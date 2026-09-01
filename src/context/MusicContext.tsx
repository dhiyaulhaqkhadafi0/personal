"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

export type Track = {
  title: string;
  artist: string;
  src: string;
};

export const PLAYLIST: Track[] = [
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

type MusicContextType = {
  currentTrack: Track;
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  togglePlay: () => void;
  playAudio: () => void;
  pauseAudio: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleSeek: (time: number) => void;
  handleVolumeChange: (val: number) => void;
  toggleMute: () => void;
  formatTime: (timeInSeconds: number) => string;
};

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playAudio = () => {
    if (audioRef.current) {
      if (!hasStarted) {
        audioRef.current.src = currentTrack.src;
        setHasStarted(true);
      }
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
      if (isPlaying || hasStarted) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const handlePrev = () => {
    const prevIndex = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrackIndex(prevIndex);
    if (audioRef.current) {
      audioRef.current.src = PLAYLIST[prevIndex].src;
      audioRef.current.load();
      if (isPlaying || hasStarted) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (val: number) => {
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
    <MusicContext.Provider
      value={{
        currentTrack,
        currentTrackIndex,
        isPlaying,
        volume,
        isMuted,
        currentTime,
        duration,
        isExpanded,
        setIsExpanded,
        togglePlay,
        playAudio,
        pauseAudio,
        handleNext,
        handlePrev,
        handleSeek,
        handleVolumeChange,
        toggleMute,
        formatTime,
      }}
    >
      {/* On-Demand Audio Element with preload=none to save initial bandwidth */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onLoadedMetadata={handleTimeUpdate}
        preload="none"
      />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
