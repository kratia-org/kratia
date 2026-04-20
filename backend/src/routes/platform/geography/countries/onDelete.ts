import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";
import { useDb } from "~/sdk/database";
import { error } from "~/sdk/error";
import type { EndpointHandler } from "~/sdk/types";
import type { GeographyCountries } from "./onGet";
import type { Auditory } from "~/sdk/database";

export const valQuery = v.object({
    uuid: v.pipe(v.string(), v.uuid())
});

export const query = toJsonSchema(valQuery);

export const response = toJsonSchema(v.object({
    success: v.boolean()
}));

export const deleteGeographyCountries: EndpointHandler<v.InferInput<typeof valQuery>> = async (payload) => {
    const validate = v.safeParse(valQuery, payload);
    if (!validate.success) throw error(400, "Invalid query parameters");

    const { uuid } = validate.output;
    const db = useDb<{ "geography.countries": GeographyCountries & Auditory }>("platform");

    const result = await db.updateTable("geography.countries")
        .set({
            deleted_at: new Date()
        } as any)
        .where("uuid", "=", uuid)
        .where("deleted_at", "is", null)
        .executeTakeFirst();

    if (Number(result.numUpdatedRows) === 0) throw error(404, "País no encontrado o ya eliminado");

    return {
        "data": { success: true }
    }
};
