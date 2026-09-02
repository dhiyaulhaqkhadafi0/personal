"use client";

import { useEffect, useState, useRef } from "react";
import type { Editor } from "@tiptap/react";
import { Trash2, Edit3, MessageSquare } from "lucide-react";

type Props = {
  editor: Editor | null;
};

export function StudioImageToolbar({ editor }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const checkImageSelection = () => {
      if (!editor.isActive("image")) {
        setIsVisible(false);
        return;
      }

      const domSelection = window.getSelection();
      const selectedImg = document.querySelector(".studio-tiptap img.ProseMirror-selectednode");

      if (selectedImg) {
        const rect = selectedImg.getBoundingClientRect();
        setPosition({
          top: Math.max(70, rect.top - 44),
          left: Math.max(16, rect.left + rect.width / 2 - 120),
        });
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    editor.on("selectionUpdate", checkImageSelection);
    return () => {
      editor.off("selectionUpdate", checkImageSelection);
    };
  }, [editor]);

  if (!editor || !isVisible) return null;

  const currentAttrs = editor.getAttributes("image");

  const handleEditAlt = () => {
    const nextAlt = window.prompt("Teks Alt Gambar (aksesibilitas & SEO):", currentAttrs.alt || "");
    if (nextAlt !== null) {
      editor.chain().focus().updateAttributes("image", { alt: nextAlt }).run();
    }
  };

  const handleEditCaption = () => {
    const nextTitle = window.prompt("Keterangan Gambar (Caption opsional):", currentAttrs.title || "");
    if (nextTitle !== null) {
      editor.chain().focus().updateAttributes("image", { title: nextTitle }).run();
    }
  };

  const handleDelete = () => {
    editor.chain().focus().deleteSelection().run();
    setIsVisible(false);
  };

  return (
    <div
      ref={toolbarRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className="fixed z-40 flex items-center gap-1 p-1 rounded-xl bg-[#16171E]/95 border border-white/15 shadow-2xl backdrop-blur-xl select-none animate-in fade-in duration-100"
      onMouseDown={(e) => e.preventDefault()}
    >
      <button
        type="button"
        onClick={handleEditAlt}
        title="Ubah teks Alt"
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10 transition-colors"
      >
        <Edit3 className="w-3 h-3 text-[#34D399]" />
        <span>Alt</span>
      </button>

      <span className="w-px h-3.5 bg-white/10" />

      <button
        type="button"
        onClick={handleEditCaption}
        title="Ubah caption gambar"
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10 transition-colors"
      >
        <MessageSquare className="w-3 h-3 text-[#60A5FA]" />
        <span>Caption</span>
      </button>

      <span className="w-px h-3.5 bg-white/10" />

      <button
        type="button"
        onClick={handleDelete}
        title="Hapus gambar ini"
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-[#EF4444] hover:bg-[#EF4444]/15 transition-colors"
      >
        <Trash2 className="w-3 h-3" />
        <span>Hapus</span>
      </button>
    </div>
  );
}
