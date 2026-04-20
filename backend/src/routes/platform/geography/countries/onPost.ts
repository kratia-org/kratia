import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";
import { useDb } from "~/sdk/database";
import { error } from "~/sdk/error";
import type { EndpointHandler } from "~/sdk/types";
import { valCountry } from "./onGet";
import type { GeographyCountries } from "./onGet";
import type { Auditory } from "~/sdk/database";

export const valBody = valCountry;

export const body = toJsonSchema(valBody);

export const response = toJsonSchema(v.object({
    uuid: v.pipe(v.string(), v.uuid()),
    ...valCountry.entries
}));

export const postGeographyCountries: EndpointHandler<v.InferInput<typeof valBody>> = async (payload) => {
    const validate = v.safeParse(valBody, payload);
    if (!validate.success) throw error(400, "Invalid payload");
    const data = validate.output;
    const db = useDb<{ "geography.countries": GeographyCountries & Auditory }>("platform");
    const result = await db.insertInto("geography.countries").values({
        ...data as any
    }).returningAll().executeTakeFirst();

    if (!result) throw error(500, "Error al crear el país");

    const { created_at, updated_at, deleted_at, created_by, updated_by, deleted_by, ...rest } = result;
    return {
        "data": rest
    }
};
