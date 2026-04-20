import { createContextId, type Signal } from "@builder.io/qwik";

export const ACLContext = createContextId<Signal<object>>("aclContext")
