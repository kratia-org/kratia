import { component$, Slot } from '@builder.io/qwik';

export const PhoneMockup = component$(() => {
  return (
    <div class="mockup-phone">
      <div class="camera"></div>
      <div class="display">
        <div class="artboard artboard-demo phone-1">
          <Slot />
        </div>
      </div>
    </div>
  );
});
