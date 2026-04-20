import { component$, Slot } from '@builder.io/qwik';

interface TableProps {
  zebra?: boolean;
  pinRows?: boolean;
  pinCols?: boolean;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  class?: string;
}

export const Table = component$<TableProps>(({ zebra, pinRows, pinCols, size = 'md', class: customClass }) => {
  const classes = [
    'table',
    zebra ? 'table-zebra' : '',
    pinRows ? 'table-pin-rows' : '',
    pinCols ? 'table-pin-cols' : '',
    size ? `table-${size}` : '',
    customClass || '',
  ].join(' ');

  return (
    <table class={classes}>
      <Slot />
    </table>
  );
});
