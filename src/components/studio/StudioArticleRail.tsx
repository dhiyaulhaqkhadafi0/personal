"use client";

import { useState } from 'react';
import {
  Plus, Search, LogOut, PanelLeftClose, Trash2, AlertTriangle, AlertCircle,
  LoaderCircle, Undo2, X,
} from 'lucide-react';
import type { StudioArticle } from '@/lib/blog-types';

function formatRelativeTime(value: string) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 1) return 'baru saja';
  if (minutes < 60) return `${minutes}m lalu`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}j lalu`;
  return `${Math.floor(minutes / 1440)}h lalu`;
}

type Props = {
  articles: StudioArticle[];
  currentArticle: StudioArticle;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectArticle: (article: StudioArticle) => void;
  onCreateArticle: () => void;
  onSignOut: () => void;
  onToggleCollapse: () => void;
  onDeleteArticle?: (article: StudioArticle) => Promise<void>;
  onOpenPublishModal?: (target?: StudioArticle) => void;
};

export function StudioArticleRail({
  articles,
  currentArticle,
  searchQuery,
  onSearchChange,
  onSelectArticle,
  onCreateArticle,
  onSignOut,
  onToggleCollapse,
  onDeleteArticle,
  onOpenPublishModal,
}: Props) {
  const [articleToDelete, setArticleToDelete] = useState<StudioArticle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const filtered = articles.filter((item) =>
    (item.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmDelete = async () => {
    if (!articleToDelete || !onDeleteArticle) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await onDeleteArticle(articleToDelete);
      setArticleToDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Gagal menghapus artikel.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="studio-rail-content flex flex-col h-full select-none relative">
      {/* Brand & Collapse Header */}
      <div className="studio-brand flex items-center justify-between p-4 border-b border-white/5 bg-[#0C0D11]">
        <div className="flex items-center gap-3">
          <div className="studio-brand-mark w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D3039] to-[#14151B] border border-white/10 flex items-center justify-center font-serif text-base font-semibold text-[#F8FAFC] shadow-inner">
            K
          </div>
          <div className="flex flex-col">
            <strong className="font-serif text-sm text-[#F8FAFC] tracking-tight leading-tight">Khadafi</strong>
            <span className="text-[11px] text-[#94A3B8] tracking-widest uppercase font-mono mt-0.5">Blog Studio</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          title="Tutup panel samping naskah (Ctrl + \)"
          aria-label="Tutup sidebar artikel"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* New Article Action */}
      <div className="p-3">
        <button
          type="button"
          onClick={onCreateArticle}
          className="studio-new-btn w-full flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#1D1E24] hover:bg-[#272932] border border-white/10 hover:border-white/20 text-[#F8FAFC] text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 text-[#34D399]" />
          <span>Artikel Baru</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="px-3 pb-2">
        <div className="studio-search-bar flex items-center gap-2.5 px-3 h-9 rounded-xl bg-[#090A0D] border border-white/10 focus-within:border-[#34D399]/50 transition-colors text-xs text-[#71717A]">
          <Search className="w-4 h-4 flex-shrink-0 text-[#71717A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari naskah..."
            className="w-full bg-transparent border-0 outline-none text-[#F1F1ED] placeholder-[#71717A] text-xs"
          />
        </div>
      </div>

      {/* Heading & Count */}
      <div className="flex items-center justify-between px-4 py-2.5 text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
        <span className="font-semibold">Daftar Naskah</span>
        <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[10px] text-[#A1A1AA] font-mono">
          {articles.length}
        </span>
      </div>

      {/* Article Rows */}
      <div className="studio-article-list flex-1 overflow-y-auto px-2 space-y-1 scrollbar-thin scrollbar-thumb-[#27272A] scrollbar-track-transparent">
        {filtered.map((item) => {
          const isSelected = item.id === currentArticle.id;
          const isItemPublished = item.status === 'published';

          return (
            <div
              key={item.id}
              className="group/item relative flex items-center w-full"
            >
              <button
                type="button"
                onClick={() => onSelectArticle(item)}
                className={`studio-article-row w-full text-left p-3 pr-10 rounded-xl transition-all flex items-start gap-3 border ${
                  isSelected
                    ? 'bg-[#181920] border-[#34D399]/40 text-[#F8FAFC] shadow-sm'
                    : 'bg-transparent border-transparent text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#E2E8F0]'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                    isItemPublished
                      ? 'bg-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                      : 'bg-[#71717A]'
                  }`}
                  title={isItemPublished ? 'Published' : 'Draft'}
                />
                <div className="flex-1 min-w-0">
                  <strong className="block text-xs font-semibold truncate leading-snug">
                    {item.title || 'Untitled story'}
                  </strong>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#71717A] mt-1">
                    <span className={`capitalize font-medium ${isItemPublished ? 'text-[#34D399]' : 'text-[#A1A1AA]'}`}>
                      {item.status}
                    </span>
                    <span>·</span>
                    <span>{formatRelativeTime(item.updated_at)}</span>
                  </div>
                </div>
              </button>

              {/* Delete Trigger Button */}
              {onDeleteArticle && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteError('');
                    setArticleToDelete(item);
                  }}
                  title={isItemPublished ? 'Artikel publik harus di-unpublish dulu' : 'Hapus naskah draft'}
                  aria-label={`Hapus ${item.title || 'artikel'}`}
                  className={`absolute right-2 p-2 rounded-lg text-[#71717A] hover:text-[#EF4444] hover:bg-[#EF4444]/15 transition-all ${
                    isSelected ? 'opacity-80 hover:opacity-100' : 'opacity-40 group-hover/item:opacity-100 hover:!opacity-100'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-xs text-[#71717A] italic">
            Tidak ada artikel yang cocok dengan pencarian
          </div>
        )}
      </div>

      {/* Workspace Owner Profile */}
      <div className="studio-owner p-3.5 border-t border-white/5 bg-[#0C0D11] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#27272A] border border-white/10 flex items-center justify-center text-[11px] font-bold text-[#F1F1ED] flex-shrink-0">
            DK
          </div>
          <div className="flex flex-col min-w-0">
            <strong className="text-xs text-[#F1F1ED] truncate font-semibold">Daffa Khadafi</strong>
            <small className="text-[10px] text-[#94A3B8] truncate">Owner Workspace</small>
          </div>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          title="Keluar dari Studio"
          aria-label="Keluar dari Studio"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#71717A] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Safe Delete Confirmation Dialog */}
      {articleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-[#111216] border border-white/10 p-5 shadow-2xl space-y-4">
            {articleToDelete.status === 'published' ? (
              /* Published Warning */
              <>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/20 flex items-center justify-center text-[#FBBF24] flex-shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#F8FAFC]">Artikel Sedang Terbit (Published)</h3>
                    <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                      Naskah <strong>&ldquo;{articleToDelete.title || 'Untitled story'}&rdquo;</strong> saat ini berstatus publik di website.
                    </p>
                    <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                      Untuk menjaga keamanan dan tidak meninggalkan snapshot publik yang terisolasi, artikel harus di-<strong>Unpublish</strong> terlebih dahulu sebelum dapat dihapus dari Studio.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setArticleToDelete(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors"
                  >
                    Tutup
                  </button>
                  {onOpenPublishModal && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = articleToDelete;
                        setArticleToDelete(null);
                        if (target.id !== currentArticle.id) {
                          onSelectArticle(target);
                        }
                        onOpenPublishModal(target);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FBBF24]/15 hover:bg-[#FBBF24]/25 text-[#FBBF24] border border-[#FBBF24]/30 flex items-center gap-1.5 transition-colors"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Buka Menu Unpublish</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* Draft Confirmation */
              <>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center text-[#EF4444] flex-shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-[#F8FAFC]">Hapus Naskah Draft?</h3>
                    <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                      Naskah draft <strong>&ldquo;{articleToDelete.title || 'Untitled story'}&rdquo;</strong> akan dihapus secara permanen dari Studio.
                    </p>
                    <p className="text-xs text-[#EF4444]/90 mt-1 font-medium">
                      Tindakan ini tidak dapat dibatalkan.
                    </p>
                    {deleteError && (
                      <div className="mt-2.5 p-2.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 text-[11px] text-[#EF4444] flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{deleteError}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setArticleToDelete(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => void handleConfirmDelete()}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#EF4444] hover:bg-[#DC2626] text-white flex items-center gap-1.5 transition-colors shadow-lg shadow-red-950/40"
                  >
                    {isDeleting ? (
                      <>
                        <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                        <span>Menghapus...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Naskah</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
