import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";
import { useDb, type Auditory } from "~/core/database";
import { error } from "~/core/error";
import type { EndpointHandler } from "~/core/types";
import { valGeographyLanguages, type GeographyLanguages } from "./onGet";

export const valBody = v.omit(valGeographyLanguages, ["uuid"]);

export type PostGeographyLanguages = v.InferInput<typeof valBody>;

export const body = toJsonSchema(valBody);

export const response = toJsonSchema(valGeographyLanguages);

export const postGeographyLanguages: EndpointHandler<PostGeographyLanguages & Auditory> = async (payload) => {
    const validate = v.safeParse(valBody, payload);
    if (!validate.success) throw error(400, "Cuerpo de solicitud inválido");

    const data = validate.output;
    const db = useDb<{ "geography.languages": GeographyLanguages & Auditory }>("platform");

    const result = await db.insertInto("geography.languages")
        .values({
            ...data,
            updated_at: new Date()
        })
        .returningAll()
        .executeTakeFirst();

    if (!result) throw error(500, "Error al crear el idioma");

    const { created_at, updated_at, deleted_at, created_by, updated_by, deleted_by, ...rest } = result;

    return {
        data: rest
    };
};
