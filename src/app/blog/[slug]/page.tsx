import { getPostBySlug, getPostSlugs } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/shared/navbar';
import GrimoireMetrics from '@/components/GrimoireMetrics';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next';
import { Lora } from 'next/font/google';

const lora = Lora({ subsets: ['latin'], style: ['normal', 'italic'] });

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.metadata.title} | Digital Grimoire`,
    description: post.metadata.excerpt,
  };
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug: slug.replace(/\.mdx$/, '') }));
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0C0C0E] text-[#D1D5DB] font-sans selection:bg-[#34D399]/20 selection:text-[#E2E8F0]">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        
        {/* Navigation & Meta */}
        <div className="mb-14">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#E2E8F0] transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono">Kembali ke Daftar</span>
          </Link>

          <div className="flex items-center gap-3 text-sm font-mono tracking-wide mb-6">
            <span className="text-[#34D399]/80 uppercase font-medium">{post.metadata.category}</span>
            <span className="w-1 h-1 rounded-full bg-[#3F3F46]" />
            <span className="text-[#6B7280]">
              {new Date(post.metadata.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          
          <h1 className={`text-4xl md:text-[2.75rem] leading-[1.15] text-[#F8FAFC] font-medium tracking-tight mb-6 ${lora.className}`}>
            {post.metadata.title}
          </h1>
        </div>

        {/* Article Body - Uses Lora for highly readable serif body text */}
        <article className={`prose prose-invert max-w-none 
          prose-p:text-[#D1D5DB] prose-p:leading-[1.8] prose-p:text-[1.05rem] ${lora.className}
          prose-headings:font-sans prose-headings:font-medium prose-headings:text-[#F8FAFC] prose-headings:tracking-tight
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
          prose-a:text-[#34D399] prose-a:font-sans prose-a:no-underline hover:prose-a:underline hover:prose-a:decoration-[#34D399]/50
          prose-strong:text-[#F8FAFC]
          prose-blockquote:border-l-[#34D399]/30 prose-blockquote:bg-[#18181B]/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:font-style-italic prose-blockquote:text-[#9CA3AF]
          prose-code:text-[#34D399] prose-code:bg-[#18181B] prose-code:font-sans prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[#111113] prose-pre:border prose-pre:border-[#27272A] prose-pre:font-sans
          prose-hr:border-[#27272A]
        `}>
          <MDXRemote source={post.content} />
        </article>

        {/* Subtle Interactive Metrics */}
        <div className="mt-20">
          <GrimoireMetrics slug={slug} />
        </div>
      </main>
    </div>
  );
}
