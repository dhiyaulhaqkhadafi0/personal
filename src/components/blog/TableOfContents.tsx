"use client";

import { useEffect, useState } from "react";
import { ListCollapse, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TOCItem = {
  id: string;
  text: string;
  level: number;
  numbering: string;
};

type Props = {
  content: string;
};

export default function TableOfContents({ content }: Props) {
  const [activeId, setActiveId] = useState<string>("");
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const regex = /^(##|###)\s+(.+)$/gm;
    const foundHeadings: TOCItem[] = [];
    let match;
    
    let h2Count = 0;
    let h3Count = 0;

    while ((match = regex.exec(content)) !== null) {
      const level = match[1].length; // 2 for ##, 3 for ###
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      let numbering = "";
      if (level === 2) {
        h2Count++;
        h3Count = 0; // Reset H3 count when new H2 starts
        numbering = `${h2Count}.`;
      } else if (level === 3) {
        h3Count++;
        numbering = `${h2Count}.${h3Count}`;
      }
      
      foundHeadings.push({ id, text, level, numbering });
    }
    
    setHeadings(foundHeadings);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-10% 0px -75% 0px" }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleHeadingClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* Floating Toggle Button (Top Right) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-28 right-8 z-50 flex items-center justify-center w-12 h-12 bg-[#131316]/80 backdrop-blur-md border border-[#27272A] rounded-full shadow-2xl text-[#9CA3AF] hover:text-[#34D399] hover:border-[#34D399]/30 transition-colors"
        title="Buka Daftar Isi"
      >
        <ListCollapse className="w-5 h-5" />
      </motion.button>

      {/* Floating Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-44 right-8 z-50 w-80 max-h-[60vh] overflow-y-auto scrollbar-hide bg-[#131316]/95 backdrop-blur-2xl border border-[#27272A]/80 shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#27272A]/50">
              <span className="text-sm font-mono uppercase tracking-wider text-[#F8FAFC]">Daftar Isi</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[#6B7280] hover:text-[#E2E8F0] transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="space-y-1 relative border-l border-[#27272A]/50 pl-4 ml-1">
              {headings.map((heading) => {
                const isActive = activeId === heading.id;
                const isSub = heading.level === 3;
                return (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    onClick={(e) => handleHeadingClick(e, heading.id)}
                    className={`block py-1.5 transition-all duration-300 relative font-sans cursor-pointer ${
                      isSub ? "ml-4 text-[13px]" : "text-[14px] mt-2 font-medium"
                    } ${
                      isActive 
                        ? "text-[#34D399]" 
                        : "text-[#9CA3AF] hover:text-[#D1D5DB]"
                    }`}
                  >
                    {isActive && (
                      <motion.span 
                        layoutId="activeToCDot"
                        className="absolute -left-[18px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#34D399] rounded-full shadow-[0_0_10px_rgb(52,211,153)]" 
                      />
                    )}
                    <span className={`mr-2 font-mono ${isActive ? 'text-[#34D399]' : 'text-[#6B7280]'}`}>{heading.numbering}</span>
                    {heading.text}
                  </a>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
