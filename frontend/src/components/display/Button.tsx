import { component$, Slot, type QwikIntrinsicElements } from '@builder.io/qwik';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'link' | 'outline' | 'info' | 'success' | 'warning' | 'error';
type ButtonSize = 'lg' | 'md' | 'sm' | 'xs';

export interface ButtonProps extends QwikIntrinsicElements['button'] {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = component$<ButtonProps>(({ variant = 'primary', size = 'md', loading, ...rest }) => {
  const classes = [
    'btn',
    variant ? `btn-${variant}` : '',
    size ? `btn-${size}` : '',
    loading ? 'btn-disabled' : '',
    rest.class || '',
  ].join(' ');

  return (
    <button {...rest} class={classes}>
      {loading && <span class="loading loading-spinner"></span>}
      <Slot />
    </button>
  );
});
