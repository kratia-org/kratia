import { component$ } from '@builder.io/qwik';

interface DiffProps {
  src1: string;
  src2: string;
  alt1?: string;
  alt2?: string;
}

export const Diff = component$<DiffProps>(({ src1, src2, alt1, alt2 }) => {
  return (
    <div class="diff aspect-[16/9]">
      <div class="diff-item-1">
        <img alt={alt1 || 'image 1'} src={src1} />
      </div>
      <div class="diff-item-2">
        <img alt={alt2 || 'image 2'} src={src2} />
      </div>
      <div class="diff-resizer"></div>
    </div>
  );
});
