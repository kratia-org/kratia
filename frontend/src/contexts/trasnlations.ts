import { createContextId, type Signal } from "@builder.io/qwik";

export type Translations = Record<string, any>;


export const translationsContext = createContextId<Signal<Translations>>("translationsContext")