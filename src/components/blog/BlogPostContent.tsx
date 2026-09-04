"use client";

import { Navbar } from '@/components/shared/navbar';
import TableOfContents from '@/components/blog/TableOfContents';
import EngagementSection from '@/components/blog/EngagementSection';
import ScrollProgressNav from '@/components/blog/ScrollProgressNav';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { motion, useScroll, useSpring } from 'framer-motion';
import ArticleAtmosphere from '@/components/blog/ArticleAtmosphere';
import { ArticleRenderer } from '@/components/shared/ArticleRenderer';
import { RelatedArticlesSection } from '@/components/blog/RelatedArticlesSection';
import type { BlogPost } from '@/lib/mdx';

const sans = Plus_Jakarta_Sans({ subsets: ['latin'] });

type Props = {
  post: BlogPost;
  slug: string;
  relatedPosts?: BlogPost[];
  children: React.ReactNode;
};

// Client Component to handle Scroll Progress & Interactive UI
export default function BlogPostContent({ post, slug, relatedPosts, children }: Props) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className={`min-h-screen bg-[#0C0C0E] text-[#D1D5DB] selection:bg-[#34D399]/20 selection:text-[#E2E8F0] ${sans.className}`}>
      
      {/* Reading Progress Bar (Fixed Top) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2DD4BF] via-[#818CF8] to-[#C084FC] z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Ambient Gradient Background for Detail Page */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#10B981]/5 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#8B5CF6]/5 blur-[120px] mix-blend-screen" />
      </div>

      <Navbar />
      <ArticleAtmosphere mood={post.metadata.musicMood} enabled={post.metadata.musicEnabled} />
      <ScrollProgressNav />
      
      <main className="max-w-4xl mx-auto px-4 md:px-6 pt-32 pb-48 relative z-10 flex flex-col items-center">
        
        <div className="w-full mb-10">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#E2E8F0] transition-colors group bg-[#131316] px-4 py-2 rounded-full border border-[#27272A]/50 shadow-sm backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono">Kembali ke Dunia</span>
          </Link>
        </div>

        {/* Animated Looping Border Wrapper */}
        <div className="relative w-full rounded-[2rem] p-[1px] overflow-hidden group">
          {/* Rotating gradient background creating the border effect */}
          <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#34D399_360deg)] animate-[spin_4s_linear_infinite] opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
          
          <ArticleRenderer 
            article={{
              title: post.metadata.title,
              slug: post.metadata.slug,
              excerpt: post.metadata.excerpt || '',
              category: post.metadata.category,
              reading_time: post.metadata.readingTime || 0,
              date: post.metadata.date,
              cover_url: post.metadata.cover_url || post.metadata.image,
              cover_slides: post.metadata.cover_slides,
              cover_image: post.metadata.cover_image,
              content_json: post.contentJson,
              content: post.content,
              content_html: post.contentHtml,
              theme: post.metadata.theme,
              music_enabled: post.metadata.musicEnabled,
              music_uri: post.metadata.musicUri
            }}
            footerContent={<EngagementSection slug={slug} />}
          >
            {children}
          </ArticleRenderer>
        </div>

        {/* Deterministic Related Articles ("Baca Juga") */}
        {relatedPosts && relatedPosts.length > 0 && (
          <RelatedArticlesSection posts={relatedPosts} />
        )}

      </main>

      {/* Floating Collapsible ToC */}
      <TableOfContents content={post.content} />
    </div>
  );
}
