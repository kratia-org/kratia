import { component$, Slot } from '@builder.io/qwik';

export const Stack = component$(() => {
  return (
    <div class="stack">
      <Slot />
    </div>
  );
});
