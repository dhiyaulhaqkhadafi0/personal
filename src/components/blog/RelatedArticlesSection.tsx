import Link from 'next/link';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import { EditorialCover } from '@/components/shared/EditorialCover';
import { extractVisualSettings, resolveArticleCover } from '@/lib/blog-types';
import type { BlogPost } from '@/lib/mdx';

type Props = {
  posts: BlogPost[];
};

export function RelatedArticlesSection({ posts }: Props) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="w-full mt-16 pt-12 border-t border-white/10 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#34D399]/10 border border-[#34D399]/25 flex items-center justify-center text-[#34D399]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F8FAFC] tracking-tight">
              Baca Juga
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Eksplorasi cerita dan gagasan terkait lainnya
            </p>
          </div>
        </div>

        <Link
          href="/blog"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#34D399] hover:text-[#6EE7B7] font-medium transition-colors group"
        >
          <span>Semua Tulisan</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 1, 2, or 3-column Grid */}
      <div className={`grid grid-cols-1 ${posts.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
        {posts.map((post) => {
          const visualSettings = extractVisualSettings(post.contentJson);
          const cover = resolveArticleCover({
            cover_url: post.metadata.cover_url,
            image: post.metadata.image,
            cover_slides: post.metadata.cover_slides,
            content_json: post.contentJson,
          });

          return (
            <Link
              key={post.metadata.slug}
              href={`/blog/${post.metadata.slug}`}
              className="group flex flex-col rounded-2xl bg-[#14151B]/80 hover:bg-[#181922] border border-white/10 hover:border-[#34D399]/40 shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              {/* Card Image */}
              <div className="w-full aspect-[16/9] overflow-hidden bg-[#0A0B0E] relative">
                <EditorialCover
                  src={cover}
                  alt={visualSettings.alt_text || post.metadata.title}
                  title={post.metadata.title}
                  category={post.metadata.category}
                  slug={post.metadata.slug}
                  focalPoint={visualSettings.focal_point}
                  aspectRatio="aspect-[16/9]"
                  className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  variant="card"
                />
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-mono mb-2 text-[#94A3B8]">
                    <span className="text-[#34D399] uppercase font-semibold">
                      {post.metadata.category || 'Ideas'}
                    </span>
                    {post.metadata.readingTime ? (
                      <>
                        <span className="w-1 h-1 rounded-full bg-[#3F3F46]" />
                        <span className="flex items-center gap-1 text-[#71717A]">
                          <Clock className="w-3 h-3 text-[#34D399]" />
                          {post.metadata.readingTime} min read
                        </span>
                      </>
                    ) : null}
                  </div>

                  <h3 className="font-serif text-base font-semibold text-[#F8FAFC] group-hover:text-[#34D399] transition-colors line-clamp-2 leading-snug mb-2">
                    {post.metadata.title}
                  </h3>

                  {post.metadata.excerpt && (
                    <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                      {post.metadata.excerpt}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#34D399] font-medium">
                  <span>Baca artikel</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
