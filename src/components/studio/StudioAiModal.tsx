"use client";

import { useState, useEffect, useMemo } from 'react';
import {
  Bot, X, Check, Copy, AlertTriangle, ArrowRight, LoaderCircle,
  FileText, RefreshCw, Scissors, ShieldAlert, Sparkles, CheckCircle2,
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
  const [activeTab, setActiveTab] = useState<'edit_text' | 'article'>('edit_text');
  const [customHint, setCustomHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [lastExecutedAction, setLastExecutedAction] = useState<AiAction | null>(null);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  // Configuration check
  const [checkingConfig, setCheckingConfig] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [missingConfig, setMissingConfig] = useState<string[]>([]);

  // Edit Teks mode state: explicit textarea
  const [textInput, setTextInput] = useState('');
  const [selectedTextAction, setSelectedTextAction] = useState<AiAction>('polish');

  // Article mode state
  const [selectedArticleAction, setSelectedArticleAction] = useState<AiAction>('outline');

  // Selection tracking for optional "Terapkan"
  const [selectionSnapshot, setSelectionSnapshot] = useState<SelectionSnapshot | null>(null);
  const [isStale, setIsStale] = useState(false);

  // Calculate word count from editor text or article excerpt/title
  const articleWordCount = useMemo(() => {
    const text = editor ? editor.getText() : article.excerpt || article.title || '';
    return text.trim().split(/\s+/).filter(Boolean).length;
  }, [editor, article.excerpt, article.title, isOpen]);

  // Check config and active selection when modal opens
  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      setError(null);
      setCustomHint('');
      setSelectionSnapshot(null);
      setIsStale(false);
      setApplied(false);
      return;
    }

    // Check editor selection to prepopulate textarea if user selected text
    if (editor) {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, ' ').trim();
      if (text.length > 0) {
        setTextInput(text);
        setSelectionSnapshot({ from, to, text });
        setActiveTab('edit_text');
      } else {
        // Keep existing input if any, or default to empty
        if (!textInput) {
          setSelectionSnapshot(null);
        }
      }
    }

    // Fetch AI configuration status (checks both GEMINI_API_KEY and GEMINI_MODEL)
    setCheckingConfig(true);
    fetch('/api/studio/ai', {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setIsConfigured(Boolean(data.configured));
          setMissingConfig(Array.isArray(data.missing) ? data.missing : []);
        } else {
          setIsConfigured(false);
          setMissingConfig(['GEMINI_API_KEY', 'GEMINI_MODEL']);
        }
      })
      .catch(() => {
        setIsConfigured(false);
        setMissingConfig(['GEMINI_API_KEY', 'GEMINI_MODEL']);
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

  const handleProcessText = async () => {
    if (loading || !textInput.trim()) return;

    setError(null);
    setResult(null);
    setCopied(false);
    setApplied(false);
    setLastExecutedAction(selectedTextAction);
    setLoading(true);

    // If text still matches current selection snapshot, keep it for secondary apply
    if (selectionSnapshot && editor) {
      const currentDocText = editor.state.doc.textBetween(selectionSnapshot.from, selectionSnapshot.to, ' ').trim();
      if (currentDocText !== selectionSnapshot.text || textInput.trim() !== selectionSnapshot.text) {
        setIsStale(true);
      } else {
        setIsStale(false);
      }
    } else {
      setIsStale(true); // No active selection to replace directly
    }

    try {
      const res = await fetch('/api/studio/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          action: selectedTextAction,
          selection: textInput.trim(),
          title: article.title || '',
          excerpt: article.excerpt || '',
          body: '',
          customHint,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || 'Terjadi kesalahan saat memproses permintaan AI.');
        return;
      }

      setResult(data.result);
    } catch {
      setError('Gagal menghubungi server. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessArticle = async () => {
    if (loading) return;

    setError(null);
    setResult(null);
    setCopied(false);
    setApplied(false);
    setLastExecutedAction(selectedArticleAction);
    setLoading(true);

    try {
      const plainBody = editor ? editor.getText().slice(0, 8000) : (article.content_html || article.excerpt || '').slice(0, 8000);

      const res = await fetch('/api/studio/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          action: selectedArticleAction,
          selection: '',
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

    // A. Selection Actions: Replace original selection range if still valid
    if (selectionSnapshot && !isStale && SELECTION_ACTIONS.some((a) => a.id === lastExecutedAction)) {
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
    if (lastExecutedAction === 'excerpt') {
      onUpdateArticle({ excerpt: result.replace(/^["']|["']$/g, '').trim() });
      setApplied(true);
      setTimeout(() => onClose(), 700);
      return;
    }

    if (lastExecutedAction === 'seo_meta') {
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
    if (lastExecutedAction === 'outline') {
      editor.chain().focus().insertContent(`\n\n${result}\n\n`).run();
      setApplied(true);
      setTimeout(() => onClose(), 700);
      return;
    }
  };

  if (!isOpen) return null;

  const isSelectionAction = lastExecutedAction
    ? SELECTION_ACTIONS.some((a) => a.id === lastExecutedAction)
    : false;

  const canApplySelection = isSelectionAction && Boolean(selectionSnapshot) && !isStale;
  const canApplyMetadata =
    lastExecutedAction === 'excerpt' ||
    lastExecutedAction === 'seo_meta' ||
    lastExecutedAction === 'outline';

  const canApply = canApplySelection || canApplyMetadata;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-2xl bg-[#111216] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#14151B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-[#6366F1]/20 border border-[#34D399]/30 flex items-center justify-center text-[#34D399]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif font-bold text-[#F8FAFC]">
                  AI Editorial Co‑Pilot
                </h2>
                <span className="text-[10px] font-mono text-[#34D399] bg-[#34D399]/10 px-2 py-0.5 rounded-full border border-[#34D399]/20 font-semibold">
                  Studio Assistant
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Bantuan penyuntingan naskah dengan AI. Hasil tidak akan menimpa editor secara otomatis.
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
              {missingConfig.length > 0 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[11px] text-[#FDE68A] font-mono">
                  <span>Belum terdeteksi di runtime:</span>
                  <span className="font-semibold text-white">{missingConfig.join(', ')}</span>
                </div>
              )}
            </div>
          ) : result ? (
            /* REVIEW PANEL */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#34D399] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Hasil Olah AI</span>
                </span>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Olah Teks Lain</span>
                </button>
              </div>

              {/* Stale Selection Warning Alert (only if user tried to apply to modified text) */}
              {isStale && isSelectionAction && selectionSnapshot && (
                <div className="p-3 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-start gap-2.5 text-xs text-[#FDE68A]">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold text-white">
                      Posisi seleksi teks di editor berubah
                    </strong>
                    <p className="mt-0.5 text-[11px] text-[#FDE68A] leading-relaxed">
                      Teks asli di editor telah berubah atau tidak aktif. Gunakan tombol utama <strong>Salin Hasil</strong> untuk menempelkannya secara manual.
                    </p>
                  </div>
                </div>
              )}

              {/* Result Preview Box */}
              <div className="p-4 rounded-xl bg-[#090A0D] border border-white/10 text-xs text-[#E2E8F0] leading-relaxed whitespace-pre-wrap font-sans max-h-72 overflow-y-auto">
                {result}
              </div>

              {/* Review Action Buttons: Primary is Salin Hasil */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#CBD5E1] font-medium transition-colors"
                >
                  Buang Hasil
                </button>

                <div className="flex items-center gap-2">
                  {/* Secondary Action: Terapkan */}
                  <button
                    type="button"
                    disabled={!canApply || applied}
                    onClick={handleApplyResult}
                    title={
                      !canApply
                        ? 'Terapkan hanya aktif bila ada seleksi teks editor yang masih valid atau aksi metadata artikel.'
                        : 'Terapkan langsung ke naskah'
                    }
                    className={`px-4 py-2 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all border ${
                      !canApply
                        ? 'bg-[#181920] border-white/5 text-[#52525B] cursor-not-allowed opacity-60'
                        : applied
                        ? 'bg-[#10B981]/20 border-[#10B981]/40 text-[#34D399]'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-[#CBD5E1] hover:text-white active:scale-95'
                    }`}
                  >
                    {applied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#34D399]" />
                        <span>Diterapkan!</span>
                      </>
                    ) : (
                      <>
                        <span>Terapkan</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                      </>
                    )}
                  </button>

                  {/* Primary Action: Salin Hasil */}
                  <button
                    type="button"
                    onClick={handleCopyResult}
                    className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#34D399] text-[#022C22] font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] active:scale-95 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-[#022C22]" />
                        <span>Tersalin ke Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#022C22]" />
                        <span>Salin Hasil</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ACTION PICKER: EDIT TEKS VS ARTIKEL & NASKAH */
            <div className="space-y-4">
              {/* Segmented Mode Tabs */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-[#14151B] rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit_text')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'edit_text'
                      ? 'bg-[#22242F] text-[#F8FAFC] shadow-sm border border-white/10'
                      : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-white/5'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Edit Teks</span>
                  {textInput.trim().length > 0 && (
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

              {/* Mode 1: Edit Teks */}
              {activeTab === 'edit_text' && (
                <div className="space-y-4">
                  {/* Textarea Section */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#F8FAFC]">
                        Teks yang ingin diolah
                      </label>
                      <span className="text-[10px] font-mono text-[#71717A]">
                        {textInput.length}/4000
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8]">
                      Salin teks dari editor, tempel di sini, lalu pilih jenis perbaikannya.
                    </p>
                    <textarea
                      rows={4}
                      value={textInput}
                      maxLength={4000}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Tempel kalimat atau paragraf di sini..."
                      className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl p-3 text-xs text-[#F8FAFC] outline-none focus:border-[#34D399]/50 placeholder-[#52525B] leading-relaxed transition-colors resize-y min-h-[100px]"
                    />
                  </div>

                  {/* Action Cards Selection */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
                      Pilih Jenis Perbaikan
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SELECTION_ACTIONS.map((action) => {
                        const isSelected = selectedTextAction === action.id;
                        return (
                          <button
                            key={action.id}
                            type="button"
                            onClick={() => setSelectedTextAction(action.id)}
                            className={`p-3 rounded-xl text-left transition-all relative border ${
                              isSelected
                                ? 'bg-[#10B981]/10 border-[#10B981]/50 text-white shadow-[0_0_12px_rgba(16,185,129,0.15)] ring-1 ring-[#10B981]/40'
                                : 'bg-[#14151B] hover:bg-[#1C1E26] border-white/10 text-[#94A3B8] hover:text-[#E2E8F0]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <strong
                                className={`block text-xs font-semibold ${
                                  isSelected ? 'text-[#34D399]' : 'text-[#F8FAFC]'
                                }`}
                              >
                                {action.label}
                              </strong>
                              {isSelected && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] flex-shrink-0 mt-0.5" />
                              )}
                            </div>
                            <span className="text-[11px] text-[#71717A] block mt-0.5 leading-snug">
                              {action.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional Custom Hint */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-semibold text-[#94A3B8]">
                      Arahan Khusus (Opsional)
                    </label>
                    <input
                      type="text"
                      maxLength={150}
                      value={customHint}
                      placeholder="Contoh: Lebih tajam, gunakan analogi arsitektur..."
                      onChange={(e) => setCustomHint(e.target.value)}
                      className="w-full h-9 bg-[#0A0B0E] border border-white/10 rounded-xl px-3 text-xs text-[#F8FAFC] outline-none focus:border-[#34D399]/50 placeholder-[#52525B] transition-colors"
                    />
                  </div>

                  {/* Sticky Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={loading || !textInput.trim()}
                      onClick={handleProcessText}
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-[#022C22] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <LoaderCircle className="w-4 h-4 animate-spin text-[#022C22]" />
                          <span>Memproses Teks...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-[#022C22]" />
                          <span>Proses Teks</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Mode 2: Artikel & Naskah */}
              {activeTab === 'article' && (
                <div className="space-y-4">
                  {/* Source Metadata Card */}
                  <div className="p-3.5 rounded-xl bg-[#0A0B0E] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#818CF8]" />
                        <span className="text-xs font-semibold text-white truncate max-w-[280px]">
                          {article.title || 'Naskah Tanpa Judul'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#94A3B8]">
                          {articleWordCount} kata
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                            article.status === 'published'
                              ? 'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30'
                              : 'bg-white/5 text-[#94A3B8] border border-white/10'
                          }`}
                        >
                          {article.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#71717A] leading-relaxed">
                      AI akan menganalisis naskah yang sedang terbuka. Artikel tidak akan diubah otomatis.
                    </p>
                  </div>

                  {/* Article Action Selection */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
                      Pilih Aksi Naskah
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ARTICLE_ACTIONS.map((action) => {
                        const isSelected = selectedArticleAction === action.id;
                        return (
                          <button
                            key={action.id}
                            type="button"
                            onClick={() => setSelectedArticleAction(action.id)}
                            className={`p-3 rounded-xl text-left transition-all relative border ${
                              isSelected
                                ? 'bg-[#6366F1]/15 border-[#818CF8]/60 text-white shadow-[0_0_12px_rgba(99,102,241,0.2)] ring-1 ring-[#818CF8]/50'
                                : 'bg-[#14151B] hover:bg-[#1C1E26] border-white/10 text-[#94A3B8] hover:text-[#E2E8F0]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <strong
                                className={`block text-xs font-semibold ${
                                  isSelected ? 'text-[#A5B4FC]' : 'text-[#F8FAFC]'
                                }`}
                              >
                                {action.label}
                              </strong>
                              {isSelected && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#818CF8] flex-shrink-0 mt-0.5" />
                              )}
                            </div>
                            <span className="text-[11px] text-[#71717A] block mt-0.5 leading-snug">
                              {action.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional Custom Hint */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-semibold text-[#94A3B8]">
                      Arahan Khusus (Opsional)
                    </label>
                    <input
                      type="text"
                      maxLength={150}
                      value={customHint}
                      placeholder="Contoh: Target audiens pemula web development..."
                      onChange={(e) => setCustomHint(e.target.value)}
                      className="w-full h-9 bg-[#0A0B0E] border border-white/10 rounded-xl px-3 text-xs text-[#F8FAFC] outline-none focus:border-[#818CF8]/50 placeholder-[#52525B] transition-colors"
                    />
                  </div>

                  {/* Sticky Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleProcessArticle}
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#818CF8] hover:to-[#6366F1] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.25)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <LoaderCircle className="w-4 h-4 animate-spin text-white" />
                          <span>Menganalisis Naskah...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-white" />
                          <span>Proses Naskah</span>
                        </>
                      )}
                    </button>
                  </div>
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
