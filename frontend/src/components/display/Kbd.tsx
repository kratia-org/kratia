import { component$, Slot } from '@builder.io/qwik';

export const Kbd = component$(() => {
  return (
    <kbd class="kbd">
      <Slot />
    </kbd>
  );
});
