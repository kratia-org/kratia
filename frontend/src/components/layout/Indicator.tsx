import { component$, Slot } from '@builder.io/qwik';

export const Indicator = component$(() => {
  return (
    <div class="indicator">
      <span class="indicator-item badge badge-primary"></span>
      <Slot />
    </div>
  );
});

export const IndicatorItem = component$(() => {
  return (
    <span class="indicator-item">
      <Slot />
    </span>
  );
});
