"use client";

import { getPostBySlug, getPostSlugs } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/shared/navbar';
import TableOfContents from '@/components/blog/TableOfContents';
import EngagementSection from '@/components/blog/EngagementSection';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Lora, Plus_Jakarta_Sans } from 'next/font/google';
import { motion, useScroll, useSpring } from 'framer-motion';

const lora = Lora({ subsets: ['latin'], style: ['normal', 'italic'] });
const sans = Plus_Jakarta_Sans({ subsets: ['latin'] });

type Props = {
  post: any;
  slug: string;
};

// Client Component to handle Scroll Progress
export default function BlogPostContent({ post, slug }: Props) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
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
          
          {/* The actual Book-Frame Container */}
          <article className="relative bg-[#111113]/90 backdrop-blur-3xl rounded-[2rem] border border-[#27272A]/40 shadow-2xl p-6 md:p-14 lg:p-16 h-full w-full">
            
            {/* Header */}
            <header className="mb-16">
              <div className="flex items-center gap-3 text-sm font-mono tracking-wide mb-8">
                <span className="text-[#34D399] uppercase font-medium bg-[#34D399]/10 px-3 py-1 rounded-full border border-[#34D399]/20">{post.metadata.category}</span>
                <span className="text-[#6B7280]">
                  {new Date(post.metadata.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              
              <h1 className={`text-4xl md:text-[3rem] leading-[1.15] text-[#F8FAFC] font-medium tracking-tight mb-8 ${lora.className}`}>
                {post.metadata.title}
              </h1>
              
              <p className="text-xl text-[#A1A1AA] font-light leading-relaxed border-l-2 border-[#34D399]/30 pl-6 italic">
                {post.metadata.excerpt}
              </p>
            </header>

            {/* Typography Content */}
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
              <MDXRemote source={post.content} />
            </div>

            <EngagementSection slug={slug} />

          </article>
        </div>

      </main>

      {/* Floating Collapsible ToC */}
      <TableOfContents content={post.content} />

      {/* Spotify Floating Mini Player (Bottom Right outside article) */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block group rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1DB954] to-[#1DB954]/50 opacity-20 blur-md group-hover:opacity-40 transition-opacity pointer-events-none" />
        
        {/* Iframe */}
        <div className="relative rounded-xl border border-[#27272A] bg-[#09090B]">
          <iframe 
            style={{ borderRadius: '12px', display: 'block' }} 
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator&theme=0" 
            width="300" 
            height="80" 
            frameBorder="0" 
            allowFullScreen={false} 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
