import { component$, type QRL, JSXChildren } from '@builder.io/qwik';
import clsx from 'clsx';
import { Error } from './Error';

type CheckboxProps = {
  ref: QRL<(element: HTMLInputElement) => void>;
  name: string;
  value?: string;
  checked?: boolean;
  onInput$: (event: Event, element: HTMLInputElement) => void;
  onChange$: (event: Event, element: HTMLInputElement) => void;
  onBlur$: (event: Event, element: HTMLInputElement) => void;
  required?: boolean;
  class?: string;
  label?: string | JSXChildren;
  legend?: string;
  error?: string;
};

/**
 * Checkbox that allows users to select an option. The label next to the
 * checkbox describes the selection option.
 */
export const Checkbox = component$(({ label, name, legend, error, ...props }: CheckboxProps) => {

  const className = props.class;

  return (
    <fieldset class={clsx('fieldset')}>
      {legend && <legend class="fieldset-legend py-1">{legend}</legend>}
      <label class="fieldset-label">
        <input {...props} id={name} type="checkbox" class={clsx("checkbox bg-white text-black", className)} />
        {label && <span class="">{label}</span>}
      </label>
      <Error error={error} />
    </fieldset>
  );
}
);
