import { Lora, Plus_Jakarta_Sans } from 'next/font/google';

const lora = Lora({ subsets: ['latin'], style: ['normal', 'italic'] });
const sans = Plus_Jakarta_Sans({ subsets: ['latin'] });

export type ArticleData = {
  title: string;
  excerpt: string;
  category: string;
  reading_time: number;
  date: string;
  cover_url?: string;
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
  const spotifyId = article.music_uri?.match(/(?:spotify:playlist:|open\.spotify\.com\/playlist\/)([a-zA-Z0-9]+)/)?.[1];

  return (
    <article className={`relative bg-[#111113]/90 backdrop-blur-3xl rounded-[2rem] border border-[#27272A]/40 shadow-2xl p-6 md:p-14 lg:p-16 h-full w-full ${sans.className} ${previewMode ? 'studio-preview-renderer' : ''} theme-${article.theme || 'midnight'}`}>
      <header className="mb-16">
        <div className="flex items-center gap-3 text-sm font-mono tracking-wide mb-8">
          <span className="text-[#34D399] uppercase font-medium bg-[#34D399]/10 px-3 py-1 rounded-full border border-[#34D399]/20">{article.category}</span>
          <span className="text-[#6B7280]">
            {new Date(article.date || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          {article.reading_time > 0 && <span className="text-[#6B7280]">· {article.reading_time} min read</span>}
        </div>
        
        <h1 className={`text-4xl md:text-[3rem] leading-[1.15] text-[#F8FAFC] font-medium tracking-tight mb-8 ${lora.className}`}>
          {article.title || 'Untitled story'}
        </h1>
        
        {article.excerpt && (
          <p className="text-xl text-[#A1A1AA] font-light leading-relaxed border-l-2 border-[#34D399]/30 pl-6 italic">
            {article.excerpt}
          </p>
        )}

        {article.cover_url && (
          <div
            className="mt-10 w-full aspect-[16/9] rounded-2xl border border-white/10 bg-cover bg-center shadow-[0_25px_70px_rgba(0,0,0,0.45)]"
            style={{ backgroundImage: `url(${article.cover_url})` }}
            role="img"
            aria-label={`Cover artikel ${article.title}`}
          />
        )}
      </header>

      <div className={`prose prose-invert max-w-none 
        prose-p:text-[#D1D5DB] prose-p:leading-[2] prose-p:text-[1.1rem] ${lora.className}
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

      {article.music_enabled && spotifyId && (
        <div className="mt-16 pt-8 border-t border-[#27272A]/50">
          <iframe 
            title="Spotify atmosphere" 
            loading="lazy" 
            src={`https://open.spotify.com/embed/playlist/${spotifyId}?theme=0`} 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            className="w-full h-[152px] rounded-xl"
          />
        </div>
      )}

      {footerContent}
    </article>
  );
}
