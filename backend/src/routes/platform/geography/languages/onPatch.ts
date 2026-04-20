import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";
import { useDb, type Auditory } from "~/core/database";
import { error } from "~/core/error";
import type { EndpointHandler } from "~/core/types";
import { valGeographyLanguages, type GeographyLanguages } from "./onGet";

export const valBody = v.intersect([
    v.object({ uuid: v.pipe(v.string(), v.uuid()) }),
    v.partial(v.omit(valGeographyLanguages, ["uuid"]))
]);

export type PatchGeographyLanguages = v.InferInput<typeof valBody>;

export const body = toJsonSchema(valBody);

export const response = toJsonSchema(valGeographyLanguages);

export const patchGeographyLanguages: EndpointHandler<PatchGeographyLanguages> = async (payload) => {
    const validate = v.safeParse(valBody, payload);
    if (!validate.success) throw error(400, "Cuerpo de solicitud inválido");

    const { uuid, ...data } = validate.output;

    if (Object.keys(data).length === 0) throw error(400, "No se proporcionaron datos para actualizar");

    const db = useDb<{ "geography.languages": GeographyLanguages & Auditory }>("platform");

    const result = await db.updateTable("geography.languages")
        .set({
            ...data,
            updated_at: new Date()
        })
        .where("uuid", "=", uuid)
        .returningAll()
        .executeTakeFirst();

    if (!result) throw error(404, "Idioma no encontrado");

    const { created_at, updated_at, deleted_at, created_by, updated_by, deleted_by, ...rest } = result;

    return {
        data: rest
    };
};
