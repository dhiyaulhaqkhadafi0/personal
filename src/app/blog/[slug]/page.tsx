import { getPostBySlug, getPostSlugs } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/shared/navbar';
import GrimoireMetrics from '@/components/GrimoireMetrics';
import { ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next';

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
    <div className="min-h-screen bg-zinc-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 transition-colors mb-12 font-mono group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return to Grimoire
        </Link>

        <header className="mb-12 pb-8 border-b border-zinc-800/80">
          <div className="flex items-center gap-3 text-sm font-mono text-emerald-500/80 mb-6">
            <span className="uppercase tracking-wider font-semibold">{post.metadata.category}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="flex items-center gap-1.5 text-zinc-500">
              <Calendar className="w-4 h-4" />
              {post.metadata.date}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif text-slate-100 font-bold leading-tight mb-6">
            {post.metadata.title}
          </h1>
          
          <p className="text-xl text-zinc-400 font-light leading-relaxed">
            {post.metadata.excerpt}
          </p>
        </header>

        {/* MDX Content with Tailwind Typography */}
        <article className="prose prose-invert prose-emerald max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-code:text-emerald-300 prose-code:bg-emerald-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800">
          <MDXRemote source={post.content} />
        </article>

        {/* Interactive Metrics */}
        <GrimoireMetrics slug={slug} />
      </main>
    </div>
  );
}
