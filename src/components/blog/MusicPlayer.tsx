"use client";

import { useMusic, ATMOSPHERES } from "@/context/MusicContext";
import { Headphones, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";

const SpotifyLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.502 17.31c-.218.358-.682.474-1.04.256-2.853-1.743-6.444-2.138-10.675-1.171-.41.094-.823-.162-.917-.572-.094-.41.162-.823.572-.917 4.634-1.059 8.608-.616 11.804 1.334.358.218.474.682.256 1.07zm1.468-3.268c-.274.446-.86.588-1.306.314-3.265-2.008-8.243-2.59-12.106-1.418-.5.152-1.033-.134-1.185-.634-.152-.5.134-1.033.634-1.185 4.412-1.339 9.897-.687 13.65 1.621.446.274.588.86.313 1.302zm.126-3.41c-3.915-2.325-10.37-2.54-14.113-1.404-.6.182-1.24-.162-1.422-.762-.182-.6.162-1.24.762-1.422 4.298-1.305 11.425-1.053 15.932 1.623.539.32.716 1.02.396 1.56-.32.54-1.02.716-1.555.405z" />
  </svg>
);

export default function MusicPlayer() {
  const {
    currentAtmosphere,
    isExpanded,
    hasLoadedIframe,
    selectAtmosphere,
    toggleExpanded,
    setIsExpanded,
  } = useMusic();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none select-none">
      {/* ================= 1. EXPANDED ATMOSPHERE DOCK (Persistent in DOM, smooth GPU transition) ================= */}
      <div
        className={`w-[340px] sm:w-[380px] bg-[#111113]/95 backdrop-blur-2xl border border-[#27272A] rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden transition-all duration-300 ease-out origin-bottom-right ${
          isExpanded
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto mb-3"
            : "opacity-0 scale-95 translate-y-8 pointer-events-none absolute bottom-0 right-0"
        }`}
      >
        {/* Spotify Green Ambient Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#1DB954]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header: Title & Minimize Button */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#27272A]/70">
          <div className="flex items-center gap-2">
            <SpotifyLogo className="w-5 h-5 text-[#1DB954]" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#F8FAFC] font-semibold">
              Choose Your Atmosphere
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="p-1.5 rounded-full text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[#27272A] transition-colors"
            title="Kecilkan Player"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Mood Atmosphere Selector Chips */}
        <div className="mb-4">
          <div className="text-[11px] font-mono text-[#9CA3AF] uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Reading Soundscape</span>
            <span className="text-[#34D399] flex items-center gap-1 font-sans text-xs font-medium">
              <Headphones className="w-3 h-3" /> {currentAtmosphere.emoji} {currentAtmosphere.name}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {ATMOSPHERES.map((atm) => {
              const isSelected = currentAtmosphere.id === atm.id;
              return (
                <button
                  key={atm.id}
                  type="button"
                  onClick={() => selectAtmosphere(atm)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? "bg-[#1DB954]/15 border-[#1DB954] text-[#F8FAFC] shadow-[0_0_15px_rgba(29,185,84,0.25)] scale-[1.02]"
                      : "bg-[#09090B] border-[#27272A] text-[#9CA3AF] hover:border-[#3F3F46] hover:text-[#E2E8F0]"
                  }`}
                >
                  <span className="text-base mb-1">{atm.emoji}</span>
                  <span className="text-[11px] font-medium leading-tight line-clamp-1">{atm.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mood Tagline */}
        <p className="text-xs text-[#71717A] italic mb-3 text-center">
          &ldquo;{currentAtmosphere.tagline}&rdquo;
        </p>

        {/* Single Lazy-Loaded Spotify Embed (Always alive in DOM once initiated) */}
        {hasLoadedIframe && (
          <div className="rounded-2xl overflow-hidden border border-[#27272A] bg-[#09090B] shadow-inner">
            <iframe
              key={currentAtmosphere.spotifyPlaylistId}
              style={{ borderRadius: "12px", display: "block" }}
              src={`https://open.spotify.com/embed/playlist/${currentAtmosphere.spotifyPlaylistId}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              frameBorder="0"
              allowFullScreen={false}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* ================= 2. COMPACT SLIM ATMOSPHERE PILL (Visible when minimized) ================= */}
      {!isExpanded && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-auto flex items-center gap-2.5 bg-[#111113]/90 backdrop-blur-2xl border border-[#27272A] hover:border-[#1DB954]/60 rounded-full py-2 px-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all cursor-pointer group"
          onClick={toggleExpanded}
        >
          <SpotifyLogo className="w-4 h-4 text-[#1DB954] flex-shrink-0 group-hover:scale-110 transition-transform" />

          <div className="flex items-center gap-1.5 text-xs font-medium text-[#E2E8F0] group-hover:text-[#1DB954] transition-colors">
            <span>{currentAtmosphere.emoji}</span>
            <span>{currentAtmosphere.name}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-[#6B7280] bg-[#18181B] px-2 py-0.5 rounded-full border border-[#27272A]">
            <Headphones className="w-3 h-3 text-[#34D399]" />
            <span>{hasLoadedIframe ? "Aktif" : "Atmosphere"}</span>
          </div>
        </motion.button>
      )}
    </div>
  );
}
