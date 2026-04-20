import { component$, Slot, type PropFunction } from '@builder.io/qwik';

interface ModalProps {
  id: string;
  open: boolean;
  onClose$: PropFunction<() => void>;
  title?: string;
}

export const Modal = component$<ModalProps>(({ id, open, onClose$, title }) => {
  return (
    <>
      <dialog id={id} class={`modal ${open ? 'modal-open' : ''}`} onClose$={onClose$}>
        <div class="modal-box">
          {title && <h3 class="font-bold text-lg mb-4">{title}</h3>}
          <div class="py-4">
            <Slot />
          </div>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn" onClick$={onClose$}>Cerrar</button>
            </form>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button onClick$={onClose$}>Cerrar</button>
        </form>
      </dialog>
    </>
  );
});
