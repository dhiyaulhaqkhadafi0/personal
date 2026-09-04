import { Node, mergeAttributes } from '@tiptap/core';

export interface EditorialFigureOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    editorialFigure: {
      setImage: (options: { src: string; alt?: string; title?: string; caption?: string }) => ReturnType;
    };
  }
}

export const EditorialFigure = Node.create<EditorialFigureOptions>({
  name: 'image',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'block',
  inline: false,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const img = element.tagName.toLowerCase() === 'img' ? element : element.querySelector('img');
          return img?.getAttribute('src') || null;
        },
      },
      alt: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const img = element.tagName.toLowerCase() === 'img' ? element : element.querySelector('img');
          return img?.getAttribute('alt') || null;
        },
      },
      title: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const img = element.tagName.toLowerCase() === 'img' ? element : element.querySelector('img');
          return img?.getAttribute('title') || null;
        },
      },
      caption: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const figcaption = element.querySelector('figcaption');
          if (figcaption && figcaption.textContent && figcaption.textContent.trim().length > 0) {
            return figcaption.textContent.trim();
          }
          const img = element.tagName.toLowerCase() === 'img' ? element : element.querySelector('img');
          const dataCaption = element.getAttribute('data-caption') || img?.getAttribute('data-caption');
          if (dataCaption && dataCaption.trim().length > 0) return dataCaption.trim();
          const title = img?.getAttribute('title');
          if (title && title.trim().length > 0) return title.trim();
          return null;
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure:has(img)',
      },
      {
        tag: 'img[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes.src || '';
    const alt = HTMLAttributes.alt || '';
    const caption = typeof HTMLAttributes.caption === 'string' && HTMLAttributes.caption.trim().length > 0
      ? HTMLAttributes.caption.trim()
      : null;

    const imgAttrs: Record<string, string> = {
      src,
      alt,
      class: 'studio-editor-image',
    };
    if (HTMLAttributes.title) {
      imgAttrs.title = HTMLAttributes.title;
    }

    if (!caption) {
      return [
        'figure',
        mergeAttributes(this.options.HTMLAttributes, { class: 'studio-editorial-figure' }),
        ['img', imgAttrs],
      ];
    }

    return [
      'figure',
      mergeAttributes(this.options.HTMLAttributes, { class: 'studio-editorial-figure' }),
      ['img', imgAttrs],
      ['figcaption', { class: 'studio-editorial-figcaption' }, caption],
    ];
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
