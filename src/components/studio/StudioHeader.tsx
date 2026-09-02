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
    <header className="studio-topbar flex items-center justify-between px-4 bg-[#0C0D11]/95 backdrop-blur-md border-b border-white/10 select-none h-16 z-30 shadow-sm">
      {/* Left controls: Sidebar toggle & Title/Status */}
      <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
        {!focusMode && (
          <button
            type="button"
            onClick={onToggleLeft}
            title={leftCollapsed ? 'Buka daftar naskah (Ctrl + \\)' : 'Tutup daftar naskah (Ctrl + \\)'}
            aria-label="Toggle daftar naskah"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
              leftCollapsed
                ? 'text-[#94A3B8] bg-[#14151B] border-white/10 hover:text-[#F8FAFC] hover:bg-white/10 hover:border-white/20'
                : 'text-[#34D399] bg-[#34D399]/15 border-[#34D399]/30 shadow-sm'
            }`}
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-3 min-w-0">
          <span className="font-serif text-sm font-semibold text-[#F8FAFC] truncate max-w-[220px] sm:max-w-[320px]">
            {article.title || 'Untitled story'}
          </span>

          <span className="w-1.5 h-1.5 rounded-full bg-[#3F3F46] flex-shrink-0" />

          {/* Autosave state indicator */}
          <div className="flex items-center gap-2 text-xs font-mono flex-shrink-0">
            {saveState === 'saving' && (
              <>
                <LoaderCircle className="w-3.5 h-3.5 text-[#A78BFA] animate-spin" />
                <span className="text-[#A78BFA] font-medium">Menyimpan…</span>
              </>
            )}
            {saveState === 'saved' && (
              <>
                <div className="w-2 h-2 rounded-full bg-[#34D399] shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span className="text-[#34D399] font-medium">Tersimpan</span>
              </>
            )}
            {saveState === 'editing' && (
              <>
                <div className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
                <span className="text-[#FBBF24] font-medium">Menulis…</span>
              </>
            )}
            {saveState === 'error' && (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" />
                <span className="text-[#EF4444] font-medium">Gagal menyimpan</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Center minimal editing tools (Undo, Redo, Add Block) */}
      <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#121319] rounded-xl border border-white/10">
        <button
          type="button"
          onClick={onInsertBlockClick}
          title="Tambah blok editorial (/)"
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-[#E2E8F0] hover:text-white hover:bg-white/10 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-[#34D399]" />
          <span>Tambah blok</span>
        </button>

        <span className="w-px h-4 bg-white/10 mx-0.5" />

        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          aria-label="Redo"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      {/* Right actions: Focus Mode, Preview, Settings Toggle, Publish/Update */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Focus / Zen Mode Button */}
        <button
          type="button"
          onClick={onToggleFocus}
          title={focusMode ? 'Keluar Mode Fokus (Ctrl + \\)' : 'Mode Fokus / Zen Mode (Ctrl + \\)'}
          aria-label="Mode Fokus"
          className={`flex items-center gap-2 h-10 px-3.5 rounded-xl text-xs font-semibold transition-all border ${
            focusMode
              ? 'bg-[#34D399]/15 text-[#34D399] border-[#34D399]/40 shadow-sm'
              : 'bg-[#14151B] text-[#94A3B8] hover:text-[#F8FAFC] border-white/10 hover:border-white/20 hover:bg-white/5'
          }`}
        >
          {focusMode ? (
            <>
              <Minimize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar Fokus</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Fokus</span>
            </>
          )}
        </button>

        {/* Preview Button */}
        <button
          type="button"
          onClick={onOpenPreview}
          title="Pratinjau naskah publik"
          className="flex items-center gap-2 h-10 px-3.5 rounded-xl text-xs font-semibold text-[#CBD5E1] hover:text-[#F8FAFC] bg-[#14151B] hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all shadow-sm"
        >
          <Eye className="w-4 h-4 text-[#60A5FA]" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        {/* Settings Sidebar Toggle (hidden in Focus Mode) */}
        {!focusMode && (
          <button
            type="button"
            onClick={onToggleRight}
            title={rightCollapsed ? 'Buka panel pengaturan (Ctrl + \\)' : 'Tutup panel pengaturan (Ctrl + \\)'}
            aria-label="Toggle panel pengaturan"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
              rightCollapsed
                ? 'text-[#94A3B8] bg-[#14151B] border-white/10 hover:text-[#F8FAFC] hover:bg-white/10 hover:border-white/20'
                : 'text-[#34D399] bg-[#34D399]/15 border-[#34D399]/30 shadow-sm'
            }`}
          >
            <PanelRight className="w-4 h-4" />
          </button>
        )}

        {/* Publish / Update Button (Hero Primary Action) */}
        {isPublished ? (
          canUpdate ? (
            <button
              type="button"
              onClick={onOpenPublishModal}
              className="flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-[#052E16] text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-emerald-950/50 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Perbarui</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenPublishModal}
              className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#181922] hover:bg-[#22242F] text-[#E2E8F0] border border-white/15 text-xs font-semibold transition-all shadow-sm"
            >
              <Check className="w-4 h-4 text-[#34D399]" />
              <span>Terbaru</span>
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={onOpenPublishModal}
            className="flex items-center gap-2 h-10 px-5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-[#052E16] text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-emerald-950/50 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Publish</span>
          </button>
        )}
      </div>
    </header>
  );
}
