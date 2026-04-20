import { join } from "path";
import { logger } from "./src/core/logger";
import type { Context } from "./src/core/types";
import { statusCodes, error, ServerError } from "./src/core/error";
import { Events } from "./src/core/events";

export const isDev = Bun.env.BUN_ENV === "development" || false;

process.env.ROOT_PATH = join(process.cwd());
export const publicPath = join(process.env.ROOT_PATH, "public");

export const router = new Bun.FileSystemRouter({
    style: "nextjs",
    dir: join(process.cwd(), "src/routes"),
    origin: `http://localhost:${Bun.env.PORT}`
});

const events = new Events({
    clientId: "api_backend",
    brokers: ["172.16.1.7:9092"]
});

const server = Bun.serve({
    port: Number(Bun.env.PORT) || 3000,
    fetch: async (req, server) => {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip");
        const url = new URL(req.url);
        const pathname = url.pathname;
        // Static files
        if (pathname.includes('.')) {
            const safePath = pathname.replace(/^(\.\.(\/|\\|$))+/, '');
            const filePath = join(publicPath, safePath);
            const file = Bun.file(filePath);
            return new Response(file);
        }
        //Routing
        const match = router.match(req);
        if (!match) throw error(404);
        console.log(match)
        console.log(ip)
        const module = await import(match.filePath);
        if (!module) throw error(404);
        const json = (status: number, body?: any): Response => {
            const statusInfo: { code: number, message: string } | undefined = statusCodes.filter((c) => c.code === Number(status))[0];
            if (!body) body = {};
            return Response.json({
                status: statusInfo?.code,
                message: statusInfo?.message,
                ...body
            }, {
                status: Number(status),
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
                    "Content-Type": "application/json",
                }
            });
        };
        const body = async (): Promise<unknown> => req.method !== "GET" ? await req.json() : null;
        const parseQuery = (urlSearchParams: Record<string, string>) => {
            const query: {
                [key: string]: string | Record<string, string>[];
            } = {};
            for (const [key, value] of Object.entries(urlSearchParams)) {
                const match = key.match(/^(\w+)\[(.+)\]$/);
                if (match) {
                    const parent = match[1] as string;
                    const child = match[2] as string;
                    if (!Array.isArray(query[parent])) {
                        query[parent] = [];
                    }
                    (query[parent] as Record<string, string>[]).push(
                        { [child]: value }
                    );
                } else {
                    query[key] = value;
                }
            }
            return query;
        };


        const ctx: Context = {
            request: req,
            headers: req.headers,
            pathname,
            method: req.method,
            body: body,
            query: parseQuery(match.query),
            params: match.params,
            json: json,
            error: error,
            shared: null,
            events: null
        }
        const onRequest = module['onRequest'];
        if (onRequest) {
            const middleware = await onRequest(ctx);
            ctx.shared = middleware;
        };
        // onPost, onGet, onDelete, onPut, onPatch
        const endPoint = `on${req.method.toLowerCase().charAt(0).toUpperCase() + req.method.toLowerCase().slice(1)}`;
        const handler = module[endPoint];
        if (!handler) throw error(404);
        ctx.events = events;
        // Ejecutar Handler
        const response = await handler(ctx);
        return response;
    },
    error: (err) => {
        if (err instanceof ServerError) {
            isDev && logger.error({ location: "server" }, err.toString());
            return Response.json({
                status: err.status,
                message: err.message,
                error: err.error,
                details: err.details
            }, { status: err.status });
        }
        isDev && logger.error({ location: "server" }, err.toString());
        return Response.json({
            status: 500,
            message: "Internal Server Error",
        }, { status: 500 });
    }
});

logger.info({ location: "server" }, `Server is running at ${server.hostname}:${server.port} `);
