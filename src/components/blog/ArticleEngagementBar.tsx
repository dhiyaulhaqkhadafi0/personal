"use client";

import { useEffect, useState, useRef } from 'react';
import { Eye, Heart } from 'lucide-react';

type Props = {
  slug: string;
  previewMode?: boolean;
};

const numberFormatter = new Intl.NumberFormat('id-ID');

export function ArticleEngagementBar({ slug, previewMode = false }: Props) {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState(false);
  const [likeAnimate, setLikeAnimate] = useState(false);

  // Active time tracking for honest view count (8 seconds of active visibility)
  const visibleSecondsRef = useRef(0);
  const hasRecordedViewRef = useRef(false);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (previewMode || !slug) {
      setViewCount(0);
      setLikeCount(0);
      setHasLiked(false);
      return;
    }

    let isMounted = true;

    // 1. Fetch current engagement stats
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/engagement/${slug}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          setViewCount(typeof data.view_count === 'number' ? data.view_count : 0);
          setLikeCount(typeof data.like_count === 'number' ? data.like_count : 0);
          setHasLiked(Boolean(data.viewer_has_liked));
        }
      } catch (err) {
        console.error('Failed to fetch engagement:', err);
      }
    };

    fetchStats();

    // 2. Active visibility timer (runs only when document is active and visible)
    const recordViewIfEligible = async () => {
      if (hasRecordedViewRef.current) return;
      hasRecordedViewRef.current = true;

      try {
        const res = await fetch(`/api/engagement/${slug}/view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            duration_seconds: visibleSecondsRef.current,
            visible_seconds: visibleSecondsRef.current,
          }),
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (typeof data.view_count === 'number') {
            setViewCount(data.view_count);
          }
          if (typeof data.like_count === 'number') {
            setLikeCount(data.like_count);
          }
        }
      } catch {
        // Silent ignore for view recording failures
      }
    };

    timerIntervalRef.current = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        visibleSecondsRef.current += 1;
        if (visibleSecondsRef.current >= 8 && !hasRecordedViewRef.current) {
          recordViewIfEligible();
        }
      }
    }, 1000);

    return () => {
      isMounted = false;
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [slug, previewMode]);

  const handleToggleLike = async () => {
    if (previewMode || isLiking) return;

    // Optimistic UI update
    const previousHasLiked = hasLiked;
    const previousLikeCount = likeCount ?? 0;
    const newHasLiked = !previousHasLiked;
    const newLikeCount = newHasLiked ? previousLikeCount + 1 : Math.max(0, previousLikeCount - 1);

    setHasLiked(newHasLiked);
    setLikeCount(newLikeCount);
    if (newHasLiked) {
      setLikeAnimate(true);
      setTimeout(() => setLikeAnimate(false), 400);
    }
    setIsLiking(true);

    try {
      const res = await fetch(`/api/engagement/${slug}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error('Gagal memperbarui suka');
      }

      const data = await res.json();
      if (typeof data.like_count === 'number') {
        setLikeCount(data.like_count);
      }
      if (typeof data.viewer_has_liked === 'boolean') {
        setHasLiked(data.viewer_has_liked);
      }
    } catch (err) {
      console.error('Error toggling like, rolling back:', err);
      // Rollback to previous state on failure
      setHasLiked(previousHasLiked);
      setLikeCount(previousLikeCount);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div
      aria-label="Statistik pembaca artikel"
      className="flex items-center justify-between py-4 px-4 my-6 rounded-2xl bg-[#111216] border border-white/10 select-none shadow-sm"
    >
      {/* View Counter */}
      <div className="flex items-center gap-2 text-[#94A3B8]">
        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#64748B]">
          <Eye className="w-4 h-4" strokeWidth={1.75} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-mono font-medium text-[#E2E8F0]">
            {viewCount !== null ? numberFormatter.format(viewCount) : '—'}
          </span>
          <span className="text-[10px] text-[#64748B] font-sans tracking-wide">
            dibaca
          </span>
        </div>
      </div>

      {/* Like Button */}
      <button
        type="button"
        onClick={handleToggleLike}
        disabled={previewMode || isLiking}
        aria-label={hasLiked ? 'Batalkan suka' : 'Beri suka untuk artikel ini'}
        title={hasLiked ? 'Batalkan suka' : 'Sukai artikel'}
        className={`group flex items-center gap-2 h-9 px-3.5 rounded-xl border text-xs font-medium transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34D399] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0E] ${
          hasLiked
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/15'
            : 'bg-[#14151B] border-white/10 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-white/20 hover:bg-white/5'
        } ${previewMode ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
      >
        <Heart
          className={`w-4 h-4 transition-transform duration-200 ${
            hasLiked
              ? 'fill-rose-500 text-rose-500 scale-110'
              : 'text-[#64748B] group-hover:text-rose-400'
          } ${likeAnimate ? 'scale-125 transition-transform' : ''}`}
          strokeWidth={1.75}
        />
        <span className="font-mono text-xs font-semibold">
          {likeCount !== null ? numberFormatter.format(likeCount) : '—'}
        </span>
        <span className="text-[11px] font-sans text-[#71717A] group-hover:text-[#94A3B8] hidden sm:inline">
          {hasLiked ? 'Disukai' : 'Suka'}
        </span>
      </button>
    </div>
  );
}
