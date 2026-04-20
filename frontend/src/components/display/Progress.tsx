import { component$ } from '@builder.io/qwik';

type ProgressVariant = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

interface ProgressProps {
  value?: number;
  max?: number;
  variant?: ProgressVariant;
  class?: string;
}

export const Progress = component$<ProgressProps>(({ value, max = 100, variant = 'primary', class: customClass }) => {
  return <progress class={`progress progress-${variant} ${customClass || ''}`} value={value} max={max}></progress>;
});
