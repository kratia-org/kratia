import { component$, Slot } from '@builder.io/qwik';

interface FieldsetProps {
  legend?: string;
  class?: string;
}

export const Fieldset = component$<FieldsetProps>(({ legend, class: customClass }) => {
  return (
    <fieldset class={`fieldset ${customClass || ''}`}>
      {legend && <legend class="fieldset-legend font-bold">{legend}</legend>}
      <Slot />
    </fieldset>
  );
});
