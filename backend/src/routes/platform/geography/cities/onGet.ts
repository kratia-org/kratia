import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";
import { useDb, getData } from "~/sdk/database";
import type { EndpointHandler } from "~/sdk/types";

export const valQuery = v.object({
    uuid: v.pipe(v.string(), v.minLength(36), v.maxLength(36)),
    code: v.pipe(v.string(), v.minLength(3), v.maxLength(3)),
    name: v.pipe(v.string(), v.maxLength(64)),
});

export type GeographyContinents = v.InferInput<typeof valQuery>;

export const query = toJsonSchema(v.partial(valQuery));

export const response = toJsonSchema(valQuery);

export const getGeographyContinents: EndpointHandler<Partial<GeographyContinents>> = async (payload) => {
    const db = useDb<{ "geography.continents": GeographyContinents }>("platform");
    let baseQuery = db.selectFrom("geography.continents");
    const result = await getData(baseQuery, payload)
    return result;
}