import { component$, Slot } from '@builder.io/qwik';

interface CarouselProps {
  snap?: 'center' | 'end';
  vertical?: boolean;
  class?: string;
}

export const Carousel = component$<CarouselProps>(({ snap = 'center', vertical, class: customClass }) => {
  const classes = [
    'carousel',
    snap ? `carousel-${snap}` : '',
    vertical ? 'carousel-vertical' : '',
    customClass || '',
  ].join(' ');

  return (
    <div class={classes}>
      <Slot />
    </div>
  );
});

export const CarouselItem = component$(() => {
  return (
    <div class="carousel-item">
      <Slot />
    </div>
  );
});
