import { component$, type QwikIntrinsicElements } from '@builder.io/qwik';

interface ToggleProps extends QwikIntrinsicElements['input'] {
  label: string;
}

export const Toggle = component$<ToggleProps>(({ label, ...rest }) => {
  return (
    <div class="form-control">
      <label class="label cursor-pointer justify-start gap-4">
        <input {...rest} type="checkbox" class={`toggle toggle-primary ${rest.class || ''}`} />
        <span class="label-text font-medium">{label}</span>
      </label>
    </div>
  );
});
