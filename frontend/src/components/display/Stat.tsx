import { component$, Slot } from '@builder.io/qwik';

interface StatProps {
  title: string;
  value: string | number;
  desc?: string;
  variant?: string;
  class?: string;
}

export const Stat = component$<StatProps>(({ title, value, desc, variant, class: customClass }) => {
  return (
    <div class={`stat ${customClass || ''}`}>
      <div class="stat-title">{title}</div>
      <div class={`stat-value ${variant ? `text-${variant}` : ''}`}>{value}</div>
      {desc && <div class="stat-desc">{desc}</div>}
      <Slot />
    </div>
  );
});

export const StatsContainer = component$(() => {
  return <div class="stats shadow w-full"><Slot /></div>;
});
