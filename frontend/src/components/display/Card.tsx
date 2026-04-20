import { component$, Slot } from '@builder.io/qwik';

interface CardProps {
  class?: string;
}

export const Card = component$<CardProps>(({ class: customClass }) => {

  return (
    <div class={[
      'card',
      customClass
    ]}>
      <CardHeader />
      <CardBody />
      <CardFooter />
    </div>
  );
});

interface CardHeaderProps {
  class?: string;
  title?: string;
  subtitle?: string;
}

export const CardHeader = component$<CardHeaderProps>(({ class: customClass, title, subtitle }) => {
  return (
    <div class={['card-header', customClass]}>
      {title && <h2 class="card-title">{title}</h2>}
      {subtitle && <p class="text-sm text-gray-500">{subtitle}</p>}
      <Slot />
    </div>
  );
});

interface CardBodyProps {
  class?: string
}

export const CardBody = component$<CardBodyProps>(({ class: customClass }) => {
  return (
    <div class={['card-body', customClass]}>
      <Slot />
    </div>
  );
});

export const CardFooter = component$(() => {
  return (
    <div class="card-footer">
      <Slot />
    </div>
  );
});
