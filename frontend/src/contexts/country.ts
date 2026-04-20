import { createContextId, type Signal } from "@builder.io/qwik";

export const countriesContext = createContextId<Signal<object[]>>("countries")

export const countryContext = createContextId<Signal<object>>("country")