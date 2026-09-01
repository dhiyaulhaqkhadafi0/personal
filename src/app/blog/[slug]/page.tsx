import { getPostBySlug, getPostSlugs } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/shared/navbar';
import TableOfContents from '@/components/blog/TableOfContents';
import EngagementSection from '@/components/blog/EngagementSection';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next';
import { Lora, Plus_Jakarta_Sans } from 'next/font/google';

const lora = Lora({ subsets: ['latin'], style: ['normal', 'italic'] });
const sans = Plus_Jakarta_Sans({ subsets: ['latin'] });

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
    <div className={`min-h-screen bg-gradient-to-br from-[#09090B] via-[#0C0C0E] to-[#120D14] text-[#D1D5DB] selection:bg-[#34D399]/20 selection:text-[#E2E8F0] ${sans.className}`}>
      <Navbar />
      
      <main className="max-w-[85rem] mx-auto px-6 pt-32 pb-24 flex items-start gap-12 relative">
        
        {/* Main Reading Area (Book-Frame) */}
        <div className="flex-1 w-full max-w-3xl mx-auto">
          
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#E2E8F0] transition-colors mb-10 group bg-[#18181B] px-4 py-2 rounded-full border border-[#27272A]"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono">Kembali ke Daftar</span>
          </Link>

          {/* Book-Frame Container */}
          <article className="bg-[#131316]/80 backdrop-blur-xl rounded-[2rem] border border-[#27272A]/60 shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-8 md:p-14 relative overflow-hidden">
            
            {/* Subtle light leak effect at the top */}
            <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#34D399]/30 to-transparent" />
            
            {/* Navigation & Meta */}
            <header className="mb-14">
              <div className="flex items-center gap-3 text-sm font-mono tracking-wide mb-8">
                <span className="text-[#34D399] uppercase font-medium bg-[#34D399]/10 px-3 py-1 rounded-full">{post.metadata.category}</span>
                <span className="w-1 h-1 rounded-full bg-[#3F3F46]" />
                <span className="text-[#6B7280]">
                  {new Date(post.metadata.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              
              <h1 className={`text-4xl md:text-[2.75rem] leading-[1.15] text-[#F8FAFC] font-medium tracking-tight mb-8 ${lora.className}`}>
                {post.metadata.title}
              </h1>
              
              <p className="text-xl text-[#A1A1AA] font-light leading-relaxed border-l-2 border-[#34D399]/30 pl-6 italic">
                {post.metadata.excerpt}
              </p>
            </header>

            {/* Article Body - Highly Readable Typography */}
            <div className={`prose prose-invert max-w-none 
              prose-p:text-[#D1D5DB] prose-p:leading-[1.9] prose-p:text-[1.05rem] ${lora.className}
              prose-headings:font-sans prose-headings:font-medium prose-headings:text-[#F8FAFC] prose-headings:tracking-tight
              prose-h2:text-[1.75rem] prose-h2:mt-14 prose-h2:mb-6
              prose-h3:text-[1.35rem] prose-h3:mt-10 prose-h3:mb-4
              prose-a:text-[#34D399] prose-a:font-sans prose-a:no-underline hover:prose-a:underline hover:prose-a:decoration-[#34D399]/50
              prose-strong:text-[#F8FAFC] prose-strong:font-semibold
              prose-blockquote:border-l-[#34D399]/40 prose-blockquote:bg-[#18181B]/60 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:font-style-italic prose-blockquote:text-[#A1A1AA]
              prose-code:text-[#34D399] prose-code:bg-[#09090B] prose-code:font-sans prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-[#09090B] prose-pre:border prose-pre:border-[#27272A] prose-pre:font-sans prose-pre:shadow-inner
              prose-hr:border-[#27272A] prose-hr:my-12
            `}>
              <MDXRemote source={post.content} />
            </div>

            {/* Engagement Section (Likes, Shares, Comments) */}
            <EngagementSection slug={slug} />

          </article>
        </div>

        {/* Right Sidebar for Auto-ToC (Visible on large screens) */}
        <aside className="hidden xl:block w-72 sticky top-32">
          <TableOfContents content={post.content} />
        </aside>

      </main>
    </div>
  );
}
