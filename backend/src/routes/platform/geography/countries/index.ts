import type { RequestHandler, RequestResponse } from "@kratia/sdk/types";
import { getGeographyCountries } from "./onGet";
import { postGeographyCountries } from "./onPost";
import { patchGeographyCountries } from "./onPatch";
import { deleteGeographyCountries } from "./onDelete";

export const onGet: RequestHandler = async ({ json, query }) => {
    let response: RequestResponse = { status: 500 }
    const result = await getGeographyCountries(query)
    if (!result) throw new Error("Error al obtener los países")
    response = { status: 200, data: result };
    return json(response.status, response.data);
}

export const onPost: RequestHandler = async ({ json, body }) => {
    const payload = await body();
    const result = await postGeographyCountries(payload as any);
    return json(201, result.data);
}

export const onPatch: RequestHandler = async ({ json, query, body }) => {
    const { uuid } = query;
    const payload = await body();
    const result = await patchGeographyCountries({ uuid, payload });
    return json(200, result.data);
}

export const onDelete: RequestHandler = async ({ json, query }) => {
    const { uuid } = query;
    const result = await deleteGeographyCountries({ uuid });
    return json(200, result.data);
}