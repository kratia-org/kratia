import { component$ } from '@builder.io/qwik';
import clsx from 'clsx';
import { Expandable } from '../actions/Expandable';

type Alert = {
  type: "success" | "error" | "warning" | "info" | "loading";
  message: string;
};

/**
 * Response text usually used at the end of a form to provide feedback to the
 * user.
 */
export default component$(({ type, message }: Alert) => {

  return (
    <Expandable expanded={!!message}>
      <div role="alert" class={clsx('alert',
        type === 'success' &&
        'alert-success',
        type === 'error' &&
        'alert-error',
        type === 'warning' &&
        'alert-warning',
        type === 'info' &&
        'alert-info'
      )}
      >{type === "loading" ?
        <span class="loading loading-spinner loading-xl"></span>
        : <i class={`bi bi-${type === "success" ? "check-circle-fill" : type === "error" ? "x-circle-fill" : type === "warning" ? "exclamation-triangle-fill" : type === "info" && "info-circle-fill"}`}></i>
        }
        <span>{message}</span>
      </div>
    </Expandable >
  );
});
