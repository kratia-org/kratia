import { $, component$, useSignal } from '@builder.io/qwik';
import clsx from 'clsx';

type ButtonProps = {
  type: 'button' | 'reset' | 'submit';
  'preventdefault:click'?: boolean;
  label: string;
  onClick$?: () => unknown;
  loading?: boolean;
  form?: string;
  class?: string;
};

/**
 * Basic button component that contains important functionality and is used to
 * build more complex components on top of it.
 */
export const Button = component$((props: ButtonProps) => {
  // Use loading signal
  const loading = useSignal(false);

  return (
    <button {...props}
      // disabled={loading.value || props.loading}
      // Start and stop loading if function is async
      onClick$={props.onClick$ &&
        $(async () => {
          loading.value = true;
          await props.onClick$!();
          loading.value = false;
        })
      }
    >
      <span class={clsx('loading loading-spinner duration-200', loading.value || props.loading ? 'visible delay-300' : 'invisible -translate-x-5 opacity-0')} />
      <span class={clsx('transition-[opacity,transform,visibility] duration-200', loading.value || props.loading ? 'invisible translate-x-5 opacity-0' : 'visible delay-300')}>
        {props.label}
      </span>
    </button>
  );
});
