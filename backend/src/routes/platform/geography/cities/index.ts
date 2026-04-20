import type { RequestHandler, RequestResponse } from "@kratia/sdk/types";
import { getGeographyContinents } from "./onGet";


export const onGet: RequestHandler = async ({ json, query }) => {
    let response: RequestResponse = { status: 500 }
    const result = await getGeographyContinents(query)
    if (!result) throw new Error("Error al obtener los continentes")
    response = { status: 200, data: result };
    return json(response.status, response.data);
}