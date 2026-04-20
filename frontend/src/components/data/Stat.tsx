import { component$, Slot } from '@builder.io/qwik';

interface StatProps {
  title: string;
  value: string | number;
  desc?: string;
  icon?: boolean;
  variant?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  class?: string;
}

export const Stat = component$<StatProps>(({ title, value, desc, icon, variant, class: customClass }) => {
  return (
    <div class={`stat ${customClass || ''}`}>
      {icon && (
        <div class="stat-figure text-primary">
          <Slot name="icon" />
        </div>
      )}
      <div class="stat-title">{title}</div>
      <div class={`stat-value ${variant ? `text-${variant}` : ''}`}>{value}</div>
      {desc && <div class="stat-desc">{desc}</div>}
      <Slot />
    </div>
  );
});

export const StatsContainer = component$(() => {
  return (
    <div class="stats shadow w-full">
      <Slot />
    </div>
  );
});
