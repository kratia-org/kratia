import { component$, Slot } from '@builder.io/qwik';

interface ToastProps {
  horizontal?: 'start' | 'center' | 'end';
  vertical?: 'top' | 'middle' | 'bottom';
  class?: string;
}

export const Toast = component$<ToastProps>(({ horizontal = 'end', vertical = 'bottom', class: customClass }) => {
  const classes = [
    'toast',
    horizontal ? `toast-${horizontal}` : '',
    vertical ? `toast-${vertical}` : '',
    customClass || '',
  ].join(' ');

  return (
    <div class={classes}>
      <Slot />
    </div>
  );
});
