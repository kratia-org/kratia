import { component$, Slot } from '@builder.io/qwik';

interface HeroProps {
  overlay?: boolean;
  bgUrl?: string;
}

export const Hero = component$<HeroProps>(({ overlay, bgUrl }) => {
  return (
    <div class="hero min-h-screen" style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : {}}>
      {overlay && <div class="hero-overlay bg-opacity-60"></div>}
      <div class="hero-content text-center">
        <div class="max-width: 448px">
          <Slot />
        </div>
      </div>
    </div>
  );
});
