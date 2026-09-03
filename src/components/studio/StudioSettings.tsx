"use client";

import { useState, useId, useEffect, useRef } from 'react';
import {
  Settings2, ImageIcon, Upload, X, Music2, Sparkles, PanelRightClose,
  AlertCircle, CheckCircle2, Copy, Check, Edit3, RotateCcw, ExternalLink,
  LoaderCircle, Compass, LayoutTemplate, Share2, Eye,
} from 'lucide-react';
import {
  slugify,
  extractVisualSettings,
  applyVisualSettingsToContentJson,
  FOCAL_POINT_CSS,
  FOCAL_POINT_LABELS,
  type StudioArticle,
  type FocalPoint,
  type HeroLayout,
  type VisualSettings,
} from '@/lib/blog-types';

export type SettingsTab = 'article' | 'experience' | 'seo';

type Props = {
  article: StudioArticle;
  onUpdate: (patch: Partial<StudioArticle>) => void;
  autoCoverUrl: string | null;
  onUploadCover: (file: File) => Promise<void>;
  uploading: boolean;
  onToggleCollapse: () => void;
};

function isValidSpotifyPlaylistUrl(url: string): boolean {
  if (!url || !url.trim()) return false;
  return /^(https?:\/\/open\.spotify\.com\/playlist\/|spotify:playlist:)[a-zA-Z0-9]+/.test(
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
    const autoSlug = slugify(article.title || '');
    return Boolean(article.slug && article.slug !== 'untitled-story' && article.slug !== autoSlug);
  });
  const [previewLoading, setPreviewLoading] = useState(false);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const coverInputId = useId();

  // Reset custom slug status and preview state when switching articles
  useEffect(() => {
    const autoSlug = slugify(article.title || '');
    const isCustom = Boolean(article.slug && article.slug !== 'untitled-story' && article.slug !== autoSlug);
    setIsCustomSlug(isCustom);
    setPreviewLoading(false);
    if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
  }, [article.id]);

  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
    };
  }, []);

  const manualCover = article.cover_url || (article.cover_slides && article.cover_slides.length > 0 ? article.cover_slides[0] : null);
  const displayCover = manualCover || autoCoverUrl;

  const visualSettings = extractVisualSettings(article.content_json);

  const handleUpdateVisual = (patch: Partial<VisualSettings>) => {
    const updatedContentJson = applyVisualSettingsToContentJson(article.content_json, patch);
    onUpdate({ content_json: updatedContentJson });
  };

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
    if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
    previewTimeoutRef.current = setTimeout(() => {
      setPreviewLoading(false);
    }, 8000); // 8s safety fallback

    try {
      await onUploadCover(file);
    } catch {
      setPreviewLoading(false);
      if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
    }
  };

  const hasSpotifyUrl = Boolean(article.music_uri?.trim());
  const isSpotifyValid = isValidSpotifyPlaylistUrl(article.music_uri || '');

  const focalPointCss = FOCAL_POINT_CSS[visualSettings.focal_point] || '50% 50%';

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

            {/* SECTION: COVER & VISUAL SETTINGS */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#34D399]" />
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1]">
                    Visual Cover
                  </label>
                </div>
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

              {/* Cover Preview Box with Live Focal Point */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0A0B0E] border border-white/10 flex items-center justify-center group shadow-inner">
                {displayCover ? (
                  <>
                    <img
                      src={displayCover}
                      alt={visualSettings.alt_text || article.title || 'Cover'}
                      style={{ objectPosition: focalPointCss }}
                      onLoad={() => {
                        setPreviewLoading(false);
                        if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
                      }}
                      onError={() => {
                        setPreviewLoading(false);
                        if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
                      }}
                      className={`w-full h-full object-cover transition-all duration-300 ${
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
                  className={`absolute right-3 bottom-3 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black/95 border border-white/20 backdrop-blur-md text-xs text-[#F8FAFC] font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-lg active:scale-95 ${
                    uploading ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  {uploading ? (
                    <>
                      <LoaderCircle className="w-3.5 h-3.5 animate-spin text-[#34D399]" />
                      <span>Mengunggah…</span>
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
                <div className="p-2.5 rounded-xl bg-[#34D399]/10 border border-[#34D399]/20 flex flex-col gap-0.5 text-xs">
                  <div className="flex items-center gap-1.5 text-[#34D399] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Thumbnail Otomatis Aktif</span>
                  </div>
                  <span className="text-[#94A3B8] text-[11px] leading-relaxed">
                    Menggunakan gambar pertama dari naskah artikel sebagai cover. Mengunggah cover manual akan menggantikan thumbnail ini.
                  </span>
                </div>
              )}

              {/* FOCAL POINT / POSISI GAMBAR */}
              {displayCover && (
                <div className="pt-2 border-t border-white/5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#CBD5E1] flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>Fokus Gambar (Focal Point)</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#34D399] bg-[#34D399]/10 px-2 py-0.5 rounded-md border border-[#34D399]/20">
                      {FOCAL_POINT_LABELS[visualSettings.focal_point]}
                    </span>
                  </div>

                  {/* Visual 5-way D-pad selector */}
                  <div className="bg-[#0A0B0E] p-2.5 rounded-xl border border-white/5">
                    <div className="grid grid-cols-3 gap-1.5 max-w-[210px] mx-auto">
                      <div />
                      <button
                        type="button"
                        onClick={() => handleUpdateVisual({ focal_point: 'top' })}
                        title="Fokus Atas"
                        aria-label="Fokus Atas"
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center transition-all ${
                          visualSettings.focal_point === 'top'
                            ? 'bg-[#10B981] text-[#022C22] font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : 'bg-[#16171F] text-[#94A3B8] hover:text-white hover:bg-white/10'
                        }`}
                      >
                        Atas
                      </button>
                      <div />

                      <button
                        type="button"
                        onClick={() => handleUpdateVisual({ focal_point: 'left' })}
                        title="Fokus Kiri"
                        aria-label="Fokus Kiri"
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center transition-all ${
                          visualSettings.focal_point === 'left'
                            ? 'bg-[#10B981] text-[#022C22] font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : 'bg-[#16171F] text-[#94A3B8] hover:text-white hover:bg-white/10'
                        }`}
                      >
                        Kiri
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateVisual({ focal_point: 'center' })}
                        title="Fokus Tengah"
                        aria-label="Fokus Tengah"
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center transition-all ${
                          visualSettings.focal_point === 'center'
                            ? 'bg-[#10B981] text-[#022C22] font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : 'bg-[#16171F] text-[#94A3B8] hover:text-white hover:bg-white/10'
                        }`}
                      >
                        Tengah
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateVisual({ focal_point: 'right' })}
                        title="Fokus Kanan"
                        aria-label="Fokus Kanan"
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center transition-all ${
                          visualSettings.focal_point === 'right'
                            ? 'bg-[#10B981] text-[#022C22] font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : 'bg-[#16171F] text-[#94A3B8] hover:text-white hover:bg-white/10'
                        }`}
                      >
                        Kanan
                      </button>

                      <div />
                      <button
                        type="button"
                        onClick={() => handleUpdateVisual({ focal_point: 'bottom' })}
                        title="Fokus Bawah"
                        aria-label="Fokus Bawah"
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center transition-all ${
                          visualSettings.focal_point === 'bottom'
                            ? 'bg-[#10B981] text-[#022C22] font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : 'bg-[#16171F] text-[#94A3B8] hover:text-white hover:bg-white/10'
                        }`}
                      >
                        Bawah
                      </button>
                      <div />
                    </div>
                  </div>
                  <span className="text-[11px] text-[#71717A] leading-relaxed block">
                    Pilih titik fokus agar subjek utama gambar tidak terpotong pada berbagai ukuran layar.
                  </span>
                </div>
              )}

              {/* CAPTION & KREDIT & ALT TEXT */}
              {displayCover && (
                <div className="pt-2 border-t border-white/5 space-y-3">
                  {/* Caption Cover */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#CBD5E1]">
                        Caption Cover <span className="text-[#71717A] font-normal lowercase">(opsional)</span>
                      </label>
                      <span className={`text-[10px] font-mono ${visualSettings.caption.length > 140 ? 'text-[#FBBF24]' : 'text-[#71717A]'}`}>
                        {visualSettings.caption.length}/160
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={160}
                      value={visualSettings.caption}
                      placeholder="Keterangan singkat tentang gambar cover..."
                      onChange={(e) =>
                        handleUpdateVisual({
                          caption: e.target.value.replace(/<[^>]*>/g, ''),
                        })
                      }
                      className="w-full h-9 bg-[#0A0B0E] border border-white/10 rounded-xl px-3 text-xs text-[#F8FAFC] outline-none focus:border-[#34D399]/50 transition-colors placeholder-[#52525B]"
                    />
                  </div>

                  {/* Kredit Foto / Sumber */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#CBD5E1]">
                        Kredit Foto / Sumber <span className="text-[#71717A] font-normal lowercase">(opsional)</span>
                      </label>
                      <span className={`text-[10px] font-mono ${visualSettings.credit.length > 70 ? 'text-[#FBBF24]' : 'text-[#71717A]'}`}>
                        {visualSettings.credit.length}/80
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={80}
                      value={visualSettings.credit}
                      placeholder="Contoh: Unsplash / Satoshi Nakamoto"
                      onChange={(e) =>
                        handleUpdateVisual({
                          credit: e.target.value.replace(/<[^>]*>/g, ''),
                        })
                      }
                      className="w-full h-9 bg-[#0A0B0E] border border-white/10 rounded-xl px-3 text-xs text-[#F8FAFC] outline-none focus:border-[#34D399]/50 transition-colors placeholder-[#52525B]"
                    />
                    <span className="text-[10px] text-[#71717A] mt-1 block">
                      Nama fotografer atau sumber lisensi. Jangan memasukkan URL mentah.
                    </span>
                  </div>

                  {/* Alt Text (Deskripsi Gambar) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#CBD5E1]">
                        Deskripsi Gambar (Alt Text)
                      </label>
                      <span className={`text-[10px] font-mono ${visualSettings.alt_text.length > 140 ? 'text-[#FBBF24]' : 'text-[#71717A]'}`}>
                        {visualSettings.alt_text.length}/160
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={160}
                      value={visualSettings.alt_text}
                      placeholder={article.title || 'Deskripsi visual isi cover...'}
                      onChange={(e) =>
                        handleUpdateVisual({
                          alt_text: e.target.value.replace(/<[^>]*>/g, ''),
                        })
                      }
                      className="w-full h-9 bg-[#0A0B0E] border border-white/10 rounded-xl px-3 text-xs text-[#F8FAFC] outline-none focus:border-[#34D399]/50 transition-colors placeholder-[#52525B]"
                    />
                    <span className="text-[10px] text-[#71717A] mt-1 block">
                      Jelaskan isi gambar untuk aksesibilitas pembaca dan SEO.
                    </span>
                  </div>
                </div>
              )}
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
            {/* HERO LAYOUT SELECTION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1]">
                    Layout Hero Artikel
                  </label>
                  <span className="text-[11px] text-[#94A3B8]">Pilih gaya presentasi cover dan judul</span>
                </div>
                <LayoutTemplate className="w-4 h-4 text-[#34D399]" />
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'editorial' as const,
                    title: 'Editorial',
                    badge: 'Default',
                    description: 'Judul dan metadata di atas, cover proporsional dalam kontainer baca.',
                  },
                  {
                    id: 'immersive' as const,
                    title: 'Immersive',
                    badge: 'Panorama',
                    description: 'Cover membentang lebih lebar dari kolom baca, memberi impresi visual luas.',
                  },
                  {
                    id: 'cinematic' as const,
                    title: 'Cinematic',
                    badge: 'Poster Hero',
                    description: 'Cover menjadi visual hero besar dengan judul & metadata dramatis di atasnya.',
                  },
                ].map((item) => {
                  const isSelected = visualSettings.hero_layout === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleUpdateVisual({ hero_layout: item.id })}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all relative ${
                        isSelected
                          ? 'bg-[#10B981]/10 border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : 'bg-[#0A0B0E] border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isSelected ? 'text-[#34D399]' : 'text-[#F8FAFC]'}`}>
                            {item.title}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-semibold ${
                            isSelected
                              ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30'
                              : 'bg-white/5 text-[#71717A] border border-white/5'
                          }`}>
                            {item.badge}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#34D399]" />}
                      </div>
                      <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
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
                    💡 <strong>Opsional:</strong> Tempelkan tautan playlist Spotify. Player resmi Spotify akan muncul pada artikel publik; pembaca bebas memutar atau tidak (tanpa autoplay).
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
                            <span>Tautan playlist Spotify valid</span>
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
                          <span>Format harus playlist Spotify (contoh: https://open.spotify.com/playlist/...)</span>
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

            {/* SOCIAL SHARE CARD PREVIEW (Open Graph) */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1] flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Pratinjau Saat Dibagikan</span>
                </label>
                <span className="text-[10px] font-mono text-[#71717A]">Open Graph / Twitter</span>
              </div>

              <div className="rounded-xl overflow-hidden bg-[#0A0B0E] border border-white/10 shadow-lg select-none">
                {/* 1.91:1 Card Image */}
                <div className="relative aspect-[1.91/1] w-full bg-[#14151B] overflow-hidden flex items-center justify-center">
                  {displayCover ? (
                    <img
                      src={displayCover}
                      alt={visualSettings.alt_text || article.title || 'Cover'}
                      style={{ objectPosition: focalPointCss }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#12131A] via-[#181922] to-[#0A0B0E] flex flex-col items-center justify-center text-center p-4 border border-white/5">
                      <Sparkles className="w-6 h-6 text-[#34D399] mb-1.5 opacity-60" />
                      <span className="text-xs font-mono text-[#94A3B8] max-w-[220px] truncate">
                        {article.title || 'Untitled story'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-3 bg-[#111216] border-t border-white/5 space-y-1 text-left">
                  <span className="block text-[10px] font-mono uppercase text-[#71717A] tracking-wider">
                    khadafidaffa.com
                  </span>
                  <strong className="block text-xs text-[#F8FAFC] font-semibold line-clamp-1 leading-snug">
                    {article.seo_title || article.title || 'Untitled story'}
                  </strong>
                  <p className="text-[11px] text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {article.seo_description || article.excerpt || 'Deskripsi naskah untuk pratinjau media sosial.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
