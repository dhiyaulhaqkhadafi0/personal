"use client";

import {
  PanelLeft, PanelRight, Maximize2, Minimize2, Eye, Save, Send, Check,
  LoaderCircle, AlertCircle, Undo2, Redo2, Plus,
} from 'lucide-react';
import type { StudioArticle } from '@/lib/blog-types';

type Props = {
  article: StudioArticle;
  saveState: 'saved' | 'editing' | 'saving' | 'error';
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  focusMode: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  onToggleFocus: () => void;
  onOpenPreview: () => void;
  onOpenPublishModal: () => void;
  canUpdate: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onInsertBlockClick: () => void;
};

export function StudioHeader({
  article,
  saveState,
  leftCollapsed,
  rightCollapsed,
  focusMode,
  onToggleLeft,
  onToggleRight,
  onToggleFocus,
  onOpenPreview,
  onOpenPublishModal,
  canUpdate,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onInsertBlockClick,
}: Props) {
  const isPublished = article.status === 'published';

  return (
    <header className="studio-topbar flex items-center justify-between px-3.5 py-2.5 bg-[#0C0D11]/90 backdrop-blur-md border-b border-white/5 select-none h-14 z-30">
      {/* Left controls: Sidebar toggle & Title/Status */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
        {!focusMode && (
          <button
            type="button"
            onClick={onToggleLeft}
            title={leftCollapsed ? 'Buka daftar artikel' : 'Tutup daftar artikel'}
            aria-label="Toggle sidebar artikel"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              leftCollapsed ? 'text-[#71717A] hover:text-[#E2E8F0] hover:bg-white/5' : 'text-[#34D399] bg-[#34D399]/10'
            }`}
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-serif text-xs text-[#E2E8F0] truncate max-w-[200px] sm:max-w-[280px]">
            {article.title || 'Untitled story'}
          </span>

          <span className="w-1 h-1 rounded-full bg-[#3F3F46] flex-shrink-0" />

          {/* Autosave state indicator */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#71717A] flex-shrink-0">
            {saveState === 'saving' && (
              <>
                <LoaderCircle className="w-3 h-3 text-[#A78BFA] animate-spin" />
                <span className="text-[#A78BFA]">Menyimpan…</span>
              </>
            )}
            {saveState === 'saved' && (
              <>
                <Check className="w-3 h-3 text-[#34D399]" />
                <span className="text-[#34D399]">Tersimpan</span>
              </>
            )}
            {saveState === 'editing' && (
              <>
                <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
                <span className="text-[#FBBF24]">Menulis…</span>
              </>
            )}
            {saveState === 'error' && (
              <>
                <AlertCircle className="w-3 h-3 text-[#EF4444]" />
                <span className="text-[#EF4444]">Gagal menyimpan — coba lagi</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Center minimal editing tools (Undo, Redo, Add Block) */}
      <div className="hidden md:flex items-center gap-1 px-2 border-x border-white/5">
        <button
          type="button"
          onClick={onInsertBlockClick}
          title="Tambah blok editorial (/)"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-white/5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-[#34D399]" />
          <span>Tambah blok</span>
        </button>

        <span className="w-px h-3.5 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
          className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717A] hover:text-[#E2E8F0] hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          aria-label="Redo"
          className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717A] hover:text-[#E2E8F0] hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right actions: Focus Mode, Preview, Settings Toggle, Publish/Update */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Focus / Zen Mode Button */}
        <button
          type="button"
          onClick={onToggleFocus}
          title={focusMode ? 'Keluar Mode Fokus (Ctrl + \\)' : 'Mode Fokus / Zen Mode (Ctrl + \\)'}
          aria-label="Mode Fokus"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            focusMode
              ? 'bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30'
              : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-white/5'
          }`}
        >
          {focusMode ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar Fokus</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fokus</span>
            </>
          )}
        </button>

        {/* Preview Button */}
        <button
          type="button"
          onClick={onOpenPreview}
          title="Pratinjau naskah publik"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-white/5 border border-white/5 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        {/* Settings Sidebar Toggle (hidden in Focus Mode) */}
        {!focusMode && (
          <button
            type="button"
            onClick={onToggleRight}
            title={rightCollapsed ? 'Buka panel pengaturan' : 'Tutup panel pengaturan'}
            aria-label="Toggle panel pengaturan"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              rightCollapsed ? 'text-[#71717A] hover:text-[#E2E8F0] hover:bg-white/5' : 'text-[#34D399] bg-[#34D399]/10'
            }`}
          >
            <PanelRight className="w-4 h-4" />
          </button>
        )}

        {/* Publish / Update Button */}
        {isPublished ? (
          canUpdate ? (
            <button
              type="button"
              onClick={onOpenPublishModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#34D399] hover:bg-[#2EB882] text-[#090A0D] text-xs font-semibold tracking-wide transition-all shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Perbarui</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenPublishModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-[#E2E8F0] text-xs font-medium transition-colors"
            >
              <Check className="w-3.5 h-3.5 text-[#34D399]" />
              <span>Terbaru</span>
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={onOpenPublishModal}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#34D399] hover:bg-[#2EB882] text-[#090A0D] text-xs font-semibold tracking-wide transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>
        )}
      </div>
    </header>
  );
}
