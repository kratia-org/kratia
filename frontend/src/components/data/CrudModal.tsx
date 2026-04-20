import { type Signal, Slot, component$ } from "@builder.io/qwik";

export interface CrudModal {
    method: Signal<"create" | "view" | "update" | "delete" | undefined>;
    title: string;
    currentRow: Signal<any>;
}

export default component$(({ method, title, currentRow }: CrudModal) => {
    return (
        <dialog id="modal" class="modal">
            <div class={[
                "modal-box bg-neutral border",
                method.value === "update" ? "border-warning"
                    : method.value === "delete" ? "border-error"
                        : "border-primary"]}>
                <form method="dialog">
                    <button class="btn btn-sm btn-circle border-none  btn-ghost absolute right-2 top-2"
                        onClick$={() => { method.value = undefined; currentRow.value = {} }}
                    >
                        ✕
                    </button>
                </form>
                <div class="card-header">
                    <div class={[
                        "text-lg font-bold",
                        method.value === "update" ? "text-warning"
                            : method.value === "delete" ? "text-error"
                                : "text-primary"
                    ]}>
                        <span class="capitalize">{method.value}</span>
                        <span> {title}</span>
                    </div>
                </div>
                <div class="card-body p-0">
                    <Slot />
                </div>
                <div class="modal-action">
                    <form method="dialog">
                        <button class={[
                            "btn btn-sm",
                            method.value === "update" ? "btn-warning"
                                : method.value === "delete" ? "btn-error"
                                    : "btn-primary"
                        ]} onClick$={() => { method.value = undefined; currentRow.value = {} }}
                        >
                            Close
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    );
});