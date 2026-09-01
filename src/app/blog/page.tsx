import { getAllPosts } from '@/lib/mdx';
import { Navbar } from '@/components/shared/navbar';
import { Lora } from 'next/font/google';
import BlogSearchFilter from '@/components/blog/BlogSearchFilter';
import Image from 'next/image';

const lora = Lora({ subsets: ['latin'], style: ['normal', 'italic'] });

export const metadata = {
  title: 'Digital Grimoire | Daffa Dhiyaulhaq Khadafi',
  description: 'A digital diary of an AI-Assisted Product Engineer. Concepts, thoughts, and architectural blueprints.',
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#09090B] text-[#D1D5DB] font-sans selection:bg-[#34D399]/20 selection:text-[#E2E8F0] relative overflow-hidden">
      
      {/* Ambient Corner Lights (Floating Orbs) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] rounded-full bg-[#34D399]/5 blur-[120px] pointer-events-none animate-spin-slow mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-[#6366F1]/5 blur-[150px] pointer-events-none animate-spin-slow mix-blend-screen" style={{ animationDirection: 'reverse' }} />

      <Navbar />
      
      <main className="relative z-10 pt-24 pb-24 max-w-6xl mx-auto px-6">
        
        {/* Fixed Hero Section (Image and Text separated) */}
        <section className="mb-20 flex flex-col items-center text-center">
          
          <div className="w-full max-w-5xl h-[35vh] md:h-[45vh] min-h-[300px] relative rounded-3xl overflow-hidden mb-12 shadow-2xl border border-[#27272A]/50 group">
            <Image 
              src="/assets/images/grimoire-cover.png" 
              alt="The Digital Grimoire World" 
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-[2s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
          </div>
          
          <div className="max-w-3xl">
            <h1 className={`text-5xl md:text-6xl text-[#F8FAFC] font-medium tracking-tight mb-6 drop-shadow-sm ${lora.className}`}>
              The Digital Grimoire
            </h1>
            <p className="text-[#A1A1AA] text-lg md:text-xl leading-relaxed font-light">
              Catatan perjalanan, arsip pemikiran, dan kerangka arsitektur. 
              Menjembatani batas antara logika komputasi dan intuisi desain.
            </p>
          </div>
        </section>

        {/* Main Content (Premium Search, Filter, Grid) */}
        <BlogSearchFilter posts={posts} loraClassName={lora.className} />
        
      </main>
    </div>
  );
}
