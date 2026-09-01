"use client";

import Link from "next/link";
import Image from "next/image";

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t border-white/10 bg-[#020204] mt-auto relative z-20 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-2 pr-0 md:pr-12">
            <Link href="/" className="inline-block mb-8 relative group">
              {/* Logo AAPE Container with Ambient Luxury Glow */}
              <div className="relative flex items-center">
                {/* Soft Radial Ambient Aura Behind Footer Logo */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#34D399]/25 via-[#2DD4BF]/15 to-[#818CF8]/25 blur-2xl opacity-40 group-hover:opacity-100 transition-all duration-700 rounded-3xl pointer-events-none" />
                
                <Image
                  src="/assets/logo AAPE.png"
                  alt="AAPE Logo"
                  width={260}
                  height={84}
                  className="w-auto h-20 sm:h-22 md:h-24 object-contain relative z-10 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)] group-hover:drop-shadow-[0_0_35px_rgba(52,211,153,0.65)] group-hover:scale-105 transition-all duration-500"
                />
              </div>
            </Link>
            <p className="text-slate-400 text-[15px] leading-relaxed max-w-sm mb-8 font-medium">
              Membangun ekosistem bisnis digital yang defensibel dengan kecepatan tinggi menggunakan pendekatan <span className="text-slate-200">AI-Assisted Engineering</span>.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.youtube.com/@khdfii9" target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-lg group">
                <YoutubeIcon className="w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              </a>
              <a href="https://www.linkedin.com/in/khdfii9/" target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-lg group">
                <LinkedinIcon className="w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              </a>
              <a href="mailto:daffadhiyaulhaqkhadafi@gmail.com" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-lg group">
                <MailIcon className="w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <span className="w-8 h-px bg-white/20" />
              Navigasi
            </h3>
            <ul className="space-y-5">
              <li><Link href="/" className="text-slate-400 hover:text-brand-accent text-[15px] font-medium transition-all hover:translate-x-1 inline-block">Home</Link></li>
              <li><Link href="/about" className="text-slate-400 hover:text-brand-accent text-[15px] font-medium transition-all hover:translate-x-1 inline-block">Tentang Saya</Link></li>
              <li><Link href="/changelog" className="text-slate-400 hover:text-brand-accent text-[15px] font-medium transition-all hover:translate-x-1 inline-block">Changelog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <span className="w-8 h-px bg-white/20" />
              Legalitas
            </h3>
            <ul className="space-y-5">
              <li><Link href="/privacy" className="text-slate-400 hover:text-brand-accent text-[15px] font-medium transition-all hover:translate-x-1 inline-block">Kebijakan Privasi</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-brand-accent text-[15px] font-medium transition-all hover:translate-x-1 inline-block">Syarat & Ketentuan</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-sm font-medium text-center md:text-left">
            © {currentYear === 2026 ? '2026' : `2026 - ${currentYear}`} Daffa Dhiyaulhaq Khadafi. All rights reserved.
          </p>
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 shadow-inner backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <p className="text-slate-300 text-xs font-semibold tracking-wide">
              Designed & Vibe-Coded with Next.js, Tailwind, and AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
