"use client";

import { useEffect, useState, useRef } from "react";
import type { Editor } from "@tiptap/react";
import {
  Type, Heading2, Heading3, Quote, List, ListOrdered, Code2,
  Minus, ImageIcon, MessageSquareQuote, Bookmark,
} from "lucide-react";

export type SlashCommandItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: (editor: Editor) => void;
};

type Props = {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: () => void;
  position: { top: number; left: number };
  searchQuery: string;
};

export function StudioSlashMenu({
  editor,
  isOpen,
  onClose,
  onSelectImage,
  position,
  searchQuery,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const commands: SlashCommandItem[] = [
    {
      id: "paragraph",
      title: "Teks Biasa",
      description: "Mulai menulis paragraf editorial standar",
      icon: Type,
      action: (ed) => ed.chain().focus().setParagraph().run(),
    },
    {
      id: "heading2",
      title: "Heading 2",
      description: "Subjudul bagian utama naskah",
      icon: Heading2,
      action: (ed) => ed.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      id: "heading3",
      title: "Heading 3",
      description: "Subjudul subbagian yang lebih spesifik",
      icon: Heading3,
      action: (ed) => ed.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      id: "blockquote",
      title: "Kutipan (Quote)",
      description: "Kutipan pembicara atau referensi penting",
      icon: Quote,
      action: (ed) => {
        ed.chain()
          .focus()
          .setBlockquote()
          .updateAttributes("blockquote", { variant: "quote" })
          .run();
      },
    },
    {
      id: "pullquote",
      title: "Pull Quote",
      description: "Pernyataan kunci besar dengan penekanan editorial",
      icon: MessageSquareQuote,
      action: (ed) => {
        ed.chain()
          .focus()
          .insertContent({
            type: "blockquote",
            attrs: { variant: "pullquote" },
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "“Tulis pernyataan kunci yang memikat di sini…”" }],
              },
            ],
          })
          .run();
      },
    },
    {
      id: "bulletList",
      title: "Daftar Poin (Bullet)",
      description: "Daftar butir tanpa urutan angka",
      icon: List,
      action: (ed) => ed.chain().focus().toggleBulletList().run(),
    },
    {
      id: "orderedList",
      title: "Daftar Nomor",
      description: "Daftar berurutan berbasis angka",
      icon: ListOrdered,
      action: (ed) => ed.chain().focus().toggleOrderedList().run(),
    },
    {
      id: "callout",
      title: "Catatan / Callout",
      description: "Kotak sorotan informasi atau catatan khusus",
      icon: Bookmark,
      action: (ed) => {
        ed.chain()
          .focus()
          .insertContent({
            type: "blockquote",
            attrs: { variant: "callout" },
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "💡 Catatan: Tulis informasi penting untuk pembaca di sini." }],
              },
            ],
          })
          .run();
      },
    },
    {
      id: "codeBlock",
      title: "Blok Kode",
      description: "Blok kode monospace dengan syntax styling",
      icon: Code2,
      action: (ed) => ed.chain().focus().toggleCodeBlock().run(),
    },
    {
      id: "divider",
      title: "Garis Pembatas",
      description: "Garis pemisah antar babak naskah",
      icon: Minus,
      action: (ed) => ed.chain().focus().setHorizontalRule().run(),
    },
    {
      id: "image",
      title: "Gambar",
      description: "Unggah gambar visual dari komputer",
      icon: ImageIcon,
      action: () => onSelectImage(),
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Execute selected command
  const executeCommand = (cmd: SlashCommandItem) => {
    if (!editor) return;

    // Delete the slash trigger text before running action
    const { from } = editor.state.selection;
    const currentLineText = editor.state.doc.textBetween(
      editor.state.selection.$from.start(),
      from,
      "\n",
      "\0"
    );
    const slashPos = currentLineText.lastIndexOf("/");
    if (slashPos !== -1) {
      const startDelete = editor.state.selection.$from.start() + slashPos;
      editor.chain().focus().deleteRange({ from: startDelete, to: from }).run();
    }

    cmd.action(editor);
    onClose();
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, selectedIndex, filteredCommands, editor]);

  if (!isOpen || filteredCommands.length === 0) return null;

  return (
    <div
      ref={menuRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className="fixed z-50 w-72 max-h-80 overflow-y-auto rounded-xl bg-[#14151B]/95 border border-white/10 shadow-2xl backdrop-blur-xl p-1.5 scrollbar-thin scrollbar-thumb-[#27272A] animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#71717A] border-b border-white/5 mb-1 flex items-center justify-between">
        <span>Blok Editorial</span>
        <span>{filteredCommands.length} opsi</span>
      </div>

      <div className="space-y-0.5">
        {filteredCommands.map((cmd, index) => {
          const Icon = cmd.icon;
          const isSelected = index === selectedIndex;
          return (
            <button
              key={cmd.id}
              type="button"
              onClick={() => executeCommand(cmd)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors ${
                isSelected
                  ? "bg-[#34D399]/15 text-[#F1F1ED]"
                  : "text-[#94A3B8] hover:bg-white/5 hover:text-[#E2E8F0]"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                  isSelected
                    ? "bg-[#34D399]/20 text-[#34D399]"
                    : "bg-white/5 text-[#71717A]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <strong className="block text-xs font-medium leading-tight">
                  {cmd.title}
                </strong>
                <span className="block text-[11px] text-[#71717A] truncate leading-tight mt-0.5">
                  {cmd.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
