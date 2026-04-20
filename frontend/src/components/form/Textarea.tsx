import { component$, type QwikIntrinsicElements } from '@builder.io/qwik';

interface TextareaProps extends QwikIntrinsicElements['textarea'] {
  label?: string;
  error?: string;
}

export const Textarea = component$<TextareaProps>(({ label, error, ...rest }) => {
  const classes = [
    'textarea textarea-bordered w-full h-24',
    error ? 'textarea-error' : '',
    rest.class || '',
  ].join(' ');

  return (
    <div class="form-control w-full">
      {label && (
        <label class="label">
          <span class="label-text font-semibold">{label}</span>
        </label>
      )}
      <textarea {...rest} class={classes}></textarea>
      {error && (
        <label class="label">
          <span class="label-text-alt text-error font-medium">{error}</span>
        </label>
      )}
    </div>
  );
});
