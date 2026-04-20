import { createContextId, type Signal } from "@builder.io/qwik";

export type Locale = {
    language: {
        iso_alpha2: string
    }
}

export const localeContext = createContextId<Signal<Locale>>("localeContext");