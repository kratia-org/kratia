import { component$, Slot } from '@builder.io/qwik';

interface CollapseProps {
  title: string;
  arrow?: boolean;
  plus?: boolean;
  class?: string;
}

export const Collapse = component$<CollapseProps>(({ title, arrow = true, plus, class: customClass }) => {
  const classes = [
    'collapse bg-base-200',
    arrow ? 'collapse-arrow' : '',
    plus ? 'collapse-plus' : '',
    customClass || '',
  ].join(' ');

  return (
    <div tabIndex={0} class={classes}>
      <div class="collapse-title text-xl font-medium">
        {title}
      </div>
      <div class="collapse-content">
        <Slot />
      </div>
    </div>
  );
});
