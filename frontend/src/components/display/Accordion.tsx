import { component$, Slot } from '@builder.io/qwik';

interface AccordionProps {
  name: string;
  title: string;
  checked?: boolean;
}

export const Accordion = component$<AccordionProps>(({ name, title, checked }) => {
  return (
    <div class="collapse collapse-arrow bg-base-200">
      <input type="radio" name={name} checked={checked} />
      <div class="collapse-title text-xl font-medium">
        {title}
      </div>
      <div class="collapse-content">
        <Slot />
      </div>
    </div>
  );
});
