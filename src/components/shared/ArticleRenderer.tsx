import { Lora, Plus_Jakarta_Sans } from 'next/font/google';
import { Clock } from 'lucide-react';
import { EditorialCover } from '@/components/shared/EditorialCover';
import { resolveArticleCover } from '@/lib/blog-types';

const lora = Lora({ subsets: ['latin'], style: ['normal', 'italic'] });
const sans = Plus_Jakarta_Sans({ subsets: ['latin'] });

export type ArticleData = {
  title: string;
  excerpt: string;
  category: string;
  reading_time: number;
  date: string;
  slug?: string;
  cover_url?: string | null;
  cover_image?: string | null;
  cover_slides?: string[] | unknown;
  content_json?: unknown;
  content?: string | null;
  content_html?: string | null;
  image?: string | null;
  theme?: string;
  music_enabled?: boolean;
  music_uri?: string;
};

type Props = {
  article: ArticleData;
  contentHtml?: string;
  children?: React.ReactNode;
  footerContent?: React.ReactNode;
  previewMode?: boolean;
};

export function ArticleRenderer({ article, contentHtml, children, footerContent, previewMode = false }: Props) {
  const resolvedCover = resolveArticleCover(article);
  const spotifyId = article.music_uri?.match(/(?:spotify:playlist:|open\.spotify\.com\/playlist\/)([a-zA-Z0-9]+)/)?.[1];

  return (
    <article className={`relative bg-[#111113]/90 backdrop-blur-3xl rounded-[2rem] border border-[#27272A]/40 shadow-2xl p-6 md:p-12 lg:p-14 h-full w-full ${sans.className} ${previewMode ? 'studio-preview-renderer' : ''} theme-${article.theme || 'midnight'}`}>
      <header className="mb-12 md:mb-14">
        {/* 1. Cover Editorial 16:9 with Premium Fallback (never overlaid with title) */}
        <div className="w-full mb-8 md:mb-10 overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
          <EditorialCover
            src={resolvedCover}
            alt={`Cover artikel ${article.title || 'Untitled story'}`}
            title={article.title}
            category={article.category}
            slug={article.slug}
            aspectRatio="aspect-[16/9]"
            className="w-full max-h-[440px]"
            priority={true}
            variant="hero"
          />
        </div>

        {/* 2. Category & Date & Reading Time Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-mono tracking-wide mb-6 text-[#9CA3AF]">
          <span className="text-[#34D399] uppercase font-medium bg-[#34D399]/10 px-3.5 py-1 rounded-full border border-[#34D399]/20">
            {article.category || 'Ideas'}
          </span>
          {article.date && (
            <>
              <span className="w-1 h-1 rounded-full bg-[#3F3F46]" />
              <span className="text-[#71717A]">
                {new Date(article.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </>
          )}
          {article.reading_time > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-[#3F3F46]" />
              <span className="text-[#71717A] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#34D399]" /> {article.reading_time} min read
              </span>
            </>
          )}
        </div>

        {/* 3. Big Article Title */}
        <h1 className={`text-3xl sm:text-4xl md:text-[2.85rem] leading-[1.2] text-[#F8FAFC] font-medium tracking-tight mb-6 ${lora.className}`}>
          {article.title || 'Untitled story'}
        </h1>

        {/* 4. Excerpt / Deck */}
        {article.excerpt && (
          <p className="text-lg md:text-xl text-[#A1A1AA] font-light leading-relaxed border-l-2 border-[#34D399]/30 pl-6 italic mb-8">
            {article.excerpt}
          </p>
        )}

        {/* 5. Author Metadata */}
        <div className="flex items-center gap-3 pt-6 border-t border-[#27272A]/50 text-xs font-mono text-[#9CA3AF]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#34D399]/20 to-[#6366F1]/20 border border-[#34D399]/30 flex items-center justify-center font-bold text-[#34D399] text-xs">
            DK
          </div>
          <div className="flex flex-col">
            <span className="text-[#E2E8F0] font-medium">Daffa Khadafi</span>
            <span className="text-[#71717A] text-[11px]">AI-Assisted Product Engineer</span>
          </div>
        </div>
      </header>

      {/* 6. Body Article (Comfortable reading measure: max 720px) */}
      <div className={`prose prose-invert max-w-[720px] mx-auto
        prose-p:text-[#D1D5DB] prose-p:leading-[1.95] prose-p:text-[1.08rem] ${lora.className}
        prose-headings:font-sans prose-headings:font-medium prose-headings:text-[#F8FAFC] prose-headings:tracking-tight
        prose-h2:text-[1.85rem] prose-h2:mt-16 prose-h2:mb-6
        prose-h3:text-[1.4rem] prose-h3:mt-10 prose-h3:mb-4
        prose-a:text-[#34D399] prose-a:font-sans prose-a:no-underline hover:prose-a:underline hover:prose-a:decoration-[#34D399]/50
        prose-strong:text-[#F8FAFC] prose-strong:font-semibold
        prose-blockquote:border-l-[#34D399]/40 prose-blockquote:bg-[#18181B]/60 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:font-style-italic prose-blockquote:text-[#A1A1AA]
        prose-code:text-[#34D399] prose-code:bg-[#09090B] prose-code:font-sans prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-[#09090B] prose-pre:border prose-pre:border-[#27272A]/50 prose-pre:font-sans prose-pre:shadow-inner
        prose-hr:border-[#27272A]/50 prose-hr:my-16
      `}>
        {contentHtml ? <div dangerouslySetInnerHTML={{ __html: contentHtml }} /> : children}
      </div>

      {/* Spotify Atmospheric Player */}
      {article.music_enabled && spotifyId && (
        <div className="max-w-[720px] mx-auto mt-16 pt-8 border-t border-[#27272A]/50">
          <iframe 
            title="Spotify atmosphere" 
            loading="lazy" 
            src={`https://open.spotify.com/embed/playlist/${spotifyId}?theme=0`} 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            className="w-full h-[152px] rounded-xl"
          />
        </div>
      )}

      {footerContent && (
        <div className="max-w-[720px] mx-auto">
          {footerContent}
        </div>
      )}
    </article>
  );
}
