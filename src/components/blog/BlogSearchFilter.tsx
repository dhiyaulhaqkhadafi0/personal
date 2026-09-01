"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { SendHorizontal, LayoutGrid, List, ChevronDown, SearchX, RotateCcw, MonitorPlay, Eye, TrendingUp, Star, Clock } from "lucide-react";
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

type SortMode = "Terbaru" | "Trending" | "Banyak Dilihat" | "Pilihan Editor";

export default function BlogSearchFilter({ posts, loraClassName }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortMode, setSortMode] = useState<SortMode>("Terbaru");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "youtube">("grid");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

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
  const sortOptions: { id: SortMode; icon: any; label: string }[] = [
    { id: "Terbaru", icon: Clock, label: "Terbaru" },
    { id: "Trending", icon: TrendingUp, label: "Sedang Trending" },
    { id: "Banyak Dilihat", icon: Eye, label: "Paling Banyak Dilihat" },
    { id: "Pilihan Editor", icon: Star, label: "Pilihan Editor" },
  ];

  // Pseudo-random deterministic number generator based on string (for fake views/trending scores)
  const getScore = (str: string, seed: number) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(Math.sin(hash * seed) * 10000);
  };

  // Real-time search across title, excerpt, category, and slug, PLUS sorting
  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    
    // 1. Filter
    let filtered = posts.filter((post) => {
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

    // 2. Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortMode === "Terbaru") {
        return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
      } else if (sortMode === "Trending") {
        return getScore(b.metadata.slug, 42) - getScore(a.metadata.slug, 42);
      } else if (sortMode === "Banyak Dilihat") {
        return getScore(b.metadata.slug, 13) - getScore(a.metadata.slug, 13);
      } else if (sortMode === "Pilihan Editor") {
        return getScore(b.metadata.slug, 99) - getScore(a.metadata.slug, 99);
      }
      return 0;
    });

    return filtered;
  }, [posts, searchQuery, selectedCategory, sortMode]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("Semua");
    setSortMode("Terbaru");
  };

  const getSortIcon = (mode: SortMode) => {
    const option = sortOptions.find(o => o.id === mode);
    if (!option) return null;
    const Icon = option.icon;
    return <Icon className="w-4 h-4 text-[#34D399]" />;
  };

  return (
    <div className="w-full relative z-30">
      
      {/* Search & Filter Header Container */}
      <div className="relative w-full mb-12 shadow-2xl z-40">
        
        {/* Animated Gradient Looping Border */}
        <div className="absolute -inset-[1px] rounded-[2.25rem] overflow-hidden pointer-events-none p-[1px]">
          <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#34D399_360deg)] animate-[spin_6s_linear_infinite] opacity-30 group-hover:opacity-60 transition-opacity" />
        </div>

        {/* Inner Controls Bar */}
        <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-[#111113]/95 p-3.5 sm:p-4 md:px-6 rounded-[2.25rem] border border-[#27272A]/70 backdrop-blur-3xl z-40">
          
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

          {/* RIGHT: Dropdown Filters & Layout Toggles */}
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0 w-full xl:w-auto">
            
            {/* Dual Dropdowns Wrapper */}
            <div className="flex w-full sm:w-auto gap-2 z-50">
              
              {/* Dropdown 1: Kategori Topik */}
              <div className="relative flex-1 sm:w-44">
                <button
                  type="button"
                  onClick={() => { setIsCategoryDropdownOpen(!isCategoryDropdownOpen); setIsSortDropdownOpen(false); }}
                  className="flex items-center justify-between w-full bg-[#09090B] border border-[#27272A] hover:border-[#34D399]/60 px-4 py-3 rounded-full text-sm font-medium transition-colors shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[#F8FAFC] truncate">{selectedCategory}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform duration-300 flex-shrink-0 ${isCategoryDropdownOpen ? "rotate-180 text-[#34D399]" : ""}`} />
                </button>

                <AnimatePresence>
                  {isCategoryDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsCategoryDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.96 }} transition={{ duration: 0.18 }}
                        className="absolute top-full right-0 mt-3 w-full sm:w-56 bg-[#141417] backdrop-blur-2xl border border-[#3F3F46] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-2 z-50"
                      >
                        <div className="px-3 py-1.5 text-[10px] font-mono text-[#71717A] uppercase tracking-wider border-b border-[#27272A] mb-1">Topik Konten</div>
                        {categories.map((cat) => {
                          const isSelected = selectedCategory === cat;
                          return (
                            <button
                              key={cat} type="button" onClick={() => { setSelectedCategory(cat); setIsCategoryDropdownOpen(false); }}
                              className={`flex items-center justify-between w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${isSelected ? "bg-[#34D399]/15 text-[#34D399] font-semibold border border-[#34D399]/30" : "text-[#A1A1AA] hover:bg-[#1F1F23] hover:text-[#F8FAFC]"}`}
                            >
                              <span>{cat}</span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isSelected ? "bg-[#34D399]/20 text-[#34D399]" : "bg-[#27272A] text-[#71717A]"}`}>{categoryCounts[cat]}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Dropdown 2: Sort Mode */}
              <div className="relative flex-1 sm:w-48">
                <button
                  type="button"
                  onClick={() => { setIsSortDropdownOpen(!isSortDropdownOpen); setIsCategoryDropdownOpen(false); }}
                  className="flex items-center justify-between w-full bg-[#09090B] border border-[#27272A] hover:border-[#34D399]/60 px-4 py-3 rounded-full text-sm font-medium transition-colors shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate text-[#F8FAFC]">
                    {getSortIcon(sortMode)}
                    <span className="truncate">{sortMode}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform duration-300 flex-shrink-0 ${isSortDropdownOpen ? "rotate-180 text-[#34D399]" : ""}`} />
                </button>

                <AnimatePresence>
                  {isSortDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsSortDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.96 }} transition={{ duration: 0.18 }}
                        className="absolute top-full right-0 mt-3 w-full sm:w-60 bg-[#141417] backdrop-blur-2xl border border-[#3F3F46] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-2 z-50"
                      >
                        <div className="px-3 py-1.5 text-[10px] font-mono text-[#71717A] uppercase tracking-wider border-b border-[#27272A] mb-1">Urutan & Filter</div>
                        {sortOptions.map((opt) => {
                          const isSelected = sortMode === opt.id;
                          const Icon = opt.icon;
                          return (
                            <button
                              key={opt.id} type="button" onClick={() => { setSortMode(opt.id); setIsSortDropdownOpen(false); }}
                              className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${isSelected ? "bg-[#34D399]/15 text-[#34D399] font-semibold border border-[#34D399]/30" : "text-[#A1A1AA] hover:bg-[#1F1F23] hover:text-[#F8FAFC]"}`}
                            >
                              <Icon className={`w-4 h-4 ${isSelected ? "text-[#34D399]" : "text-[#71717A]"}`} />
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* View Toggles (List vs Grid vs Youtube) */}
            <div className="flex items-center gap-1 bg-[#09090B] p-1.5 rounded-full border border-[#27272A] flex-shrink-0 w-full justify-center sm:w-auto sm:justify-start z-10">
              <button
                type="button"
                onClick={() => setViewMode("youtube")}
                className={`w-9 h-9 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                  viewMode === "youtube" ? "bg-[#34D399] text-[#09090B] font-bold shadow-[0_0_15px_rgba(52,211,153,0.35)] scale-105" : "text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[#18181B]"
                }`}
                title="Mode Tampilan Teater" aria-label="Mode Youtube"
              >
                <MonitorPlay className="w-4 h-4" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`w-9 h-9 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                  viewMode === "list" ? "bg-[#34D399] text-[#09090B] font-bold shadow-[0_0_15px_rgba(52,211,153,0.35)] scale-105" : "text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[#18181B]"
                }`}
                title="Mode Tampilan List" aria-label="Mode List"
              >
                <List className="w-4 h-4" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`w-9 h-9 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                  viewMode === "grid" ? "bg-[#34D399] text-[#09090B] font-bold shadow-[0_0_15px_rgba(52,211,153,0.35)] scale-105" : "text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[#18181B]"
                }`}
                title="Mode Tampilan Grid" aria-label="Mode Grid"
              >
                <LayoutGrid className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Active Filter & Count Pill */}
      {(searchQuery.trim() || selectedCategory !== "Semua" || sortMode !== "Terbaru") && (
        <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-8 px-2 font-mono">
          <div className="flex items-center gap-2">
            <span>Ditemukan <strong className="text-[#34D399]">{filteredPosts.length}</strong> artikel</span>
            {searchQuery && (
              <span>untuk &ldquo;<strong className="text-[#F8FAFC]">{searchQuery}</strong>&rdquo;</span>
            )}
            {sortMode !== "Terbaru" && (
              <span>&bull; {sortMode}</span>
            )}
          </div>
          <button onClick={handleReset} className="flex items-center gap-1 text-[#34D399] hover:underline cursor-pointer">
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filter</span>
          </button>
        </div>
      )}

      {/* Posts Content View */}
      <div className="min-h-[350px] relative z-10">
        {filteredPosts.length > 0 ? (
          <div className="transition-all duration-300 w-full">
            
            {/* GRID & LIST MODES */}
            {viewMode !== "youtube" && (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10" : "flex flex-col gap-6"}>
                {filteredPosts.map((post) => (
                  <div key={post.metadata.slug} className="w-full">
                    <Link href={`/blog/${post.metadata.slug}`} className="block group h-full">
                      {viewMode === "grid" ? (
                        <article className="flex flex-col h-full bg-[#131316]/40 border border-[#27272A]/60 rounded-[1.75rem] overflow-hidden hover:border-[#34D399]/40 transition-all duration-500 hover:shadow-[0_10px_35px_rgba(52,211,153,0.06)] hover:-translate-y-1">
                          {post.metadata.image && (
                            <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-[#09090B]">
                              <Image src={post.metadata.image} alt={post.metadata.title} fill className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-[#131316]/20 to-transparent" />
                            </div>
                          )}
                          <div className={`p-6 sm:p-7 flex flex-col flex-grow relative ${post.metadata.image ? "-mt-8" : ""}`}>
                            <div className="flex items-center justify-between text-xs font-mono tracking-wider mb-4 relative z-10">
                              <span className="bg-[#09090B] text-[#34D399] px-3 py-1 rounded-full border border-[#27272A] uppercase font-medium shadow-md">{post.metadata.category}</span>
                              <span className="text-[#9CA3AF] bg-[#09090B] px-3 py-1 rounded-full border border-[#27272A] shadow-md">{new Date(post.metadata.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                            </div>
                            <h2 className={`text-xl sm:text-[1.4rem] text-[#E2E8F0] group-hover:text-white font-medium leading-[1.35] transition-colors mb-3 ${loraClassName}`}>{post.metadata.title}</h2>
                            <p className="text-[#9CA3AF] leading-relaxed text-sm font-light group-hover:text-[#D1D5DB] transition-colors flex-grow">{post.metadata.excerpt}</p>
                          </div>
                        </article>
                      ) : (
                        <article className="flex flex-col sm:flex-row gap-6 p-6 sm:p-7 bg-[#131316]/50 border border-[#27272A]/70 rounded-[1.75rem] hover:border-[#34D399]/40 transition-all duration-300 hover:bg-[#18181C] items-center group/item hover:shadow-xl">
                          <div className="flex-grow w-full">
                            <div className="flex items-center gap-3 text-xs font-mono tracking-wider mb-3">
                              <span className="text-[#34D399] uppercase font-semibold bg-[#34D399]/10 px-2.5 py-0.5 rounded-full border border-[#34D399]/20">{post.metadata.category}</span>
                              <span className="w-1 h-1 rounded-full bg-[#3F3F46]" />
                              <span className="text-[#71717A]">{new Date(post.metadata.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                            </div>
                            <h2 className={`text-xl sm:text-2xl text-[#E2E8F0] group-hover/item:text-[#34D399] font-medium leading-snug transition-colors mb-2.5 ${loraClassName}`}>{post.metadata.title}</h2>
                            <p className="text-[#9CA3AF] leading-relaxed text-sm font-light group-hover/item:text-[#D1D5DB] transition-colors line-clamp-2 max-w-3xl">{post.metadata.excerpt}</p>
                          </div>
                          {post.metadata.image && (
                            <div className="w-full sm:w-44 md:w-52 h-32 sm:h-28 relative rounded-2xl overflow-hidden flex-shrink-0 bg-[#09090B] border border-[#27272A]">
                              <Image src={post.metadata.image} alt={post.metadata.title} fill className="object-cover opacity-80 group-hover/item:opacity-100 group-hover/item:scale-105 transition-all duration-500 ease-out" />
                            </div>
                          )}
                        </article>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* YOUTUBE (SIDE-BY-SIDE) MODE */}
            {viewMode === "youtube" && (
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                {/* Hero / Main Left Article (First Post) */}
                <div className="lg:w-[62%] xl:w-2/3 h-full">
                  <Link href={`/blog/${filteredPosts[0].metadata.slug}`} className="block group h-full">
                    <article className="flex flex-col h-full bg-[#131316]/40 border border-[#27272A]/60 rounded-[2rem] overflow-hidden hover:border-[#34D399]/40 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(52,211,153,0.08)]">
                      {filteredPosts[0].metadata.image ? (
                        <div className="relative w-full aspect-video max-h-[420px] overflow-hidden bg-[#09090B]">
                          <Image src={filteredPosts[0].metadata.image} alt={filteredPosts[0].metadata.title} fill className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-[#131316]/10 to-transparent" />
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-tr from-[#18181B] to-[#27272A] relative" />
                      )}
                      <div className={`p-6 sm:p-8 md:p-10 flex flex-col flex-grow relative ${filteredPosts[0].metadata.image ? "-mt-12" : ""}`}>
                        <div className="flex items-center gap-3 text-xs font-mono tracking-wider mb-5 relative z-10">
                          <span className="bg-[#1DB954]/20 text-[#1DB954] backdrop-blur-md px-4 py-1.5 rounded-full border border-[#1DB954]/30 uppercase font-semibold shadow-xl flex items-center gap-2">
                            <MonitorPlay className="w-3.5 h-3.5" /> Unggulan
                          </span>
                          <span className="bg-[#09090B]/80 backdrop-blur-md text-[#34D399] px-4 py-1.5 rounded-full border border-[#27272A] uppercase font-medium shadow-md">
                            {filteredPosts[0].metadata.category}
                          </span>
                        </div>
                        <h2 className={`text-2xl sm:text-3xl md:text-4xl text-[#E2E8F0] group-hover:text-white font-medium leading-[1.3] transition-colors mb-4 ${loraClassName}`}>{filteredPosts[0].metadata.title}</h2>
                        <p className="text-[#9CA3AF] text-base leading-relaxed font-light group-hover:text-[#D1D5DB] transition-colors mb-6">{filteredPosts[0].metadata.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs font-mono text-[#71717A] mt-auto pt-4 border-t border-[#27272A]/50">
                          <span>{new Date(filteredPosts[0].metadata.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                          <span className="w-1 h-1 rounded-full bg-[#3F3F46]" />
                          <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {Math.floor(getScore(filteredPosts[0].metadata.slug, 13))} Views</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </div>

                {/* Sidebar Right (Up Next / Recommendations list) */}
                <div className="lg:w-[38%] xl:w-1/3 flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-2 pb-6 scrollbar-thin scrollbar-thumb-[#27272A] scrollbar-track-transparent">
                  <div className="text-sm font-semibold text-[#F8FAFC] px-2 mb-2 flex items-center gap-2 border-b border-[#27272A]/50 pb-3">
                    {sortMode === "Terbaru" ? "Terbaru Lainnya" : "Rekomendasi Terkait"}
                  </div>
                  {filteredPosts.slice(1).map((post) => (
                    <Link key={post.metadata.slug} href={`/blog/${post.metadata.slug}`} className="block group">
                      <article className="flex gap-4 p-3 bg-transparent hover:bg-[#18181C] rounded-2xl transition-colors duration-300">
                        {post.metadata.image && (
                          <div className="relative w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#09090B] border border-[#27272A]">
                            <Image src={post.metadata.image} alt={post.metadata.title} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out" />
                          </div>
                        )}
                        <div className="flex flex-col py-0.5 justify-between">
                          <h3 className={`text-sm sm:text-base text-[#E2E8F0] group-hover:text-[#34D399] font-medium leading-snug line-clamp-2 ${loraClassName}`}>{post.metadata.title}</h3>
                          <div className="flex flex-col gap-1 mt-2 text-[11px] font-mono text-[#71717A]">
                            <span className="text-[#34D399] uppercase tracking-wider">{post.metadata.category}</span>
                            <span className="flex items-center gap-1.5">{Math.floor(getScore(post.metadata.slug, 13))} Views &bull; {new Date(post.metadata.date).toLocaleDateString("id-ID", { month: "short", year: "numeric" })}</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                  {filteredPosts.length <= 1 && (
                    <div className="text-xs text-[#71717A] italic px-2 py-4 text-center border border-dashed border-[#27272A] rounded-xl mt-4">
                      Tidak ada artikel lain untuk ditampilkan.
                    </div>
                  )}
                </div>
              </div>
            )}
            
          </div>
        ) : (
          /* ================= EMPTY SEARCH STATE ================= */
          <div className="py-20 px-6 text-center flex flex-col items-center justify-center bg-[#131316]/30 rounded-3xl border border-[#27272A]/40">
            <div className="w-14 h-14 rounded-full bg-[#27272A]/50 border border-[#3F3F46] flex items-center justify-center mb-4 text-[#9CA3AF]">
              <SearchX className="w-6 h-6 text-[#9CA3AF]" />
            </div>
            <h3 className={`text-xl text-[#F8FAFC] font-medium mb-2 ${loraClassName}`}>
              Maaf, Artikel Tidak Ditemukan
            </h3>
            <p className="text-sm text-[#9CA3AF] max-w-md mb-6 leading-relaxed">
              Tidak ada artikel yang cocok dengan pencarian Anda.
            </p>
            <button type="button" onClick={handleReset} className="flex items-center gap-2 bg-[#34D399]/15 hover:bg-[#34D399]/25 text-[#34D399] border border-[#34D399]/30 px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer">
              <RotateCcw className="w-4 h-4" />
              <span>Reset Pencarian & Tampilkan Semua</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
