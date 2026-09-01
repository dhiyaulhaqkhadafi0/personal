"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { SendHorizontal, LayoutGrid, List, ChevronDown, SearchX, RotateCcw, Sparkles } from "lucide-react";
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

export default function BlogSearchFilter({ posts, loraClassName }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Derive categories and counts dynamically
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: posts.length };
    posts.forEach((post) => {
      const cat = post.metadata.category || "Teknologi";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [posts]);

  const categories = Object.keys(categoryCounts);

  // Robust real-time search across title, excerpt, category, and slug
  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const titleMatch = post.metadata.title.toLowerCase().includes(q);
      const excerptMatch = post.metadata.excerpt.toLowerCase().includes(q);
      const categoryMatch = post.metadata.category.toLowerCase().includes(q);
      const slugMatch = post.metadata.slug.toLowerCase().includes(q);

      const matchesSearch = !q || titleMatch || excerptMatch || categoryMatch || slugMatch;

      const matchesCategory =
        selectedCategory === "Semua" ||
        post.metadata.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("Semua");
  };

  return (
    <div className="w-full relative z-30">
      
      {/* Search & Filter Header Container */}
      <div className="relative w-full mb-12 shadow-2xl z-40">
        
        {/* Animated Gradient Looping Border (Isolated in background so dropdown is never clipped!) */}
        <div className="absolute -inset-[1px] rounded-[2.25rem] overflow-hidden pointer-events-none p-[1px]">
          <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#34D399_360deg)] animate-[spin_6s_linear_infinite] opacity-30 group-hover:opacity-60 transition-opacity" />
        </div>

        {/* Inner Controls Bar */}
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111113]/95 p-3.5 sm:p-4 md:px-6 rounded-[2.25rem] border border-[#27272A]/70 backdrop-blur-3xl z-40">
          
          {/* LEFT: Search Bar (Large & Flexible) */}
          <div className="relative flex-grow flex items-center bg-[#09090B] border border-[#27272A] focus-within:border-[#34D399]/60 rounded-full overflow-hidden shadow-inner transition-colors group/search">
            <input
              type="text"
              className="w-full bg-transparent py-3 pl-6 pr-14 text-[#E2E8F0] placeholder-[#6B7280] focus:outline-none text-sm font-medium tracking-wide"
              placeholder="Cari konsep, arsitektur, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Plane / Send Icon inside Search */}
            <div className="absolute right-2 flex items-center justify-center w-8 h-8 rounded-full bg-[#18181B] border border-[#27272A] group-focus-within/search:bg-[#34D399]/20 group-focus-within/search:border-[#34D399]/40 transition-all duration-300 shadow-sm cursor-pointer hover:scale-105">
              <SendHorizontal className="w-3.5 h-3.5 text-[#9CA3AF] group-focus-within/search:text-[#34D399] transition-colors" strokeWidth={2} />
            </div>
          </div>

          {/* RIGHT: Dropdown Category & List/Grid Toggles */}
          <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
            
            {/* Glassmorphism Dropdown Filter */}
            <div className="relative flex-grow md:flex-grow-0 z-50">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full md:w-56 bg-[#09090B] border border-[#27272A] hover:border-[#34D399]/60 px-5 py-3 rounded-full text-sm font-medium transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[#F8FAFC] truncate">{selectedCategory}</span>
                  <span className="text-xs text-[#34D399] font-mono">({categoryCounts[selectedCategory] || 0})</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform duration-300 flex-shrink-0 ${isDropdownOpen ? "rotate-180 text-[#34D399]" : ""}`} />
              </button>

              {/* Dropdown Menu (Floating with high z-index, never hidden) */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown on outside click */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full right-0 mt-3 w-full md:w-64 bg-[#141417] backdrop-blur-2xl border border-[#3F3F46] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-2 z-50"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-mono text-[#71717A] uppercase tracking-wider border-b border-[#27272A] mb-1">
                        Pilih Kategori
                      </div>
                      {categories.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat);
                              setIsDropdownOpen(false);
                            }}
                            className={`flex items-center justify-between w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
                              isSelected
                                ? "bg-[#34D399]/15 text-[#34D399] font-semibold border border-[#34D399]/30"
                                : "text-[#A1A1AA] hover:bg-[#1F1F23] hover:text-[#F8FAFC]"
                            }`}
                          >
                            <span>{cat}</span>
                            <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${isSelected ? "bg-[#34D399]/20 text-[#34D399]" : "bg-[#27272A] text-[#71717A]"}`}>
                              {categoryCounts[cat]}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* View Toggles (List vs Grid) */}
            <div className="flex items-center gap-1 bg-[#09090B] p-1.5 rounded-full border border-[#27272A] flex-shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-full transition-all flex items-center justify-center ${
                  viewMode === "list"
                    ? "bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40 shadow-sm"
                    : "text-[#6B7280] hover:text-[#D1D5DB] border border-transparent"
                }`}
                title="Mode Tampilan List"
              >
                <List className="w-4 h-4" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-full transition-all flex items-center justify-center ${
                  viewMode === "grid"
                    ? "bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40 shadow-sm"
                    : "text-[#6B7280] hover:text-[#D1D5DB] border border-transparent"
                }`}
                title="Mode Tampilan Grid"
              >
                <LayoutGrid className="w-4 h-4" strokeWidth={2.2} />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Active Filter & Count Pill */}
      {(searchQuery.trim() || selectedCategory !== "Semua") && (
        <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-8 px-2 font-mono">
          <div className="flex items-center gap-2">
            <span>Ditemukan <strong className="text-[#34D399]">{filteredPosts.length}</strong> artikel</span>
            {searchQuery && (
              <span>untuk kata kunci &ldquo;<strong className="text-[#F8FAFC]">{searchQuery}</strong>&rdquo;</span>
            )}
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[#34D399] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filter</span>
          </button>
        </div>
      )}

      {/* Posts Content View */}
      <div className="min-h-[350px] relative z-10">
        <AnimatePresence mode="wait">
          {filteredPosts.length > 0 ? (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
                  : "flex flex-col gap-6"
              }
            >
              {filteredPosts.map((post, i) => (
                <motion.div
                  key={post.metadata.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <Link href={`/blog/${post.metadata.slug}`} className="block group h-full">
                    {viewMode === "grid" ? (
                      /* ================= GRID MODE (CARDS) ================= */
                      <article className="flex flex-col h-full bg-[#131316]/40 border border-[#27272A]/60 rounded-[1.75rem] overflow-hidden hover:border-[#34D399]/40 transition-all duration-500 hover:shadow-[0_10px_35px_rgba(52,211,153,0.06)] hover:-translate-y-1">
                        {post.metadata.image && (
                          <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-[#09090B]">
                            <Image
                              src={post.metadata.image}
                              alt={post.metadata.title}
                              fill
                              className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-[#131316]/20 to-transparent" />
                          </div>
                        )}

                        <div className={`p-6 sm:p-7 flex flex-col flex-grow relative ${post.metadata.image ? "-mt-8" : ""}`}>
                          <div className="flex items-center justify-between text-xs font-mono tracking-wider mb-4 relative z-10">
                            <span className="bg-[#09090B] text-[#34D399] px-3 py-1 rounded-full border border-[#27272A] uppercase font-medium shadow-md">
                              {post.metadata.category}
                            </span>
                            <span className="text-[#9CA3AF] bg-[#09090B] px-3 py-1 rounded-full border border-[#27272A] shadow-md">
                              {new Date(post.metadata.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>

                          <h2 className={`text-xl sm:text-[1.4rem] text-[#E2E8F0] group-hover:text-white font-medium leading-[1.35] transition-colors mb-3 ${loraClassName}`}>
                            {post.metadata.title}
                          </h2>

                          <p className="text-[#9CA3AF] leading-relaxed text-sm font-light group-hover:text-[#D1D5DB] transition-colors flex-grow">
                            {post.metadata.excerpt}
                          </p>
                        </div>
                      </article>
                    ) : (
                      /* ================= LIST MODE (EDITORIAL ROWS) ================= */
                      <article className="flex flex-col sm:flex-row gap-6 p-6 sm:p-7 bg-[#131316]/50 border border-[#27272A]/70 rounded-[1.75rem] hover:border-[#34D399]/40 transition-all duration-300 hover:bg-[#18181C] items-center group/item hover:shadow-xl">
                        <div className="flex-grow w-full">
                          <div className="flex items-center gap-3 text-xs font-mono tracking-wider mb-3">
                            <span className="text-[#34D399] uppercase font-semibold bg-[#34D399]/10 px-2.5 py-0.5 rounded-full border border-[#34D399]/20">
                              {post.metadata.category}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-[#3F3F46]" />
                            <span className="text-[#71717A]">
                              {new Date(post.metadata.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                            </span>
                          </div>

                          <h2 className={`text-xl sm:text-2xl text-[#E2E8F0] group-hover/item:text-[#34D399] font-medium leading-snug transition-colors mb-2.5 ${loraClassName}`}>
                            {post.metadata.title}
                          </h2>

                          <p className="text-[#9CA3AF] leading-relaxed text-sm font-light group-hover/item:text-[#D1D5DB] transition-colors line-clamp-2 max-w-3xl">
                            {post.metadata.excerpt}
                          </p>
                        </div>

                        {post.metadata.image && (
                          <div className="w-full sm:w-44 md:w-52 h-32 sm:h-28 relative rounded-2xl overflow-hidden flex-shrink-0 bg-[#09090B] border border-[#27272A]">
                            <Image
                              src={post.metadata.image}
                              alt={post.metadata.title}
                              fill
                              className="object-cover opacity-80 group-hover/item:opacity-100 group-hover/item:scale-105 transition-all duration-500 ease-out"
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
            /* ================= EMPTY SEARCH STATE ================= */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-20 px-6 text-center flex flex-col items-center justify-center bg-[#131316]/30 rounded-3xl border border-[#27272A]/40"
            >
              <div className="w-14 h-14 rounded-full bg-[#27272A]/50 border border-[#3F3F46] flex items-center justify-center mb-4 text-[#9CA3AF]">
                <SearchX className="w-6 h-6 text-[#9CA3AF]" />
              </div>
              <h3 className={`text-xl text-[#F8FAFC] font-medium mb-2 ${loraClassName}`}>
                Maaf, Artikel Tidak Ditemukan
              </h3>
              <p className="text-sm text-[#9CA3AF] max-w-md mb-6 leading-relaxed">
                Tidak ada artikel yang cocok dengan kata kunci &ldquo;<span className="text-[#34D399] font-medium">{searchQuery}</span>&rdquo; pada kategori &ldquo;<span className="text-[#34D399] font-medium">{selectedCategory}</span>&rdquo;.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 bg-[#34D399]/15 hover:bg-[#34D399]/25 text-[#34D399] border border-[#34D399]/30 px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Pencarian & Tampilkan Semua</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
