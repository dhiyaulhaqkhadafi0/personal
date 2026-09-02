"use client";

import { useState, useEffect } from "react";

export type EditorialCoverProps = {
  src?: string | null;
  alt: string;
  title?: string;
  category?: string;
  slug?: string;
  aspectRatio?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  variant?: 'hero' | 'card' | 'thumbnail';
};

/**
 * Deterministically generates a distinct, premium dark color palette based on string seed.
 * Ensures every article without an image receives a unique, intentional visual identity.
 */
function getDeterministicPalette(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash);

  const palettes = [
    // 1. Deep Emerald / Cyber Forest
    {
      bgGradient: 'from-[#06130E] via-[#0B1A14] to-[#040806]',
      accentBg: 'bg-[#34D399]/15 border-[#34D399]/30 text-[#34D399]',
      glow: 'radial-gradient(ellipse at 85% 15%, rgba(52, 211, 153, 0.16) 0%, transparent 65%), radial-gradient(ellipse at 15% 85%, rgba(16, 185, 129, 0.08) 0%, transparent 60%)',
      border: 'border-[#34D399]/20',
      rule: 'bg-[#34D399]/50',
    },
    // 2. Cosmic Indigo / Deep Violet
    {
      bgGradient: 'from-[#0B0918] via-[#120F24] to-[#070610]',
      accentBg: 'bg-[#A78BFA]/15 border-[#A78BFA]/30 text-[#A78BFA]',
      glow: 'radial-gradient(ellipse at 85% 15%, rgba(167, 139, 250, 0.16) 0%, transparent 65%), radial-gradient(ellipse at 15% 85%, rgba(129, 140, 248, 0.08) 0%, transparent 60%)',
      border: 'border-[#A78BFA]/20',
      rule: 'bg-[#A78BFA]/50',
    },
    // 3. Midnight Sapphire / Oceanic Cobalt
    {
      bgGradient: 'from-[#06101B] via-[#0B1727] to-[#040810]',
      accentBg: 'bg-[#60A5FA]/15 border-[#60A5FA]/30 text-[#60A5FA]',
      glow: 'radial-gradient(ellipse at 85% 15%, rgba(96, 165, 250, 0.16) 0%, transparent 65%), radial-gradient(ellipse at 15% 85%, rgba(56, 189, 248, 0.08) 0%, transparent 60%)',
      border: 'border-[#60A5FA]/20',
      rule: 'bg-[#60A5FA]/50',
    },
    // 4. Crimson Velvet / Solar Rose
    {
      bgGradient: 'from-[#17080F] via-[#220D17] to-[#0E0409]',
      accentBg: 'bg-[#FB7185]/15 border-[#FB7185]/30 text-[#FB7185]',
      glow: 'radial-gradient(ellipse at 85% 15%, rgba(251, 113, 133, 0.16) 0%, transparent 65%), radial-gradient(ellipse at 15% 85%, rgba(244, 63, 94, 0.08) 0%, transparent 60%)',
      border: 'border-[#FB7185]/20',
      rule: 'bg-[#FB7185]/50',
    },
    // 5. Warm Obsidian Amber
    {
      bgGradient: 'from-[#150E06] via-[#1E1509] to-[#0C0803]',
      accentBg: 'bg-[#FBBF24]/15 border-[#FBBF24]/30 text-[#FBBF24]',
      glow: 'radial-gradient(ellipse at 85% 15%, rgba(251, 191, 36, 0.15) 0%, transparent 65%), radial-gradient(ellipse at 15% 85%, rgba(245, 158, 11, 0.08) 0%, transparent 60%)',
      border: 'border-[#FBBF24]/20',
      rule: 'bg-[#FBBF24]/50',
    },
    // 6. Aqua Teal / Glaze Mint
    {
      bgGradient: 'from-[#051214] via-[#091C1E] to-[#030B0D]',
      accentBg: 'bg-[#2DD4BF]/15 border-[#2DD4BF]/30 text-[#2DD4BF]',
      glow: 'radial-gradient(ellipse at 85% 15%, rgba(45, 212, 191, 0.16) 0%, transparent 65%), radial-gradient(ellipse at 15% 85%, rgba(20, 184, 166, 0.08) 0%, transparent 60%)',
      border: 'border-[#2DD4BF]/20',
      rule: 'bg-[#2DD4BF]/50',
    },
  ];

  return palettes[index % palettes.length];
}

