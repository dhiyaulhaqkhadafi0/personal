"use client";

import { useState, useEffect } from 'react';
import {
  Sparkles, X, Check, Copy, AlertTriangle, ArrowRight, LoaderCircle,
  FileText, Wand2, RefreshCw, Layers, Heading, Scissors, ShieldAlert,
} from 'lucide-react';
import type { Editor } from '@tiptap/react';
import {
  SELECTION_ACTIONS,
  ARTICLE_ACTIONS,
  type AiAction,
} from '@/lib/editorial-ai';
import type { StudioArticle } from '@/lib/blog-types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  article: StudioArticle;
  onUpdateArticle: (patch: Partial<StudioArticle>) => void;
  authToken: string;
};

type SelectionSnapshot = {
  from: number;
  to: number;
  text: string;
};

export function StudioAiModal({
  isOpen,
  onClose,
  editor,
  article,
  onUpdateArticle,
  authToken,
}: Props) {
  const [activeTab, setActiveTab] = useState<'selection' | 'article'>('selection');
  const [customHint, setCustomHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState<AiAction | null>(null);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  // Configuration check
  const [checkingConfig, setCheckingConfig] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  // Selection tracking
  const [selectedText, setSelectedText] = useState('');
  const [selectionSnapshot, setSelectionSnapshot] = useState<SelectionSnapshot | null>(null);
  const [isStale, setIsStale] = useState(false);

  // Check config and active selection when modal opens
  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      setError(null);
      setCustomHint('');
      setSelectionSnapshot(null);
      setIsStale(false);
      return;
    }

    // Check editor selection
    if (editor) {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, ' ').trim();
      setSelectedText(text);
      if (text.length > 0) {
        setActiveTab('selection');
      } else {
        setActiveTab('article');
      }
    }

    // Fetch AI configuration status (checks both GEMINI_API_KEY and GEMINI_MODEL)
    setCheckingConfig(true);
    fetch('/api/studio/ai', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setIsConfigured(Boolean(data.configured));
        } else {
          setIsConfigured(false);
        }
      })
      .catch(() => {
        setIsConfigured(false);
      })
      .finally(() => {
        setCheckingConfig(false);
      });
  }, [isOpen, editor, authToken]);

  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleRunAi = async (action: AiAction) => {
    if (!editor || loading) return;

    setError(null);
    setResult(null);
    setCopied(false);
    setApplied(false);
    setCurrentAction(action);
    setLoading(true);

    let snapshot: SelectionSnapshot | null = null;
    let targetSelection = '';

    const isSelectionAction = SELECTION_ACTIONS.some((a) => a.id === action);

    if (isSelectionAction) {
      const { from, to } = editor.state.selection;
      targetSelection = editor.state.doc.textBetween(from, to, ' ').trim();

      if (!targetSelection) {
        setError('Pilih sebagian teks pada naskah terlebih dahulu untuk menjalankan aksi ini.');
        setLoading(false);
        return;
      }

      snapshot = { from, to, text: targetSelection };
      setSelectionSnapshot(snapshot);
      setIsStale(false);
    }

    try {
      const plainBody = isSelectionAction ? '' : editor.getText().slice(0, 4000);

      const res = await fetch('/api/studio/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          action,
          selection: targetSelection,
          title: article.title || '',
          excerpt: article.excerpt || '',
          body: plainBody,
          customHint,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || 'Terjadi kesalahan saat memproses permintaan AI.');
        return;
      }

      setResult(data.result);

      // Verify if selection has become stale during fetch
      if (snapshot && editor) {
        const currentDocText = editor.state.doc.textBetween(snapshot.from, snapshot.to, ' ').trim();
        if (currentDocText !== snapshot.text) {
          setIsStale(true);
        }
      }
    } catch {
      setError('Gagal menghubungi server. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleApplyResult = () => {
    if (!result || !editor) return;

    // A. Selection Actions: Replace original selection range
    if (selectionSnapshot && SELECTION_ACTIONS.some((a) => a.id === currentAction)) {
      if (isStale) return;

      editor
        .chain()
        .focus()
        .setTextSelection({ from: selectionSnapshot.from, to: selectionSnapshot.to })
        .insertContent(result)
        .run();

      setApplied(true);
      setTimeout(() => {
        onClose();
      }, 700);
      return;
    }

    // B. Metadata Actions
    if (currentAction === 'excerpt') {
      onUpdateArticle({ excerpt: result.replace(/^["']|["']$/g, '').trim() });
      setApplied(true);
      setTimeout(() => onClose(), 700);
      return;
    }

    if (currentAction === 'seo_meta') {
      const titleMatch = result.match(/SEO_TITLE:\s*(.+)/i);
      const descMatch = result.match(/META_DESCRIPTION:\s*(.+)/i);
      const patch: Partial<StudioArticle> = {};
      if (titleMatch && titleMatch[1]) patch.seo_title = titleMatch[1].trim().slice(0, 60);
      if (descMatch && descMatch[1]) patch.seo_description = descMatch[1].trim().slice(0, 160);
      if (Object.keys(patch).length > 0) {
        onUpdateArticle(patch);
      }
      setApplied(true);
      setTimeout(() => onClose(), 700);
      return;
    }

    // C. Outline: Insert at current cursor position
    if (currentAction === 'outline') {
      editor.chain().focus().insertContent(`\n\n${result}\n\n`).run();
      setApplied(true);
      setTimeout(() => onClose(), 700);
      return;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-2xl bg-[#111216] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#14151B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-[#6366F1]/20 border border-[#34D399]/30 flex items-center justify-center text-[#34D399]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif font-bold text-[#F8FAFC]">
                  AI Editorial Co‑Pilot
                </h2>
                <span className="text-[10px] font-mono text-[#34D399] bg-[#34D399]/10 px-2 py-0.5 rounded-full border border-[#34D399]/20 font-semibold">
                  Editorial Co‑Pilot
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Teks yang kamu kirim akan diproses oleh penyedia AI. Hasil tidak diterapkan otomatis.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup AI modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#71717A] hover:text-[#F8FAFC] hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {checkingConfig ? (
            <div className="p-12 text-center text-xs text-[#94A3B8] flex flex-col items-center justify-center gap-3">
              <LoaderCircle className="w-5 h-5 text-[#34D399] animate-spin" />
              <span>Memeriksa status AI Co-Pilot...</span>
            </div>
          ) : !isConfigured ? (
            /* EMPTY STATE: UNCONFIGURED */
            <div className="p-8 text-center bg-[#14151B] border border-white/10 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#FBBF24]">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                AI Editorial belum dikonfigurasi
              </h3>
              <p className="text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                Pastikan variabel <code className="text-[#34D399] bg-white/5 px-1 py-0.5 rounded">GEMINI_API_KEY</code> dan <code className="text-[#34D399] bg-white/5 px-1 py-0.5 rounded">GEMINI_MODEL</code> telah diatur di environment server Anda untuk mengaktifkan asisten editorial ini.
              </p>
            </div>
          ) : result ? (
            /* REVIEW PANEL: RESULTS MUST BE REVIEWED BEFORE APPLICATION */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#34D399] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Hasil Analisis Editorial</span>
                </span>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Ulangi Perintah</span>
                </button>
              </div>

              {/* Stale Selection Warning Alert */}
              {isStale && (
                <div className="p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2.5 text-xs text-[#FCA5A5]">
                  <AlertTriangle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold text-[#F8FAFC]">
                      Naskah di editor telah berubah
                    </strong>
                    <p className="mt-0.5 text-[11px] text-[#FCA5A5] leading-relaxed">
                      Teks asli yang diseleksi telah disunting saat AI sedang memproses. Penimpaan otomatis dinonaktifkan demi keamanan naskah Anda. Anda dapat menyalin hasil di bawah atau menjalankan ulang seleksi.
                    </p>
                  </div>
                </div>
              )}

              {/* Result Preview Box */}
              <div className="p-4 rounded-xl bg-[#090A0D] border border-white/10 text-xs text-[#E2E8F0] leading-relaxed whitespace-pre-wrap font-sans max-h-72 overflow-y-auto">
                {result}
              </div>

              {/* Review Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#CBD5E1] font-medium transition-colors"
                >
                  Buang
                </button>

                <button
                  type="button"
                  onClick={handleCopyResult}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#CBD5E1] font-medium flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#34D399]" />
                      <span className="text-[#34D399]">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span>Salin</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isStale || applied}
                  onClick={handleApplyResult}
                  className={`px-5 py-2 rounded-xl font-bold text-xs tracking-wide flex items-center gap-1.5 transition-all shadow-sm ${
                    isStale
                      ? 'bg-[#27272A] text-[#71717A] cursor-not-allowed border border-white/5'
                      : applied
                      ? 'bg-[#10B981] text-[#022C22]'
                      : 'bg-[#10B981] hover:bg-[#34D399] text-[#022C22] active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  }`}
                >
                  {applied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Diterapkan!</span>
                    </>
                  ) : (
                    <>
                      <span>Terapkan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* ACTION PICKER: SELECTION VS ARTICLE MODE */
            <div className="space-y-4">
              {/* Segmented Mode Tabs */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-[#14151B] rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setActiveTab('selection')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'selection'
                      ? 'bg-[#22242F] text-[#F8FAFC] shadow-sm border border-white/10'
                      : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-white/5'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Teks Terpilih</span>
                  {selectedText && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('article')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'article'
                      ? 'bg-[#22242F] text-[#F8FAFC] shadow-sm border border-white/10'
                      : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-[#818CF8]" />
                  <span>Artikel &amp; Naskah</span>
                </button>
              </div>

              {/* Mode A: Teks Terpilih */}
              {activeTab === 'selection' && (
                <div className="space-y-3">
                  {selectedText ? (
                    <div className="p-3 bg-[#0A0B0E] border border-white/10 rounded-xl text-xs text-[#94A3B8] line-clamp-3 italic">
                      &ldquo;{selectedText}&rdquo;
                    </div>
                  ) : (
                    <div className="p-3 bg-[#0A0B0E] border border-dashed border-white/10 rounded-xl text-xs text-[#71717A] text-center">
                      Belum ada teks yang dipilih di editor. Sorot kalimat atau paragraf terlebih dahulu untuk memakai mode ini.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SELECTION_ACTIONS.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        disabled={loading || !selectedText}
                        onClick={() => handleRunAi(action.id)}
                        className="p-3 rounded-xl bg-[#14151B] hover:bg-[#1C1E26] border border-white/10 hover:border-[#34D399]/40 text-left transition-all group disabled:opacity-40 disabled:pointer-events-none"
                      >
                        <strong className="block text-xs text-[#F8FAFC] group-hover:text-[#34D399] transition-colors">
                          {action.label}
                        </strong>
                        <span className="text-[11px] text-[#71717A] block mt-0.5 leading-snug">
                          {action.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mode B: Artikel / Naskah */}
              {activeTab === 'article' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ARTICLE_ACTIONS.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        disabled={loading}
                        onClick={() => handleRunAi(action.id)}
                        className="p-3 rounded-xl bg-[#14151B] hover:bg-[#1C1E26] border border-white/10 hover:border-[#818CF8]/40 text-left transition-all group disabled:opacity-40 disabled:pointer-events-none"
                      >
                        <strong className="block text-xs text-[#F8FAFC] group-hover:text-[#818CF8] transition-colors">
                          {action.label}
                        </strong>
                        <span className="text-[11px] text-[#71717A] block mt-0.5 leading-snug">
                          {action.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Custom Hint */}
              <div className="pt-2 border-t border-white/5 space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  Arahan Khusus (Opsional)
                </label>
                <input
                  type="text"
                  maxLength={150}
                  value={customHint}
                  placeholder="Contoh: Buat dengan analogi arsitektur piramida..."
                  onChange={(e) => setCustomHint(e.target.value)}
                  className="w-full h-9 bg-[#0A0B0E] border border-white/10 rounded-xl px-3 text-xs text-[#F8FAFC] outline-none focus:border-[#34D399]/50 placeholder-[#52525B] transition-colors"
                />
              </div>

              {/* Loading State */}
              {loading && (
                <div className="p-4 rounded-xl bg-[#14151B] border border-white/10 flex items-center justify-center gap-2.5 text-xs text-[#34D399]">
                  <LoaderCircle className="w-4 h-4 animate-spin text-[#34D399]" />
                  <span>Memproses analisis editorial dengan AI...</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#FCA5A5] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#EF4444] flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
