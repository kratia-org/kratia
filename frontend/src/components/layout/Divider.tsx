import { component$, Slot } from '@builder.io/qwik';

interface DividerProps {
  text?: string;
  vertical?: boolean;
  class?: string;
}

export const Divider = component$<DividerProps>(({ text, vertical, class: customClass }) => {
  return (
    <div class={`divider ${vertical ? 'divider-horizontal' : ''} ${customClass || ''}`}>
      {text || <Slot />}
    </div>
  );
});
