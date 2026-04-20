import { component$, Slot } from '@builder.io/qwik';

export const Validator = component$(() => {
  return (
    <div class="validator">
      <Slot />
    </div>
  );
});
