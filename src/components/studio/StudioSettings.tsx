"use client";

import { useState, useId } from 'react';
import {
  Settings2, ImageIcon, Upload, X, Music2, Sparkles, PanelRightClose,
  AlertCircle, CheckCircle2, Copy, Check, Edit3, RotateCcw, ExternalLink,
  LoaderCircle,
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

function isValidSpotifyUrl(url: string): boolean {
  if (!url || !url.trim()) return false;
  return /^(https?:\/\/open\.spotify\.com\/(playlist|album|track|artist)\/|spotify:(playlist|album|track):)[a-zA-Z0-9]+/.test(
    url.trim()
  );
}

export function StudioSettings({
  article,
  onUpdate,
  autoCoverUrl,
  onUploadCover,
  uploading,
  onToggleCollapse,
}: Props) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('article');
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [isCustomSlug, setIsCustomSlug] = useState(() => {
    // If slug is explicitly different from slugify(title), initialize as custom
    return Boolean(article.slug && article.title && article.slug !== slugify(article.title));
  });
  const [previewLoading, setPreviewLoading] = useState(false);
  const coverInputId = useId();

  const manualCover = article.cover_url || (article.cover_slides && article.cover_slides.length > 0 ? article.cover_slides[0] : null);
  const displayCover = manualCover || autoCoverUrl;

  const seoTitleLength = (article.seo_title || '').length;
  const seoDescLength = (article.seo_description || '').length;

  const handleCopyUrl = async () => {
    const fullUrl = `https://khadafidaffa.com/blog/${article.slug || ''}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedSlug(true);
      setTimeout(() => setCopiedSlug(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleUploadFile = async (file: File) => {
    setPreviewLoading(true);
    try {
      await onUploadCover(file);
    } finally {
      // previewLoading will turn false on <img> onLoad
    }
  };

  const hasSpotifyUrl = Boolean(article.music_uri?.trim());
  const isSpotifyValid = isValidSpotifyUrl(article.music_uri || '');

  return (
    <div className="studio-settings-content flex flex-col h-full select-none bg-[#0C0D11]">
      {/* Header with Collapse Button */}
      <div className="studio-settings-head flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#181920] border border-white/10 flex items-center justify-center text-[#34D399]">
            <Settings2 className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-sm font-bold text-[#F8FAFC] block leading-snug">Pengaturan Naskah</strong>
            <span className="text-[11px] text-[#94A3B8]">Detail, experience, &amp; SEO</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          title="Tutup panel pengaturan (Ctrl + \)"
          aria-label="Tutup panel pengaturan"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
        >
          <PanelRightClose className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Tabs (Segmented Control) */}
      <div className="px-3 pt-3 pb-2 border-b border-white/5 bg-[#090A0D]/60">
        <div className="flex items-center bg-[#14151B] p-1 rounded-xl border border-white/10 gap-1">
          {(['article', 'experience', 'seo'] as SettingsTab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                className={`flex-1 h-9 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#22242F] text-[#F8FAFC] shadow-sm border border-white/10'
                    : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-white/5'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'article' ? 'Artikel' : tab === 'experience' ? 'Experience' : 'SEO'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Tab Content */}
      <div className="studio-settings-scroll flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-[#27272A] scrollbar-track-transparent text-xs">
        {/* TAB 1: ARTIKEL */}
        {activeTab === 'article' && (
          <div className="space-y-5">
            {/* Smart URL Slug */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
                  URL Naskah
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (isCustomSlug) {
                      // Reset to auto slug
                      setIsCustomSlug(false);
                      onUpdate({ slug: slugify(article.title || 'untitled-story') });
                    } else {
                      setIsCustomSlug(true);
                    }
                  }}
                  className="flex items-center gap-1 text-[11px] font-medium text-[#34D399] hover:text-[#6EE7B7] transition-colors"
                >
                  {isCustomSlug ? (
                    <>
                      <RotateCcw className="w-3 h-3" />
                      <span>Gunakan slug otomatis</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-3 h-3" />
                      <span>Sesuaikan URL</span>
                    </>
                  )}
                </button>
              </div>

              {/* URL Preview Box */}
              <div className="p-3 rounded-xl bg-[#090A0D] border border-white/10 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-[#34D399] truncate">
                    khadafidaffa.com/blog/{article.slug || 'untitled-story'}
                  </span>
                  <button
                    type="button"
                    onClick={() => void handleCopyUrl()}
                    title="Salin tautan artikel"
                    className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10 transition-colors flex-shrink-0"
                  >
                    {copiedSlug ? (
                      <Check className="w-3.5 h-3.5 text-[#34D399]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {!isCustomSlug ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#71717A]">
                    <Sparkles className="w-3 h-3 text-[#34D399]" />
                    <span>Slug otomatis mengikuti judul naskah</span>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <span className="text-[10px] text-[#94A3B8] block">Custom URL slug:</span>
                    <div className="flex items-center rounded-lg bg-[#14151B] border border-white/10 px-2.5 h-9 focus-within:border-[#34D399]/50">
                      <span className="text-[#52525B] font-mono text-xs">/blog/</span>
                      <input
                        type="text"
                        value={article.slug}
                        onChange={(e) => onUpdate({ slug: slugify(e.target.value) })}
                        placeholder="custom-slug"
                        className="w-full bg-transparent border-0 outline-none text-[#F8FAFC] font-mono text-xs pl-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1] mb-1.5">
                Kategori
              </label>
              <select
                value={article.category}
                onChange={(e) => onUpdate({ category: e.target.value })}
                className="w-full h-10 bg-[#0A0B0E] border border-white/10 rounded-xl px-3 text-xs text-[#F8FAFC] font-medium outline-none focus:border-[#34D399]/50 transition-colors"
              >
                <option>Ideas</option>
                <option>AI &amp; Technology</option>
                <option>Building in Public</option>
                <option>Creator Economy</option>
                <option>Personal Notes</option>
              </select>
            </div>

            {/* Excerpt / Deck Sync */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
                  Ringkasan / Excerpt
                </label>
                <span className={`text-[10px] font-mono ${article.excerpt.length > 200 ? 'text-[#FBBF24]' : 'text-[#71717A]'}`}>
                  {article.excerpt.length}/220
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={220}
                value={article.excerpt}
                placeholder="Ringkasan tersinkronisasi otomatis dengan deck di canvas..."
                onChange={(e) => onUpdate({ excerpt: e.target.value })}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl p-3 text-xs text-[#F8FAFC] outline-none resize-none placeholder-[#52525B] focus:border-[#34D399]/50 leading-relaxed transition-colors"
              />
            </div>

            {/* Metadata Ringkas */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5">
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                Status &amp; Statistik
              </span>
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Status Publikasi</span>
                <span className={`capitalize font-semibold ${article.status === 'published' ? 'text-[#34D399]' : 'text-[#A1A1AA]'}`}>
                  {article.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Jumlah Kata</span>
                <span className="font-mono text-[#F8FAFC]">{article.word_count || 0} kata</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Waktu Baca</span>
                <span className="font-mono text-[#F8FAFC]">{article.reading_time || 1} menit</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="space-y-5">
            {/* Visual Cover */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
                  Visual Cover
                </label>
                {manualCover && (
                  <button
                    type="button"
                    onClick={() => onUpdate({ cover_url: '', cover_slides: [] })}
                    className="text-[11px] text-[#EF4444] hover:underline"
                  >
                    Hapus cover manual
                  </button>
                )}
              </div>

              {/* Cover Preview Box with Real Load Detection */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0A0B0E] border border-white/10 flex items-center justify-center group shadow-inner">
                {displayCover ? (
                  <>
                    <img
                      src={displayCover}
                      alt={article.title || 'Cover'}
                      onLoad={() => setPreviewLoading(false)}
                      onError={() => setPreviewLoading(false)}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        previewLoading ? 'opacity-30 blur-sm' : 'opacity-100'
                      }`}
                    />
                    {previewLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 gap-2 text-xs text-white">
                        <LoaderCircle className="w-4 h-4 animate-spin text-[#34D399]" />
                        <span>Memuat pratinjau…</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#71717A]">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-[#71717A]">Belum ada cover artikel</span>
                  </div>
                )}

                {/* Upload Button */}
                <label
                  htmlFor={coverInputId}
                  className={`absolute right-3 bottom-3 px-3.5 py-2 rounded-xl bg-black/80 hover:bg-black/95 border border-white/20 backdrop-blur-md text-xs text-[#F8FAFC] font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-lg active:scale-95 ${
                    uploading ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  {uploading ? (
                    <>
                      <LoaderCircle className="w-3.5 h-3.5 animate-spin text-[#34D399]" />
                      <span>Mengunggah gambar…</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>{displayCover ? 'Ganti Cover' : 'Upload Cover'}</span>
                    </>
                  )}
                  <input
                    id={coverInputId}
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && void handleUploadFile(e.target.files[0])}
                  />
                </label>
              </div>

              {/* Auto Cover Indicator */}
              {autoCoverUrl && !manualCover && (
                <div className="mt-2.5 p-3 rounded-xl bg-[#34D399]/10 border border-[#34D399]/20 flex flex-col gap-1 text-xs">
                  <div className="flex items-center gap-1.5 text-[#34D399] font-semibold">
                    <Sparkles className="w-4 h-4 flex-shrink-0" />
                    <span>Thumbnail Otomatis Aktif</span>
                  </div>
                  <span className="text-[#94A3B8] text-[11px] leading-relaxed">
                    Menggunakan gambar pertama dari naskah artikel sebagai cover. Mengunggah cover manual akan menggantikan thumbnail ini.
                  </span>
                </div>
              )}
            </div>

            {/* Reading Atmosphere (Spotify) */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1DB954]/15 border border-[#1DB954]/25 flex items-center justify-center text-[#1DB954]">
                    <Music2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#F8FAFC] block">Reading Atmosphere (Spotify)</span>
                    <span className="text-[11px] text-[#94A3B8]">Musik pengiring opsional untuk pembaca</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdate({ music_enabled: !article.music_enabled })}
                  aria-label="Toggle Reading Atmosphere"
                  className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                    article.music_enabled ? 'bg-[#1DB954]' : 'bg-[#27272A]'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      article.music_enabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {article.music_enabled && (
                <div className="space-y-3 pt-3 border-t border-white/5 animate-in fade-in duration-150">
                  <div className="p-3 rounded-lg bg-[#14151B] border border-white/5 text-[11px] text-[#94A3B8] leading-relaxed">
                    💡 <strong>Opsional:</strong> Tempelkan tautan playlist atau album Spotify. Player resmi Spotify akan muncul pada artikel publik; pembaca bebas memutar atau tidak (tanpa autoplay).
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1] mb-1.5">
                      Tautan Playlist Spotify
                    </label>
                    <input
                      type="text"
                      value={article.music_uri || ''}
                      placeholder="https://open.spotify.com/playlist/..."
                      onChange={(e) => onUpdate({ music_uri: e.target.value })}
                      className="w-full h-10 bg-[#0A0B0E] border border-white/10 rounded-xl px-3 text-xs text-[#F8FAFC] outline-none focus:border-[#1DB954]/50 font-mono placeholder-[#52525B]"
                    />
                  </div>

                  {hasSpotifyUrl && (
                    <div className="flex items-center justify-between text-xs">
                      {isSpotifyValid ? (
                        <>
                          <span className="text-[#1DB954] flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tautan Spotify valid</span>
                          </span>
                          <a
                            href={article.music_uri}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#94A3B8] hover:text-white flex items-center gap-1 font-medium text-[11px] underline underline-offset-2"
                          >
                            <span>Buka di Spotify</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      ) : (
                        <span className="text-[#FBBF24] flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Format belum sesuai (contoh: https://open.spotify.com/playlist/...)</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SEO */}
        {activeTab === 'seo' && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
                  SEO Title
                </label>
                <span className={`text-[10px] font-mono ${seoTitleLength > 60 ? 'text-[#FBBF24]' : 'text-[#71717A]'}`}>
                  {seoTitleLength}/60
                </span>
              </div>
              <input
                type="text"
                maxLength={60}
                value={article.seo_title || ''}
                placeholder={article.title || 'Judul di Google...'}
                onChange={(e) => onUpdate({ seo_title: e.target.value })}
                className="w-full h-10 bg-[#0A0B0E] border border-white/10 rounded-xl px-3 text-xs text-[#F8FAFC] outline-none focus:border-[#34D399]/50 transition-colors"
              />
              {seoTitleLength > 55 && (
                <span className="text-[11px] text-[#FBBF24] flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Mendekati batas optimal tampilan Google (60 karakter).</span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
                  Meta Description
                </label>
                <span className={`text-[10px] font-mono ${seoDescLength > 160 ? 'text-[#FBBF24]' : 'text-[#71717A]'}`}>
                  {seoDescLength}/160
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={160}
                value={article.seo_description || ''}
                placeholder={article.excerpt || 'Deskripsi yang tampil pada snippet pencarian Google...'}
                onChange={(e) => onUpdate({ seo_description: e.target.value })}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl p-3 text-xs text-[#F8FAFC] outline-none resize-none placeholder-[#52525B] focus:border-[#34D399]/50 leading-relaxed transition-colors"
              />
            </div>

            {/* Google SERP Snippet Preview */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
                Pratinjau Hasil Pencarian (SERP)
              </label>
              <div className="p-4 rounded-xl bg-[#0A0B0E] border border-white/10 space-y-1.5 text-left">
                <span className="block text-[11px] font-mono text-[#34D399] truncate">
                  khadafidaffa.com › blog › {article.slug || 'slug'}
                </span>
                <strong className="block text-sm text-[#60A5FA] font-sans font-semibold line-clamp-1 hover:underline cursor-pointer">
                  {article.seo_title || article.title || 'Untitled story'}
                </strong>
                <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed font-sans">
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
