import { component$ } from '@builder.io/qwik';

export const ThemeController = component$(() => {
  return (
    <input 
      type="checkbox" 
      value="synthwave" 
      class="toggle theme-controller" 
    />
  );
});
