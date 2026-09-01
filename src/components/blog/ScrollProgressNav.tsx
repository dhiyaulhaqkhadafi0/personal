"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function ScrollProgressNav() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Smooth out the scroll progress
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Calculate position for the glowing orb based on scroll progress
  const yPos = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed right-6 sm:right-8 top-1/2 -translate-y-1/2 z-50 h-32 sm:h-48 flex items-center justify-center opacity-0 md:opacity-100 pointer-events-none transition-opacity duration-700">
      
      {/* Background Track */}
      <div className="relative w-1 h-full bg-[#27272A]/50 rounded-full overflow-hidden shadow-inner backdrop-blur-sm">
        
        {/* Filled Progress Bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#1DB954] to-[#34D399] rounded-full origin-top shadow-[0_0_10px_rgba(52,211,153,0.5)]"
          style={{ scaleY, bottom: 0 }}
        />
      </div>

      {/* Glowing Orb following the progress */}
      <div className="absolute top-0 w-full h-full pointer-events-none">
        <motion.div 
          className="absolute right-[-4.5px] w-3 h-3 rounded-full bg-[#F8FAFC] shadow-[0_0_15px_rgba(52,211,153,0.9),_0_0_30px_rgba(52,211,153,0.6)]"
          style={{ top: yPos, y: "-50%" }}
        >
          {/* Inner pulsating core */}
          <div className="absolute inset-[2px] rounded-full bg-[#1DB954] animate-pulse" />
        </motion.div>
      </div>

    </div>
  );
}
