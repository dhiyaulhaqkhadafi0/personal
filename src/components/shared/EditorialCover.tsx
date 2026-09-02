"use client";

import { useState, useEffect } from "react";

export type EditorialCoverProps = {
  src?: string | null;
  alt: string;
  aspectRatio?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  variant?: 'hero' | 'card' | 'thumbnail';
  category?: string;
};

/**
 * EditorialCover
 *
 * Premium editorial cover component with:
 * - Native <img> for zero-risk CDN/R2 loading.
 * - onError protection: automatically falls back to an elegant editorial canvas if the image fails.
 * - Aspect-ratio container to prevent Cumulative Layout Shift (CLS).
 * - High-end dark ambient fallback with subtle geometric watermark and editorial stamp.
 * - No raw alt text or broken image icons displayed inside the canvas.
 */
export function EditorialCover({
  src,
  alt,
  aspectRatio,
  className = '',
  imageClassName = '',
  priority = false,
  variant = 'card',
  category,
}: EditorialCoverProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset error state if image source changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const cleanSrc = src && typeof src === 'string' && src.trim().length > 0 ? src.trim() : null;
  const showFallback = !cleanSrc || hasError;

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#0A0B0E] select-none ${aspectRatio || ''} ${className}`}
      role="img"
      aria-label={alt || 'Cover artikel Khadafi Journal'}
    >
      {/* Background Editorial Canvas (always present as backdrop / fallback) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden">
        {/* Ambient Subtle Glows */}
        <div className="absolute -top-[20%] -right-[15%] w-[65%] h-[65%] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.09)_0%,transparent_70%)] blur-2xl" />
        <div className="absolute -bottom-[20%] -left-[15%] w-[65%] h-[65%] rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.08)_0%,transparent_70%)] blur-2xl" />

        {/* Delicate Architectural Grid Watermark */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04] text-white"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern id="editorial-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#editorial-grid)" />
        </svg>

        {/* Minimal Corner Crosshair Accents (for hero & card variants) */}
        {variant !== 'thumbnail' && (
          <>
            <span className="absolute top-3 left-3 font-mono text-[9px] text-white/15 tracking-widest">+</span>
            <span className="absolute top-3 right-3 font-mono text-[9px] text-white/15 tracking-widest">+</span>
            <span className="absolute bottom-3 left-3 font-mono text-[9px] text-white/15 tracking-widest">+</span>
            <span className="absolute bottom-3 right-3 font-mono text-[9px] text-white/15 tracking-widest">+</span>
          </>
        )}

        {/* Editorial Brand Stamp */}
        <div className="relative z-10 flex flex-col items-center gap-1.5 px-4 text-center">
          {variant === 'thumbnail' ? (
            <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] text-[#71717A] uppercase bg-[#000000]/60 px-2 py-0.5 rounded border border-white/5">
              KHADAFI
            </span>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#000000]/50 border border-white/10 backdrop-blur-md shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]/80 animate-pulse" />
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] text-[#A1A1AA] uppercase">
                KHADAFI JOURNAL {category ? `• ${category}` : '• EDITORIAL'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actual Image Rendered on Top */}
      {!showFallback && (
        <img
          src={cleanSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${imageClassName}`}
        />
      )}

      {/* Subtle vignette border inside */}
      <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-[inherit]" />
    </div>
  );
}
