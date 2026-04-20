import {
  component$,
  Slot,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import autoAnimate from '@formkit/auto-animate';

type ExpandableProps = {
  expanded: boolean;
};

/**
 * Wrapper component to vertically expand or collapse content with auto-animate.
 */
export const Expandable = component$(({ expanded }: ExpandableProps) => {
  // Reference to the parent element
  const parent = useSignal<HTMLDivElement>();

  // Setup auto-animate when the component mounts
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (parent.value) {
      autoAnimate(parent.value, (el, action) => {
        let keyframes: Keyframe[] = [];

        if (action === 'add') {
          keyframes = [
            { transform: 'scale(0)', opacity: 0 },
            { transform: 'scale(1.15)', opacity: 1, offset: 0.75 },
            { transform: 'scale(1)', opacity: 1 },
          ];
        }

        if (action === 'remove') {
          keyframes = [
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(1.15)', opacity: 1, offset: 0.33 },
            { transform: 'scale(0.75)', opacity: 0.1, offset: 0.5 },
            { transform: 'scale(0.5)', opacity: 0 },
          ];
        }

        return new KeyframeEffect(el, keyframes, {
          duration: 600,
          easing: 'ease-out',
        });
      });
    }
  });

  return (
    <div ref={parent}>
      {expanded && <Slot />}
    </div>
  );
});
