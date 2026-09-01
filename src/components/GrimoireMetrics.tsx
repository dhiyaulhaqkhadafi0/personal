"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Zap } from "lucide-react";

type GrimoireMetricsProps = {
  slug: string;
};

export default function GrimoireMetrics({ slug }: GrimoireMetricsProps) {
  const [views, setViews] = useState<number | null>(null);
  const [ignites, setIgnites] = useState<number | null>(null);
  const [isIgniting, setIsIgniting] = useState(false);

  useEffect(() => {
    // Increment view count on mount
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
    
    // Only record once in development if StrictMode is on (prevent double fire by tracking state or local storage ideally, but this is fine for now)
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
    }, 1000); // Prevent spamming
  };

  return (
    <div className="flex items-center gap-6 py-8 border-t border-white/10 mt-12">
      <div className="flex items-center gap-2 text-slate-400">
        <Eye className="w-5 h-5 text-emerald-500/70" />
        <span className="font-mono text-sm">{views !== null ? views : "---"} Views</span>
      </div>

      <button 
        onClick={handleIgnite}
        disabled={isIgniting}
        className="group relative flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <motion.div
          whileTap={{ scale: 0.8 }}
          animate={isIgniting ? { 
            scale: [1, 1.5, 1],
            rotate: [0, 15, -15, 0],
            color: "#10b981" 
          } : {}}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Zap className={`w-5 h-5 ${isIgniting ? 'text-emerald-500 fill-emerald-500/20' : 'group-hover:text-emerald-500'}`} />
          
          <AnimatePresence>
            {isIgniting && (
              <motion.div
                initial={{ opacity: 1, scale: 0 }}
                animate={{ opacity: 0, scale: 2 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-emerald-500 rounded-full z-[-1]"
              />
            )}
          </AnimatePresence>
        </motion.div>
        
        <span className="font-mono text-sm">
          {ignites !== null ? ignites : "---"} Ignites
        </span>
      </button>
    </div>
  );
}
