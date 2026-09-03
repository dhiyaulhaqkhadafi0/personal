"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Send } from "lucide-react";

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
  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch comments
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

    fetchComments();
  }, [slug]);

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
    <div className="mt-14 border-t border-white/10 pt-12 pb-16">
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
