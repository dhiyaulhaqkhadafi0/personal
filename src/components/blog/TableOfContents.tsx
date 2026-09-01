"use client";

import { useEffect, useState } from "react";
import { ListCollapse } from "lucide-react";

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

  useEffect(() => {
    // Basic markdown header parsing (H2 and H3)
    const regex = /^(##|###)\s+(.+)$/gm;
    const foundHeadings: TOCItem[] = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      // Simple slugify matching what rehype-slug might do
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
    <div className="sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto hidden xl:block w-64 pr-6 scrollbar-hide">
      <div className="flex items-center gap-2 text-[#E2E8F0] font-medium mb-4 text-sm uppercase tracking-wider font-mono">
        <ListCollapse className="w-4 h-4 text-[#34D399]" />
        Daftar Isi
      </div>
      <nav className="space-y-1 relative border-l border-[#27272A] pl-4 ml-2">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`block text-sm py-1.5 transition-colors duration-200 relative ${
                heading.level === 3 ? "ml-4" : ""
              } ${
                isActive 
                  ? "text-[#34D399] font-medium" 
                  : "text-[#9CA3AF] hover:text-[#D1D5DB]"
              }`}
            >
              {isActive && (
                <span className="absolute -left-[17px] top-1/2 -translate-y-1/2 w-[2px] h-full bg-[#34D399] rounded-full" />
              )}
              {heading.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
