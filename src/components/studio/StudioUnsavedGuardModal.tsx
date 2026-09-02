"use client";

import { AlertTriangle, AlertCircle, LoaderCircle, Save, Trash2 } from 'lucide-react';

type Props = {
  isOpen: boolean;
  currentArticleTitle: string;
  targetArticleTitle: string;
  onSaveAndSwitch: () => Promise<void>;
  onDiscardAndSwitch: () => void;
  onStay: () => void;
  isSaving: boolean;
  saveError?: string;
};

export function StudioUnsavedGuardModal({
  isOpen,
  currentArticleTitle,
  targetArticleTitle,
  onSaveAndSwitch,
  onDiscardAndSwitch,
  onStay,
  isSaving,
  saveError,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-guard-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-[#111216] border border-white/10 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Warning Icon & Heading */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/20 flex items-center justify-center text-[#FBBF24] flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 id="unsaved-guard-title" className="text-sm font-bold text-[#F8FAFC]">
              Perubahan belum tersimpan
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
              Anda sedang meninggalkan naskah <strong>&ldquo;{currentArticleTitle || 'Untitled story'}&rdquo;</strong> yang memiliki perubahan lokal dan belum tersimpan di server.
            </p>
            {targetArticleTitle && (
              <p className="text-[11px] text-[#71717A] mt-1 truncate">
                Target perpindahan: <span className="text-[#CBD5E1] font-medium">{targetArticleTitle}</span>
              </p>
            )}
          </div>
        </div>

        {/* Error Notice (if saving failed) */}
        {saveError && (
          <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-xs text-[#EF4444] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              <strong>Gagal menyimpan naskah:</strong> {saveError}
              <p className="text-[11px] mt-1 text-[#FCA5A5]">
                Perpindahan naskah dibatalkan agar perubahan Anda tidak hilang. Silakan periksa kembali atau pilih buang perubahan jika ingin melanjutkan.
              </p>
            </div>
          </div>
        )}

        {/* Action Button Set */}
        <div className="pt-2 border-t border-white/5 space-y-2.5">
          {/* Primary Action: Simpan & Pindah */}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => void onSaveAndSwitch()}
            className="w-full h-11 px-4 rounded-xl bg-[#10B981] hover:bg-[#34D399] text-[#022C22] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(52,211,153,0.35)] active:scale-[0.99] disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin text-[#022C22]" />
                <span>Menyimpan ke Server…</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#022C22]" />
                <span>Simpan &amp; Pindah</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2">
            {/* Secondary Destructive Action: Buang Perubahan & Pindah */}
            <button
              type="button"
              disabled={isSaving}
              onClick={onDiscardAndSwitch}
              className="h-10 px-3 rounded-xl bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/25 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 active:scale-[0.98]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Buang &amp; Pindah</span>
            </button>

            {/* Safe Default Action: Tetap di artikel ini */}
            <button
              type="button"
              disabled={isSaving}
              onClick={onStay}
              className="h-10 px-3 rounded-xl bg-[#1F2028] hover:bg-[#2A2B36] text-[#CBD5E1] hover:text-white border border-white/10 text-xs font-medium flex items-center justify-center transition-colors disabled:opacity-50"
            >
              Tetap di Artikel Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
