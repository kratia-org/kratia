import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";
import { useDb } from "~/sdk/database";
import { error } from "~/sdk/error";
import type { EndpointHandler } from "~/sdk/types";
import { valCountry } from "./onGet";
import type { GeographyCountries } from "./onGet";
import type { Auditory } from "~/sdk/database";

export const valQuery = v.object({
    uuid: v.pipe(v.string(), v.uuid())
});

export const valBody = v.partial(valCountry);

export const query = toJsonSchema(valQuery);
export const body = toJsonSchema(valBody);

export const response = toJsonSchema(valCountry);

export const Country = v.intersect([valQuery, valBody]);

export const patchGeographyCountries: EndpointHandler<v.InferInput<typeof Country>> = async (payload) => {
    const validate = v.safeParse(Country, payload);
    if (!validate.success) throw error(400, "Invalid parameters");

    const { uuid, ...data } = validate.output;

    if (Object.keys(data).length === 0) throw error(400, "No data provided to update");

    const db = useDb<{ "geography.countries": GeographyCountries & Auditory }>("platform");
    const result = await db.updateTable("geography.countries")
        .set({
            ...data as any,
            updated_at: new Date()
        })
        .where("uuid", "=", uuid)
        .returningAll()
        .executeTakeFirst();

    if (!result) throw error(404, "País no encontrado");

    const { created_at, updated_at, deleted_at, created_by, updated_by, deleted_by, ...rest } = result;
    return {
        "data": rest
    }
};
