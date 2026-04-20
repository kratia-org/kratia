import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";
import { useDb, getData } from "~/sdk/database";
import { error } from "~/sdk/error";
import type { EndpointHandler } from "~/sdk/types";
import { valCountry } from "../../geography/countries/onGet";

export const valBody = v.object({
    country: v.pipe(v.string(), v.uuid()),
    nuip: v.pipe(v.string(), v.minLength(3), v.maxLength(20)),
    birthdate: v.pipe(v.string(), v.isoDate()),
    names: v.pipe(v.array(v.string()), v.minLength(1), v.maxLength(64)),
    surnames: v.pipe(v.array(v.string()), v.minLength(1), v.maxLength(64))
});

export type PersonsNaturals = v.InferInput<typeof valBody>;

export const body = toJsonSchema(valBody);

export const response = toJsonSchema(v.object({
    uuid: v.pipe(v.string(), v.uuid()),
    ...valBody.entries,
    country: valCountry
}));

export const postPersonsNaturals: EndpointHandler<Partial<PersonsNaturals>> = async (payload) => {
    const validate = v.safeParse(valBody, payload);
    if (!validate.success) throw error(400, "Invalid payload");
    const data = validate.output;
    const db = useDb<{ "persons.naturals": PersonsNaturals }>("platform");
    const result = db.insertInto("persons.naturals").values({
        country: data.country,
        nuip: data.nuip,
        birthdate: data.birthdate,
        names: data.names,
        surnames: data.surnames
    }).executeTakeFirst();
    if (!result) throw error(500, "Error al crear la persona");
    return {
        "data": { ...result }
    }
};