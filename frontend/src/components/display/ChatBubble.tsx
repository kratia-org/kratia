import { component$, Slot } from '@builder.io/qwik';

interface ChatBubbleProps {
  side?: 'start' | 'end';
  avatar?: string;
  header?: string;
  footer?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
}

export const ChatBubble = component$<ChatBubbleProps>(({ side = 'start', avatar, header, footer, variant }) => {
  return (
    <div class={`chat chat-${side}`}>
      {avatar && (
        <div class="chat-image avatar">
          <div class="w-10 rounded-full">
            <img alt="avatar" src={avatar} />
          </div>
        </div>
      )}
      {header && <div class="chat-header">{header}</div>}
      <div class={`chat-bubble ${variant ? `chat-bubble-${variant}` : ''}`}>
        <Slot />
      </div>
      {footer && <div class="chat-footer opacity-50">{footer}</div>}
    </div>
  );
});
