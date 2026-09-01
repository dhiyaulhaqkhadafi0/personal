import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';
import { Navbar } from '@/components/shared/navbar';
import { Lora } from 'next/font/google';

const lora = Lora({ subsets: ['latin'], style: ['normal', 'italic'] });

export const metadata = {
  title: 'Digital Grimoire | Daffa Dhiyaulhaq Khadafi',
  description: 'A digital diary of an AI-Assisted Product Engineer. Concepts, thoughts, and architectural blueprints.',
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#0C0C0E] text-[#D1D5DB] font-sans selection:bg-[#34D399]/20 selection:text-[#E2E8F0]">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <header className="mb-20">
          <h1 className={`text-4xl md:text-5xl text-[#F8FAFC] font-medium tracking-tight mb-6 ${lora.className}`}>
            The Digital Grimoire
          </h1>
          <p className="text-[#9CA3AF] text-lg leading-relaxed max-w-2xl font-light">
            Catatan perjalanan, arsip pemikiran, dan kerangka arsitektur. 
            Menjembatani batas antara logika komputasi dan intuisi desain.
          </p>
        </header>

        <div className="space-y-12">
          {posts.map((post) => (
            <Link 
              key={post.metadata.slug} 
              href={`/blog/${post.metadata.slug}`}
              className="block group"
            >
              <article className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-10 py-6 border-b border-[#27272A]/50 hover:border-[#52525B] transition-colors duration-300">
                
                {/* Meta Sidebar */}
                <div className="flex-shrink-0 w-full md:w-32 flex items-center md:flex-col md:items-start gap-4 md:gap-1 text-sm">
                  <span className="text-[#6B7280] font-mono tracking-wide">
                    {new Date(post.metadata.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="hidden md:inline text-[#3F3F46]">•</span>
                  <span className="text-[#34D399]/80 font-medium tracking-wide uppercase text-xs">
                    {post.metadata.category}
                  </span>
                </div>
                
                {/* Content Area */}
                <div className="flex-grow space-y-3">
                  <h2 className={`text-2xl text-[#E2E8F0] group-hover:text-white font-medium leading-snug transition-colors ${lora.className}`}>
                    {post.metadata.title}
                  </h2>
                  <p className="text-[#9CA3AF] leading-relaxed text-base font-light max-w-2xl group-hover:text-[#D1D5DB] transition-colors">
                    {post.metadata.excerpt}
                  </p>
                </div>
                
              </article>
            </Link>
          ))}
          
          {posts.length === 0 && (
            <div className="py-20 text-[#6B7280] font-light italic text-center">
              Belum ada catatan yang ditulis.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
