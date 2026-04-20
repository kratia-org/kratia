import { component$, Slot } from '@builder.io/qwik';

export const WindowMockup = component$(() => {
  return (
    <div class="mockup-window border-base-300 border bg-base-200">
      <div class="flex justify-center px-4 py-16 bg-base-100 border-t border-base-300">
        <Slot />
      </div>
    </div>
  );
});
