import Link from 'next/link';
import { Lora, Plus_Jakarta_Sans } from 'next/font/google';
import { Clock, ArrowUpRight } from 'lucide-react';
import { EditorialCover } from '@/components/shared/EditorialCover';
import { ArticleShareButtons } from '@/components/blog/ArticleShareButtons';
import {
  resolveArticleCover,
  extractVisualSettings,
  extractDistributionSettings,
  isCtaCompleteAndEnabled,
  formatCreditDisplay,
  type VisualSettings,
  type DistributionSettings,
} from '@/lib/blog-types';

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
  visual_settings?: VisualSettings;
  distribution_settings?: DistributionSettings;
};

type Props = {
  article: ArticleData;
  contentHtml?: string;
  children?: React.ReactNode;
  footerContent?: React.ReactNode;
  previewMode?: boolean;
};

function CoverCaptionCredit({
  caption,
  credit,
  className = '',
}: {
  caption?: string;
  credit?: string;
  className?: string;
}) {
  const displayCredit = formatCreditDisplay(credit);
  const cleanCaption = (caption || '').replace(/<[^>]*>/g, '').trim();

  if (!cleanCaption && !displayCredit) return null;

  return (
    <figcaption className={`mt-3 px-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs ${className}`}>
      {cleanCaption ? (
        <span className="text-[#CBD5E1] text-xs font-normal leading-relaxed">{cleanCaption}</span>
      ) : (
        <span />
      )}
      {displayCredit && (
        <span className="text-[#71717A] text-[11px] italic font-sans ml-auto">
          Foto: {displayCredit}
        </span>
      )}
    </figcaption>
  );
}

