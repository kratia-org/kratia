import { component$, Slot } from '@builder.io/qwik';

interface SwapProps {
  rotate?: boolean;
  flip?: boolean;
  active?: boolean;
}

export const Swap = component$<SwapProps>(({ rotate, flip, active }) => {
  const classes = [
    'swap',
    rotate ? 'swap-rotate' : '',
    flip ? 'swap-flip' : '',
    active ? 'swap-active' : '',
  ].join(' ');

  return (
    <label class={classes}>
      <input type="checkbox" />
      <div class="swap-on"><Slot name="on" /></div>
      <div class="swap-off"><Slot name="off" /></div>
    </label>
  );
});
