import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";
import { useDb, type Auditory } from "~/core/database";
import { error } from "~/core/error";
import type { EndpointHandler } from "~/core/types";
import type { GeographyLanguages } from "./onGet";

export const valQuery = v.object({
    uuid: v.pipe(v.string(), v.uuid())
});

export const query = toJsonSchema(valQuery);

export const response = toJsonSchema(v.object({
    success: v.boolean()
}));

export const deleteGeographyLanguages: EndpointHandler<v.InferInput<typeof valQuery>> = async (payload) => {
    const validate = v.safeParse(valQuery, payload);
    if (!validate.success) throw error(400, "ID inválido");

    const { uuid } = validate.output;
    const db = useDb<{ "geography.languages": GeographyLanguages & Auditory }>("platform");

    const result = await db.updateTable("geography.languages")
        .set({
            deleted_at: new Date()
        } as any)
        .where("uuid", "=", uuid)
        .where("deleted_at", "is", null)
        .executeTakeFirst();

    if (Number(result.numUpdatedRows) === 0) throw error(404, "Idioma no encontrado o ya eliminado");

    return {
        data: { success: true }
    };
};
