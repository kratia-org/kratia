import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";
import { useDb, getData, type Auditory } from "~/core/database";
import type { EndpointHandler } from "~/core/types";

export const valGeographyLanguages = v.object({
    country_iso_alpha_2: v.pipe(v.string(), v.minLength(2), v.maxLength(2)),
    iso_alpha2: v.pipe(v.string(), v.minLength(2), v.maxLength(2)),
    iso_alpha3: v.pipe(v.string(), v.minLength(3), v.maxLength(3)),
    name_native: v.pipe(v.string(), v.minLength(3), v.maxLength(64)),
    name_official: v.pipe(v.string(), v.minLength(3), v.maxLength(64)),
    flag_emoji: v.pipe(v.string(), v.minLength(2), v.maxLength(2)),
    flag_png: v.pipe(v.string(), v.minLength(3), v.maxLength(255)),
    flag_svg: v.pipe(v.string(), v.minLength(3), v.maxLength(255)),
});

export type GeographyLanguages = v.InferInput<typeof valGeographyLanguages>;

export const query = toJsonSchema(v.partial(valGeographyLanguages));

export const response = toJsonSchema(valGeographyLanguages);

export const getGeographyLanguages: EndpointHandler<Partial<GeographyLanguages>> = async (payload) => {
    const db = useDb<{ "geography.languages": GeographyLanguages & Auditory }>("platform");
    let baseQuery = db.selectFrom("geography.languages").selectAll().where('deleted_at', 'is', null);
    const result = await getData(baseQuery, payload);
    return result;
};