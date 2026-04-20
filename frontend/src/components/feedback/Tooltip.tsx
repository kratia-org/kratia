import { component$, Slot } from '@builder.io/qwik';

interface TooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  open?: boolean;
  class?: string;
}

export const Tooltip = component$<TooltipProps>(({ text, position = 'top', variant, open, class: customClass }) => {
  const classes = [
    'tooltip',
    position ? `tooltip-${position}` : '',
    variant ? `tooltip-${variant}` : '',
    open ? 'tooltip-open' : '',
    customClass || '',
  ].join(' ');

  return (
    <div class={classes} data-tip={text}>
      <Slot />
    </div>
  );
});
