import { component$, Slot } from '@builder.io/qwik';

export const BottomNavigation = component$(() => {
  return (
    <div class="btm-nav">
      <Slot />
    </div>
  );
});

interface BottomNavButtonProps {
  active?: boolean;
}

export const BottomNavButton = component$<BottomNavButtonProps>(({ active }) => {
  return (
    <button class={active ? 'active' : ''}>
      <Slot />
    </button>
  );
});
