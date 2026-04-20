import { component$, isBrowser, useSignal, useTask$ } from "@builder.io/qwik"
import { FormResponse, FormStore } from "@modular-forms/qwik";
import Alert from "../feedback/Alert";
import { Expandable } from "../actions/Expandable";

type ResponseProps = {
    of: FormStore<any, any>
}

export default component$(({ of: form, ...props }: ResponseProps) => {


    // Use frozen response signal
    const frozenResponse = useSignal<FormResponse<any>>();

    // Freeze response while element collapses to prevent UI from jumping
    useTask$(({ track, cleanup }) => {
        const nextResponse = track(() => form.response);
        if (isBrowser && !nextResponse) {
            const timeout = setTimeout(
                () => (frozenResponse.value = nextResponse),
                200
            );
            cleanup(() => clearTimeout(timeout));
        } else {
            frozenResponse.value = nextResponse;
        }
    });

    return (
        <Expandable expanded={!!form.response}>
            {form.submitting ? (
                <Alert type="loading" message="Loading..." />
            ) : form.response && (
                form.response.status === "success" ? (
                    <Alert type="success" message={form.response?.message || "Success"} />
                ) : form.response.status === "error" ? (
                    <Alert type="error" message={form.response?.message || "Error"} />
                ) : form.response.status === "info" && (
                    <Alert type="warning" message={form.response?.message || "Info"} />
                )
            )
            }
        </Expandable>
    );
});