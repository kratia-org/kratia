import { component$, Slot, type QwikIntrinsicElements } from '@builder.io/qwik';

interface LinkProps extends QwikIntrinsicElements['a'] {
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error';
  hover?: boolean;
}

export const Link = component$<LinkProps>(({ variant, hover = true, ...rest }) => {
  const classes = [
    'link',
    variant ? `link-${variant}` : '',
    hover ? 'link-hover' : '',
    rest.class || '',
  ].join(' ');

  return (
    <a {...rest} class={classes}>
      <Slot />
    </a>
  );
});
