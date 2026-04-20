import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";
import { useDb, getData, type Auditory } from "~/sdk/database";
import type { EndpointHandler } from "~/sdk/types";

export const valPersonsNaturals = v.object({
    uuid: v.pipe(v.string(), v.uuid()),
    account_uuid: v.pipe(v.string(), v.uuid()),
    country_uuid: v.optional(v.pipe(v.string(), v.uuid())),
    nuip: v.pipe(v.string(), v.minLength(3), v.maxLength(20)),
    birthdate: v.optional(v.pipe(v.string(), v.isoDate())),
    names: v.optional(v.array(v.string())),
    surnames: v.optional(v.array(v.string())),
    deathdate: v.optional(v.pipe(v.string(), v.isoDate())),
});

export type PersonsNaturals = v.InferInput<typeof valPersonsNaturals>;

export const query = toJsonSchema(v.partial(valPersonsNaturals));

export const response = toJsonSchema(valPersonsNaturals);

export const getPersonsNaturals: EndpointHandler<Partial<PersonsNaturals>> = async (payload) => {
    const db = useDb<{ "persons.naturals": PersonsNaturals & Auditory }>("platform");
    let baseQuery = db.selectFrom("persons.naturals").selectAll().where('deleted_at', 'is', null);
    const result = await getData(baseQuery, payload);
    return result;
};