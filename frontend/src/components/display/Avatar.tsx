import { component$ } from '@builder.io/qwik';

type AvatarSize = 'lg' | 'md' | 'sm' | 'xs';
type AvatarShape = 'circle' | 'rounded' | 'squircle' | 'hexagon' | 'triangle';

interface AvatarProps {
  src?: string;
  placeholder?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  online?: boolean;
  offline?: boolean;
  class?: string;
}

const sizeMap = {
  xs: 'w-8',
  sm: 'w-12',
  md: 'w-16',
  lg: 'w-24',
};

export const Avatar = component$<AvatarProps>(({ 
  src, 
  placeholder, 
  size = 'md', 
  shape = 'circle', 
  online, 
  offline,
  class: customClass 
}) => {
  const containerClasses = [
    'avatar',
    online ? 'online' : '',
    offline ? 'offline' : '',
    placeholder ? 'placeholder' : '',
    customClass || '',
  ].join(' ');

  const imageClasses = [
    sizeMap[size] || 'w-16',
    shape === 'rounded' ? 'rounded' : 
    shape === 'circle' ? 'rounded-full' : 
    shape === 'squircle' ? 'mask mask-squircle' : 
    shape === 'hexagon' ? 'mask mask-hexagon' : 
    shape === 'triangle' ? 'mask mask-triangle' : '',
  ].join(' ');

  return (
    <div class={containerClasses}>
      <div class={imageClasses}>
        {src ? (
          <img src={src} alt="avatar" />
        ) : (
          <div class="bg-neutral text-neutral-content flex items-center justify-center">
            <span class="text-xl uppercase">{placeholder?.charAt(0) || 'U'}</span>
          </div>
        )}
      </div>
    </div>
  );
});
