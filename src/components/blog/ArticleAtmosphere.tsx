"use client";

import { useEffect } from 'react';
import { useMusic } from '@/context/MusicContext';

export default function ArticleAtmosphere({ mood, enabled }: { mood?: string; enabled?: boolean }) {
  const { recommendAtmosphere } = useMusic();
  useEffect(() => {
    if (enabled && mood) recommendAtmosphere(mood);
  }, [enabled, mood, recommendAtmosphere]);
  return null;
}
