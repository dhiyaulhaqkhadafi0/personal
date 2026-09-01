"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Minimize2, Maximize2, Music, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Track = {
  title: string;
  artist: string;
  src: string;
  duration: string;
};

const PLAYLIST: Track[] = [
  {
    title: "Deep Focus & Code",
    artist: "LoFi Instrument",
    src: "https://assets.mixkit.co/music/preview/mixkit-chill-bro-494.mp3",
    duration: "2:15",
  },
  {
    title: "Midnight Wisdom",
    artist: "Ambient Acoustic",
    src: "https://assets.mixkit.co/music/preview/mixkit-sleepy-cat-135.mp3",
    duration: "2:40",
  },
  {
    title: "Serene Horizon",
    artist: "Calm Piano Study",
    src: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
    duration: "3:02",
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current && hasInteracted) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrackIndex, isPlaying, hasInteracted]);

  const togglePlay = () => {
    setHasInteracted(true);
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setHasInteracted(true);
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setHasInteracted(true);
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onLoadedMetadata={handleTimeUpdate}
        preload="metadata"
      />

      {/* Floating Bottom-Right Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            /* ================= FULL EXPANDED CARD ================= */
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-80 md:w-88 bg-[#111113]/95 backdrop-blur-2xl border border-[#27272A] rounded-3xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative overflow-hidden"
            >
              {/* Subtle animated background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#34D399]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Header: Title & Minimize */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#27272A]/60">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#34D399]/20 flex items-center justify-center">
                    <Music className="w-3.5 h-3.5 text-[#34D399]" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#E2E8F0] font-medium">
                    Alunan Literasi
                  </span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-full text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[#27272A] transition-colors"
                  title="Minimize Player"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Track Info & Equalizer */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="truncate">
                  <h4 className="text-sm font-medium text-[#F8FAFC] truncate">
                    {currentTrack.title}
                  </h4>
                  <p className="text-xs text-[#9CA3AF] font-mono mt-0.5 truncate">
                    {currentTrack.artist}
                  </p>
                </div>

                {/* Animated Equalizer Wave */}
                <div className="flex items-end gap-1 h-5 flex-shrink-0">
                  {[40, 90, 60, 100, 50].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={isPlaying ? { height: ["20%", `${h}%`, "20%"] } : { height: "20%" }}
                      transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.12 }}
                      className="w-1 bg-[#34D399] rounded-full"
                    />
                  ))}
                </div>
              </div>

              {/* Progress Slider & Timing */}
              <div className="mb-4">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-[#27272A] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#6B7280] mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls: Prev | Play/Pause | Next */}
              <div className="flex items-center justify-center gap-6 mb-4">
                <button
                  onClick={handlePrev}
                  className="p-2 text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[#18181B] rounded-full transition-colors"
                  title="Previous Track"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-[#34D399] hover:bg-[#2DD4BF] text-[#09090B] flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-transform hover:scale-105 active:scale-95"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="p-2 text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[#18181B] rounded-full transition-colors"
                  title="Next Track"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Slider Section */}
              <div className="flex items-center gap-3 bg-[#09090B] px-3.5 py-2.5 rounded-2xl border border-[#27272A]">
                <button
                  onClick={toggleMute}
                  className="text-[#9CA3AF] hover:text-[#34D399] transition-colors flex-shrink-0"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-[#27272A] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
                />

                <span className="text-[11px] font-mono text-[#6B7280] w-7 text-right">
                  {isMuted ? "0%" : `${Math.round(volume * 100)}%`}
                </span>
              </div>
            </motion.div>
          ) : (
            /* ================= COMPACT SLIM PILL (NEVER BLOCKS CONTENT) ================= */
            <motion.div
              key="compact"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 bg-[#111113]/90 backdrop-blur-2xl border border-[#27272A] hover:border-[#34D399]/40 rounded-full py-1.5 pl-2 pr-3.5 shadow-2xl transition-all"
            >
              {/* Play / Pause Toggle Button */}
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-[#34D399] hover:bg-[#2DD4BF] text-[#09090B] flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
                title={isPlaying ? "Pause" : "Play Instrumental"}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>

              {/* Title & Equalizer (Click to expand) */}
              <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-3 text-left group"
              >
                <div className="max-w-[130px] truncate">
                  <div className="text-xs font-medium text-[#E2E8F0] group-hover:text-[#34D399] transition-colors truncate">
                    {currentTrack.title}
                  </div>
                  <div className="text-[10px] text-[#6B7280] font-mono">
                    {isPlaying ? "Sedang Memutar" : "Alunan Musik"}
                  </div>
                </div>

                {/* Animated Equalizer Wave */}
                <div className="flex items-end gap-0.5 h-3.5 flex-shrink-0 pr-1">
                  {[40, 80, 50, 90].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={isPlaying ? { height: ["20%", `${h}%`, "20%"] } : { height: "20%" }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                      className="w-0.5 bg-[#34D399] rounded-full"
                    />
                  ))}
                </div>

                <div className="p-1 text-[#6B7280] group-hover:text-[#E2E8F0] transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
