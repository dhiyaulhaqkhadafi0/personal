"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Sparkles } from "lucide-react";

type GrimoireMetricsProps = {
  slug: string;
};

export default function GrimoireMetrics({ slug }: GrimoireMetricsProps) {
  const [views, setViews] = useState<number | null>(null);
  const [ignites, setIgnites] = useState<number | null>(null);
  const [isIgniting, setIsIgniting] = useState(false);

  useEffect(() => {
    const recordView = async () => {
      try {
        const res = await fetch(`/api/metrics/${slug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "view" }),
        });
        const data = await res.json();
        if (data.view_count !== undefined) {
          setViews(data.view_count);
          setIgnites(data.ignite_count);
        }
      } catch (error) {
        console.error("Failed to record view", error);
      }
    };
    recordView();
  }, [slug]);

  const handleIgnite = async () => {
    if (isIgniting) return;
    setIsIgniting(true);
    
    try {
      const res = await fetch(`/api/metrics/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "ignite" }),
      });
      const data = await res.json();
      if (data.ignite_count !== undefined) {
        setIgnites(data.ignite_count);
      }
    } catch (error) {
      console.error("Failed to ignite", error);
    }
    
    setTimeout(() => {
      setIsIgniting(false);
    }, 800);
  };

  return (
    <div className="flex items-center gap-8 py-6 border-t border-[#27272A]/50">
      
      {/* View Counter */}
      <div className="flex items-center gap-2.5 text-[#6B7280]">
        <Eye className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.5} />
        <span className="font-mono text-sm tracking-wide">
          {views !== null ? views.toLocaleString() : "---"} views
        </span>
      </div>

      {/* Ignite Button (Subtle & Elegant) */}
      <button 
        onClick={handleIgnite}
        disabled={isIgniting}
        className="group flex items-center gap-2.5 text-[#6B7280] hover:text-[#D1D5DB] transition-colors relative"
      >
        <motion.div
          whileTap={{ scale: 0.9 }}
          animate={isIgniting ? { 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          } : {}}
          transition={{ duration: 0.4 }}
          className="relative flex items-center justify-center"
        >
          <Sparkles 
            className={`w-4 h-4 transition-colors duration-300 ${isIgniting ? 'text-[#34D399] fill-[#34D399]/20' : 'group-hover:text-[#34D399]'}`} 
            strokeWidth={1.5}
          />
          
          <AnimatePresence>
            {isIgniting && (
              <motion.div
                initial={{ opacity: 0.8, scale: 0.5 }}
                animate={{ opacity: 0, scale: 2.5 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 border border-[#34D399] rounded-full z-[-1]"
              />
            )}
          </AnimatePresence>
        </motion.div>
        
        <span className={`font-mono text-sm tracking-wide transition-colors duration-300 ${isIgniting ? 'text-[#34D399]' : ''}`}>
          {ignites !== null ? ignites.toLocaleString() : "---"} ignites
        </span>
      </button>

    </div>
  );
}