export function ArticleRenderer({ article, contentHtml, children, footerContent, previewMode = false }: Props) {
  const resolvedCover = resolveArticleCover(article);
  const spotifyId = article.music_uri?.match(/(?:spotify:playlist:|open\.spotify\.com\/playlist\/)([a-zA-Z0-9]+)/)?.[1];

  const visualSettings = extractVisualSettings(article.visual_settings || article.content_json || article);
  const { focal_point, hero_layout, caption, credit, alt_text } = visualSettings;
  const altText = alt_text?.trim() || article.title || 'Cover artikel';

  const distributionSettings = extractDistributionSettings(
    article.distribution_settings || article.content_json || article
  );

  const renderMetadata = (className = 'mb-6 text-[#9CA3AF]') => (
    <div className={`flex flex-wrap items-center gap-3 text-xs sm:text-sm font-mono tracking-wide ${className}`}>
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
  );

  const renderAuthor = (className = 'pt-6 border-t border-[#27272A]/50 text-xs font-mono text-[#9CA3AF]') => (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/assets/Profile%20Photo.png"
        alt="Daffa Dhiyaulhaq Khadafi"
        className="w-10 h-10 rounded-full object-cover border border-[#34D399]/40 shadow-sm flex-shrink-0"
      />
      <div className="flex flex-col min-w-0">
        <span className="text-[#E2E8F0] font-medium truncate">Daffa Dhiyaulhaq Khadafi</span>
        <span className="text-[#71717A] text-[11px] truncate">AI-Assisted Product Engineer</span>
      </div>
    </div>
  );

  const renderExcerpt = (className = 'mb-8') =>
    article.excerpt ? (
      <p className={`text-lg md:text-xl text-[#A1A1AA] font-light leading-relaxed border-l-2 border-[#34D399]/30 pl-6 italic ${className}`}>
        {article.excerpt}
      </p>
    ) : null;

  const articleUrl = `https://khadafidaffa.com/blog/${article.slug || ''}`;

  return (
    <article className={`relative bg-[#111113]/90 backdrop-blur-3xl rounded-[2rem] border border-[#27272A]/40 shadow-2xl p-6 md:p-12 lg:p-14 h-full w-full ${sans.className} ${previewMode ? 'studio-preview-renderer' : ''} theme-${article.theme || 'midnight'}`}>
      {/* 1. HERO LAYOUT: CINEMATIC */}
      {hero_layout === 'cinematic' && (
        <header className="mb-12 md:mb-14">
          {resolvedCover ? (
            <div className="-mx-6 md:-mx-12 lg:-mx-14 -mt-6 md:-mt-12 lg:-mt-14 mb-8 relative overflow-hidden rounded-t-[2rem] min-h-[360px] sm:min-h-[420px] md:min-h-[480px] flex flex-col justify-end">
              {/* Background Cover Image */}
              <div className="absolute inset-0">
                <EditorialCover
                  src={resolvedCover}
                  alt={altText}
                  title={article.title}
                  category={article.category}
                  slug={article.slug}
                  focalPoint={focal_point}
                  aspectRatio="aspect-auto"
                  className="w-full h-full"
                  imageClassName="w-full h-full"
                  priority={true}
                  variant="hero"
                />
              </div>

              {/* Multi-layered Dark Gradient Overlay for Maximum Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/70 to-[#111113]/25 pointer-events-none" />
              <div className="absolute inset-0 bg-black/30 pointer-events-none" />

              {/* Headline Lockup */}
              <div className="relative z-10 p-6 sm:p-10 md:p-12">
                {renderMetadata('mb-4 text-[#CBD5E1]')}
                <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.18] text-[#FFFFFF] font-medium tracking-tight mb-6 drop-shadow-md ${lora.className}`}>
                  {article.title || 'Untitled story'}
                </h1>
                {renderAuthor('border-t border-white/15 pt-4 text-xs font-mono text-[#CBD5E1]')}
              </div>
            </div>
          ) : (
            <div className="mb-8">
              {renderMetadata()}
              <h1 className={`text-3xl sm:text-4xl md:text-[2.85rem] leading-[1.2] text-[#F8FAFC] font-medium tracking-tight mb-6 ${lora.className}`}>
                {article.title || 'Untitled story'}
              </h1>
              {renderAuthor('mb-8 pb-6 border-b border-[#27272A]/50')}
            </div>
          )}

          {resolvedCover && <CoverCaptionCredit caption={caption} credit={credit} className="mb-8" />}
          {renderExcerpt()}
        </header>
      )}

      {/* 2. HERO LAYOUT: IMMERSIVE */}
      {hero_layout === 'immersive' && (
        <header className="mb-12 md:mb-14">
          {renderMetadata()}
          <h1 className={`text-3xl sm:text-4xl md:text-[3.15rem] leading-[1.18] text-[#F8FAFC] font-medium tracking-tight mb-6 ${lora.className}`}>
            {article.title || 'Untitled story'}
          </h1>
          {renderExcerpt()}
          {renderAuthor('mb-8 pb-6 border-b border-[#27272A]/50 text-xs font-mono text-[#9CA3AF]')}

          {resolvedCover && (
            <div className="-mx-4 sm:-mx-8 md:-mx-12 lg:-mx-14 mb-8">
              <figure className="m-0">
                <div className="w-full overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.55)]">
                  <EditorialCover
                    src={resolvedCover}
                    alt={altText}
                    title={article.title}
                    category={article.category}
                    slug={article.slug}
                    focalPoint={focal_point}
                    aspectRatio="aspect-[16/9] sm:aspect-[21/9]"
                    className="w-full max-h-[520px]"
                    priority={true}
                    variant="hero"
                  />
                </div>
                <CoverCaptionCredit caption={caption} credit={credit} />
              </figure>
            </div>
          )}
        </header>
      )}

      {/* 3. HERO LAYOUT: EDITORIAL (Default) */}
      {hero_layout === 'editorial' && (
        <header className="mb-12 md:mb-14">
          {renderMetadata()}
          <h1 className={`text-3xl sm:text-4xl md:text-[2.85rem] leading-[1.2] text-[#F8FAFC] font-medium tracking-tight mb-6 ${lora.className}`}>
            {article.title || 'Untitled story'}
          </h1>
          {renderExcerpt()}
          {renderAuthor('mb-8 pb-6 border-b border-[#27272A]/50 text-xs font-mono text-[#9CA3AF]')}

          {resolvedCover && (
            <div className="w-full mb-8">
              <figure className="m-0">
                <div className="w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                  <EditorialCover
                    src={resolvedCover}
                    alt={altText}
                    title={article.title}
                    category={article.category}
                    slug={article.slug}
                    focalPoint={focal_point}
                    aspectRatio="aspect-[16/9]"
                    className="w-full max-h-[440px]"
                    priority={true}
                    variant="hero"
                  />
                </div>
                <CoverCaptionCredit caption={caption} credit={credit} />
              </figure>
            </div>
          )}
        </header>
      )}

      {/* Body Article (Comfortable reading measure: max 720px) */}
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

      {/* CTA (Call to Action) Card: Rendered after article body, before share actions */}
      {isCtaCompleteAndEnabled(distributionSettings) && (
        <div className="max-w-[720px] mx-auto mt-14 mb-4 select-none">
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#14151C] via-[#101117] to-[#0A0B0E] border border-[#34D399]/30 shadow-[0_15px_35px_rgba(0,0,0,0.45)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#34D399]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-2 max-w-lg">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#34D399] bg-[#34D399]/10 px-2.5 py-0.5 rounded-full border border-[#34D399]/20 inline-block">
                  Aksi Berikutnya
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight leading-snug">
                  {distributionSettings.cta_title}
                </h3>
                {distributionSettings.cta_description && (
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {distributionSettings.cta_description}
                  </p>
                )}
              </div>

              <div className="flex-shrink-0">
                {distributionSettings.cta_button_url.startsWith('/') ? (
                  <Link
                    href={distributionSettings.cta_button_url}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#34D399] text-[#022C22] font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95 whitespace-nowrap"
                  >
                    <span>{distributionSettings.cta_button_label}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <a
                    href={distributionSettings.cta_button_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#34D399] text-[#022C22] font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95 whitespace-nowrap"
                  >
                    <span>{distributionSettings.cta_button_label}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Actions */}
      <div className="max-w-[720px] mx-auto">
        <ArticleShareButtons
          url={articleUrl}
          title={article.title || 'Untitled story'}
        />
      </div>

      {/* Spotify Atmospheric Player */}
      {article.music_enabled && spotifyId && (
        <div className="max-w-[720px] mx-auto mt-8 pt-8 border-t border-[#27272A]/50">
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


