import { component$ } from '@builder.io/qwik';

interface RadialProgressProps {
  value: number;
  size?: string;
  thickness?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
}

export const RadialProgress = component$<RadialProgressProps>(({ value, size = '12rem', thickness = '2px', variant }) => {
  return (
    <div 
      class={`radial-progress ${variant ? `text-${variant}` : ''}`} 
      /* @ts-ignore */
      style={{ '--value': value, '--size': size, '--thickness': thickness }} 
      role="progressbar"
    >
      {value}%
    </div>
  );
});
