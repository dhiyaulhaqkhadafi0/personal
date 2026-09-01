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
    <footer className="w-full border-t border-white/10 bg-[#05050A] mt-auto relative z-20">
      <div className="container mx-auto px-4 max-w-6xl py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-black tracking-tight text-white inline-block mb-4">
              Gerak<span className="text-brand-accent">asa.</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-6">
              Membangun produk digital yang defensibel dengan kecepatan tinggi menggunakan pendekatan AI-Assisted Engineering.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/daffak" target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all">
                <GithubIcon className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/khdfii9/" target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all">
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a href="mailto:daffadhiyaulhaqkhadafi@gmail.com" className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all">
                <MailIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Navigasi</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-white/60 hover:text-brand-accent text-sm transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-white/60 hover:text-brand-accent text-sm transition-colors">Tentang Saya</Link></li>
              <li><Link href="/changelog" className="text-white/60 hover:text-brand-accent text-sm transition-colors">Changelog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Legalitas</h3>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-white/60 hover:text-brand-accent text-sm transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/terms" className="text-white/60 hover:text-brand-accent text-sm transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs text-center md:text-left">
            © {currentYear === 2026 ? '2026' : `2026 - ${currentYear}`} Daffa Dhiyaulhaq Khadafi. All rights reserved.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-white/60 text-[11px] font-medium tracking-wide">
              Designed & Vibe-Coded with Next.js, Tailwind, and AI Copilots
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
