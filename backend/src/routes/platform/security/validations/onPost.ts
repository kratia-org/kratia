import * as v from "valibot";
import { toJsonSchema } from "@valibot/to-json-schema";
import type { EndpointHandler, EndpointResponse } from "~/sdk/types";
import { error } from "~/sdk/error";
import { useDb, type Auditory } from "@kratia/sdk/database";
import { logger } from "@kratia/sdk/logger";

const valSecurityValidation = v.object({
    account_uuid: v.pipe(v.string(), v.uuid("Please input a valid account.")),
    type: v.pipe(v.string(), v.picklist(["signup", "recover", "signin"])),
    code: v.pipe(v.string(), v.regex(/^[0-9]{6}$/, "The code must contain only 6 digits.")),
    expire_at: v.pipe(v.string(), v.transform((value) => new Date(value)))
})

export type SecurityValidation = v.InferInput<typeof valSecurityValidation>;


export const postSecurityValidation: EndpointHandler<Partial<SecurityValidation>> = async (payload) => {
    const response: EndpointResponse = {};
    // 1. Validar ANTES de tocar la base de datos
    const validate = v.safeParse(valSecurityValidation, payload);
    if (!validate.success) {
        throw error(400, "Not validation success");
    }
    console.log(validate.output)
    const data = validate.output;
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
    const platform = useDb<{ "security.validations": SecurityValidation & Auditory }>("platform");
    /*
    const getSecurityValidation = await platform.updateTable('security.validations')
        .set({
            expire_at: new Date().toISOString(),
            updated_at: new Date(),
            updated_by: data.account_uuid,
        })
        .where('account_uuid', '=', data.account_uuid)
        .where('type', '=', data.type)
        .where('expire_at', '>', new Date().toISOString())
        .executeTakeFirst();

    if (getSecurityValidation) {
        logger.info({ location: "endpoint" }, "You have already requested a verification code.")
    }
    const securityValidation = await platform.insertInto('security.validations')
        .values({
            account_uuid: data.account_uuid,
            type: data.type,
            code: verificationCode,
            expire_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutos
            created_by: data.account_uuid,
            updated_at: new Date(),
            updated_by: data.account_uuid,
        })
        .executeTakeFirst();
    if (securityValidation) {
        logger.info({ location: "endpoint" }, "You have already requested a verification code.")
        throw error(409, "You have already requested a verification code.", "validation_expired")
    }
        */

    return response
};