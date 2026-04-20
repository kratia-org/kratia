import { component$, Slot } from '@builder.io/qwik';

interface MenuProps {
  horizontal?: boolean;
  vertical?: boolean;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  class?: string;
}

export const Menu = component$<MenuProps>(({ horizontal, vertical, size, class: customClass }) => {
  const classes = [
    'menu bg-base-200 rounded-box',
    horizontal ? 'menu-horizontal' : '',
    vertical ? 'menu-vertical' : '',
    size ? `menu-${size}` : '',
    customClass || '',
  ].join(' ');

  return (
    <ul class={classes}>
      <Slot />
    </ul>
  );
});

export const MenuItem = component$(() => {
  return (
    <li>
      <Slot />
    </li>
  );
});
