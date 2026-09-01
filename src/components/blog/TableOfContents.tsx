"use client";

import { useEffect, useState } from "react";
import { ListCollapse, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TOCItem = {
  id: string;
  text: string;
  level: number;
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
    
    while ((match = regex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      foundHeadings.push({ id, text, level });
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
      { rootMargin: "0px 0px -80% 0px" }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 bg-[#131316]/80 backdrop-blur-md border border-[#27272A] rounded-full shadow-2xl text-[#9CA3AF] hover:text-[#34D399] hover:border-[#34D399]/30 transition-colors"
      >
        <ListCollapse className="w-6 h-6" />
      </motion.button>

      {/* Floating Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-28 right-8 z-50 w-72 max-h-[60vh] overflow-y-auto scrollbar-hide bg-[#131316]/90 backdrop-blur-xl border border-[#27272A]/80 shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#27272A]/50">
              <span className="text-sm font-mono uppercase tracking-wider text-[#F8FAFC]">Daftar Isi</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[#6B7280] hover:text-[#E2E8F0] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="space-y-1 relative border-l border-[#27272A]/50 pl-4 ml-1">
              {headings.map((heading) => {
                const isActive = activeId === heading.id;
                return (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    onClick={() => setIsOpen(false)}
                    className={`block text-[13px] py-1.5 transition-all duration-300 relative ${
                      heading.level === 3 ? "ml-4" : ""
                    } ${
                      isActive 
                        ? "text-[#34D399] font-medium" 
                        : "text-[#9CA3AF] hover:text-[#D1D5DB]"
                    }`}
                  >
                    {isActive && (
                      <motion.span 
                        layoutId="activeToCDot"
                        className="absolute -left-[18px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#34D399] rounded-full shadow-[0_0_10px_rgb(52,211,153)]" 
                      />
                    )}
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
