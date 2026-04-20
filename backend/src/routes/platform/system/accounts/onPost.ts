import * as v from "valibot";
import { toJsonSchema } from "@valibot/to-json-schema";
import type { EndpointHandler, EndpointResponse } from "~/sdk/types";
import { error } from "~/sdk/error";
import { useDb, type Auditory } from "@kratia/sdk/database";
import type { Generated } from "kysely";
import { logger } from "@kratia/sdk/logger";
import { postSecurityValidation } from "../../security/validations/onPost";
import { sendSMS } from "@kratia/sdk/aws";

const valSignUP = v.pipe(v.object({
    country: v.pipe(v.string(), v.uuid("Please input a valid country.")),
    nuip: v.pipe(v.string(), v.regex(/^[0-9]{6,12}$/, "The NUIP must contain only numbers between 6 and 12 digits.")),
    callcode: v.pipe(v.string(), v.regex(/^\+[0-9]{2,4}$/, "input a + and 2 - 4 numbers")),
    phone: v.pipe(v.string(), v.regex(/^[0-9]{10}$/, "The phone must contain only 10 numbers.")),
    email: v.pipe(v.string(), v.email("Please enter a valid email address.")),
    terms: v.pipe(v.literal(true, "You must accept the terms and conditions.")),
    password: v.pipe(v.string(), v.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters, letters and numbers, uppercase and lowercase letters and special characters."))
}))



export type SignUp = v.InferInput<typeof valSignUP>;

export const body = toJsonSchema(valSignUP);

type Account = {
    username: string;
    password: string;
    terms: boolean;
    status?: string;
}

type Natural = {
    country_uuid: string;
    account_uuid: string;
    nuip: string;
}

type Profile = {
    person_uuid: string;
    phone: string;
    email: string;
}

type Validation = {
    account_uuid: string;
    type: string;
    code: string;
    expires_at: Date;
}



export const postAccount: EndpointHandler<SignUp> = async (payload) => {
    const response: EndpointResponse = {};

    // 1. Validación de entrada
    const validate = v.safeParse(valSignUP, payload);
    if (!validate.success) {
        throw error(400, validate.issues[0].message);
    }

    const data = validate.output;

    const platform = useDb<{
        "system.accounts": Account & Auditory,
        "persons.naturals": Natural & Auditory,
        "persons.profiles": Profile & Auditory,
        "security.validations": Validation & Auditory
    }>("platform");

    // 2. Verificar existencia previa
    const existingAccount = await platform.selectFrom('system.accounts')
        .where('username', '=', data.nuip)
        .select(['uuid', 'status'])
        .executeTakeFirst();

    if (existingAccount) {
        if (existingAccount.status === "pending") {
            const renewCode = await postSecurityValidation({
                account_uuid: existingAccount.uuid,
                type: "signup",
            });
            if (renewCode) {
                throw error(409, "validation_required", "La cuenta está pendiente de validación. Se ha reenviado el código.");
            }
            throw error(500, "validation_error", "Error de validación, contacte a soporte.");
        }
        // Manejo simplificado para otros estados (active, locked, etc.)
        const msg = existingAccount.status === "locked" ? "Cuenta bloqueada." : "La cuenta ya existe.";
        throw error(409, "already_exists", msg);
    }

    // 3. Ejecución de Transacción Atómica
    // Usamos el callback de .transaction() para asegurar que el rollback sea automático si algo falla
    const result = await platform.transaction().execute(async (trx) => {
        // A. Insertar Cuenta (Retornamos solo lo necesario por seguridad)
        const account = await trx.insertInto('system.accounts')
            .values({
                username: data.nuip,
                password: await Bun.password.hash(data.password),
                terms: data.terms,
                updated_at: new Date(),
            })
            .returning(['uuid', 'username', 'status'])
            .executeTakeFirstOrThrow();

        // B. Insertar Persona Natural
        const natural = await trx.insertInto('persons.naturals')
            .values({
                country_uuid: data.country,
                account_uuid: account.uuid,
                nuip: data.nuip,
                created_by: account.uuid,
                updated_at: new Date(),
                updated_by: account.uuid,
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        // C. Insertar Perfil
        const profile = await trx.insertInto('persons.profiles')
            .values({
                person_uuid: natural.uuid,
                phone: data.phone,
                email: data.email,
                created_by: account.uuid,
                updated_at: new Date(),
                updated_by: account.uuid,
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        // D. Generar Código de Validación
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const validation = await trx.insertInto('security.validations')
            .values({
                account_uuid: account.uuid,
                type: "signup",
                code: await Bun.password.hash(code),
                expires_at: new Date(Date.now() + 10 * 60 * 1000),
                created_by: account.uuid,
                updated_at: new Date(),
                updated_by: account.uuid,
            })
            .returningAll()
            .executeTakeFirstOrThrow();


        await sendSMS(`${data.callcode}${data.phone}`, `Tu código es ${code}`);

        return { account, natural, profile, validation };
    }).catch((err) => {
        logger.error({ location: "postAccount_transaction" }, err.message);
        throw error(400, "No se pudo crear la cuenta.");
    });

    response.data = { ...result.account };

    return response;
};