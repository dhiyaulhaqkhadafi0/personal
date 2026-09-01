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
    <div className="min-h-screen bg-[#09090B] text-[#D1D5DB] font-sans selection:bg-[#34D399]/20 selection:text-[#E2E8F0]">
      <Navbar />
      
      {/* Hero Cover Image Section */}
      <div className="relative w-full h-[50vh] md:h-[65vh] min-h-[400px]">
        <Image 
          src="/assets/images/grimoire-cover.png" 
          alt="The Digital Grimoire World" 
          fill
          priority
          className="object-cover object-center"
        />
        {/* Gradient Mask to blend image into the dark background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090B]/80 via-transparent to-transparent" />
        
        {/* Hero Title Container */}
        <div className="absolute bottom-0 left-0 w-full z-10 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className={`text-5xl md:text-7xl text-[#F8FAFC] font-medium tracking-tight mb-4 drop-shadow-lg ${lora.className}`}>
              The Digital Grimoire
            </h1>
            <p className="text-[#A1A1AA] text-lg md:text-xl leading-relaxed max-w-2xl font-light drop-shadow-md">
              Catatan perjalanan, arsip pemikiran, dan kerangka arsitektur. 
              Menjembatani batas antara logika komputasi dan intuisi desain.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content (Search, Filter, List) */}
      <main className="max-w-4xl mx-auto px-6 pt-12 pb-24 relative z-20">
        <BlogSearchFilter posts={posts} loraClassName={lora.className} />
      </main>
    </div>
  );
}
