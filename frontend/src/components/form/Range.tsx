import { component$, type QwikIntrinsicElements } from '@builder.io/qwik';

interface RangeProps extends QwikIntrinsicElements['input'] {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const Range = component$<RangeProps>(({ label, min = 0, max = 100, step = 1, ...rest }) => {
  return (
    <div class="form-control w-full">
      {label && (
        <label class="label">
          <span class="label-text font-semibold">{label}</span>
        </label>
      )}
      <input {...rest} type="range" min={min} max={max} step={step} class={`range range-primary ${rest.class || ''}`} />
      <div class="w-full flex justify-between text-xs px-2 mt-2">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
});
