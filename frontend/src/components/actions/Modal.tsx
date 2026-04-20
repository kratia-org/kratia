import { component$, Slot, type PropFunction } from '@builder.io/qwik';
import type { Signal } from '@builder.io/qwik';

interface ModalProps {
  id: string;
  accent?: "info" | "warning" | "error" | "success";
  title?: string;
}

export const Modal = component$<ModalProps>(({ id, accent, title }) => {
  return (

    <dialog id={id} class="modal">
      <div class={[
        "modal-box bg-neutral border",
        accent === "warning" ? "border-warning"
          : accent === "info" ? "border-info"
            : accent === "error" ? "border-error"
              : accent === "success" ? "border-success"
                : "border-primary"]}>
        <form method="dialog">
          <button class="btn btn-sm btn-circle border-none  btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div class="card-header">
          <div class={[
            "text-lg font-bold",
            accent === "warning" ? "text-warning"
              : accent === "info" ? "text-info"
                : accent === "error" ? "text-error"
                  : accent === "success" ? "text-success"
                    : "text-primary"
          ]}>
            <span class="capitalize"> {title}</span>
          </div>
        </div>
        <div class="card-body p-0">
          <Slot />
        </div>
        <div class="modal-action">
          <form method="dialog">
            <button class={[
              "btn btn-sm",
              accent === "warning" ? "btn-warning"
                : accent === "info" ? "btn-info"
                  : accent === "error" ? "btn-error"
                    : accent === "success" ? "btn-success"
                      : "btn-primary"
            ]}>
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
});
