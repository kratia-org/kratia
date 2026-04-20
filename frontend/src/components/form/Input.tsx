import { component$, type QRL, useSignal, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import clsx from 'clsx';
import { Error } from './Error';
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';


type TextInputProps = {
  ref?: QRL<(element: HTMLInputElement) => void>;
  type?: 'text' | 'email' | 'tel' | 'password' | 'url' | 'number' | 'date';
  name: string;
  value: string | string[] | number | null | undefined;
  onInput$: (event: Event, element: HTMLInputElement) => void;
  onChange$: (event: Event, element: HTMLInputElement) => void;
  onBlur$: (event: Event, element: HTMLInputElement) => void;
  placeholder?: string;
  required?: boolean;
  class?: string;
  legend?: string;
  label?: string;
  error?: string;
  form?: string;
  disabled?: boolean;
  readonly?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  justify?: 'left' | 'center' | 'right';
  width?: string;
};

/**
 * Text input field that users can type into. Various decorations can be
 * displayed in or around the field to communicate the entry requirements.
 */
export const Input = component$(({ type, legend, pattern, minLength, maxLength, label, value, error, readonly, justify, width, ...props }: TextInputProps) => {

  const { name, required } = props;
  const className = props.class ?? "";
  delete props.class;

  const input = useSignal<string | string[] | number | null | undefined>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (type === "date") {
      const picker = document.getElementById(name) as HTMLInputElement;
      new AirDatepicker(picker, {
        locale: localeEn,
        dateFormat: 'yyyy-mm-dd',
        onSelect: (date) => picker.value = date.formattedDate.toString(),


      })
    }
  })

  useTask$(({ track }) => {
    if (!Number.isNaN(track(() => value))) {
      input.value = value;
    }
  });
  return (
    <fieldset class={clsx(width ? width : 'w-full', 'fieldset m-0 p-0')}>
      {legend &&
        <legend class="w-full fieldset-legend py-1">{legend}</legend>
      }
      <label class={clsx(className, 'p-0 input bg-white text-black w-full focus:outline-none focus-within:outline-none', error && 'border-error', props.class)}>
        {label &&
          <span class={clsx("label px-2 m-0")}>
            <i translate="no"
              class={clsx(label.split("-")[0] === "icon" ? 'material-symbols-outlined' : label.split("-")[0] === "flag" && "fi fi-" + label.split("-")[1])}
            >
              {label.split("-")[0] === "icon" ? label.split("-")[1] : label.split("-")[0] === "flag" && ""}
            </i>
          </span>
        }
        <input type={type === "date" ? "text" : type} class={`z-50 text-${justify}`} {...props} id={name} value={input.value} readOnly={readonly} required={required} pattern={pattern} minLength={minLength} maxLength={maxLength} />
      </label>
      <Error error={error} />
    </fieldset>
  );
}
);
