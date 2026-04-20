import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";
import { getData, useDb } from "~/sdk/database";
import type { EndpointHandler } from "~/sdk/types";
import type { GetPersonNatural } from "../../persons/naturals/onGet";
import type { GetPersonProfile } from "../../persons/profiles/onGet";
import { jsonObjectFrom } from "kysely/helpers/postgres";

export const valSystemAccounts = v.object({
    uuid: v.pipe(v.string(), v.minLength(36), v.maxLength(36)),
    username: v.pipe(v.string(), v.minLength(3), v.maxLength(32)),
    status: v.pipe(v.string(), v.minLength(1), v.maxLength(16)),
});

export type SystemAccounts = v.InferInput<typeof valSystemAccounts>;

export const query = toJsonSchema(v.partial(valSystemAccounts));

export const response = toJsonSchema(valSystemAccounts);

export const getSystemAccounts: EndpointHandler<Partial<SystemAccounts>> = async (payload) => {
    const db = useDb<{
        "system.accounts": SystemAccounts,
        "persons.naturals": GetPersonNatural,
        "persons.profiles": GetPersonProfile
    }>("platform");

    let query = db.selectFrom("system.accounts")
        .select((eb) => [
            'system.accounts.uuid',
            'system.accounts.username',
            'system.accounts.status',
            // Buscamos la persona relacionada (reemplaza el Join)
            jsonObjectFrom(
                eb.selectFrom('persons.naturals')
                    .selectAll()
                    .whereRef('persons.naturals.account_uuid', '=', 'system.accounts.uuid')
            ).as('person'),

            // Buscamos el perfil relacionado (reemplaza el Join)
            jsonObjectFrom(
                eb.selectFrom('persons.profiles')
                    .selectAll()
                    // Aquí usamos account_uuid o buscamos a través de la relación lógica
                    .whereRef('persons.profiles.person_uuid', '=',
                        eb.selectFrom('persons.naturals')
                            .select('uuid')
                            .whereRef('account_uuid', '=', 'system.accounts.uuid')
                    )
            ).as('profile')
        ]);


    const accounts = await getData(query, payload);
    return accounts
}