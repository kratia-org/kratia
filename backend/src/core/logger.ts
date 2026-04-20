import pino from "pino";

export const logger = pino({
    level: process.env.IS_DEV ? "trace" : "info",
    base: {
        env: process.env.IS_DEV ? "dev" : "prod"
    },
    timestamp: pino.stdTimeFunctions.isoTime
})
