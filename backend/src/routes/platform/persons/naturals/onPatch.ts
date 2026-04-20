import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";
import { useDb, type Auditory } from "~/sdk/database";
import { error } from "~/sdk/error";
import type { EndpointHandler } from "~/sdk/types";
import { valPersonsNaturals, type PersonsNaturals } from "./onGet";

export const valBody = v.intersect([
    v.object({ uuid: v.pipe(v.string(), v.uuid()) }),
    v.partial(v.omit(valPersonsNaturals, ["uuid", "account_uuid"]))
]);

export type PatchPersonsNaturals = v.InferInput<typeof valBody>;

export const body = toJsonSchema(valBody);

export const response = toJsonSchema(valPersonsNaturals);

export const patchPersonsNaturals: EndpointHandler<PatchPersonsNaturals> = async (payload) => {
    const validate = v.safeParse(valBody, payload);
    if (!validate.success) {
        throw error(400, validate.issues[0].message);
    }
    const { uuid, ...data } = validate.output;

    const db = useDb<{ "persons.naturals": PersonsNaturals & Auditory }>("platform");

    const result = await db.updateTable("persons.naturals")
        .set({
            ...data,
            updated_at: new Date()
            // In a real scenario, updated_by should be set from context
        })
        .where("uuid", "=", uuid)
        .returningAll()
        .executeTakeFirst();

    if (!result) throw error(404, "Persona no encontrada o no se pudo actualizar");

    return {
        data: result
    };
};
