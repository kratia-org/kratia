import type { RequestHandler } from "@kratia/sdk/types";
import { getGeographyLanguages, type GeographyLanguages } from "./onGet";
import { postGeographyLanguages } from "./onPost";
import { patchGeographyLanguages } from "./onPatch";
import { deleteGeographyLanguages } from "./onDelete";

export const onGet: RequestHandler = async ({ query, json, shared, error }) => {
    const acl = shared?.acl;
    if (!acl?.read) throw error(403);
    const result = await getGeographyLanguages(query as any);
    return json(200, result);
};

export const onPost: RequestHandler = async ({ body, json, shared, error }) => {
    const session = shared?.session;
    if (!session) throw error(401);
    const acl = session.acl;
    if (!acl?.create) throw error(403);
    const payload = await body() as GeographyLanguages;
    const currentDate = new Date();
    const result = await postGeographyLanguages({
        ...payload,
        created_by: session.uuid,
        updated_by: session.uuid,
        created_at: currentDate,
        updated_at: currentDate,
        deleted_at: null,
    });
    return json(200, result);
};

export const onPatch: RequestHandler = async ({ body, json, shared, error }) => {
    const acl = shared?.acl;
    if (!acl?.update) throw error(403);
    const payload = await body();
    const result = await patchGeographyLanguages(payload as any);
    return json(200, result);
};

export const onDelete: RequestHandler = async ({ query, json, shared, error }) => {
    const acl = shared?.acl;
    if (!acl?.delete) throw error(403);
    const result = await deleteGeographyLanguages(query as any);
    return json(200, result);
};