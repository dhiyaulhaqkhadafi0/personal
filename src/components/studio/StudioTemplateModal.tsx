"use client";

import { useState, useEffect } from 'react';
import { X, FileText, LayoutTemplate, BookOpen, Lightbulb, Compass, ArrowRight, LoaderCircle } from 'lucide-react';
import { STUDIO_TEMPLATES, type StudioTemplate } from '@/lib/studio-templates';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: StudioTemplate) => Promise<void>;
  isCreating: boolean;
};

const TEMPLATE_ICONS: Record<string, typeof FileText> = {
  blank: FileText,
  reflection: Lightbulb,
  guide: Compass,
  'case-study': BookOpen,
};

export function StudioTemplateModal({
  isOpen,
  onClose,
  onSelectTemplate,
  isCreating,
}: Props) {
  const [selectedId, setSelectedId] = useState<string>('blank');

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isCreating) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isCreating, onClose]);

  if (!isOpen) return null;

  const activeTemplate = STUDIO_TEMPLATES.find((t) => t.id === selectedId) || STUDIO_TEMPLATES[0];

  const handleConfirm = async () => {
    if (isCreating) return;
    await onSelectTemplate(activeTemplate);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isCreating) onClose();
      }}
    >
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0F1015] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-[#14151B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#34D399]/10 border border-[#34D399]/20 flex items-center justify-center text-[#34D399]">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 id="template-modal-title" className="text-base font-bold text-[#F8FAFC]">
                Pilih Struktur Naskah Baru
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Mulai menulis dengan kanvas bersih atau gunakan kerangka editorial teruji
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isCreating}
            title="Tutup (Esc)"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#71717A] hover:text-[#F8FAFC] hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Templates Grid Container */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#27272A] scrollbar-track-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STUDIO_TEMPLATES.map((tmpl) => {
              const Icon = TEMPLATE_ICONS[tmpl.id] || FileText;
              const isSelected = tmpl.id === selectedId;

              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedId(tmpl.id)}
                  onDoubleClick={() => void onSelectTemplate(tmpl)}
                  className={`group relative p-5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#181922] border-[#34D399]/50 shadow-[0_0_20px_rgba(52,211,153,0.08)] ring-1 ring-[#34D399]/40'
                      : 'bg-[#121319] hover:bg-[#161720] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div>
                    {/* Top Row: Icon & Badge */}
                    <div className="flex items-center justify-between mb-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30'
                            : 'bg-white/5 text-[#94A3B8] border border-white/5 group-hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full font-semibold border ${
                          isSelected
                            ? 'bg-[#34D399]/15 text-[#34D399] border-[#34D399]/30'
                            : 'bg-white/5 text-[#71717A] border-white/5'
                        }`}
                      >
                        {tmpl.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3
                      className={`text-sm font-bold transition-colors ${
                        isSelected ? 'text-[#F8FAFC]' : 'text-[#E2E8F0] group-hover:text-white'
                      }`}
                    >
                      {tmpl.name}
                    </h3>
                    <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed line-clamp-2">
                      {tmpl.description}
                    </p>
                  </div>

                  {/* Bottom: Structure tags */}
                  <div className="mt-4 pt-3.5 border-t border-white/5">
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-[#64748B] mb-2 font-semibold">
                      Komponen Naskah:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tmpl.structureTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-[#94A3B8] border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Radio Indicator (top-right selection dot) */}
                  <div
                    className={`absolute top-4 right-4 w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#34D399] bg-[#34D399]'
                        : 'border-white/20 bg-transparent group-hover:border-white/40'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0F1015]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-[#121319]">
          <span className="text-xs text-[#71717A] hidden sm:block">
            Tip: Klik ganda pada kartu untuk langsung mulai menulis.
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              disabled={isCreating}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={isCreating}
              onClick={() => void handleConfirm()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#10B981] hover:bg-[#34D399] text-[#022C22] flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(52,211,153,0.35)] active:scale-95 disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                  <span>Membuat Naskah...</span>
                </>
              ) : (
                <>
                  <span>Gunakan Template Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
