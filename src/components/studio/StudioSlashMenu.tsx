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

  // Keyboard navigation & auto-scroll
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: position.top, left: position.left, maxHeight: 340 });

  useEffect(() => {
    if (!isOpen) return;

    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const menuWidth = 300;
    const desiredHeight = 360;

    let top = position.top;
    let left = Math.max(16, Math.min(position.left, vw - menuWidth - 20));

    const spaceBelow = vh - position.top - 20;
    const spaceAbove = position.top - 75;

    let maxHeight = desiredHeight;

    if (spaceBelow < 240 && spaceAbove > spaceBelow) {
      // Open above the caret
      maxHeight = Math.min(desiredHeight, Math.max(180, spaceAbove - 10));
      top = Math.max(75, position.top - maxHeight - 12);
    } else {
      // Open below the caret, clamp to available viewport height
      maxHeight = Math.min(desiredHeight, Math.max(180, spaceBelow));
      top = Math.min(position.top, Math.max(75, vh - maxHeight - 20));
    }

    setCoords({ top, left, maxHeight });
  }, [isOpen, position]);

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

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [isOpen, selectedIndex]);

  if (!isOpen || filteredCommands.length === 0) return null;

  return (
    <div
      ref={menuRef}
      style={{ top: `${coords.top}px`, left: `${coords.left}px`, maxHeight: `${coords.maxHeight}px` }}
      className="fixed z-50 w-[300px] flex flex-col rounded-xl bg-[#14151B]/98 border border-white/15 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden select-none"
    >
      {/* Sticky Header */}
      <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] border-b border-white/10 flex items-center justify-between bg-[#181920] flex-shrink-0">
        <span className="font-semibold text-[#E2E8F0]">Blok Editorial</span>
        <span className="text-[#34D399] font-medium bg-[#34D399]/10 px-1.5 py-0.5 rounded text-[10px]">
          {filteredCommands.length} opsi
        </span>
      </div>

      {/* Scrollable Command List */}
      <div
        ref={listRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-1.5 pb-2 space-y-0.5 scrollbar-thin scrollbar-thumb-[#3F3F46] scrollbar-track-transparent"
      >
        {filteredCommands.map((cmd, index) => {
          const Icon = cmd.icon;
          const isSelected = index === selectedIndex;
          return (
            <button
              key={cmd.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              type="button"
              onClick={() => executeCommand(cmd)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors ${
                isSelected
                  ? "bg-[#34D399]/15 text-[#F8FAFC]"
                  : "text-[#94A3B8] hover:bg-white/5 hover:text-[#E2E8F0]"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected
                    ? "bg-[#34D399]/25 text-[#34D399]"
                    : "bg-white/5 text-[#71717A]"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <strong className="block text-xs font-semibold leading-tight">
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
