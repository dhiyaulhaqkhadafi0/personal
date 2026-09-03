"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  AlertTriangle,
  LoaderCircle,
  Clock,
  FileText,
  Video,
  Layers,
  MessageSquare,
  HelpCircle,
  Share2,
  Film,
  Camera,
  Monitor,
  ExternalLink,
  Info,
} from "lucide-react";
import type { Editor } from "@tiptap/react";
import type { StudioArticle } from "@/lib/blog-types";
import {
  type RepurposingPlatform,
  type ContentGoal,
  type ContentTone,
  type ContentCta,
  type RepurposingResponse,
  type RepurposingSection,
  REPURPOSING_PLATFORMS,
  CONTENT_GOALS,
  CONTENT_TONES,
  CONTENT_CTAS,
} from "@/lib/repurposing-types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  article: StudioArticle;
  authToken: string;
};

export function StudioRepurposeModal({
  isOpen,
  onClose,
  editor,
  article,
  authToken,
}: Props) {
  // Config status
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [checkingConfig, setCheckingConfig] = useState(false);

  // Settings state
  const [selectedPlatform, setSelectedPlatform] = useState<RepurposingPlatform>("threads");
  const [selectedGoal, setSelectedGoal] = useState<ContentGoal>("awareness");
  const [selectedTone, setSelectedTone] = useState<ContentTone>("natural");
  const [selectedCta, setSelectedCta] = useState<ContentCta>("discussion");

  // Output & Loading state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RepurposingResponse | null>(null);
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  // Snapshot tracking for stale detection
  const snapshotArticleId = useRef<string>(article.id);
  const snapshotText = useRef<string>("");
  const [isSnapshotStale, setIsSnapshotStale] = useState(false);

  // AbortController ref for in-flight request cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  const isPublished = article.status === "published";

  // Helper to extract plain text
  const getArticleText = () => {
    if (editor) {
      return editor.getText().trim();
    }
    return article.excerpt || article.title;
  };

  // Check config on modal open
  useEffect(() => {
    if (!isOpen) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setLoading(false);
      setConfirmDiscard(false);
      return;
    }

    setCheckingConfig(true);
    fetch("/api/studio/repurpose", {
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
  }, [isOpen, authToken]);

  // Handle article change: cancel previous in-flight request & reset results
  useEffect(() => {
    if (snapshotArticleId.current !== article.id) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      snapshotArticleId.current = article.id;
      snapshotText.current = getArticleText();
      setResult(null);
      setError(null);
      setLoading(false);
      setIsSnapshotStale(false);
      setConfirmDiscard(false);
    }
  }, [article.id]);

  // Check if current editor content differs from snapshot taken during generation
  useEffect(() => {
    if (!result) {
      setIsSnapshotStale(false);
      return;
    }
    const currentText = getArticleText();
    if (snapshotText.current && currentText !== snapshotText.current) {
      setIsSnapshotStale(true);
    } else {
      setIsSnapshotStale(false);
    }
  }, [article.title, article.excerpt, result]);

  // Auto-adjust CTA if draft and 'read_article' was selected
  useEffect(() => {
    if (!isPublished && selectedCta === "read_article") {
      setSelectedCta("discussion");
    }
  }, [isPublished, selectedCta]);

  const handleGenerate = async () => {
    if (loading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setConfirmDiscard(false);

    const bodyText = getArticleText();
    snapshotText.current = bodyText;
    setIsSnapshotStale(false);

    try {
      const res = await fetch("/api/studio/repurpose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          platform: selectedPlatform,
          goal: selectedGoal,
          tone: selectedTone,
          cta: selectedCta,
          article: {
            title: article.title,
            excerpt: article.excerpt,
            body: bodyText,
            category: article.category,
            slug: article.slug,
            status: article.status,
            canonical_url: isPublished ? `https://khadafi.my.id/blog/${article.slug}` : undefined,
          },
        }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Gagal membuat turunan konten.");
      }

      setResult(data.data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memproses konten.");
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCopySection = (section: RepurposingSection) => {
    let textToCopy = section.content;
    if (section.on_screen_text) {
      textToCopy = `[Teks Layar]: ${section.on_screen_text}\n[Voice-over]: ${section.content}`;
    }
    if (section.visual_note) {
      textToCopy += `\n(Catatan visual: ${section.visual_note})`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedSectionId(section.id);
    setTimeout(() => setCopiedSectionId(null), 2000);
  };

  const handleCopyCaption = () => {
    if (!result?.caption) return;
    navigator.clipboard.writeText(result.caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyAll = () => {
    if (!result) return;

    let fullOutput = "";

    if (result.platform === "instagram") {
      fullOutput = result.sections
        .map((s, idx) => {
          let str = `--- ${s.label.toUpperCase()} ---\n${s.content}`;
          if (s.visual_note) str += `\n[Visual]: ${s.visual_note}`;
          return str;
        })
        .join("\n\n");

      if (result.caption) {
        fullOutput += `\n\n--- CAPTION INSTAGRAM ---\n${result.caption}`;
      }
    } else if (result.platform === "tiktok") {
      fullOutput = result.sections
        .map((s) => {
          let str = `--- ${s.label.toUpperCase()} ---`;
          if (s.on_screen_text) str += `\n[Teks Layar]: ${s.on_screen_text}`;
          str += `\n[VO]: ${s.content}`;
          if (s.visual_note) str += `\n[Visual / B-Roll]: ${s.visual_note}`;
          return str;
        })
        .join("\n\n");

      if (result.caption) {
        fullOutput += `\n\n[Caption]: ${result.caption}`;
      }
    } else if (result.platform === "x" || result.platform === "threads") {
      fullOutput = result.sections.map((s) => s.content).join("\n\n---\n\n");
    } else {
      fullOutput = result.sections.map((s) => s.content).join("\n\n");
    }

    navigator.clipboard.writeText(fullOutput);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDiscard = () => {
    if (!confirmDiscard) {
      setConfirmDiscard(true);
      return;
    }
    setResult(null);
    setError(null);
    setConfirmDiscard(false);
  };

  if (!isOpen) return null;

  const currentPlatformConfig = REPURPOSING_PLATFORMS.find((p) => p.id === selectedPlatform)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] max-h-[900px] flex flex-col rounded-2xl bg-[#090A0D] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#111217] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#F8FAFC]">
                  AI Content Repurposing
                </h2>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#94A3B8]">
                  Phase 1H
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Ubah satu naskah menjadi konten siap review untuk berbagai platform.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#71717A] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Tutup modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Body: 3-column responsive layout */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden bg-[#0A0B0E]">
          {/* Column 1: Platform Selector */}
          <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#0E1015]/60 p-4 flex flex-col flex-shrink-0 overflow-y-auto">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-3 px-1">
              Pilih Platform
            </span>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {REPURPOSING_PLATFORMS.map((platform) => {
                const isSelected = selectedPlatform === platform.id;
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlatform(platform.id);
                      setConfirmDiscard(false);
                    }}
                    className={`flex flex-col text-left p-3 rounded-xl transition-all border ${
                      isSelected
                        ? "bg-[#F59E0B]/10 border-[#F59E0B]/40 text-[#F8FAFC] shadow-sm"
                        : "bg-[#14151B]/50 hover:bg-[#181A22] border-white/5 hover:border-white/15 text-[#94A3B8] hover:text-[#E2E8F0]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-semibold text-white">
                        {platform.name}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected
                            ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                            : "bg-white/5 text-[#71717A]"
                        }`}
                      >
                        {platform.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#71717A] line-clamp-2 leading-relaxed">
                      {platform.tagline}
                    </p>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Column 2: Settings Panel */}
          <section className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#0C0D12] p-5 flex flex-col flex-shrink-0 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
                Strategi Konten
              </span>
              <span className="text-[11px] font-mono text-[#34D399]">
                {currentPlatformConfig.name}
              </span>
            </div>

            <div className="space-y-5 flex-1">
              {/* Goal Setting */}
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-2">
                  Tujuan Konten
                </label>
                <div className="space-y-1.5">
                  {CONTENT_GOALS.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all border ${
                        selectedGoal === goal.id
                          ? "bg-[#34D399]/10 border-[#34D399]/40 text-[#34D399] font-medium"
                          : "bg-[#14151B] border-white/5 hover:border-white/15 text-[#94A3B8]"
                      }`}
                    >
                      {goal.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone Setting */}
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-2">
                  Gaya Bahasa
                </label>
                <div className="space-y-1.5">
                  {CONTENT_TONES.map((tone) => (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setSelectedTone(tone.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all border ${
                        selectedTone === tone.id
                          ? "bg-[#34D399]/10 border-[#34D399]/40 text-[#34D399] font-medium"
                          : "bg-[#14151B] border-white/5 hover:border-white/15 text-[#94A3B8]"
                      }`}
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Setting */}
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-2">
                  Call to Action (CTA)
                </label>
                <div className="space-y-1.5">
                  {CONTENT_CTAS.map((cta) => {
                    const isDisabled = Boolean(cta.requiresPublished && !isPublished);
                    return (
                      <button
                        key={cta.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setSelectedCta(cta.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all border flex items-center justify-between ${
                          selectedCta === cta.id
                            ? "bg-[#34D399]/10 border-[#34D399]/40 text-[#34D399] font-medium"
                            : isDisabled
                            ? "bg-transparent border-white/5 text-[#4B5563] cursor-not-allowed opacity-60"
                            : "bg-[#14151B] border-white/5 hover:border-white/15 text-[#94A3B8]"
                        }`}
                        title={isDisabled ? "Hanya tersedia untuk artikel yang sudah published" : cta.description}
                      >
                        <span>{cta.label}</span>
                        {isDisabled && (
                          <span className="text-[9px] font-mono uppercase bg-white/5 px-1.5 py-0.5 rounded text-[#71717A]">
                            Draft
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {!isPublished && (
                  <p className="text-[10px] text-[#71717A] mt-1.5 italic">
                    * &apos;Baca artikel&apos; dinonaktifkan karena naskah ini masih berstatus draft.
                  </p>
                )}
              </div>
            </div>

            {/* Generate Action Button */}
            <div className="pt-5 mt-5 border-t border-white/10">
              <button
                type="button"
                disabled={loading || isConfigured === false}
                onClick={handleGenerate}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-[#1E1B10] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin text-[#1E1B10]" />
                    <span>Menghasilkan Draft...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Buat Draft {currentPlatformConfig.name}</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-[#71717A] text-center mt-2">
                1 platform per request &bull; tidak mengubah naskah asli
              </p>
            </div>
          </section>

          {/* Column 3: Results Preview Panel */}
          <main className="flex-1 flex flex-col overflow-hidden bg-[#07080A]">
            {/* Unconfigured Alert */}
            {isConfigured === false && !checkingConfig && (
              <div className="m-6 p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-[#FCA5A5]">
                  <strong className="block text-sm font-semibold mb-1 text-white">
                    Penyedia AI Belum Dikonfigurasi
                  </strong>
                  Kunci <code>GEMINI_API_KEY</code> atau <code>GEMINI_MODEL</code> belum diatur pada environment server. Hubungi pengelola untuk mengaktifkan fitur ini.
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="m-6 p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-[#FCA5A5] leading-relaxed">
                    <strong className="block text-sm font-semibold mb-1 text-white">
                      Gagal Menghasilkan Konten
                    </strong>
                    {error}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="px-3 py-1.5 rounded-lg bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors flex-shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Coba Lagi</span>
                </button>
              </div>
            )}

            {/* Empty State */}
            {!result && !loading && !error && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#71717A] mb-4">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-[#E2E8F0] mb-1">
                  Draft Belum Dibuat
                </h3>
                <p className="text-xs text-[#71717A] max-w-md leading-relaxed">
                  Pilih platform di sisi kiri, tentukan tujuan dan gaya bahasa di panel tengah, lalu tekan tombol{" "}
                  <strong className="text-white font-medium">&ldquo;Buat Draft&rdquo;</strong> untuk memulai.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2 text-[11px] font-mono text-[#94A3B8]">
                  <span className="px-2.5 py-1 rounded-full bg-[#14151B] border border-white/10">
                    Naskah: {article.title || "Untitled story"}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#14151B] border border-white/10">
                    Status: {article.status.toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {/* Loading State Skeleton */}
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] mb-4">
                  <LoaderCircle className="w-6 h-6 animate-spin" />
                </div>
                <h3 className="text-sm font-semibold text-[#E2E8F0] mb-1">
                  Menyusun Turunan Konten {currentPlatformConfig.name}...
                </h3>
                <p className="text-xs text-[#71717A] max-w-sm">
                  AI sedang membedah naskah, menyaring insight, dan mengadaptasi ke struktur perilaku platform.
                </p>
              </div>
            )}

            {/* Results Display */}
            {result && !loading && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Result Header & Actions */}
                <div className="px-6 py-3.5 border-b border-white/10 bg-[#0E1015] flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-white">
                      {result.title}
                    </span>

                    {result.estimated_duration_seconds && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/20">
                        <Clock className="w-3 h-3" />
                        ~{result.estimated_duration_seconds} detik
                      </span>
                    )}

                    {result.word_count && (
                      <span className="text-[11px] font-mono text-[#71717A] hidden sm:inline">
                        {result.word_count} kata
                      </span>
                    )}

                    {isSnapshotStale && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-[#F59E0B] bg-[#F59E0B]/15 px-2 py-0.5 rounded border border-[#F59E0B]/30">
                        <Info className="w-3 h-3" />
                        Bersumber dari versi naskah sebelumnya
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyAll}
                      className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#34D399]/15 hover:bg-[#34D399]/25 text-[#34D399] border border-[#34D399]/30 text-xs font-semibold transition-all shadow-sm"
                    >
                      {copiedAll ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Semua</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleGenerate}
                      title="Generate ulang draft ini"
                      className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white border border-white/10 text-xs font-medium transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Generate Ulang</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDiscard}
                      title="Buang hasil ini"
                      className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-xs font-medium transition-colors ${
                        confirmDiscard
                          ? "bg-[#EF4444]/20 border-[#EF4444]/40 text-[#EF4444]"
                          : "bg-white/5 hover:bg-[#EF4444]/15 border-white/10 hover:border-[#EF4444]/30 text-[#94A3B8] hover:text-[#EF4444]"
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{confirmDiscard ? "Yakin Buang?" : "Buang"}</span>
                    </button>
                  </div>
                </div>

                {/* Warnings Area (if any) */}
                {result.warnings && result.warnings.length > 0 && (
                  <div className="px-6 py-2.5 bg-[#F59E0B]/10 border-b border-[#F59E0B]/20 text-[11px] text-[#FDE68A] flex flex-col gap-1">
                    {result.warnings.map((w, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-[#F59E0B]" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Scrollable Sections List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {/* Caption Section if available */}
                  {result.caption && (
                    <div className="p-4 rounded-xl bg-[#14151B] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono uppercase text-[#34D399] tracking-wider font-semibold">
                            Caption Postingan
                          </span>
                          <span className="text-[10px] font-mono text-[#71717A]">
                            ({result.caption.length} karakter)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyCaption}
                          className="flex items-center gap-1 text-[11px] text-[#94A3B8] hover:text-[#34D399] font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          {copiedCaption ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCaption ? "Tersalin" : "Salin Caption"}</span>
                        </button>
                      </div>
                      <p className="text-xs text-[#CBD5E1] whitespace-pre-wrap leading-relaxed font-sans">
                        {result.caption}
                      </p>
                    </div>
                  )}

                  {/* Section Cards */}
                  {result.sections.map((section, idx) => {
                    const isCopied = copiedSectionId === section.id;
                    const charCount = section.char_count ?? section.content.length;
                    const isOverLimit =
                      (result.platform === "x" && charCount > 280) ||
                      (result.platform === "threads" && charCount > 500);

                    return (
                      <div
                        key={section.id || idx}
                        className="p-4 rounded-xl bg-[#101116] border border-white/10 hover:border-white/20 transition-all space-y-3 group"
                      >
                        {/* Section Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white">
                              {section.label}
                            </span>
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-[#94A3B8]">
                              {section.type}
                            </span>
                            <span
                              className={`text-[10px] font-mono ${
                                isOverLimit ? "text-[#EF4444] font-bold" : "text-[#71717A]"
                              }`}
                            >
                              {charCount} kar
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopySection(section)}
                            className="flex items-center gap-1 text-xs text-[#94A3B8] group-hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 text-[#34D399]" />
                                <span className="text-[#34D399] font-medium">Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* On Screen Text (Video format) */}
                        {section.on_screen_text && (
                          <div className="px-3 py-2 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-start gap-2 text-xs text-[#FDE68A]">
                            <Monitor className="w-3.5 h-3.5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                            <div>
                              <strong className="block text-[10px] font-mono uppercase text-[#F59E0B]">
                                Teks Pada Layar:
                              </strong>
                              <span>{section.on_screen_text}</span>
                            </div>
                          </div>
                        )}

                        {/* Content Body */}
                        <div className="text-xs sm:text-sm text-[#E2E8F0] whitespace-pre-wrap leading-relaxed font-sans">
                          {section.content}
                        </div>

                        {/* Visual Note (Carousel / Video B-Roll) */}
                        {section.visual_note && (
                          <div className="pt-2 border-t border-white/5 flex items-start gap-2 text-[11px] text-[#94A3B8] font-mono">
                            <Camera className="w-3 h-3 text-[#34D399] flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-[#34D399]">Visual:</strong> {section.visual_note}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* CTA Footer Card */}
                  {result.cta && (
                    <div className="p-3.5 rounded-xl bg-[#34D399]/10 border border-[#34D399]/25 flex items-center justify-between text-xs text-[#A7F3D0]">
                      <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-[#34D399]" />
                        <span>
                          <strong className="font-semibold text-white">Ajakan Bertindak (CTA):</strong>{" "}
                          {result.cta}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(result.cta);
                        }}
                        className="text-[11px] font-mono text-[#34D399] hover:underline"
                      >
                        Salin CTA
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
