import { component$ } from "@builder.io/qwik";

export const Loading = component$((props?: { type: "page" | "component" }) => {
    return (
        <div class="w-full h-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <h1 class="text-2xl font-bold font-primary">Loading...</h1>
        </div>
    )
})
