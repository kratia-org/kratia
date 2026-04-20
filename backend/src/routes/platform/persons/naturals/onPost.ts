import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";
import { useDb, type Auditory } from "~/sdk/database";
import { error } from "~/sdk/error";
import type { EndpointHandler } from "~/sdk/types";
import { valPersonsNaturals, type PersonsNaturals } from "./onGet";

export const valBody = v.omit(valPersonsNaturals, ["uuid"]);

export type PostPersonsNaturals = v.InferInput<typeof valBody>;

export const body = toJsonSchema(valBody);

export const response = toJsonSchema(valPersonsNaturals);

export const postPersonsNaturals: EndpointHandler<PostPersonsNaturals> = async (payload) => {
    const validate = v.safeParse(valBody, payload);
    if (!validate.success) {
        throw error(400, validate.issues[0].message);
    }
    const data = validate.output;

    const db = useDb<{ "persons.naturals": PersonsNaturals & Auditory }>("platform");

    const result = await db.insertInto("persons.naturals")
        .values({
            account_uuid: data.account_uuid,
            country_uuid: data.country_uuid,
            nuip: data.nuip,
            birthdate: data.birthdate,
            names: data.names,
            surnames: data.surnames,
            deathdate: data.deathdate,
            created_by: data.account_uuid, // Using account_uuid as creator for now
            updated_by: data.account_uuid, // Using account_uuid as updater for now
            updated_at: new Date()
        })
        .returningAll()
        .executeTakeFirst();

    if (!result) throw error(500, "Error al crear la persona");

    return {
        data: result
    };
};