import { component$, Slot } from '@builder.io/qwik';

interface DrawerProps {
  id: string;
}

export const Drawer = component$<DrawerProps>(({ id }) => {
  return (
    <div class="drawer">
      <input id={id} type="checkbox" class="drawer-toggle" />
      <div class="drawer-content">
        <Slot name="content" />
      </div>
      <div class="drawer-side">
        <label for={id} aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <Slot name="side" />
        </ul>
      </div>
    </div>
  );
});
