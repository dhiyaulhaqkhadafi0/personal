"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type BlogPost = {
  metadata: {
    title: string;
    category: string;
    date: string;
    excerpt: string;
    slug: string;
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
      {/* Search Bar & Filters */}
      <div className="mb-12 space-y-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#6B7280] group-focus-within:text-[#34D399] transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-[#18181B]/50 border border-[#27272A] rounded-xl py-4 pl-12 pr-4 text-[#E2E8F0] placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#34D399]/50 focus:border-[#34D399]/50 transition-all backdrop-blur-sm"
            placeholder="Cari konsep, arsitektur, atau pemikiran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30"
                  : "bg-[#18181B]/50 text-[#9CA3AF] border border-[#27272A] hover:bg-[#27272A]/50 hover:text-[#D1D5DB]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6 min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.metadata.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/blog/${post.metadata.slug}`} className="block group">
                <article className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-10 py-6 border-b border-[#27272A]/50 hover:border-[#52525B] transition-colors duration-300">
                  <div className="flex-shrink-0 w-full md:w-32 flex items-center md:flex-col md:items-start gap-4 md:gap-1 text-sm">
                    <span className="text-[#6B7280] font-mono tracking-wide">
                      {new Date(post.metadata.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="hidden md:inline text-[#3F3F46]">•</span>
                    <span className="text-[#34D399]/80 font-medium tracking-wide uppercase text-xs">
                      {post.metadata.category}
                    </span>
                  </div>
                  <div className="flex-grow space-y-3">
                    <h2 className={`text-2xl text-[#E2E8F0] group-hover:text-white font-medium leading-snug transition-colors ${loraClassName}`}>
                      {post.metadata.title}
                    </h2>
                    <p className="text-[#9CA3AF] leading-relaxed text-base font-light max-w-2xl group-hover:text-[#D1D5DB] transition-colors">
                      {post.metadata.excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
          
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-[#6B7280] font-light italic text-center"
            >
              Tidak ada catatan yang sesuai dengan pencarian Anda.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
