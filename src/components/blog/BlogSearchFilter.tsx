"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type BlogPost = {
  metadata: {
    title: string;
    category: string;
    date: string;
    excerpt: string;
    slug: string;
    image?: string;
  };
};

type Props = {
  posts: BlogPost[];
  loraClassName: string;
};

const CATEGORIES = ["Semua", "Mantra", "Artefak", "Hikayat", "Relik"];

export default function BlogSearchFilter({ posts, loraClassName }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.metadata.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === "Semua" || post.metadata.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  return (
    <div className="w-full">
      
      {/* Smart Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 bg-[#131316]/50 p-4 md:p-6 rounded-[2rem] border border-[#27272A]/50 backdrop-blur-md shadow-2xl">
        
        {/* Minimalist Floating Text Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide pb-2 md:pb-0 px-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="relative text-sm font-medium transition-colors duration-300 py-2 whitespace-nowrap"
            >
              <span className={selectedCategory === cat ? "text-[#F8FAFC]" : "text-[#9CA3AF] hover:text-[#D1D5DB]"}>
                {cat}
              </span>
              {selectedCategory === cat && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#34D399] to-transparent"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Premium Animated Search Bar */}
        <div className="relative w-full md:w-96 group rounded-2xl">
          {/* Animated gradient border wrapper */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#34D399]/20 via-[#6366F1]/20 to-[#34D399]/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] animate-gradient-xy blur-[2px]" />
          
          <div className="relative flex items-center bg-[#09090B] border border-[#27272A] group-focus-within:border-transparent rounded-2xl overflow-hidden">
            <input
              type="text"
              className="w-full bg-transparent py-3.5 pl-5 pr-12 text-[#E2E8F0] placeholder-[#6B7280] focus:outline-none text-sm"
              placeholder="Eksplorasi wawasan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Plane/Send Icon */}
            <div className="absolute right-3 flex items-center justify-center w-8 h-8 rounded-full bg-[#18181B] group-focus-within:bg-[#34D399]/10 transition-colors">
              <Send className="w-4 h-4 text-[#6B7280] group-focus-within:text-[#34D399] transition-colors -ml-0.5 mt-0.5" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Posts List */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {filteredPosts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
            >
              {filteredPosts.map((post, i) => (
                <motion.div
                  key={post.metadata.slug}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link href={`/blog/${post.metadata.slug}`} className="block group h-full">
                    <article className="flex flex-col h-full bg-[#131316]/40 border border-[#27272A]/50 rounded-[2rem] overflow-hidden hover:border-[#34D399]/30 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(52,211,153,0.05)]">
                      
                      {/* Thumbnail Cover */}
                      {post.metadata.image && (
                        <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                          <Image 
                            src={post.metadata.image} 
                            alt={post.metadata.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#131316]/90 to-transparent" />
                        </div>
                      )}
                      
                      {/* Content Area */}
                      <div className="p-6 md:p-8 flex flex-col flex-grow relative">
                        {/* Meta Category & Date overlapping the image slightly if image exists */}
                        <div className={`flex items-center justify-between text-xs font-mono tracking-wider mb-4 ${post.metadata.image ? '-mt-12 relative z-10' : ''}`}>
                          <span className="bg-[#18181B] text-[#34D399] px-3 py-1 rounded-full border border-[#27272A] uppercase font-medium">
                            {post.metadata.category}
                          </span>
                          <span className="text-[#9CA3AF] bg-[#18181B] px-3 py-1 rounded-full border border-[#27272A]">
                            {new Date(post.metadata.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        
                        <h2 className={`text-2xl text-[#E2E8F0] group-hover:text-white font-medium leading-snug transition-colors mb-4 ${loraClassName}`}>
                          {post.metadata.title}
                        </h2>
                        
                        <p className="text-[#9CA3AF] leading-relaxed text-sm md:text-base font-light group-hover:text-[#D1D5DB] transition-colors flex-grow">
                          {post.metadata.excerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-[#6B7280] font-light italic text-center text-lg"
            >
              Belum ada arsip yang ditemukan.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
