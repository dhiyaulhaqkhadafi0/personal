import Blockquote from '@tiptap/extension-blockquote';
import { mergeAttributes } from '@tiptap/core';

export type QuoteVariant = 'quote' | 'pullquote' | 'callout';

export const EditorialBlockquote = Blockquote.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      variant: {
        default: 'quote',
        parseHTML: (element: HTMLElement) => {
          const variant = element.getAttribute('data-variant');
          if (variant === 'pullquote' || element.classList.contains('pullquote')) {
            return 'pullquote';
          }
          if (variant === 'callout' || element.classList.contains('callout')) {
            return 'callout';
          }
          return 'quote';
        },
        renderHTML: (attributes: Record<string, any>) => {
          const variant = (attributes.variant as QuoteVariant) || 'quote';
          const className =
            variant === 'pullquote'
              ? 'pullquote'
              : variant === 'callout'
              ? 'callout'
              : 'editorial-quote';

          return {
            'data-variant': variant,
            class: className,
          };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['blockquote', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});
