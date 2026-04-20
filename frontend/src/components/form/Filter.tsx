import { component$, type QwikIntrinsicElements } from '@builder.io/qwik';

export const Filter = component$(() => {
  return (
    <div class="filter">
      {/* DaisyUI 5 Filter is typically a join of inputs or a specific filter UI */}
      <input class="btn filter-reset" type="reset" value="Reset" />
      <Slot />
    </div>
  );
});
