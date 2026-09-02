"use client";

import { useState } from 'react';
import {
  Settings2, ImageIcon, Upload, X, Music2, Sparkles, PanelRightClose,
  AlertCircle, CheckCircle2,
} from 'lucide-react';
import { slugify, type StudioArticle } from '@/lib/blog-types';

export type SettingsTab = 'article' | 'experience' | 'seo';

type Props = {
  article: StudioArticle;
  onUpdate: (patch: Partial<StudioArticle>) => void;
  autoCoverUrl: string | null;
  onUploadCover: (file: File) => Promise<void>;
  uploading: boolean;
  onToggleCollapse: () => void;
};

export function StudioSettings({
  article,
  onUpdate,
  autoCoverUrl,
  onUploadCover,
  uploading,
  onToggleCollapse,
}: Props) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('article');

  const manualCover = article.cover_url || (article.cover_slides && article.cover_slides.length > 0 ? article.cover_slides[0] : null);
  const displayCover = manualCover || autoCoverUrl;

  const seoTitleLength = (article.seo_title || '').length;
  const seoDescLength = (article.seo_description || '').length;

  return (
    <div className="studio-settings-content flex flex-col h-full select-none">
      {/* Header with Collapse Button */}
      <div className="studio-settings-head flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-[#94A3B8]" />
          <div>
            <strong className="text-xs font-semibold text-[#F1F1ED] block">Pengaturan Naskah</strong>
            <span className="text-[10px] text-[#71717A]">Detail, experience, &amp; SEO</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          title="Tutup panel pengaturan"
          aria-label="Tutup panel pengaturan"
          className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717A] hover:text-[#E2E8F0] hover:bg-white/5 transition-colors"
        >
          <PanelRightClose className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Tabs */}
      <div className="studio-settings-tabs flex border-b border-white/5 bg-[#090A0D]/50 px-2 pt-1.5">
        {(['article', 'experience', 'seo'] as SettingsTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`flex-1 py-2 text-xs font-medium transition-all relative ${
              activeTab === tab
                ? 'text-[#F1F1ED] border-b-2 border-[#34D399]'
                : 'text-[#71717A] hover:text-[#A1A1AA]'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'article' ? 'Artikel' : tab === 'experience' ? 'Experience' : 'SEO'}
          </button>
        ))}
      </div>

      {/* Scrollable Tab Content */}
      <div className="studio-settings-scroll flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-[#27272A] scrollbar-track-transparent text-xs">
        {/* TAB 1: ARTIKEL */}
        {activeTab === 'article' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5">
                URL Slug
              </label>
              <div className="flex items-center rounded-lg bg-[#0A0B0E] border border-white/10 overflow-hidden px-2.5 py-1.5 focus-within:border-[#34D399]/50">
                <span className="text-[#52525B] font-mono text-xs">/blog/</span>
                <input
                  type="text"
                  value={article.slug}
                  onChange={(e) => onUpdate({ slug: slugify(e.target.value) })}
                  className="w-full bg-transparent border-0 outline-none text-[#E2E8F0] font-mono text-xs pl-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5">
                Kategori
              </label>
              <select
                value={article.category}
                onChange={(e) => onUpdate({ category: e.target.value })}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#E2E8F0] outline-none focus:border-[#34D399]/50"
              >
                <option>Ideas</option>
                <option>AI &amp; Technology</option>
                <option>Building in Public</option>
                <option>Creator Economy</option>
                <option>Personal Notes</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
                  Ringkasan / Excerpt
                </label>
                <span className="text-[10px] text-[#52525B] font-mono">
                  {article.excerpt.length}/220
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={220}
                value={article.excerpt}
                placeholder="Ringkasan tersinkronisasi otomatis dengan deck di canvas..."
                onChange={(e) => onUpdate({ excerpt: e.target.value })}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-lg p-2.5 text-xs text-[#E2E8F0] outline-none resize-none placeholder-[#3F3F46] focus:border-[#34D399]/50 leading-relaxed"
              />
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
                Status &amp; Statistik
              </span>
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Status Publikasi</span>
                <span className={`capitalize font-medium ${article.status === 'published' ? 'text-[#34D399]' : 'text-[#A1A1AA]'}`}>
                  {article.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Jumlah Kata</span>
                <span className="font-mono">{article.word_count || 0} kata</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Waktu Baca</span>
                <span className="font-mono">{article.reading_time || 1} menit</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5">
                Visual Cover
              </label>

              {/* Cover Preview Box */}
              <div
                className="relative aspect-video rounded-xl overflow-hidden bg-[#0A0B0E] border border-dashed border-white/15 flex flex-col items-center justify-center gap-1.5"
                style={displayCover ? { backgroundImage: `url(${displayCover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
              >
                {!displayCover && (
                  <>
                    <ImageIcon className="w-5 h-5 text-[#52525B]" />
                    <span className="text-[11px] text-[#52525B]">Belum ada cover</span>
                  </>
                )}
                <label className="absolute right-2 bottom-2 px-2.5 py-1.5 rounded-lg bg-black/70 hover:bg-black/90 border border-white/15 backdrop-blur-md text-[10px] text-[#F1F1ED] font-medium flex items-center gap-1.5 cursor-pointer transition-all shadow-md">
                  <Upload className="w-3 h-3" />
                  <span>{uploading ? 'Mengunggah...' : 'Upload cover'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && void onUploadCover(e.target.files[0])}
                  />
                </label>
              </div>

              {/* Auto Cover Indicator */}
              {autoCoverUrl && !manualCover && (
                <div className="mt-2.5 p-2.5 rounded-lg bg-[#34D399]/10 border border-[#34D399]/20 flex flex-col gap-1 text-xs">
                  <div className="flex items-center gap-1.5 text-[#34D399] font-medium">
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Cover otomatis memakai gambar pertama artikel</span>
                  </div>
                  <span className="text-[#9CA3AF] text-[11px] leading-relaxed">
                    Upload cover manual akan menggantikan cover otomatis.
                  </span>
                </div>
              )}

              {/* Multi-cover slide list */}
              {article.cover_slides && article.cover_slides.length > 0 && (
                <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1">
                  {article.cover_slides.map((url, index) => (
                    <div
                      key={url}
                      className="relative w-12 aspect-[16/10] rounded-md overflow-hidden border border-white/15 flex-shrink-0 bg-cover bg-center group"
                      style={{ backgroundImage: `url(${url})` }}
                    >
                      <span className="absolute bottom-0.5 left-1 text-[8px] font-mono text-white/80 bg-black/60 px-1 rounded">
                        {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = (article.cover_slides || []).filter((item) => item !== url);
                          onUpdate({
                            cover_slides: next,
                            cover_url: article.cover_url === url ? (next[0] || '') : article.cover_url,
                          });
                        }}
                        className="absolute inset-0 bg-black/60 items-center justify-center text-white hidden group-hover:flex"
                      >
                        <X className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Theme selection */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5">
                Tema Naskah
              </label>
              <select
                value={article.theme}
                onChange={(e) => onUpdate({ theme: e.target.value as StudioArticle['theme'] })}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#E2E8F0] outline-none focus:border-[#34D399]/50"
              >
                <option value="midnight">Midnight (Dark Editorial)</option>
                <option value="light">Editorial Light</option>
                <option value="adaptive">Adaptive</option>
              </select>
            </div>

            {/* Accent selection */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5">
                Warna Aksen
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['silver', 'violet', 'blue', 'lime'].map((accent) => (
                  <button
                    key={accent}
                    type="button"
                    onClick={() => onUpdate({ accent })}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs capitalize transition-all ${
                      article.accent === accent
                        ? 'bg-[#181920] border-[#34D399]/50 text-[#F1F1ED]'
                        : 'bg-[#0A0B0E] border-white/5 text-[#71717A] hover:text-[#A1A1AA]'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        accent === 'violet'
                          ? 'bg-[#A78BFA]'
                          : accent === 'blue'
                          ? 'bg-[#60A5FA]'
                          : accent === 'lime'
                          ? 'bg-[#34D399]'
                          : 'bg-[#E2E8F0]'
                      }`}
                    />
                    <span>{accent}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Spotify Atmosphere */}
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music2 className="w-4 h-4 text-[#34D399]" />
                  <span className="font-medium text-xs text-[#E2E8F0]">Reading Atmosphere</span>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdate({ music_enabled: !article.music_enabled })}
                  className={`w-9 h-5 rounded-full transition-colors relative ${
                    article.music_enabled ? 'bg-[#34D399]' : 'bg-[#27272A]'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      article.music_enabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {article.music_enabled && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="block text-[10px] text-[#71717A] uppercase font-mono">
                    Mood Playlist
                  </label>
                  <select
                    value={article.music_mood}
                    onChange={(e) => onUpdate({ music_mood: e.target.value })}
                    className="w-full bg-[#0A0B0E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#E2E8F0] outline-none"
                  >
                    <option>Future Ambient</option>
                    <option>Midnight Coding</option>
                    <option>Rainy Window</option>
                    <option>Soft Piano</option>
                    <option>Deep Focus</option>
                  </select>

                  <label className="block text-[10px] text-[#71717A] uppercase font-mono mt-2">
                    Spotify URI / Link
                  </label>
                  <input
                    type="text"
                    value={article.music_uri}
                    placeholder="spotify:playlist:... atau URL playlist"
                    onChange={(e) => onUpdate({ music_uri: e.target.value })}
                    className="w-full bg-[#0A0B0E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#E2E8F0] outline-none placeholder-[#3F3F46]"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SEO */}
        {activeTab === 'seo' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
                  SEO Title
                </label>
                <span className={`text-[10px] font-mono ${seoTitleLength > 60 ? 'text-[#FBBF24]' : 'text-[#71717A]'}`}>
                  {seoTitleLength}/60
                </span>
              </div>
              <input
                type="text"
                maxLength={60}
                value={article.seo_title}
                placeholder={article.title || 'Judul di Google...'}
                onChange={(e) => onUpdate({ seo_title: e.target.value })}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#E2E8F0] outline-none focus:border-[#34D399]/50"
              />
              {seoTitleLength > 55 && (
                <span className="text-[10px] text-[#FBBF24] flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> Mendekati batas optimal tampilan Google (60 karakter).
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
                  Meta Description
                </label>
                <span className={`text-[10px] font-mono ${seoDescLength > 160 ? 'text-[#FBBF24]' : 'text-[#71717A]'}`}>
                  {seoDescLength}/160
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={160}
                value={article.seo_description}
                placeholder={article.excerpt || 'Deskripsi yang tampil pada snippet pencarian Google...'}
                onChange={(e) => onUpdate({ seo_description: e.target.value })}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-lg p-2.5 text-xs text-[#E2E8F0] outline-none resize-none placeholder-[#3F3F46] focus:border-[#34D399]/50 leading-relaxed"
              />
            </div>

            {/* Google SERP Snippet Preview */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5">
                Pratinjau Hasil Pencarian (SERP)
              </label>
              <div className="p-3 rounded-lg bg-[#0A0B0E] border border-white/5 space-y-1 text-left">
                <span className="block text-[10px] font-mono text-[#34D399] truncate">
                  khadafidaffa.com › blog › {article.slug || 'slug'}
                </span>
                <strong className="block text-xs text-[#60A5FA] font-sans font-medium line-clamp-1 hover:underline cursor-pointer">
                  {article.seo_title || article.title || 'Untitled story'}
                </strong>
                <p className="text-[11px] text-[#94A3B8] line-clamp-2 leading-relaxed font-sans">
                  {article.seo_description || article.excerpt || 'Deskripsi naskah akan tampil di sini pada hasil pencarian Google.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
