import { component$, Slot } from '@builder.io/qwik';

export const Breadcrumbs = component$(() => {
  return (
    <div class="text-sm breadcrumbs">
      <ul>
        <Slot />
      </ul>
    </div>
  );
});

export const BreadcrumbItem = component$(() => {
  return (
    <li>
      <Slot />
    </li>
  );
});
