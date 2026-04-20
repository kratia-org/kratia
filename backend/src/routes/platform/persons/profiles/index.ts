import type { RequestHandler, RequestResponse } from "@kratia/sdk/types";
import { postPersonsNaturals, type PersonsNaturals } from "./onPost";


export const onPost: RequestHandler = async ({ json, body }) => {
    let response: RequestResponse = { status: 500 }
    const payload = await body()
    const result = await postPersonsNaturals(payload as Partial<PersonsNaturals>)
    if (!result) throw new Error("Error al crear la persona")
    response = { status: 200, data: result };
    return json(response.status, response.data);
}