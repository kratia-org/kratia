import { component$, Slot } from '@builder.io/qwik';

interface StepsProps {
  vertical?: boolean;
  class?: string;
}

export const Steps = component$<StepsProps>(({ vertical, class: customClass }) => {
  return (
    <ul class={`steps ${vertical ? 'steps-vertical' : ''} ${customClass || ''}`}>
      <Slot />
    </ul>
  );
});

interface StepItemProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  dataContent?: string;
}

export const StepItem = component$<StepItemProps>(({ variant, dataContent }) => {
  return (
    <li class={`step ${variant ? `step-${variant}` : ''}`} data-content={dataContent}>
      <Slot />
    </li>
  );
});
