import { component$ } from '@builder.io/qwik';

interface SkeletonProps {
  class?: string;
  circle?: boolean;
}

export const Skeleton = component$<SkeletonProps>(({ class: customClass, circle }) => {
  const classes = [
    'skeleton',
    circle ? 'rounded-full' : '',
    customClass || '',
  ].join(' ');

  return <div class={classes}></div>;
});
