import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";
import { useDb, getData, type Auditory } from "~/sdk/database";
import type { EndpointHandler } from "~/sdk/types";

export const valCountry = v.object({
    region: v.pipe(v.string(), v.minLength(3), v.maxLength(64)),
    subregion: v.pipe(v.string(), v.minLength(3), v.maxLength(64)),
    iso_numeric: v.pipe(v.string(), v.minLength(3), v.maxLength(3)),
    iso_alpha2: v.pipe(v.string(), v.minLength(2), v.maxLength(2)),
    iso_alpha3: v.pipe(v.string(), v.minLength(3), v.maxLength(3)),
    name_native: v.pipe(v.string(), v.minLength(3), v.maxLength(128)),
    name_common: v.pipe(v.string(), v.minLength(3), v.maxLength(128)),
    name_official: v.pipe(v.string(), v.minLength(3), v.maxLength(128)),
    flag_emoji: v.pipe(v.string(), v.minLength(2), v.maxLength(2)),
    flag_png: v.pipe(v.string(), v.minLength(3), v.maxLength(256)),
    flag_svg: v.pipe(v.string(), v.minLength(3), v.maxLength(256)),
    shield_png: v.pipe(v.string(), v.minLength(3), v.maxLength(256)),
    shield_svg: v.pipe(v.string(), v.minLength(3), v.maxLength(256)),
    call_code: v.pipe(v.string(), v.minLength(3), v.maxLength(4)),
});

export type GeographyCountries = v.InferInput<typeof valCountry>;

export const query = toJsonSchema(v.partial(valCountry));

export const response = toJsonSchema(v.object({
    uuid: v.pipe(v.string(), v.uuid()),
    ...valCountry.entries
}));

export const getGeographyCountries: EndpointHandler<Partial<GeographyCountries>> = async (payload) => {
    const db = useDb<{ "geography.countries": GeographyCountries & Auditory }>("platform");
    let baseQuery = db.selectFrom("geography.countries").selectAll().where('deleted_at', 'is', null);
    const result = await getData(baseQuery, payload);
    return result;
};