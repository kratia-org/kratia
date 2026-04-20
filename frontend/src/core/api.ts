import ky from 'ky';

export const api = ky.create({
    // 1. URL Base: No tienes que escribirla en cada petición
    baseUrl: 'https://api.kratia.org/',

    // 2. Timeout: Evita que el ERP se quede "colgado" si el server no responde
    timeout: 10000, // 10 segundos

    // 3. Reintentos automáticos: Vital para conexiones inestables
    retry: {
        limit: 2,
        methods: ['get'],
        statusCodes: [408, 504]
    }
});