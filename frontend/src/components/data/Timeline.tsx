import { component$, Slot } from '@builder.io/qwik';

interface TimelineProps {
  vertical?: boolean;
  compact?: boolean;
}

export const Timeline = component$<TimelineProps>(({ vertical = true, compact }) => {
  return (
    <ul class={`timeline ${vertical ? 'timeline-vertical' : ''} ${compact ? 'timeline-compact' : ''}`}>
      <Slot />
    </ul>
  );
});

interface TimelineItemProps {
  start?: boolean;
  end?: boolean;
  box?: boolean;
}

export const TimelineItem = component$<TimelineItemProps>(({ start, end, box }) => {
  return (
    <li>
      <Slot name="top" />
      <hr />
      <div class="timeline-middle">
        <Slot name="icon" />
      </div>
      <div class={`${start ? 'timeline-start' : ''} ${end ? 'timeline-end' : ''} ${box ? 'timeline-box' : ''}`}>
        <Slot />
      </div>
      <hr />
    </li>
  );
});