/**
 * EditorialCover
 *
 * Requirements:
 * - When valid image exists: clean, unobstructed, full object-cover display without badges, watermarks, or overlays.
 * - When cover is missing / fails to load: intentional typographic editorial fallback displaying category and article title,
 *   styled with deterministic dark luxury palettes based on slug/title.
 * - onError handling ensures broken links fallback smoothly with zero raw alt text or browser broken icons.
 */
export function EditorialCover({
  src,
  alt,
  title,
  category,
  slug,
  aspectRatio,
  className = '',
  imageClassName = '',
  priority = false,
  variant = 'card',
}: EditorialCoverProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset error state whenever image source changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const cleanSrc = src && typeof src === 'string' && src.trim().length > 0 ? src.trim() : null;
  const showFallback = !cleanSrc || hasError;

  // Derive deterministic palette for typographic cover
  const seed = slug || title || alt || 'editorial-article';
  const palette = getDeterministicPalette(seed);

  if (!showFallback && cleanSrc) {
    return (
      <div
        className={`relative w-full overflow-hidden bg-[#090A0D] select-none ${aspectRatio || ''} ${className}`}
        role="img"
        aria-label={alt || title || 'Cover artikel'}
      >
        <img
          src={cleanSrc}
          alt={alt || title || 'Cover artikel'}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover object-center transition-opacity duration-300 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${imageClassName}`}
        />
        {/* Extremely thin inner border to ground edges without obstructing the photo */}
        <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-[inherit]" />
      </div>
    );
  }

  // Typographic Editorial Fallback
  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-br ${palette.bgGradient} border ${palette.border} select-none flex flex-col justify-between ${aspectRatio || ''} ${className}`}
      style={{ backgroundImage: palette.glow }}
      role="img"
      aria-label={alt || title || 'Cover artikel'}
    >
      {/* Ultra-subtle geometric framing lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.025] text-white pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern id={`grid-${seed}`} width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${seed})`} />
      </svg>

      {/* Top Section: Category & Minimal Indicator */}
      <div className={`relative z-10 flex items-center justify-between ${
        variant === 'thumbnail' ? 'p-2 sm:p-2.5' : variant === 'hero' ? 'p-6 sm:p-8' : 'p-4 sm:p-5'
      }`}>
        {category ? (
          <span className={`font-mono uppercase font-semibold tracking-wider rounded-full border backdrop-blur-md ${palette.accentBg} ${
            variant === 'thumbnail'
              ? 'text-[7px] sm:text-[8px] px-1.5 py-0.5'
              : variant === 'hero'
              ? 'text-[11px] sm:text-xs px-3.5 py-1'
              : 'text-[9px] sm:text-[10px] px-2.5 py-0.5'
          }`}>
            {category}
          </span>
        ) : <span />}

        {/* Minimal edition mark */}
        <span className="font-mono text-white/20 text-[9px] sm:text-[10px] tracking-widest uppercase">
          {variant === 'thumbnail' ? '' : 'EDITION'}
        </span>
      </div>

      {/* Bottom Section: Article Title & Accent Rule */}
      <div className={`relative z-10 flex flex-col justify-end ${
        variant === 'thumbnail' ? 'p-2 sm:p-2.5' : variant === 'hero' ? 'p-6 sm:p-8 md:p-10' : 'p-4 sm:p-5'
      }`}>
        <div className={`rounded-full ${palette.rule} ${
          variant === 'thumbnail' ? 'w-4 h-[1.5px] mb-1.5' : variant === 'hero' ? 'w-10 h-[2.5px] mb-3.5' : 'w-6 h-[2px] mb-2.5'
        }`} />

        <h3 className={`text-[#F8FAFC] font-medium tracking-tight font-serif ${
          variant === 'thumbnail'
            ? 'text-[10px] sm:text-[11px] leading-[1.3] line-clamp-2'
            : variant === 'hero'
            ? 'text-xl sm:text-2xl md:text-3xl leading-[1.22] line-clamp-3 sm:line-clamp-4'
            : 'text-sm sm:text-base md:text-lg leading-[1.3] line-clamp-3'
        }`}>
          {title || alt || 'Untitled Article'}
        </h3>
      </div>

      {/* Inner thin border */}
      <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-[inherit]" />
    </div>
  );
}
