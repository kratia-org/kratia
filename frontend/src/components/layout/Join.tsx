import { component$, Slot } from '@builder.io/qwik';

interface JoinProps {
  vertical?: boolean;
}

export const Join = component$<JoinProps>(({ vertical }) => {
  return (
    <div class={`join ${vertical ? 'join-vertical' : ''}`}>
      <Slot />
    </div>
  );
});
