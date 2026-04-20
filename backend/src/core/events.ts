import { Kafka, Producer, Consumer } from "kafkajs";

/* ================= TYPES ================= */

type EventEnvelope<T = any> = {
    id: string;
    correlationId?: string;
    timestamp: string;
    event: string;
    payload: T;
};

type Handler = (data: {
    topic: string;
    partition: number;
    key: string | null;
    event: string;
    payload: any;
    timestamp: string;
    correlationId?: string;
}) => Promise<void> | void;

/* ================= CLASS ================= */

export class Events {

    private readonly kafka: Kafka;
    private readonly producers = new Map<string, Producer>();
    private readonly consumers = new Map<string, { consumer: Consumer; handler: Handler; running: boolean }>;
    private readonly pending = new Map<string, (payload: any) => void>;

    constructor({ clientId, brokers }: { clientId: string; brokers: string[] }) {
        this.kafka = new Kafka({ clientId, brokers });
    }

    /* ================= PRODUCER ================= */

    private async getProducer(topic: string): Promise<Producer> {
        if (!this.producers.has(topic)) {
            const producer = this.kafka.producer();
            await producer.connect();
            this.producers.set(topic, producer);
        }
        return this.producers.get(topic)!;
    }

    async send<T>({ topic, event, payload, correlationId }: { topic: string; event: string; payload: T; correlationId?: string; }): Promise<void> {

        const producer = await this.getProducer(topic);
        const message: EventEnvelope<T> = {
            id: crypto.randomUUID(),
            correlationId,
            timestamp: new Date().toISOString(),
            event,
            payload
        };
        await producer.send({
            topic,
            messages: [{
                key: event,
                value: JSON.stringify(message)
            }]
        });

    }

    /* ================= RPC ================= */

    private response(correlationId: string, timeout = 10000): Promise<any> {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.pending.delete(correlationId);
                reject(new Error("Worker timeout"));
            }, timeout);
            this.pending.set(correlationId, (payload) => {
                clearTimeout(timer);
                resolve(payload);
            });

        });

    }

    async request<T>({ topic, event, payload, timeout = 10000 }: { topic: string; event: string; payload: T; timeout?: number; }): Promise<any> {

        const correlationId = crypto.randomUUID();
        // Si el topic es "platform.requests", el de respuesta será "platform.responses"
        const responseTopic = `${topic}.responses`;

        // 1. Registramos el consumidor para las respuestas si no existe
        await this.register(`api-gateway`, responseTopic, async () => {
            // No necesitamos lógica aquí porque resolveMessage se llama en runConsumers
        });

        // 2. Iniciamos los consumidores para que resolveMessage() pueda capturar la respuesta
        await this.runConsumers();

        const responsePromise = this.response(correlationId, timeout);
        await this.send({ topic: topic + ".requests", event, payload, correlationId });
        return responsePromise;
    }

    private resolveMessage(parsed: EventEnvelope) {
        if (!parsed?.correlationId) return;
        const resolver = this.pending.get(parsed.correlationId);
        if (resolver) {
            resolver(parsed.payload);
            this.pending.delete(parsed.correlationId);
        }
    }

    /* ================= CONSUMER ================= */

    async register(groupId: string, topic: string, handler: Handler) {
        const key = `${topic}::${groupId}`;
        if (this.consumers.has(key)) {
            console.warn(`⚠️ Consumer ya registrado para ${key}`);
            return;
        }
        const consumer = this.kafka.consumer({ groupId });
        await consumer.connect();
        await consumer.subscribe({
            topic,
            fromBeginning: false
        });
        this.consumers.set(key, {
            consumer,
            handler,
            running: false
        });
    }

    async runConsumers() {
        for (const [key, entry] of this.consumers) {
            if (entry.running) continue;
            await entry.consumer.run({
                eachMessage: async ({ topic, partition, message }: { topic: string; partition: number; message: Record<string, any>; }) => {
                    const raw = message.value?.toString();
                    if (!raw) return;
                    try {
                        const parsed: EventEnvelope = JSON.parse(raw);
                        /* ===== Resolver RPC si aplica ===== */
                        this.resolveMessage(parsed);
                        /* ===== Ejecutar handler ===== */
                        await this.retry(async () => {
                            await entry.handler({
                                topic,
                                partition,
                                key: message.key?.toString() ?? null,
                                event: parsed.event,
                                payload: parsed.payload,
                                timestamp: parsed.timestamp,
                                correlationId: parsed.correlationId
                            });
                        });
                    } catch (err) {
                        console.error(`❌ Error procesando ${key}`, err);
                    }
                }
            });
            entry.running = true;
        }

    }

    /* ================= UTIL ================= */

    private async retry(fn: () => Promise<void>, attempts = 3, delay = 500) {
        for (let i = 0; i < attempts; i++) {
            try {
                await fn();
                return;
            } catch (err) {
                if (i === attempts - 1) throw err;
                await new Promise(r => setTimeout(r, delay));
            }
        }
    }

    async unregister(groupId: string, topic: string) {
        const key = `${topic}::${groupId}`;
        const entry = this.consumers.get(key);
        if (!entry) return;
        await entry.consumer.disconnect();
        this.consumers.delete(key);
    }

    async disconnect() {
        for (const producer of this.producers.values()) {
            await producer.disconnect();
        }
        for (const entry of this.consumers.values()) {
            await entry.consumer.disconnect();
        }
        this.producers.clear();
        this.consumers.clear();
        this.pending.clear();
    }

}
