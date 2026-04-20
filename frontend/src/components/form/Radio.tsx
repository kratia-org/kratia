import { component$, type QwikIntrinsicElements } from '@builder.io/qwik';

interface RadioProps extends QwikIntrinsicElements['input'] {
  label: string;
}

export const Radio = component$<RadioProps>(({ label, ...rest }) => {
  return (
    <div class="form-control">
      <label class="label cursor-pointer justify-start gap-4">
        <input {...rest} type="radio" class={`radio radio-primary ${rest.class || ''}`} />
        <span class="label-text font-medium">{label}</span>
      </label>
    </div>
  );
});
