import { component$, Slot } from '@builder.io/qwik';

interface DropdownProps {
  label?: string;
  align?: 'end' | 'start';
  position?: 'top' | 'bottom' | 'left' | 'right';
  hover?: boolean;
  class?: string;
}

export const Dropdown = component$<DropdownProps>(({ label, align = 'start', position = 'bottom', hover, class: customClass }) => {
  const classes = [
    'dropdown',
    align === 'end' ? 'dropdown-end' : '',
    position === 'top' ? 'dropdown-top' : 
    position === 'left' ? 'dropdown-left' : 
    position === 'right' ? 'dropdown-right' : '',
    hover ? 'dropdown-hover' : '',
    customClass || '',
  ].join(' ');

  return (
    <div class={classes}>
      <label tabIndex={0} class="btn m-1">
        {label || <Slot name="label" />}
      </label>
      <ul tabIndex={0} class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <Slot />
      </ul>
    </div>
  );
});
