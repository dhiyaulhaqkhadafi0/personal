"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Heart, Share2, Link2, MessageSquare, Send } from "lucide-react";

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

type Props = {
  slug: string;
};

type Comment = {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
};

export default function EngagementSection({ slug }: Props) {
  const [views, setViews] = useState<number | null>(null);
  const [ignites, setIgnites] = useState<number | null>(null);
  const [isIgniting, setIsIgniting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Record view & fetch metrics
    const fetchMetrics = async () => {
      try {
        const res = await fetch(`/api/metrics/${slug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "view" }),
        });
        const data = await res.json();
        if (data.view_count !== undefined) {
          setViews(data.view_count);
          setIgnites(data.ignite_count);
        }
      } catch (error) {
        console.error("Failed to fetch metrics", error);
      }
    };
    
    // Fetch comments (assuming we build this API next, for now it's optimistic/empty)
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch {
        // Silently ignore if API not ready yet
      }
    };

    fetchMetrics();
    fetchComments();
  }, [slug]);

  const handleIgnite = async () => {
    if (isIgniting) return;
    setIsIgniting(true);
    
    try {
      const res = await fetch(`/api/metrics/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "ignite" }),
      });
      const data = await res.json();
      if (data.ignite_count !== undefined) {
        setIgnites(data.ignite_count);
      }
    } catch (error) {
      console.error("Failed to ignite", error);
    }
    
    setTimeout(() => setIsIgniting(false), 600);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareMenu(false);
    // Could add toast here
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/comments/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: userName, content: newComment }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setComments([data, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to post comment", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mt-24 border-t border-[#27272A] pt-12 pb-16">
      
      {/* Metrics & Actions (Medium Style) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-16">
        
        {/* Left: View & Clap */}
        <div className="flex items-center gap-6 bg-[#18181B] py-2 px-5 rounded-full border border-[#27272A]">
          <div className="flex items-center gap-2 text-[#9CA3AF]">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-mono">{views !== null ? views.toLocaleString() : "---"}</span>
          </div>
          
          <div className="w-[1px] h-4 bg-[#27272A]" />
          
          <button 
            onClick={handleIgnite}
            className="group flex items-center gap-2 text-[#9CA3AF] hover:text-[#EF4444] transition-colors relative"
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={isIgniting ? { scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] } : {}}
              className="relative"
            >
              <Heart className={`w-4 h-4 ${isIgniting ? 'text-[#EF4444] fill-[#EF4444]' : 'group-hover:fill-[#EF4444]/20'}`} />
              <AnimatePresence>
                {isIgniting && (
                  <motion.div
                    initial={{ opacity: 1, scale: 0.5 }}
                    animate={{ opacity: 0, scale: 2.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-full border border-[#EF4444] z-[-1]"
                  />
                )}
              </AnimatePresence>
            </motion.div>
            <span className="text-sm font-mono">{ignites !== null ? ignites.toLocaleString() : "---"}</span>
          </button>
        </div>

        {/* Right: Share */}
        <div className="relative">
          <button 
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#E2E8F0] bg-[#18181B] py-2 px-5 rounded-full border border-[#27272A] transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share</span>
          </button>

          <AnimatePresence>
            {showShareMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 bottom-full mb-3 flex items-center gap-2 bg-[#18181B] p-2 rounded-xl border border-[#27272A] shadow-xl"
              >
                <a href={`https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? window.location.href : ''}`} target="_blank" rel="noreferrer" className="p-2 text-[#9CA3AF] hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 rounded-lg transition-colors">
                  <TwitterIcon className="w-4 h-4" />
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? window.location.href : ''}`} target="_blank" rel="noreferrer" className="p-2 text-[#9CA3AF] hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 rounded-lg transition-colors">
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <button onClick={copyLink} className="p-2 text-[#9CA3AF] hover:text-[#E2E8F0] hover:bg-[#27272A] rounded-lg transition-colors">
                  <Link2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Discussion / Comments Section */}
      <div className="max-w-2xl mx-auto">
        <h3 className="text-xl text-[#F8FAFC] font-serif font-medium flex items-center gap-2 mb-8">
          <MessageSquare className="w-5 h-5 text-[#34D399]" />
          Ruang Diskusi ({comments.length})
        </h3>

        {/* Comment Form */}
        <form onSubmit={submitComment} className="mb-12 bg-[#111113] border border-[#27272A] rounded-2xl p-5 shadow-inner">
          <input
            type="text"
            placeholder="Nama (Opsional/Anonim)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full bg-transparent border-b border-[#27272A] pb-3 mb-4 text-[#E2E8F0] placeholder-[#6B7280] focus:outline-none focus:border-[#34D399]/50 transition-colors text-sm font-mono"
            required
          />
          <textarea
            placeholder="Bagikan pemikiran atau perspektif Anda..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full bg-transparent text-[#E2E8F0] placeholder-[#6B7280] resize-none focus:outline-none text-base leading-relaxed mb-4"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim() || !userName.trim()}
              className="flex items-center gap-2 bg-[#34D399]/10 hover:bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30 px-5 py-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Respon"}
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-8">
          {comments.map((comment) => (
            <div key={comment.id} className="group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#27272A] to-[#18181B] border border-[#3F3F46] flex items-center justify-center text-xs font-medium text-[#A1A1AA]">
                  {comment.user_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-[#E2E8F0] font-medium text-sm">{comment.user_name}</div>
                  <div className="text-[#6B7280] text-xs font-mono">
                    {new Date(comment.created_at).toLocaleDateString("id-ID", { month: "short", day: "numeric" })}
                  </div>
                </div>
              </div>
              <p className="text-[#A1A1AA] text-sm leading-relaxed pl-11">
                {comment.content}
              </p>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-10 text-[#6B7280] font-light italic">
              Jadilah yang pertama membuka wawasan di lembar ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
