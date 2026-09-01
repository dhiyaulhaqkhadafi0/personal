"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Minimize2, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SpotifyLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.502 17.31c-.218.358-.682.474-1.04.256-2.853-1.743-6.444-2.138-10.675-1.171-.41.094-.823-.162-.917-.572-.094-.41.162-.823.572-.917 4.634-1.059 8.608-.616 11.804 1.334.358.218.474.682.256 1.07zm1.468-3.268c-.274.446-.86.588-1.306.314-3.265-2.008-8.243-2.59-12.106-1.418-.5.152-1.033-.134-1.185-.634-.152-.5.134-1.033.634-1.185 4.412-1.339 9.897-.687 13.65 1.621.446.274.588.86.313 1.302zm.126-3.41c-3.915-2.325-10.37-2.54-14.113-1.404-.6.182-1.24-.162-1.422-.762-.182-.6.162-1.24.762-1.422 4.298-1.305 11.425-1.053 15.932 1.623.539.32.716 1.02.396 1.56-.32.54-1.02.716-1.555.405z" />
  </svg>
);

type Track = {
  title: string;
  artist: string;
  src: string;
};

const PLAYLIST: Track[] = [
  {
    title: "Deep Focus & Flow",
    artist: "Spotify • Curated Reading",
    src: "/assets/audio/track-1.mp3",
  },
  {
    title: "Digital Grimoire Chill",
    artist: "Spotify • Ambient LoFi",
    src: "/assets/audio/track-2.mp3",
  },
  {
    title: "Night Coding & Synth",
    artist: "Spotify • Instrumental",
    src: "/assets/audio/track-3.mp3",
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio play failed:", err);
          setIsPlaying(false);
        });
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
    if (audioRef.current) {
      audioRef.current.src = PLAYLIST[nextIndex].src;
      audioRef.current.load();
      playAudio();
    }
  };

  const handlePrev = () => {
    const prevIndex = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrackIndex(prevIndex);
    if (audioRef.current) {
      audioRef.current.src = PLAYLIST[prevIndex].src;
      audioRef.current.load();
      playAudio();
    }
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
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return "0:00";
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
        preload="auto"
      />

      {/* Floating Player (Bottom Right) */}
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
              className="w-80 md:w-88 bg-[#121214]/95 backdrop-blur-2xl border border-[#27272A] rounded-3xl p-5 shadow-[0_16px_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
              {/* Spotify Green Accent Glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#1DB954]/15 rounded-full blur-3xl pointer-events-none" />

              {/* Header: Spotify Logo & Minimize Button */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#27272A]/70">
                <div className="flex items-center gap-2">
                  <SpotifyLogo className="w-5 h-5 text-[#1DB954]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-[#F8FAFC] font-semibold">
                    Spotify Focus Player
                  </span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-full text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[#27272A] transition-colors"
                  title="Kecilkan Player"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Track Info & Animated Wave */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="truncate">
                  <h4 className="text-sm font-semibold text-[#F8FAFC] truncate">
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
                      className="w-1 bg-[#1DB954] rounded-full"
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
                  className="w-full h-1.5 bg-[#27272A] rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
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
                  className="p-2 text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[#18181B] rounded-full transition-colors active:scale-90"
                  title="Lagu Sebelumnya"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black flex items-center justify-center shadow-[0_0_25px_rgba(29,185,84,0.4)] transition-transform hover:scale-105 active:scale-95"
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
                  className="p-2 text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[#18181B] rounded-full transition-colors active:scale-90"
                  title="Lagu Berikutnya"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Slider Section */}
              <div className="flex items-center gap-3 bg-[#0A0A0C] px-3.5 py-2.5 rounded-2xl border border-[#27272A]">
                <button
                  onClick={toggleMute}
                  className="text-[#9CA3AF] hover:text-[#1DB954] transition-colors flex-shrink-0"
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
                  className="w-full h-1 bg-[#27272A] rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
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
              className="flex items-center gap-2.5 bg-[#121214]/90 backdrop-blur-2xl border border-[#27272A] hover:border-[#1DB954]/50 rounded-full py-1.5 pl-2.5 pr-4 shadow-2xl transition-all"
            >
              {/* Play / Pause Toggle Button with Spotify Green */}
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
                title={isPlaying ? "Pause" : "Play Musik"}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>

              {/* Title & Spotify Logo (Click to expand) */}
              <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-2.5 text-left group"
              >
                <SpotifyLogo className="w-4 h-4 text-[#1DB954] flex-shrink-0" />
                
                <div className="max-w-[130px] truncate">
                  <div className="text-xs font-semibold text-[#E2E8F0] group-hover:text-[#1DB954] transition-colors truncate">
                    {currentTrack.title}
                  </div>
                  <div className="text-[10px] text-[#6B7280] font-mono">
                    {isPlaying ? "Sedang Memutar" : "Spotify LoFi"}
                  </div>
                </div>

                {/* Animated Equalizer Wave */}
                <div className="flex items-end gap-0.5 h-3.5 flex-shrink-0 pr-1">
                  {[40, 80, 50, 90].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={isPlaying ? { height: ["20%", `${h}%`, "20%"] } : { height: "20%" }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                      className="w-0.5 bg-[#1DB954] rounded-full"
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
