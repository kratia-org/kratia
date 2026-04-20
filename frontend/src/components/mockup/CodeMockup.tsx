import { component$, Slot } from '@builder.io/qwik';

export const CodeMockup = component$(() => {
  return (
    <div class="mockup-code">
      <Slot />
    </div>
  );
});

export const CodeLine = component$(() => {
  return (
    <pre>
      <code><Slot /></code>
    </pre>
  );
});
