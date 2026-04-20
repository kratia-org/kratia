import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";

export const valGetPersonProfile = v.object({
    uuid: v.pipe(v.string(), v.uuid()),
    person_uuid: v.pipe(v.string(), v.uuid()),
    email: v.pipe(v.string(), v.email()),
    phone: v.pipe(v.string(), v.regex(/^\+[0-9]{2,4}[0-9]{7,10}$/))
});

export type GetPersonProfile = v.InferInput<typeof valGetPersonProfile>;

export const query = toJsonSchema(v.partial(valGetPersonProfile));

export const response = toJsonSchema(valGetPersonProfile);