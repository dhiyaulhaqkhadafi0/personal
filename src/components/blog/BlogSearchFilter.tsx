"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SendHorizontal, LayoutGrid, List, ChevronDown, SearchX, RotateCcw, MonitorPlay, Eye, TrendingUp, Star, Clock, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EditorialCover } from "@/components/shared/EditorialCover";
import { resolveArticleCover } from "@/lib/blog-types";
import type { BlogCardItem } from "@/lib/mdx";

type Props = {
  posts: BlogCardItem[];
  initialEngagement?: Record<string, { view_count: number; like_count: number }>;
  loraClassName: string;
};

type SortMode = "Terbaru" | "Trending" | "Banyak Dilihat" | "Pilihan Editor";

export default function BlogSearchFilter({ posts, initialEngagement, loraClassName }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortMode, setSortMode] = useState<SortMode>("Terbaru");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "youtube">("youtube");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [engagement, setEngagement] = useState<Record<string, { view_count: number; like_count: number }>>(
    initialEngagement || {}
  );

  // Revalidate real engagement data in background (read-only, does not record views)
  useEffect(() => {
    let isMounted = true;
    fetch("/api/engagement")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && isMounted) {
          setEngagement(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const formatViews = (slug: string) => {
    const count = engagement[slug]?.view_count ?? 0;
    return `${new Intl.NumberFormat("id-ID").format(count)} dibaca`;
  };

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
  const sortOptions: { id: SortMode; icon: LucideIcon; label: string }[] = [
    { id: "Terbaru", icon: Clock, label: "Terbaru" },
    { id: "Trending", icon: TrendingUp, label: "Sedang Trending" },
    { id: "Banyak Dilihat", icon: Eye, label: "Paling Banyak Dilihat" },
    { id: "Pilihan Editor", icon: Star, label: "Pilihan Editor" },
  ];

  // Real-time search across title, excerpt, category, and slug, PLUS sorting with real engagement
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

    // 2. Sort using authentic engagement numbers
    filtered = [...filtered].sort((a, b) => {
      const aViews = engagement[a.metadata.slug]?.view_count ?? 0;
      const bViews = engagement[b.metadata.slug]?.view_count ?? 0;
      const aLikes = engagement[a.metadata.slug]?.like_count ?? 0;
      const bLikes = engagement[b.metadata.slug]?.like_count ?? 0;

      if (sortMode === "Terbaru") {
        return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
      } else if (sortMode === "Trending") {
        const scoreA = aViews + aLikes * 3;
        const scoreB = bViews + bLikes * 3;
        if (scoreB !== scoreA) return scoreB - scoreA;
        return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
      } else if (sortMode === "Banyak Dilihat") {
        if (bViews !== aViews) return bViews - aViews;
        return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
      } else if (sortMode === "Pilihan Editor") {
        const readA = a.metadata.readingTime || 0;
        const readB = b.metadata.readingTime || 0;
        if (readB !== readA) return readB - readA;
        return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
      }
      return 0;
    });

    return filtered;
  }, [posts, searchQuery, selectedCategory, sortMode, engagement]);

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
        
        {/* Animated Gradient Looping Border (Enhanced Premium Effect) */}
        <div className="absolute -inset-[2px] rounded-[2.25rem] overflow-hidden pointer-events-none p-[2px]">
          <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_240deg,#34D399_300deg,transparent_360deg)] animate-[spin_4s_linear_infinite] opacity-50 group-hover:opacity-80 transition-opacity blur-[2px]" />
          <div className="absolute inset-[-50%] bg-[conic-gradient(from_180deg,transparent_0_240deg,#818CF8_300deg,transparent_360deg)] animate-[spin_4s_linear_infinite] opacity-40 group-hover:opacity-70 transition-opacity blur-[4px]" />
        </div>

        {/* Inner Controls Bar (Stacked Layout) */}
        <div className="relative flex flex-col gap-5 bg-[#09090B]/90 p-5 sm:p-6 md:px-7 rounded-[2.25rem] border border-[#27272A]/80 backdrop-blur-3xl z-40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          
          {/* TOP ROW: Large Search Bar */}
          <div className="relative w-full flex items-center bg-[#000000]/60 border border-[#27272A] focus-within:border-[#34D399]/70 focus-within:shadow-[0_0_20px_rgba(52,211,153,0.15)] rounded-2xl overflow-hidden transition-all duration-300 group/search">
            <input
              type="text"
              className="w-full bg-transparent py-4 pl-6 pr-16 text-[#F8FAFC] placeholder-[#6B7280] focus:outline-none text-base font-medium tracking-wide"
              placeholder="Cari artikel, konsep, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Send Icon inside Search */}
            <div className="absolute right-3 flex items-center justify-center w-10 h-10 rounded-xl bg-[#18181B] border border-[#27272A] group-focus-within/search:bg-[#34D399]/20 group-focus-within/search:border-[#34D399]/50 transition-all duration-300 shadow-sm cursor-pointer hover:scale-105">
              <SendHorizontal className="w-4 h-4 text-[#9CA3AF] group-focus-within/search:text-[#34D399] transition-colors" strokeWidth={2} />
            </div>
          </div>

          {/* BOTTOM ROW: Filters & Toggles */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            
            {/* Dual Dropdowns Wrapper */}
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 z-50">
              
              {/* Dropdown 1: Kategori Topik */}
              <div className="relative flex-1 sm:w-48">
                <button
                  type="button"
                  onClick={() => { setIsCategoryDropdownOpen(!isCategoryDropdownOpen); setIsSortDropdownOpen(false); }}
                  className="flex items-center justify-between w-full bg-[#111113] border border-[#27272A] hover:border-[#34D399]/60 px-4 py-3 rounded-xl text-sm font-medium transition-colors shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate text-[#F8FAFC]">
                    <span className="truncate">{selectedCategory}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform duration-300 flex-shrink-0 ${isCategoryDropdownOpen ? "rotate-180 text-[#34D399]" : ""}`} />
                </button>

                <AnimatePresence>
                  {isCategoryDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsCategoryDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.96 }} transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 mt-3 w-full sm:w-60 bg-[#141417]/95 backdrop-blur-2xl border border-[#3F3F46] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-2 z-50"
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
              <div className="relative flex-1 sm:w-56">
                <button
                  type="button"
                  onClick={() => { setIsSortDropdownOpen(!isSortDropdownOpen); setIsCategoryDropdownOpen(false); }}
                  className="flex items-center justify-between w-full bg-[#111113] border border-[#27272A] hover:border-[#34D399]/60 px-4 py-3 rounded-xl text-sm font-medium transition-colors shadow-sm cursor-pointer"
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
                        className="absolute top-full left-0 mt-3 w-full sm:w-64 bg-[#141417]/95 backdrop-blur-2xl border border-[#3F3F46] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-2 z-50"
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
            <div className="flex items-center gap-1.5 bg-[#111113] p-1.5 rounded-xl border border-[#27272A] flex-shrink-0 w-full justify-center sm:w-auto sm:justify-end relative z-20 pointer-events-auto">
              <button
                type="button"
                onClick={() => setViewMode("youtube")}
                className={`w-10 h-10 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                  viewMode === "youtube" ? "bg-[#34D399] text-[#09090B] font-bold shadow-[0_0_15px_rgba(52,211,153,0.35)] scale-[1.02]" : "text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[#18181B]"
                }`}
                title="Mode Tampilan Teater" aria-label="Mode Youtube"
              >
                <MonitorPlay className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`w-10 h-10 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                  viewMode === "list" ? "bg-[#34D399] text-[#09090B] font-bold shadow-[0_0_15px_rgba(52,211,153,0.35)] scale-[1.02]" : "text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[#18181B]"
                }`}
                title="Mode Tampilan List" aria-label="Mode List"
              >
                <List className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`w-10 h-10 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                  viewMode === "grid" ? "bg-[#34D399] text-[#09090B] font-bold shadow-[0_0_15px_rgba(52,211,153,0.35)] scale-[1.02]" : "text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[#18181B]"
                }`}
                title="Mode Tampilan Grid" aria-label="Mode Grid"
              >
                <LayoutGrid className="w-5 h-5" strokeWidth={2.5} />
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

      {/* Posts Content View - Instant Switching between Grid and List */}
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
                          {/* 16:10 Cover at top of card */}
                          <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#09090B] border-b border-[#27272A]/40">
                            <EditorialCover
                              src={resolveArticleCover(post.metadata)}
                              alt={`Cover artikel: ${post.metadata.title}`}
                              title={post.metadata.title}
                              category={post.metadata.category}
                              slug={post.metadata.slug}
                              aspectRatio="aspect-[16/10]"
                              className="w-full h-full"
                              variant="card"
                            />
                          </div>
                          {/* Content strictly below cover */}
                          <div className="p-6 sm:p-7 flex flex-col flex-grow">
                            <div className="flex items-center justify-between text-xs font-mono tracking-wider mb-4">
                              <span className="bg-[#18181B] text-[#34D399] px-3 py-1 rounded-full border border-[#27272A] uppercase font-medium shadow-sm">{post.metadata.category}</span>
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-[#9CA3AF] bg-[#18181B] px-3 py-1 rounded-full border border-[#27272A] shadow-md text-[11px]">
                                  <Eye className="w-3 h-3 text-[#34D399]" /> {formatViews(post.metadata.slug)}
                                </span>
                              </div>
                            </div>
                            <h2 className={`text-xl sm:text-[1.35rem] text-[#E2E8F0] group-hover:text-white font-medium leading-[1.35] transition-colors mb-3 line-clamp-2 ${loraClassName}`}>{post.metadata.title}</h2>
                            <p className="text-[#9CA3AF] leading-relaxed text-sm font-light group-hover:text-[#D1D5DB] transition-colors line-clamp-3 flex-grow">{post.metadata.excerpt}</p>
                          </div>
                        </article>
                      ) : (
                        <article className="flex flex-col sm:flex-row gap-6 p-6 sm:p-7 bg-[#131316]/50 border border-[#27272A]/70 rounded-[1.75rem] hover:border-[#34D399]/40 transition-all duration-300 hover:bg-[#18181C] items-center group/item hover:shadow-xl">
                          <div className="flex-grow w-full min-w-0">
                            <div className="flex items-center gap-3 text-xs font-mono tracking-wider mb-3">
                              <span className="text-[#34D399] uppercase font-semibold bg-[#34D399]/10 px-2.5 py-0.5 rounded-full border border-[#34D399]/20">{post.metadata.category}</span>
                              <span className="w-1 h-1 rounded-full bg-[#3F3F46]" />
                              <span className="flex items-center gap-1 text-[#9CA3AF] text-[11px]">
                                <Eye className="w-3 h-3 text-[#34D399]" /> {formatViews(post.metadata.slug)}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-[#3F3F46]" />
                              <span className="text-[#71717A]">{new Date(post.metadata.date).toLocaleDateString("id-ID", { month: "long", day: "numeric", year: "numeric" })}</span>
                            </div>
                            <h2 className={`text-xl sm:text-2xl text-[#E2E8F0] group-hover/item:text-[#34D399] font-medium leading-snug transition-colors mb-2.5 line-clamp-2 ${loraClassName}`}>{post.metadata.title}</h2>
                            <p className="text-[#9CA3AF] leading-relaxed text-sm font-light group-hover/item:text-[#D1D5DB] transition-colors line-clamp-2 max-w-3xl">{post.metadata.excerpt}</p>
                          </div>
                          <div className="w-full sm:w-44 md:w-52 h-32 sm:h-28 relative rounded-2xl overflow-hidden flex-shrink-0 bg-[#09090B] border border-[#27272A]">
                            <EditorialCover
                              src={resolveArticleCover(post.metadata)}
                              alt={post.metadata.title}
                              title={post.metadata.title}
                              category={post.metadata.category}
                              slug={post.metadata.slug}
                              aspectRatio="aspect-[16/10]"
                              className="w-full h-full"
                              variant="thumbnail"
                            />
                          </div>
                        </article>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* YOUTUBE (SIDE-BY-SIDE) MODE */}
            {viewMode === "youtube" && (
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                {/* Hero / Main Left Article (First Post) */}
                <div className="lg:w-[55%] xl:w-[60%] h-full">
                  <Link href={`/blog/${filteredPosts[0].metadata.slug}`} className="block group h-full">
                    <article className="flex flex-col h-full bg-[#131316]/40 border border-[#27272A]/60 rounded-[2rem] overflow-hidden hover:border-[#34D399]/40 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(52,211,153,0.08)]">
                      {/* Cover 16:9 on top of card */}
                      <div className="w-full aspect-video max-h-[360px] overflow-hidden bg-[#09090B] border-b border-[#27272A]/40">
                        <EditorialCover
                          src={resolveArticleCover(filteredPosts[0].metadata)}
                          alt={`Cover artikel unggulan: ${filteredPosts[0].metadata.title}`}
                          title={filteredPosts[0].metadata.title}
                          category={filteredPosts[0].metadata.category}
                          slug={filteredPosts[0].metadata.slug}
                          aspectRatio="aspect-video"
                          className="w-full h-full"
                          priority={true}
                          variant="hero"
                        />
                      </div>

                      {/* Content strictly below cover */}
                      <div className="p-6 sm:p-8 flex flex-col flex-grow relative">
                        <div className="flex items-center gap-3 text-xs font-mono tracking-wider mb-4">
                          <span className="bg-[#1DB954]/20 text-[#1DB954] px-3.5 py-1.5 rounded-full border border-[#1DB954]/30 uppercase font-semibold shadow-sm flex items-center gap-1.5">
                            <MonitorPlay className="w-3.5 h-3.5" /> Unggulan
                          </span>
                          <span className="bg-[#18181B] text-[#34D399] px-3.5 py-1.5 rounded-full border border-[#27272A] uppercase font-medium">
                            {filteredPosts[0].metadata.category}
                          </span>
                        </div>
                        <h2 className={`text-2xl sm:text-3xl text-[#E2E8F0] group-hover:text-white font-medium leading-[1.3] transition-colors mb-3 line-clamp-2 ${loraClassName}`}>{filteredPosts[0].metadata.title}</h2>
                        <p className="text-[#9CA3AF] text-sm leading-relaxed font-light group-hover:text-[#D1D5DB] transition-colors mb-6 line-clamp-3">{filteredPosts[0].metadata.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs font-mono text-[#71717A] mt-auto pt-4 border-t border-[#27272A]/50">
                          <span>{new Date(filteredPosts[0].metadata.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                          <span className="w-1 h-1 rounded-full bg-[#3F3F46]" />
                          <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-[#34D399]" /> {formatViews(filteredPosts[0].metadata.slug)}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </div>

                {/* Sidebar Right (Up Next / Recommendations list) */}
                <div className="lg:w-[45%] xl:w-[40%] flex flex-col gap-5">
                  <div className="text-sm font-semibold text-[#F8FAFC] px-1 flex items-center justify-between border-b border-[#27272A]/50 pb-3">
                    <span className="flex items-center gap-2 text-[#34D399]">
                       <Star className="w-4 h-4" /> Rekomendasi Untukmu
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#27272A] scrollbar-track-transparent">
                    {filteredPosts.slice(1).map((post) => (
                      <Link key={post.metadata.slug} href={`/blog/${post.metadata.slug}`} className="block group">
                        <article className="flex gap-4 p-2.5 bg-transparent hover:bg-[#18181C] rounded-2xl transition-colors duration-300 items-center">
                          <div className="w-[120px] h-[75px] sm:w-[136px] sm:h-[85px] rounded-xl overflow-hidden flex-shrink-0 bg-[#09090B] border border-[#27272A]/70">
                            <EditorialCover
                              src={resolveArticleCover(post.metadata)}
                              alt={post.metadata.title}
                              title={post.metadata.title}
                              category={post.metadata.category}
                              slug={post.metadata.slug}
                              aspectRatio="aspect-[16/10]"
                              className="w-full h-full"
                              variant="thumbnail"
                            />
                          </div>
                          <div className="flex flex-col py-1 justify-between flex-grow min-w-0">
                            <h3 className={`text-[13px] sm:text-sm text-[#E2E8F0] group-hover:text-[#34D399] font-medium leading-[1.4] line-clamp-2 pr-2 ${loraClassName}`}>{post.metadata.title}</h3>
                            <div className="flex flex-col gap-1 mt-1.5 text-[10px] font-mono text-[#71717A] truncate">
                              <span className="text-[#34D399] uppercase tracking-wider truncate">{post.metadata.category}</span>
                              <span className="flex items-center gap-1.5 truncate"><Eye className="w-3 h-3 text-[#34D399]" /> {formatViews(post.metadata.slug)} &bull; {new Date(post.metadata.date).toLocaleDateString("id-ID", { month: "short", year: "numeric" })}</span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                    {filteredPosts.length <= 1 && (
                      <div className="text-xs text-[#71717A] italic px-2 py-6 text-center border border-dashed border-[#27272A] rounded-xl mt-2 bg-[#09090B]/50">
                        Belum ada artikel rekomendasi lainnya untuk saat ini.
                      </div>
                    )}
                  </div>
                  
                  {/* Pagination / View More Action for Sidebar */}
                  {filteredPosts.length > 1 && (
                     <button className="w-full mt-2 py-3 rounded-xl border border-[#27272A] bg-[#09090B] hover:bg-[#131316] hover:border-[#34D399]/50 transition-all text-xs font-mono font-medium text-[#9CA3AF] hover:text-[#34D399] flex items-center justify-center gap-2 group/btn">
                        Muat Lebih Banyak <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                     </button>
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
