import { logger } from "@kratia/sdk/logger";
import type { RequestHandler, RequestResponse } from "@kratia/sdk/types";
import jwt from "jsonwebtoken";

const openEndpoints = [
    { method: "GET", path: "/", },
    { method: "GET", path: "/favicon.ico", },
    { method: "GET", path: "/favicon.png", },
    { method: "GET", path: "/favicon.svg", },
    { method: "GET", path: "/openapi.json?format=json", },
    { method: "POST", path: "/platform/system/accounts" },
    { method: "GET", path: "/platform/structure/apps", },
    { method: "GET", path: "/platform/structure/modules", },
    { method: "GET", path: "/platform/structure/pages", },
    { method: "GET", path: "/platform/geography/countries", },
    { method: "GET", path: "/platform/geography/languages", }
]

export const onRequest: RequestHandler = async ({ headers }) => {
    const host = headers.get("X-Forwarded-Host");
    const method = headers.get("X-Forwarded-Method");
    const path = headers.get("X-Forwarded-Uri");
    return {
        host,
        method,
        path
    }
}

export const onGet: RequestHandler = async ({ headers, error, shared, json }) => {
    let response: RequestResponse = { status: 401 };
    const authorization = headers.get("Authorization");
    let responseHeaders = new Headers();
    if (!authorization) {
        const openEndpoint = openEndpoints.find((endpoint) => shared?.path?.startsWith(endpoint.path) && endpoint.method === shared?.method);
        if (openEndpoint) {
            logger.info("Open endpoint " + openEndpoint.path + " " + openEndpoint.method);
            const payload = {
                get: openEndpoint.method === "GET" ? true : false,
                post: openEndpoint.method === "POST" ? true : false,
                put: openEndpoint.method === "PUT" ? true : false,
                delete: openEndpoint.method === "DELETE" ? true : false,
            }
            const token = jwt.sign(payload, Bun.env.JWT_SECRET!, { algorithm: "HS256", expiresIn: "10s" });
            if (!token) throw error(500, "Internal Server Error");
            responseHeaders.set("x-token", token);
            response.status = 200;
        }
    }
    return json(response.status, response);
}