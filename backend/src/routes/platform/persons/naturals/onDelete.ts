import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";
import { useDb, type Auditory } from "~/sdk/database";
import { error } from "~/sdk/error";
import type { EndpointHandler } from "~/sdk/types";
import type { PersonsNaturals } from "./onGet";

export const valQuery = v.object({
    uuid: v.pipe(v.string(), v.uuid())
});

export const query = toJsonSchema(valQuery);

export const response = toJsonSchema(v.object({
    success: v.boolean()
}));

export const deletePersonsNaturals: EndpointHandler<v.InferInput<typeof valQuery>> = async (payload) => {
    const validate = v.safeParse(valQuery, payload);
    if (!validate.success) throw error(400, "ID inválido");

    const { uuid } = validate.output;
    const db = useDb<{ "persons.naturals": PersonsNaturals & Auditory }>("platform");

    const result = await db.updateTable("persons.naturals")
        .set({
            deleted_at: new Date()
        } as any)
        .where("uuid", "=", uuid)
        .where("deleted_at", "is", null)
        .executeTakeFirst();

    if (Number(result.numUpdatedRows) === 0) throw error(404, "Persona no encontrada o ya eliminada");

    return {
        data: { success: true }
    };
};
