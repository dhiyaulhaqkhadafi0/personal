"use client";

import { useState, useEffect } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

type Props = {
  url: string;
  title: string;
};

export function ArticleShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanShare(true);
    }
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      ariaLabel: 'Bagikan ke WhatsApp',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.3-.778.98-.954 1.18-.175.2-.351.226-.652.075-.3-.15-1.267-.467-2.414-1.49-1.077-.96-1.804-2.146-2.016-2.508-.212-.362-.023-.558.128-.708.136-.135.301-.351.452-.527.15-.175.2-.3.301-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.636-.929-2.242-.244-.59-.492-.51-.678-.52-.175-.008-.376-.01-.577-.01-.2 0-.527.075-.803.376-.276.3-1.054 1.03-1.054 2.512 0 1.482 1.079 2.912 1.23 3.113.15.2 2.122 3.24 5.141 4.544 3.018 1.304 3.018.87 3.57.818.552-.05 1.78-.727 2.031-1.43.25-.703.25-1.305.176-1.43-.076-.126-.277-.201-.578-.352zM12.04 2C6.516 2 2.028 6.488 2.028 12.01c0 1.98.58 3.826 1.583 5.385L2 22l4.743-1.545a9.96 9.96 0 005.297 1.51c5.524 0 10.012-4.488 10.012-10.01C22.052 6.488 17.564 2 12.04 2z"/>
        </svg>
      ),
    },
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      ariaLabel: 'Bagikan ke X (Twitter)',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      ariaLabel: 'Bagikan ke LinkedIn',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z"/>
        </svg>
      ),
    },
  ];

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch {
        // user aborted or not allowed
      }
    }
  };

  return (
    <div className="pt-8 border-t border-white/10 my-8 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-semibold">
            Bagikan Cerita
          </span>
          <span className="w-1 h-1 rounded-full bg-[#3F3F46]" />
          <span className="text-[11px] text-[#71717A]">
            Diskusi &amp; sebarluaskan gagasan
          </span>
        </div>

        {/* Share buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Mobile Web Share Trigger */}
          {canShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="inline-flex sm:hidden items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#E2E8F0] font-medium transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#34D399]" />
              <span>Bagikan</span>
            </button>
          )}

          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.ariaLabel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14151B] hover:bg-[#1E202A] border border-white/10 hover:border-white/20 text-[#CBD5E1] hover:text-[#F8FAFC] text-xs font-medium transition-all shadow-sm active:scale-95"
            >
              <span className="text-[#94A3B8]">{link.icon}</span>
              <span>{link.name}</span>
            </a>
          ))}

          {/* Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label="Salin tautan artikel"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-sm active:scale-95 ${
              copied
                ? 'bg-[#10B981]/20 border-[#10B981]/50 text-[#34D399]'
                : 'bg-[#14151B] hover:bg-[#1E202A] border-white/10 hover:border-white/20 text-[#CBD5E1] hover:text-[#F8FAFC]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#34D399]" />
                <span className="text-[#34D399] font-semibold">Tautan disalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span>Salin tautan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
