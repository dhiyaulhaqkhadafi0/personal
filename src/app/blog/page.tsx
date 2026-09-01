import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';
import { Calendar, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/shared/navbar';

export const metadata = {
  title: 'Digital Grimoire | Daffa Dhiyaulhaq Khadafi',
  description: 'A digital diary of an AI-Assisted Product Engineer. Concepts, thoughts, and architectural blueprints.',
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-white font-bold mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            The Digital Grimoire
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-light">
            A repository of architectural concepts, AI integrations, and the subtle art of defensible product engineering.
          </p>
        </header>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link 
              key={post.metadata.slug} 
              href={`/blog/${post.metadata.slug}`}
              className="block group"
            >
              <article className="p-6 md:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 group-hover:to-emerald-500/10 transition-colors duration-500" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs font-mono text-emerald-500/80">
                      <span className="uppercase tracking-wider font-semibold">{post.metadata.category}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span className="flex items-center gap-1.5 text-zinc-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.metadata.date}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-serif font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                      {post.metadata.title}
                    </h2>
                    
                    <p className="text-slate-400 leading-relaxed max-w-2xl">
                      {post.metadata.excerpt}
                    </p>
                  </div>
                  
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-zinc-800 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all">
                    <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-20 text-slate-500 border border-dashed border-zinc-800 rounded-2xl">
              The grimoire is currently empty.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
