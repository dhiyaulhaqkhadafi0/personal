"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

export type Atmosphere = {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  spotifyPlaylistId: string;
};

export const ATMOSPHERES: Atmosphere[] = [
  {
    id: "deep-focus",
    name: "Deep Focus",
    emoji: "🧠",
    tagline: "Minimal instrumental for deep thinking",
    spotifyPlaylistId: "37i9dQZF1DWZeKCadgRdKQ",
  },
  {
    id: "midnight",
    name: "Midnight Coding",
    emoji: "🌙",
    tagline: "Atmospheric instrumentals & night vibe",
    spotifyPlaylistId: "37i9dQZF1DXdLEN7aqioXM",
  },
  {
    id: "piano",
    name: "Soft Piano",
    emoji: "🎹",
    tagline: "Calm piano & neo-classical peace",
    spotifyPlaylistId: "37i9dQZF1DX4sWSpwq3LiO",
  },
  {
    id: "ambient",
    name: "Future Ambient",
    emoji: "🌌",
    tagline: "Cinematic space & atmospheric drone",
    spotifyPlaylistId: "37i9dQZF1DX3Ogo9pFvBkY",
  },
  {
    id: "rain",
    name: "Rainy Window",
    emoji: "🌧",
    tagline: "Gentle rain sounds & focus ambient",
    spotifyPlaylistId: "37i9dQZF1DX8Uebhn9wzrS",
  },
  {
    id: "coffee",
    name: "Coffee & Code",
    emoji: "☕",
    tagline: "Warm lo-fi cafe vibes & steady flow",
    spotifyPlaylistId: "37i9dQZF1DWWQRwui0ExPn",
  },
];

type MusicContextType = {
  currentAtmosphere: Atmosphere;
  isExpanded: boolean;
  hasLoadedIframe: boolean;
  selectAtmosphere: (atm: Atmosphere) => void;
  recommendAtmosphere: (name: string) => void;
  toggleExpanded: () => void;
  setIsExpanded: (expanded: boolean) => void;
};

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentAtmosphere, setCurrentAtmosphere] = useState<Atmosphere>(ATMOSPHERES[0]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasLoadedIframe, setHasLoadedIframe] = useState(false);

  const selectAtmosphere = (atm: Atmosphere) => {
    setCurrentAtmosphere(atm);
    setHasLoadedIframe(true);
  };

  const recommendAtmosphere = useCallback((name: string) => {
    const recommended = ATMOSPHERES.find((atm) => atm.name.toLowerCase() === name.toLowerCase());
    if (recommended) setCurrentAtmosphere(recommended);
  }, []);

  const toggleExpanded = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      if (next) setHasLoadedIframe(true);
      return next;
    });
  };

  return (
    <MusicContext.Provider
      value={{
        currentAtmosphere,
        isExpanded,
        hasLoadedIframe,
        selectAtmosphere,
        recommendAtmosphere,
        toggleExpanded,
        setIsExpanded,
      }}
    >
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
