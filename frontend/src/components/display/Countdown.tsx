import { component$, useVisibleTask$, useSignal } from '@builder.io/qwik';

interface CountdownProps {
  value: number;
}

export const Countdown = component$<CountdownProps>(({ value }) => {
  return (
    <span class="countdown font-mono text-2xl">
      {/* @ts-ignore */}
      <span style={{ '--value': value }}></span>
    </span>
  );
});
