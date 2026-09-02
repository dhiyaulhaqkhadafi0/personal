"use client";

import { useEffect, useState, useRef } from "react";
import type { Editor } from "@tiptap/react";
import { Bold, Italic, Strikethrough, Link2, RemoveFormatting } from "lucide-react";

type Props = {
  editor: Editor | null;
};

export function StudioBubbleMenu({ editor }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const updateMenu = () => {
      const { state, view } = editor;
      const { selection } = state;

      // Only show if selection is not empty (i.e. user selected text)
      if (selection.empty) {
        setIsVisible(false);
        return;
      }

      // Check if text is currently selected inside DOM
      const domSelection = window.getSelection();
      if (!domSelection || domSelection.isCollapsed || domSelection.rangeCount === 0) {
        setIsVisible(false);
        return;
      }

      try {
        const range = domSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        if (rect.width === 0 || rect.height === 0) {
          setIsVisible(false);
          return;
        }

        const menuWidth = 190;
        const menuHeight = 40;

        let top = rect.top - menuHeight - 8;
        // If too close to viewport top, place below selection
        if (top < 60) {
          top = rect.bottom + 8;
        }

        let left = rect.left + rect.width / 2 - menuWidth / 2;
        // Clamp left within window edges
        left = Math.max(12, Math.min(left, window.innerWidth - menuWidth - 12));

        setPosition({ top, left });
        setIsVisible(true);
      } catch {
        setIsVisible(false);
      }
    };

    editor.on("selectionUpdate", updateMenu);
    editor.on("blur", () => {
      // Small timeout to allow button clicks inside bubble menu before hiding
      setTimeout(() => {
        if (!menuRef.current?.contains(document.activeElement)) {
          setIsVisible(false);
        }
      }, 150);
    });

    return () => {
      editor.off("selectionUpdate", updateMenu);
    };
  }, [editor]);

  if (!editor || !isVisible) return null;

  const handleLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL tautan:", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
  };

  const handleClear = () => {
    editor.chain().focus().unsetAllMarks().clearNodes().run();
  };

  return (
    <div
      ref={menuRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className="fixed z-40 flex items-center gap-0.5 p-1 rounded-xl bg-[#16171E]/95 border border-white/15 shadow-2xl backdrop-blur-xl select-none animate-in fade-in zoom-in-95 duration-100"
      onMouseDown={(e) => e.preventDefault()} // Prevents losing editor selection
    >
      <button
        type="button"
        title="Tebal (Ctrl+B)"
        aria-label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
          editor.isActive("bold")
            ? "bg-[#34D399]/20 text-[#34D399]"
            : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10"
        }`}
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        title="Miring (Ctrl+I)"
        aria-label="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
          editor.isActive("italic")
            ? "bg-[#34D399]/20 text-[#34D399]"
            : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10"
        }`}
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        title="Coret (Strikethrough)"
        aria-label="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
          editor.isActive("strike")
            ? "bg-[#34D399]/20 text-[#34D399]"
            : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10"
        }`}
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </button>

      <span className="w-px h-3.5 bg-white/10 mx-0.5" />

      <button
        type="button"
        title="Sisipkan Tautan"
        aria-label="Link"
        onClick={handleLink}
        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
          editor.isActive("link")
            ? "bg-[#34D399]/20 text-[#34D399]"
            : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10"
        }`}
      >
        <Link2 className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        title="Hapus Pemformatan"
        aria-label="Clear formatting"
        onClick={handleClear}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#71717A] hover:text-[#EF4444] hover:bg-white/10 transition-colors"
      >
        <RemoveFormatting className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
