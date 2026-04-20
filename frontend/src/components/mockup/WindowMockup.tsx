import { component$, Slot } from '@builder.io/qwik';

interface WindowMockupProps {
  class?: string;
}

export const WindowMockup = component$<WindowMockupProps>(({ class: customClass }) => {
  return (
    <div class={`mockup-window border bg-base-300 ${customClass || ''}`}>
      <div class="flex justify-center px-4 py-16 bg-base-200">
        <Slot />
      </div>
    </div>
  );
});
