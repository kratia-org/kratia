import { component$ } from '@builder.io/qwik';

type LoadingType = 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';
type LoadingSize = 'lg' | 'md' | 'sm' | 'xs';

interface LoadingProps {
  type?: LoadingType;
  size?: LoadingSize;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error';
  class?: string;
}

export const Loading = component$<LoadingProps>(({ type = 'spinner', size = 'md', variant, class: customClass }) => {
  const classes = [
    'loading',
    type ? `loading-${type}` : '',
    size ? `loading-${size}` : '',
    variant ? `text-${variant}` : '',
    customClass || '',
  ].join(' ');

  return <span class={classes}></span>;
});
