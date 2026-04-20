import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { isBrowser } from '@builder.io/qwik/build';
import { Expandable } from '../actions/Expandable';

type InputErrorProps = {
  error?: string;
};

export const Error = component$(({ error }: InputErrorProps) => {
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
    <Expandable expanded={!!error}>
      <p class="label text-error text-sm p-0 break-words whitespace-normal text-justify">
        {frozenError.value}
      </p>
    </Expandable>
  );
});
