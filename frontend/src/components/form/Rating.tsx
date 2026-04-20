import { component$, type QwikIntrinsicElements } from '@builder.io/qwik';

interface RatingProps extends QwikIntrinsicElements['input'] {
  label?: string;
  max?: number;
}

export const Rating = component$<RatingProps>(({ label, max = 5, ...rest }) => {
  return (
    <div class="form-control">
      {label && (
        <label class="label">
          <span class="label-text font-semibold">{label}</span>
        </label>
      )}
      <div class="rating">
        {Array.from({ length: max }).map((_, i) => (
          <input 
            key={i} 
            {...rest}
            type="radio" 
            name={rest.name || 'rating'} 
            class="mask mask-star-2 bg-orange-400" 
            checked={i + 1 === (rest.value as unknown as number)}
          />
        ))}
      </div>
    </div>
  );
});
