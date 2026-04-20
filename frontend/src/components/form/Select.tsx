import { component$, type QRL, useSignal, useTask$, isBrowser } from '@builder.io/qwik';
import clsx from 'clsx';
import { Error } from './Error';
import { Expandable } from '../actions/Expandable';

type SelectProps = {
  ref: QRL<(element: HTMLSelectElement) => void>;
  name: string;
  value: string | string[] | null | undefined;
  onInput$: (event: Event, element: HTMLSelectElement) => void;
  onChange$: (event: Event, element: HTMLSelectElement) => void;
  onBlur$: (event: Event, element: HTMLSelectElement) => void;
  options: { value: string; label: string }[];
  multiple?: boolean;
  size?: number;
  placeholder?: string;
  class?: string;
  legend?: string;
  label?: string;
  error?: string;
  message?: string;
};

/**
 * Select field that allows users to select predefined values. Various
 * decorations can be displayed in or around the field to communicate the
 * entry requirements.
 */
export const Select = component$(({ value, options, legend, label, error, message = "", ...props }: SelectProps) => {
  const { name, multiple, placeholder } = props;
  const className = props.class ?? "";
  delete props.class;

  // Create computed value of selected values
  const values = useSignal<string[]>();

  useTask$(({ track }) => {
    track(() => value);
    values.value = Array.isArray(value)
      ? value
      : value && typeof value === 'string'
        ? [value]
        : [];
  });

  // Use frozen error signal
  const frozenError = useSignal<string>();

  // Freeze error while element collapses to prevent UI from jumping
  useTask$(({ track, cleanup }) => {
    const nextError = track(() => error);
    if (isBrowser && !nextError) {
      const timeout = setTimeout(() => (frozenError.value = nextError), 200);
      cleanup(() => clearTimeout(timeout));
    } else {
      frozenError.value = nextError;
    }
  });


  return (
    <fieldset class="fieldset w-full">
      {legend &&
        <legend class="fieldset-legend w-full py-0">{legend}</legend>
      }
      <label class={[className, "select bg-white text-black w-full focus-within:outline-none focus:outline-none appearance-none", error && 'border-error', multiple ? '' : '']}>
        {label &&
          <span class={clsx("label px-2")}>
            <i translate="no"
              class={[label.split("-")[0] == "icon" ? 'text-2xl material-symbols-outlined' : label.split("-")[0] == "flag" && "fi fi-" + label.split("-")[1]]}
            >
              {label.split("-")[0] == "icon" ? label.split("-")[1] : label.split("-")[0] == "flag" && ""}
            </i>
          </span>
        }
        <select class="capitalize px-1" {...props} id={name}>
          <option value="" disabled hidden selected={!value}>
            {placeholder}
          </option>
          {options.map((option, key) => (
            <option class="capitalize" key={key} value={option.value} selected={values.value?.includes(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <Expandable expanded={!!error || !!message}>
        <p class={["label **:text-sm p-0 whitespace-normal text-justify", error && "text-error"]}>
          {frozenError.value || message}
        </p>
      </Expandable>
    </fieldset>
  );
}
);
