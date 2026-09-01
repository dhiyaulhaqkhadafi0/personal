"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { SendHorizontal, LayoutGrid, List } from "lucide-react";
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 bg-[#131316]/50 p-4 md:px-8 md:py-5 rounded-[2rem] border border-[#27272A]/50 backdrop-blur-md shadow-2xl">
        
        {/* Left: Minimalist Floating Text Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide pb-2 md:pb-0 px-2 flex-grow">
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

        {/* Right: Search Bar & View Toggles */}
        <div className="flex items-center gap-4">
          
          {/* View Toggles (List vs Grid) */}
          <div className="hidden md:flex items-center gap-1 bg-[#09090B] p-1 rounded-full border border-[#27272A]">
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-full transition-colors ${viewMode === "list" ? "bg-[#27272A] text-[#E2E8F0]" : "text-[#6B7280] hover:text-[#9CA3AF]"}`}
              title="List View"
            >
              <List className="w-4 h-4" strokeWidth={2} />
            </button>
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-full transition-colors ${viewMode === "grid" ? "bg-[#27272A] text-[#E2E8F0]" : "text-[#6B7280] hover:text-[#9CA3AF]"}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          {/* Premium Animated Search Bar (Google AI Studio style) */}
          <div className="relative w-full md:w-80 group rounded-full">
            {/* Animated gradient border wrapper (Calm elegant colors: Teal, Blue, Purple) */}
            <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-[#2DD4BF] via-[#818CF8] to-[#C084FC] opacity-30 group-focus-within:opacity-100 transition-opacity duration-700 bg-[length:200%_auto] animate-gradient-xy blur-[2px]" />
            <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-[#2DD4BF] via-[#818CF8] to-[#C084FC] opacity-10 group-focus-within:opacity-50 transition-opacity duration-700 bg-[length:200%_auto] animate-gradient-xy" />
            
            <div className="relative flex items-center bg-[#131316] border border-[#27272A] group-focus-within:border-transparent rounded-full overflow-hidden shadow-inner">
              <input
                type="text"
                className="w-full bg-transparent py-2.5 pl-6 pr-12 text-[#E2E8F0] placeholder-[#6B7280] focus:outline-none text-sm font-medium tracking-wide"
                placeholder="Cari konsep, arsitektur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* Paper Plane / Enter Icon */}
              <div className="absolute right-2 flex items-center justify-center w-8 h-8 rounded-full bg-[#18181B] border border-[#27272A] group-focus-within:bg-gradient-to-br group-focus-within:from-[#2DD4BF]/20 group-focus-within:to-[#818CF8]/20 group-focus-within:border-[#818CF8]/30 transition-all duration-300 shadow-sm cursor-pointer hover:scale-105">
                <SendHorizontal className="w-3.5 h-3.5 text-[#9CA3AF] group-focus-within:text-[#E2E8F0] transition-colors" strokeWidth={2} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Posts List */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {filteredPosts.length > 0 ? (
            <motion.div 
              layout
              className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12" 
                : "flex flex-col gap-8"
              }
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
                    {viewMode === "grid" ? (
                      /* ---------------- GRID MODE (CARD WITH THUMBNAIL) ---------------- */
                      <article className="flex flex-col h-full bg-[#131316]/40 border border-[#27272A]/50 rounded-[2rem] overflow-hidden hover:border-[#34D399]/30 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(52,211,153,0.05)]">
                        {/* Thumbnail Cover */}
                        {post.metadata.image && (
                          <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-[#09090B]">
                            <Image 
                              src={post.metadata.image} 
                              alt={post.metadata.title}
                              fill
                              className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-[#131316]/20 to-transparent" />
                          </div>
                        )}
                        
                        {/* Content Area */}
                        <div className={`p-6 md:p-8 flex flex-col flex-grow relative ${post.metadata.image ? '-mt-8' : ''}`}>
                          <div className="flex items-center justify-between text-xs font-mono tracking-wider mb-4 relative z-10">
                            <span className="bg-[#09090B] text-[#34D399] px-3 py-1.5 rounded-full border border-[#27272A] uppercase font-medium shadow-lg">
                              {post.metadata.category}
                            </span>
                            <span className="text-[#9CA3AF] bg-[#09090B] px-3 py-1.5 rounded-full border border-[#27272A] shadow-lg">
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
                    ) : (
                      /* ---------------- LIST MODE (LONG ROWS) ---------------- */
                      <article className="flex flex-col md:flex-row gap-6 p-6 md:p-8 bg-[#131316]/40 border border-[#27272A]/50 rounded-[2rem] hover:border-[#34D399]/30 transition-all duration-500 hover:bg-[#18181B]/60 items-center">
                        <div className="flex-grow w-full">
                          <div className="flex items-center gap-3 text-xs font-mono tracking-wider mb-4">
                            <span className="text-[#34D399] uppercase font-medium">{post.metadata.category}</span>
                            <span className="w-1 h-1 rounded-full bg-[#3F3F46]" />
                            <span className="text-[#6B7280]">
                              {new Date(post.metadata.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>
                          <h2 className={`text-2xl md:text-3xl text-[#E2E8F0] group-hover:text-white font-medium leading-snug transition-colors mb-4 ${loraClassName}`}>
                            {post.metadata.title}
                          </h2>
                          <p className="text-[#9CA3AF] leading-relaxed font-light group-hover:text-[#D1D5DB] transition-colors max-w-3xl">
                            {post.metadata.excerpt}
                          </p>
                        </div>
                        
                        {/* Small Thumbnail for List View (Optional, but looks premium) */}
                        {post.metadata.image && (
                          <div className="w-full md:w-48 h-32 md:h-full min-h-[120px] relative rounded-2xl overflow-hidden flex-shrink-0 bg-[#09090B] border border-[#27272A]/50">
                            <Image 
                              src={post.metadata.image} 
                              alt={post.metadata.title}
                              fill
                              className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                            />
                          </div>
                        )}
                      </article>
                    )}
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
