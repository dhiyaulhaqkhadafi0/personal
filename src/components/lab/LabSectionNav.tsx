"use client";

import { useEffect, useState } from "react";
import { LAB_NAV_ITEMS } from "@/lib/hcftl";

export function LabSectionNav() {
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const item of LAB_NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Navigasi Seksi Lab"
      className="sticky top-20 z-40 w-full py-2.5 backdrop-blur-xl bg-[#05070A]/85 border-y border-white/[0.06] transition-all"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#7DD3FC]/80 hidden sm:inline">
            HCFTL / LAB NAV
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {LAB_NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`text-xs font-mono tracking-wider px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#7DD3FC]/15 text-[#7DD3FC] border border-[#7DD3FC]/30 shadow-[0_0_15px_rgba(125,211,252,0.15)] font-semibold"
                    : "text-[#A2ACB9] hover:text-[#F4F7FA] hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                {item.label.toUpperCase()}
              </button>
            );
          })}
        </div>

        <div className="text-[10px] font-mono text-[#66717F] hidden md:inline">
          EST. 2026
        </div>
      </div>
    </nav>
  );
}
