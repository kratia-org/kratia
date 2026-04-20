import type { RequestHandler, RequestResponse } from "@kratia/sdk/types";
import { getPersonsNaturals } from "./onGet";
import { postPersonsNaturals } from "./onPost";
import { patchPersonsNaturals } from "./onPatch";
import { deletePersonsNaturals } from "./onDelete";

export const onGet: RequestHandler = async ({ query, json }) => {
    const result = await getPersonsNaturals(query as any);
    return json(200, result);
};

export const onPost: RequestHandler = async ({ body, json }) => {
    const payload = await body();
    const result = await postPersonsNaturals(payload as any);
    return json(200, result);
};

export const onPatch: RequestHandler = async ({ body, json }) => {
    const payload = await body();
    const result = await patchPersonsNaturals(payload as any);
    return json(200, result);
};

export const onDelete: RequestHandler = async ({ query, json }) => {
    const result = await deletePersonsNaturals(query as any);
    return json(200, result);
};