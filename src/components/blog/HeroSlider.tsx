"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ['latin'], style: ['normal', 'italic'] });

const IMAGES = Array.from({ length: 10 }, (_, i) => `/assets/images/cover-${i + 1}.png`);

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 5000); // Ganti gambar setiap 5 detik
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mb-20 flex flex-col items-center text-center">
      
      {/* Sliding Image Container */}
      <div className="w-full max-w-5xl h-[35vh] md:h-[45vh] min-h-[300px] relative rounded-3xl overflow-hidden mb-12 shadow-2xl border border-[#27272A]/50 group bg-[#09090B]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image 
              src={IMAGES[currentIndex]} 
              alt="The Digital Grimoire Worlds" 
              fill
              priority
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Gradients to blend and style the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-90 z-10" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl z-10 pointer-events-none" />
      </div>
      
      <div className="max-w-3xl relative z-20">
        <h1 className={`text-5xl md:text-[4rem] font-medium tracking-tight mb-6 drop-shadow-sm ${lora.className}`}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8FAFC] via-[#34D399] to-[#F8FAFC] bg-[length:200%_auto] animate-gradient-x inline-block">
            The Digital Grimoire
          </span>
        </h1>
        <p className="text-[#A1A1AA] text-lg md:text-xl leading-relaxed font-light">
          Catatan perjalanan, arsip pemikiran, dan kerangka arsitektur. 
          Menjembatani batas antara logika komputasi dan intuisi desain.
        </p>
      </div>
    </section>
  );
}
