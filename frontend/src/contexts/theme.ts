import { createContextId, type Signal } from "@builder.io/qwik";

export const themeContext = createContextId<Signal<string>>('theme')