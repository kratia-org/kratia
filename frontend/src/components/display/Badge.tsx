import { component$, Slot } from '@builder.io/qwik';

type BadgeVariant = 'neutral' | 'primary' | 'secondary' | 'accent' | 'ghost' | 'info' | 'success' | 'warning' | 'error';
type BadgeSize = 'lg' | 'md' | 'sm' | 'xs';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  outline?: boolean;
  class?: string;
}

export const Badge = component$<BadgeProps>(({ variant = 'neutral', size = 'md', outline = false, class: customClass }) => {
  const classes = [
    'badge',
    variant ? `badge-${variant}` : '',
    size ? `badge-${size}` : '',
    outline ? 'badge-outline' : '',
    customClass || '',
  ].join(' ');

  return (
    <div class={classes}>
      <Slot />
    </div>
  );
});
