"use client";

import { CheckCircle2, AlertTriangle, X, LoaderCircle, Sparkles, Send, Save, Undo2 } from 'lucide-react';
import type { StudioArticle } from '@/lib/blog-types';

type Props = {
  article: StudioArticle;
  autoCoverUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: () => Promise<void>;
  onConfirmUnpublish?: () => Promise<void>;
  isPublishing: boolean;
  publishError?: string;
};

export function StudioPublishModal({
  article,
  autoCoverUrl,
  isOpen,
  onClose,
  onConfirmPublish,
  onConfirmUnpublish,
  isPublishing,
  publishError,
}: Props) {
  if (!isOpen) return null;

  const isPublished = article.status === 'published';

  // 1. Title Check
  const hasTitle = Boolean(article.title?.trim() && article.title !== 'Untitled story');

  // 2. Slug Check
  const hasValidSlug = Boolean(article.slug?.trim() && !article.slug.startsWith('untitled-'));

  // 3. Excerpt / Deck Check
  const hasExcerpt = Boolean(article.excerpt?.trim());

  // 4. Cover Check
  const hasManualCover = Boolean(article.cover_url?.trim());
  const hasAutoCover = Boolean(!hasManualCover && autoCoverUrl);
  const hasAnyCover = hasManualCover || hasAutoCover;

  // 5. SEO Check
  const hasSeo = Boolean(article.seo_title?.trim() && article.seo_description?.trim());

  // 6. Word count Check
  const wordCount = article.word_count || 0;
  const hasContent = wordCount > 30;

  const allPassed = hasTitle && hasValidSlug && hasExcerpt && hasAnyCover && hasSeo && hasContent;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-checklist-title"
    >
      <div className="relative w-full max-w-lg overflow-hidden bg-[#111216] border border-[#27272A] rounded-2xl shadow-2xl p-6 sm:p-7 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/5 pb-4">
          <div>
            <h2 id="publish-checklist-title" className="text-lg font-serif font-semibold text-[#F8FAFC]">
              {isPublished ? 'Perbarui Versi Publik' : 'Checklist Kesiapan Naskah'}
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              {isPublished
                ? 'Periksa pembaruan sebelum menimpa versi publik di khadafidaffa.com.'
                : 'Tinjau kelengkapan metadata sebelum artikel ditayangkan secara publik.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPublishing}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#71717A] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Checklist Items */}
        <div className="space-y-3 py-1 text-xs">
          {/* Title */}
          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#181920]/60 border border-white/5">
            {hasTitle ? (
              <CheckCircle2 className="w-4 h-4 text-[#34D399] flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#FBBF24] flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <strong className="block text-[#E2E8F0] font-medium">Judul Naskah</strong>
              <span className="text-[#71717A] truncate block">
                {hasTitle ? article.title : 'Judul masih default atau belum diisi'}
              </span>
            </div>
          </div>

          {/* Slug */}
          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#181920]/60 border border-white/5">
            {hasValidSlug ? (
              <CheckCircle2 className="w-4 h-4 text-[#34D399] flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#FBBF24] flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <strong className="block text-[#E2E8F0] font-medium">URL Artikel (Slug)</strong>
              <span className="text-[#71717A] font-mono text-[11px] truncate block">
                /blog/{article.slug || 'untitled'}
              </span>
            </div>
          </div>

          {/* Excerpt / Deck */}
          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#181920]/60 border border-white/5">
            {hasExcerpt ? (
              <CheckCircle2 className="w-4 h-4 text-[#34D399] flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#FBBF24] flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <strong className="block text-[#E2E8F0] font-medium">Ringkasan / Deck</strong>
              <span className="text-[#71717A] truncate block">
                {hasExcerpt ? `${article.excerpt.slice(0, 70)}...` : 'Ringkasan belum diisi'}
              </span>
            </div>
          </div>

          {/* Cover */}
          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#181920]/60 border border-white/5">
            {hasAnyCover ? (
              <CheckCircle2 className="w-4 h-4 text-[#34D399] flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#FBBF24] flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <strong className="block text-[#E2E8F0] font-medium flex items-center gap-1.5">
                <span>Cover Visual</span>
                {hasAutoCover && (
                  <span className="text-[10px] bg-[#34D399]/15 text-[#34D399] px-1.5 py-0.2 rounded font-mono font-normal flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Auto-body
                  </span>
                )}
              </strong>
              <span className="text-[#71717A] truncate block">
                {hasManualCover
                  ? 'Cover manual tersedia'
                  : hasAutoCover
                  ? 'Memakai gambar pertama dari isi artikel'
                  : 'Belum ada cover (akan memakai fallback tipografi editorial)'}
              </span>
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#181920]/60 border border-white/5">
            {hasSeo ? (
              <CheckCircle2 className="w-4 h-4 text-[#34D399] flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#FBBF24] flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <strong className="block text-[#E2E8F0] font-medium">Optimasi Pencarian (SEO)</strong>
              <span className="text-[#71717A] truncate block">
                {hasSeo
                  ? `${article.seo_title} · ${article.seo_description.length} karakter deskripsi`
                  : 'Judul atau deskripsi SEO belum lengkap'}
              </span>
            </div>
          </div>

          {/* Word count & Reading time */}
          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#181920]/60 border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-[#34D399] flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <strong className="block text-[#E2E8F0] font-medium">Panjang Naskah</strong>
              <span className="text-[#71717A]">
                {wordCount} kata · Estimasi baca {article.reading_time || 1} menit
              </span>
            </div>
          </div>
        </div>

        {/* Error Note if publish was aborted / save failed */}
        {publishError && (
          <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{publishError}</span>
          </div>
        )}

        {/* Warning Note if any item missing */}
        {!allPassed && !publishError && (
          <div className="p-3 rounded-lg bg-[#FBBF24]/10 border border-[#FBBF24]/20 text-xs text-[#FBBF24] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Beberapa data belum lengkap, tetapi Anda tetap dapat menayangkannya sekarang.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-3">
          {isPublished && onConfirmUnpublish ? (
            <button
              type="button"
              onClick={() => void onConfirmUnpublish()}
              disabled={isPublishing}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/10 border border-[#EF4444]/20 transition-colors flex items-center gap-1.5"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Unpublish</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              disabled={isPublishing}
              className="px-4 py-2 rounded-lg text-xs text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-white/5 transition-colors"
            >
              Kembali Mengedit
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {isPublished && onConfirmUnpublish && (
              <button
                type="button"
                onClick={onClose}
                disabled={isPublishing}
                className="px-3.5 py-2 rounded-lg text-xs text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-white/5 transition-colors"
              >
                Batal
              </button>
            )}
            <button
              type="button"
              onClick={() => void onConfirmPublish()}
              disabled={isPublishing}
              className="px-5 py-2 rounded-lg bg-[#34D399] hover:bg-[#2EB882] text-[#0A0B0E] text-xs font-semibold tracking-wide transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : isPublished ? (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Perbarui Artikel</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Publikasikan Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
