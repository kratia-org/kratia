import { component$ } from '@builder.io/qwik';

type MaskShape = 'squircle' | 'heart' | 'hexagon' | 'hexagon-2' | 'decagon' | 'pentagon' | 'diamond' | 'square' | 'circle' | 'parachute' | 'star' | 'star-2' | 'triangle' | 'triangle-2' | 'triangle-3' | 'triangle-4';

interface MaskProps {
  src: string;
  shape?: MaskShape;
}

export const Mask = component$<MaskProps>(({ src, shape = 'squircle' }) => {
  return <img class={`mask mask-${shape}`} src={src} />;
});
