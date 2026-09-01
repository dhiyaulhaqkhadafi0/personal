"use client";

import Link from "next/link";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
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
            <Link href="/" className="inline-block mb-6 relative group">
              {/* Logo AAPE */}
              <div className="relative">
                <span className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 relative z-10 group-hover:to-brand-accent transition-all duration-500">
                  AAPE
                </span>
                <span className="absolute inset-0 text-4xl font-black tracking-tighter text-brand-accent blur-[15px] opacity-40 group-hover:opacity-80 transition-opacity duration-500 animate-pulse">
                  AAPE
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-[15px] leading-relaxed max-w-sm mb-8 font-medium">
              Membangun produk digital yang defensibel dengan kecepatan tinggi menggunakan pendekatan <span className="text-slate-200">AI-Assisted Engineering</span>.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/daffak" target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-lg group">
                <GithubIcon className="w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
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
