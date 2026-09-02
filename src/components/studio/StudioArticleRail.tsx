"use client";

import { Plus, Search, LogOut, PanelLeftClose } from 'lucide-react';
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
}: Props) {
  const filtered = articles.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="studio-rail-content flex flex-col h-full select-none">
      {/* Brand & Collapse Header */}
      <div className="studio-brand flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="studio-brand-mark w-8 h-8 rounded-lg bg-gradient-to-br from-[#2D3039] to-[#14151B] border border-white/10 flex items-center justify-center font-serif text-sm font-semibold text-[#F1F1ED]">
            K
          </div>
          <div className="flex flex-col">
            <strong className="font-serif text-sm text-[#F1F1ED] tracking-tight">Khadafi</strong>
            <span className="text-[11px] text-[#71717A] tracking-wider uppercase font-mono">Blog Studio</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          title="Tutup sidebar (Ctrl + \)"
          aria-label="Tutup sidebar artikel"
          className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717A] hover:text-[#E2E8F0] hover:bg-white/5 transition-colors"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* New Article Action */}
      <div className="p-3">
        <button
          type="button"
          onClick={onCreateArticle}
          className="studio-new-btn w-full flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg bg-[#1D1E24] hover:bg-[#262830] border border-white/10 text-[#F1F1ED] text-xs font-semibold tracking-wide transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 text-[#34D399]" />
          <span>Artikel Baru</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="px-3 pb-2">
        <div className="studio-search-bar flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#090A0D] border border-white/5 text-xs text-[#71717A]">
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari naskah..."
            className="w-full bg-transparent border-0 outline-none text-[#E2E8F0] placeholder-[#52525B] text-xs"
          />
        </div>
      </div>

      {/* Heading & Count */}
      <div className="flex items-center justify-between px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
        <span>Daftar Naskah</span>
        <span className="bg-white/5 px-1.5 py-0.5 rounded text-[10px]">{articles.length}</span>
      </div>

      {/* Article Rows */}
      <div className="studio-article-list flex-1 overflow-y-auto px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-[#27272A] scrollbar-track-transparent">
        {filtered.map((item) => {
          const isSelected = item.id === currentArticle.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectArticle(item)}
              className={`studio-article-row w-full text-left p-2.5 rounded-lg transition-all flex items-start gap-2.5 border ${
                isSelected
                  ? 'bg-[#181920] border-[#34D399]/30 text-[#F1F1ED]'
                  : 'bg-transparent border-transparent text-[#94A3B8] hover:bg-white/[0.03] hover:text-[#E2E8F0]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  item.status === 'published'
                    ? 'bg-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                    : 'bg-[#71717A]'
                }`}
                title={item.status === 'published' ? 'Published' : 'Draft'}
              />
              <div className="flex-1 min-w-0">
                <strong className="block text-xs font-medium truncate leading-snug">
                  {item.title || 'Untitled story'}
                </strong>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#71717A] mt-1">
                  <span className="capitalize">{item.status}</span>
                  <span>·</span>
                  <span>{formatRelativeTime(item.updated_at)}</span>
                </div>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-6 text-center text-xs text-[#52525B]">
            Tidak ada artikel ditemukan
          </div>
        )}
      </div>

      {/* Workspace Owner Profile */}
      <div className="studio-owner p-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#27272A] border border-white/10 flex items-center justify-center text-[10px] font-bold text-[#E2E8F0] flex-shrink-0">
            DK
          </div>
          <div className="flex flex-col min-w-0">
            <strong className="text-xs text-[#E2E8F0] truncate font-medium">Daffa Khadafi</strong>
            <small className="text-[10px] text-[#71717A] truncate">Owner Workspace</small>
          </div>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          title="Keluar dari Studio"
          aria-label="Keluar dari Studio"
          className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717A] hover:text-[#EF4444] hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
