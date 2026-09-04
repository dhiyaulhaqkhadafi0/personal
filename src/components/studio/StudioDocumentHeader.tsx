"use client";

import { useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import { slugify, type StudioArticle } from "@/lib/blog-types";

type Props = {
  article: StudioArticle;
  onUpdate: (patch: Partial<StudioArticle>) => void;
};

export function StudioDocumentHeader({ article, onUpdate }: Props) {
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const deckRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize title textarea on input and article changes
  const adjustTitleHeight = () => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  };

  // Auto-resize deck textarea on input and article changes
  const adjustDeckHeight = () => {
    if (deckRef.current) {
      deckRef.current.style.height = "auto";
      deckRef.current.style.height = `${deckRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTitleHeight();
    adjustDeckHeight();
  }, [article.id, article.title, article.excerpt]);

  return (
    <header className="studio-doc-header mb-6 select-none">
      {/* 1. Compact Editorial Metadata */}
      <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-[#71717A] tracking-wider mb-4">
        <span
          className={`px-2.5 py-0.5 rounded-full border text-[11px] uppercase font-semibold ${
            article.status === "published"
              ? "bg-[#34D399]/10 border-[#34D399]/30 text-[#34D399]"
              : "bg-white/5 border-white/10 text-[#A1A1AA]"
          }`}
        >
          {article.status === "published" ? "Published" : "Draft"}
        </span>

        <span className="w-1 h-1 rounded-full bg-[#3F3F46]" />

        <span className="text-[#34D399] uppercase font-medium bg-[#34D399]/5 px-2.5 py-0.5 rounded border border-[#34D399]/15">
          {article.category || "Ideas"}
        </span>

        <span className="w-1 h-1 rounded-full bg-[#3F3F46]" />

        <span className="flex items-center gap-1.5 text-[#94A3B8]">
          <Clock className="w-3.5 h-3.5 text-[#34D399]" />
          <span>{article.reading_time || 1} min read</span>
        </span>

        <span className="w-1 h-1 rounded-full bg-[#3F3F46]" />

        <span className="text-[#71717A]">{article.word_count || 0} kata</span>
      </div>

      {/* 2. Auto-resizing Massive Editorial Title */}
      <textarea
        ref={titleRef}
        rows={1}
        value={article.title}
        placeholder="Judul naskah..."
        onChange={(e) => {
          const nextTitle = e.target.value;
          const oldTitle = article.title || '';
          const oldDefaultSlug = slugify(oldTitle);
          const currentSlug = article.slug || '';
          const isAutoSlug = !currentSlug || currentSlug === oldDefaultSlug || currentSlug.startsWith('untitled-');
          const nextSlug = isAutoSlug ? slugify(nextTitle) || 'untitled-story' : currentSlug;

          onUpdate({
            title: nextTitle,
            slug: nextSlug,
            seo_title: article.seo_title === article.title || !article.seo_title ? nextTitle : article.seo_title,
          });
          adjustTitleHeight();
        }}
        onInput={adjustTitleHeight}
        className="studio-title-textarea w-full bg-transparent border-0 outline-none resize-none font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#F8FAFC] placeholder-[#3F3F46] leading-[1.12] p-0 block transition-colors"
      />

      {/* 3. Deck / Subtitle Input (Synchronized with article.excerpt) */}
      <div className="mt-4">
        <textarea
          ref={deckRef}
          rows={2}
          value={article.excerpt}
          placeholder="Tulis ringkasan singkat yang mengundang pembaca masuk ke artikel ini…"
          onChange={(e) => {
            const nextExcerpt = e.target.value;
            onUpdate({
              excerpt: nextExcerpt,
              seo_description: article.seo_description === article.excerpt || !article.seo_description ? nextExcerpt : article.seo_description,
            });
            adjustDeckHeight();
          }}
          onInput={adjustDeckHeight}
          className="studio-deck-textarea w-full bg-transparent border-0 border-l-2 border-[#34D399]/30 pl-4 py-1 text-base sm:text-lg text-[#94A3B8] font-light italic leading-relaxed outline-none resize-none placeholder-[#474B57] block transition-colors focus:border-[#34D399]"
        />
      </div>

      {/* 4. Elegant Thin Divider */}
      <div className="w-16 h-[1.5px] bg-gradient-to-r from-[#34D399]/50 via-[#818CF8]/30 to-transparent mt-6 mb-8" />
    </header>
  );
}
