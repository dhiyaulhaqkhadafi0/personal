"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Brain, BarChart2, Users, Network, Layers, RefreshCcw, 
  ArrowRight, Database, Cpu, LayoutTemplate, X, ChevronUp, ChevronDown, CheckCircle2, AlertCircle, ArrowLeft, Lock, ShieldAlert, DollarSign, Activity, TrendingUp, XCircle, Target, Scale, Atom, ZoomIn, ZoomOut, Award, Zap, PenTool, ExternalLink, Code2, ShieldCheck, Compass, Check, Briefcase
} from "lucide-react";
import Image from "next/image";
import { Navbar } from "../components/shared/navbar";

// Custom SVG Icons
const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

// Framer Motion Animation Presets
const appleTransition: any = {
  initial: { opacity: 0, y: 60, scale: 0.95, filter: "blur(10px)" },
  whileInView: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 1.2, ease: [0.19, 1, 0.22, 1] }
};

const fadeUp: any = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const pillarContent = [
  { 
    title: "Core Intelligence & Data", 
    desc: "Otak dan memori sistem. Mengelola identitas pengguna, ontologi kebugaran (G-Taxonomy), Fitness Graph longitudinal, serta lapisan keamanan dan privasi data.",
    icon: <Database className="w-8 h-8" />
  },
  { 
    title: "Consumer Experience", 
    desc: "Wajah antarmuka harian. Menjawab 'hari ini harus ngapain?' melalui G-Today, menampilkan peta perjalanan G-Journey, serta menyajikan insight dari Fitness IQ.",
    icon: <LayoutTemplate className="w-8 h-8" />
  },
  { 
    title: "Capability & Ecosystem", 
    desc: "Modul aktivitas dan ekosistem. Meliputi pelacakan olahraga (G-Move), pemulihan (G-Wellness), integrasi pelatih (G-Coach), akses sasana fisik, komunitas, dan acara.",
    icon: <Layers className="w-8 h-8" />
  },
  { 
    title: "Professional & B2B", 
    desc: "SaaS untuk pelatih dan korporat. Gerakasa Pro untuk manajemen klien, portal untuk mitra penyelenggara acara/sasana, dan solusi kesejahteraan karyawan.",
    icon: <Users className="w-8 h-8" />
  },
  { 
    title: "Deep Tech & Hardware", 
    desc: "Eksperimen masa depan. Integrasi wearable lintas perangkat, hingga eksperimen riset dan pengembangan sensor kebugaran otonom.",
    icon: <Cpu className="w-8 h-8" />
  },
];

const masterSpecs = [
  { 
    title: "The App Definition", 
    content: (
      <div className="space-y-4">
        <p>
          Gerakasa adalah <span className="text-white italic font-bold">Fitness Intelligence Super App</span> yang secara komprehensif memahami tujuan, konteks, aktivitas, preferensi, dan progres pengguna.
        </p>
        <p>
          Tujuannya adalah mengorkestrasi perjalanan kebugaran (<span className="text-white italic">fitness journey</span>) secara personal dan secara otomatis menghubungkan pengguna dengan pelatih, sasana olahraga, komunitas, acara, hingga perangkat fisik tepat di saat mereka membutuhkannya.
        </p>
      </div>
    )
  },
  { 
    title: "Vision & Mission", 
    content: (
      <div className="space-y-6">
        <div>
          <h6 className="text-white font-bold mb-2 flex items-center gap-2"><Target className="w-5 h-5 text-brand-accent"/> Visi (10 Tahun):</h6>
          <p>Menjadi <span className="text-white italic">Fitness Intelligence Super App</span> paling dipercaya di Indonesia, dan berevolusi menjadi jaringan operasi (<span className="text-white italic">operating network</span>) yang membantu manusia bergerak secara lebih terarah serta terhubung langsung dengan ekosistem kebugaran di dunia nyata.</p>
        </div>
        <div>
          <h6 className="text-white font-bold mb-2 flex items-center gap-2"><Target className="w-5 h-5 text-brand-accent"/> Misi:</h6>
          <p>Mengubah kompleksitas pilihan <span className="text-white italic">fitness</span> yang tak terbatas menjadi langkah harian yang jelas. Sistem tidak hanya mengeksekusi tujuan yang sudah ada, tetapi membantu pengguna menemukan arah mereka, merancang rencana yang adaptif terhadap realitas kehidupan, dan memadukan efisiensi AI dengan empati pakar manusia.</p>
        </div>
      </div>
    )
  },
  { 
    title: "Professional, B2B & Network", 
    content: (
      <div className="space-y-4">
        <p>Ekosistem Gerakasa melampaui aplikasi konsumen (B2C) dengan membangun empat infrastruktur bisnis masa depan:</p>
        <ul className="space-y-3 list-none pl-0">
          <li className="flex gap-3"><span className="text-brand-accent mt-1">✦</span> <div><strong className="text-white">Gerakasa Pro:</strong> Perangkat lunak SaaS dan asisten AI (copilot) bagi pelatih untuk mengelola klien secara lebih skalabel.</div></li>
          <li className="flex gap-3"><span className="text-brand-accent mt-1">✦</span> <div><strong className="text-white">Gerakasa Partner:</strong> Portal manajemen inventaris dan pemesanan untuk sasana (gym), studio, dan penyelenggara acara.</div></li>
          <li className="flex gap-3"><span className="text-brand-accent mt-1">✦</span> <div><strong className="text-white">Gerakasa Business & G-Work:</strong> Solusi program kesehatan (wellness) berbasis metrik nyata untuk klien korporat.</div></li>
          <li className="flex gap-3"><span className="text-brand-accent mt-1">✦</span> <div><strong className="text-white">Gerakasa OS & API:</strong> Lisensi lapisan kecerdasan buatan Gerakasa untuk diintegrasikan ke perangkat keras atau platform pihak ketiga.</div></li>
        </ul>
      </div>
    )
  },
  { 
    title: "Connected Data & Future AI", 
    content: (
      <div className="space-y-4">
        <p>Untuk memperkaya <span className="text-white font-bold">Fitness Graph</span>, infrastruktur <strong className="text-brand-accent">Gerakasa Sync</strong> disiapkan untuk mengintegrasikan data dari Apple HealthKit, Android Health Connect, dan wearable pihak ketiga.</p>
        <p>Gerakasa juga mengeksplorasi antarmuka masa depan (Horizon 3), termasuk <strong className="text-white">G-Vision</strong> (computer vision untuk mengevaluasi postur latihan), <strong className="text-white">G-Voice</strong> (asisten suara proaktif saat berlatih), dan <strong className="text-white">G-Spatial</strong> (panduan kebugaran berbasis Augmented Reality / Spatial Computing).</p>
      </div>
    )
  },
  { 
    title: "Hardware & Deep Tech", 
    content: (
      <div className="space-y-4">
        <p>Sebagai strategi opsional jangka panjang (Horizon 4), Gerakasa merencanakan divisi <span className="text-white font-bold">Hardware Lab</span> untuk meriset integrasi perangkat lunak dan fisik secara mulus.</p>
        <p>Rencana ini mencakup pelacak kebugaran pendamping seperti <strong className="text-brand-accent">Gerakasa Band / Clip / Ring</strong> untuk mengurangi input data manual, pengembangan pakaian pintar ber-sensor (<strong className="text-brand-accent">G-Sensory Apparel</strong>), hingga sensor hidrasi biometrik.</p>
      </div>
    )
  },
  { 
    title: "Visionary Moonshots", 
    content: (
      <div className="space-y-4">
        <p>Dalam fase end-state (5–10 tahun ke depan), Gerakasa merancang penelitian (R&D) untuk produk visioner seperti:</p>
        <ul className="space-y-3 list-none pl-0">
          <li className="flex gap-3"><span className="text-brand-success mt-1">●</span> <div><strong className="text-white">G-Twin:</strong> Membangun kembaran digital biomekanik pengguna untuk menyimulasikan beban dan risiko cedera.</div></li>
          <li className="flex gap-3"><span className="text-brand-success mt-1">●</span> <div><strong className="text-white">G-Space:</strong> Lingkungan olahraga otonom yang menyesuaikan alat gym dengan profil pengguna secara nirkabel.</div></li>
          <li className="flex gap-3"><span className="text-brand-success mt-1">●</span> <div><strong className="text-white">G-Longevity:</strong> Fokus kecerdasan AI pada optimalisasi rentang kesehatan atau healthspan jangka panjang.</div></li>
        </ul>
      </div>
    )
  },
  { 
    title: "Invisible Orchestration", 
    content: (
      <div className="space-y-4">
        <p>Kemenangan Gerakasa tidak diukur dari seberapa lama pengguna menghabiskan waktu di dalam aplikasi. End-game sistem ini adalah <span className="text-white font-bold italic">&quot;orkestrasi tak terlihat&quot;</span>, di mana kelelahan mengambil keputusan ditekan hingga ke titik nol.</p>
        <div className="bg-[#1A0B0B]/60 border border-brand-accent/20 p-6 rounded-2xl mt-4">
          <p className="text-white/80 text-sm md:text-base leading-relaxed"><span className="text-brand-accent font-bold uppercase tracking-widest text-xs block mb-2">Contoh Kasus:</span>Jika kalender jadwal pengguna penuh atau metrik pemulihannya sangat rendah, sistem secara otomatis merestrukturisasi rutinitas latihan beban menjadi sesi peregangan singkat 15 menit, tanpa pengguna harus mengatur ulang kalender kebugaran mereka secara manual.</p>
        </div>
      </div>
    )
  },
  { 
    title: "24-Month Roadmap", 
    content: (
      <div className="space-y-4">
        <p>Pengembangan dilakukan melalui gerbang validasi bertahap untuk mencegah ekspansi buta:</p>
        <div className="relative border-l border-white/20 pl-6 ml-2 space-y-6 mt-6">
          <div className="relative">
            <div className="absolute -left-[29px] top-2 w-3 h-3 bg-brand-accent rounded-full shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
            <strong className="text-white">Fase 0–1 (Bulan 0–4):</strong> Validasi Masalah & Peluncuran Alpha Intelligence (Eksklusif pada vertikal Latihan Kekuatan).
          </div>
          <div className="relative">
            <div className="absolute -left-[29px] top-2 w-3 h-3 bg-brand-success rounded-full" />
            <strong className="text-white">Fase 2–3 (Bulan 4–9):</strong> Validasi Permintaan Beta dan Peluncuran Eksperimen Pilot Berbayar (Gerakasa+ & Layanan Pelatih).
          </div>
          <div className="relative">
            <div className="absolute -left-[29px] top-2 w-3 h-3 bg-brand-warning rounded-full" />
            <strong className="text-white">Fase 4–5 (Bulan 9–18):</strong> Bukti Horizontal (Ekspansi ke olahraga Lari) dan Peluncuran Ekosistem Fisik Lokal (Pemesanan Sasana & Acara).
          </div>
          <div className="relative">
            <div className="absolute -left-[29px] top-2 w-3 h-3 bg-purple-500 rounded-full" />
            <strong className="text-white">Fase 6 (Bulan 18–24):</strong> Skala Jaringan dan Peluncuran Modul Enterprise/B2B.
          </div>
        </div>
      </div>
    )
  },
  { 
    title: "Safety, Privacy & Governance", 
    content: (
      <div className="space-y-4">
        <p><span className="text-white font-bold">Batas aman (Guardrails)</span> adalah arsitektur fundamental, bukan sekadar pelengkap teknis. Panduan kebugaran Gerakasa dilarang keras menyamar sebagai diagnosis medis klinis.</p>
        <p>Sinyal ketidaknyamanan fisik akan langsung memicu modifikasi program atau eskalasi ke pakar (<span className="text-white italic">human expert</span>), bukan direspons dengan &quot;kepastian buatan&quot; oleh AI.</p>
        <p>Seluruh pengelolaan data sensitif dirancang melalui prinsip <span className="text-brand-success font-bold">Privacy by Design</span> dengan sistem persetujuan (consent) transparan yang sepenuhnya dikendalikan pengguna.</p>
      </div>
    )
  },
  { 
    title: "Tech Stack & Architecture", 
    content: (
      <div className="space-y-4">
        <p>Dibangun menggunakan prinsip <span className="text-white font-bold italic">Modular Monolith</span> di tahap awal untuk menjaga kelincahan, kode Gerakasa memisahkan batasan domain (seperti Profil, Journey, dan Daily Action) secara ketat.</p>
        <ul className="space-y-3 list-none pl-0">
          <li className="flex gap-3"><span className="text-white mt-1">⚡</span> <div><strong className="text-white">Frontend:</strong> Next.js (App Router), TypeScript Strict, dan pnpm.</div></li>
          <li className="flex gap-3"><span className="text-white mt-1">🗄️</span> <div><strong className="text-white">Backend & Database:</strong> Supabase dengan skema migrasi lokal dan kebijakan Row Level Security (RLS) deny-by-default untuk keamanan maksimum.</div></li>
          <li className="flex gap-3"><span className="text-white mt-1">🧠</span> <div><strong className="text-white">AI Architecture:</strong> Menggunakan logika deterministik berbasis aturan (rule-based) untuk aturan keamanan dan eskalasi, sementara AI generatif dibatasi pada modul pemeringkatan (ranking), penyesuaian adaptasi, dan modul penjelas (explanation layer) untuk memastikan setiap keputusan mesin dapat dipertanggungjawabkan.</div></li>
        </ul>
      </div>
    )
  },
];

const mockupImages = [
  "/assets/ChatGPT Image Aug 27, 2026, 02_42_25 AM (1).png",
  "/assets/ChatGPT Image Aug 27, 2026, 02_42_25 AM (2).png",
  "/assets/ChatGPT Image Aug 27, 2026, 02_42_25 AM (3).png",
  "/assets/ChatGPT Image Aug 27, 2026, 02_42_26 AM (4).png",
  "/assets/ChatGPT Image Aug 27, 2026, 02_42_26 AM (5).png",
  "/assets/ChatGPT Image Aug 27, 2026, 02_54_36 AM (1).png",
  "/assets/ChatGPT Image Aug 27, 2026, 02_54_36 AM (2).png",
  "/assets/ChatGPT Image Aug 27, 2026, 02_54_37 AM (3).png",
  "/assets/ChatGPT Image Aug 27, 2026, 02_54_37 AM (4).png",
  "/assets/ChatGPT Image Aug 27, 2026, 02_54_38 AM (5).png",
  "/assets/ChatGPT Image Aug 27, 2026, 02_54_38 AM (6).png",
  "/assets/ChatGPT Image Aug 27, 2026, 02_54_39 AM (7).png",
  "/assets/ChatGPT Image Aug 27, 2026, 02_54_40 AM (8).png",
  "/assets/ChatGPT Image Aug 27, 2026, 02_54_40 AM (9).png",
  "/assets/ChatGPT Image Aug 27, 2026, 02_54_41 AM (10).png",
  "/assets/ChatGPT Image Aug 27, 2026, 03_07_38 AM (1).png",
  "/assets/ChatGPT Image Aug 27, 2026, 03_07_39 AM (2).png",
  "/assets/ChatGPT Image Aug 27, 2026, 03_07_39 AM (3).png",
  "/assets/ChatGPT Image Aug 27, 2026, 03_07_39 AM (4).png",
  "/assets/ChatGPT Image Aug 27, 2026, 03_07_40 AM (5).png",
];

const coreCompetencies = [
  {
    title: "Product Strategy & Zero-to-One",
    category: "Strategic Discovery & Scoping",
    desc: "Mampu membedah ambiguitas ruang masalah menjadi kerangka kerja logis, menentukan prioritas Minimum Viable Product (MVP) yang kejam (ruthless scoping), dan merancang arsitektur data.",
    icon: <Brain className="w-8 h-8 text-indigo-400" />,
    badge: "Strategic Framework",
    tags: ["Problem Discovery", "Ruthless MVP Scoping", "Data Ontology"],
    glow: "hover:border-indigo-500/40 hover:shadow-[0_0_40px_rgba(99,102,241,0.2)]"
  },
  {
    title: "Systems Design & UI/UX",
    category: "High-Craft Design Systems",
    desc: "Merangkai antarmuka premium dan sistem desain (Figma/Milanote) yang berfokus pada pengurangan decision fatigue pengguna melalui prinsip estetika modern dan mode gelap (dark mode) tingkat tinggi.",
    icon: <Layers className="w-8 h-8 text-emerald-400" />,
    badge: "Interaction & Craft",
    tags: ["Design Systems", "Decision Fatigue Minimization", "Dark Mode UI"],
    glow: "hover:border-emerald-500/40 hover:shadow-[0_0_40px_rgba(52,211,153,0.2)]"
  },
  {
    title: "AI-Accelerated Engineering",
    category: "Vibe Coding & AI Agents",
    desc: "Memanfaatkan alur kerja vibe coding dan ekosistem agen AI generatif untuk merakit kode produksi (Next.js & Supabase) dengan kecepatan eksponensial tanpa mengorbankan skalabilitas arsitektur.",
    icon: <Cpu className="w-8 h-8 text-amber-400" />,
    badge: "10x Velocity",
    tags: ["Vibe Coding Workflows", "AI Agentic Ecosystems", "Fullstack Velocity"],
    glow: "hover:border-amber-500/40 hover:shadow-[0_0_40px_rgba(251,191,36,0.2)]"
  }
];

const arsenalGroups = [
  {
    category: "AI Copilots & Agents",
    desc: "Autonomous workflow, code generation & prompt orchestration",
    icon: <Brain className="w-5 h-5 text-indigo-400" />,
    tools: ["Windsurf", "Cursor", "Anti Gravity", "v0", "Claude Code", "Gemini CLI", "Lovable.dev"],
    borderGradient: "from-indigo-500/50 via-blue-500/50 to-indigo-500/50"
  },
  {
    category: "Engineering & Database",
    desc: "Production-ready scalable web architectures & cloud infrastructure",
    icon: <Cpu className="w-5 h-5 text-emerald-400" />,
    tools: ["Next.js", "Supabase", "Tailwind CSS", "Vercel", "Google Cloud", "TypeScript"],
    borderGradient: "from-emerald-500/50 via-teal-500/50 to-emerald-500/50"
  },
  {
    category: "Visual, Product & Mindmapping",
    desc: "Architecture blueprints, mental models & design systems",
    icon: <Layers className="w-5 h-5 text-purple-400" />,
    tools: ["Figma", "Milanote", "Xmind"],
    borderGradient: "from-purple-500/50 via-fuchsia-500/50 to-purple-500/50"
  },
  {
    category: "Synthetic Media & Creator Tools",
    desc: "Generative audio, video synthesis & rapid multimedia production",
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    tools: ["ElevenLabs", "Leonardo.ai", "HeyGen", "CapCut"],
    borderGradient: "from-amber-500/50 via-orange-500/50 to-amber-500/50"
  }
];

const certificatesList = [
  {
    title: "Introduction to Cybersecurity Tools & Cyber Attacks",
    issuer: "IBM",
    category: "Cybersecurity",
    image: "/certificate/IBMDesign20251026-29-av8of9_page-0001.jpg",
    link: "#",
  },
  {
    title: "Data Analytics Essentials",
    issuer: "IBM",
    category: "Data Analytics",
    image: "/certificate/IBMDesign20251026-30-snhmp9_page-0001 (1).jpg",
    link: "#",
  },
  {
    title: "Product Management Essentials",
    issuer: "IBM",
    category: "Product Management",
    image: "/certificate/IBMDesign20260830-20-s0mimw_page-0001.jpg",
    link: "#",
  },
  {
    title: "Mastering Product Management",
    issuer: "Refocus / MySkill",
    category: "Product Management",
    image: "/certificate/Daffa Dhiyaulhaq Khadafi's-Mastering Product Management-Completion-Certificate_page-0001.jpg",
    link: "#",
  },
  {
    title: "Fundamental Product Marketing",
    issuer: "Executive Program",
    category: "Go-to-Market",
    image: "/certificate/Daffa Dhiyaulhaq Khadafi's-Fundamental Product Marketing-Completion-Certificate_page-0001.jpg",
    link: "#",
  },
  {
    title: "Becoming a Product Manager",
    issuer: "IIBA Endorsed",
    category: "Product Strategy",
    image: "/certificate/Becoming a Product Manager - IIBA.jpg",
    link: "#",
  },
  {
    title: "Certificate of Business Analysis",
    issuer: "IIBA",
    category: "Business Analysis",
    image: "/certificate/Certificate of Analysis Business - IIBA.jpg",
    link: "#",
  },
  {
    title: "Google AI Professional",
    issuer: "Google",
    category: "AI Architecture Specialist",
    image: "/certificate/Sertifikat Google AI Proffesional.jpg",
    link: "#",
  },
  {
    title: "Certified Product Manager",
    issuer: "MySkill Bootcamp",
    category: "End-to-End PM",
    image: "/certificate/Sertifikat PM_page-Myskill.jpg",
    link: "#",
  }
];

const badgesList = [
  { title: "Data Analytics Essentials", image: "/badge/data-analytics-essentials.png", link: "https://www.credly.com/badges/f9ed8f12-2094-41ee-ba14-16180e871dc3/public_url" },
  { title: "Data Science Orientation", image: "/badge/data-science-orientation.png", link: "https://www.credly.com/badges/c616fe7c-3896-41db-a6ef-7533d9d341a0/public_url" },
  { title: "Google AI for App Building", image: "/badge/google-ai-for-app-building.png", link: "https://www.credly.com/badges/2f7f9d1a-a2c8-4fdd-9a70-fe70637b7f45/public_url" },
  { title: "Google AI for App Deployment", image: "/badge/google-ai-for-app-deployment.png", link: "https://www.credly.com/badges/3180f40c-0a06-4bcc-a91b-18c113e6235f/public_url" },
  { title: "Google AI for Brainstorming and Planning", image: "/badge/google-ai-for-brainstorming-and-planning.1.png", link: "https://www.credly.com/badges/6cf6936f-b594-4d11-acf7-108f3cb514db/public_url" },
  { title: "Google AI for Content Creation", image: "/badge/google-ai-for-content-creation.png", link: "https://www.credly.com/badges/6ab0d54d-4cef-4610-b2d1-8ada571f1717/public_url" },
  { title: "Google AI for Data Analysis", image: "/badge/google-ai-for-data-analysis.png", link: "https://www.credly.com/badges/3a074f96-e6d1-4e98-8530-4c52094eec51/public_url" },
  { title: "Google AI for Research and Insights", image: "/badge/google-ai-for-research-and-insights.png", link: "https://www.credly.com/badges/930feb58-0310-4ff9-a64c-2ad25893601c/public_url" },
  { title: "Google AI for Writing and Communicating", image: "/badge/google-ai-for-writing-and-communicating.png", link: "https://www.credly.com/badges/7d1b45db-0e82-4bff-8a65-1e13b70de31a/public_url" },
  { title: "Google AI Fundamentals", image: "/badge/google-ai-fundamentals.png", link: "https://www.credly.com/badges/e4bc5476-beff-44d2-8b8d-ea207f798027/public_url" },
  { title: "Cybersecurity Tools & Cyber Attacks", image: "/badge/introduction-to-cybersecurity-tools-cyber-attacks.png", link: "https://www.credly.com/badges/649e1d24-887c-44f2-90b0-64c13c557c10/public_url" },
  { title: "Product Management Essentials", image: "/badge/product-management-essentials.png", link: "https://www.credly.com/badges/6b6c1243-6ab1-4f0c-b881-5692a084b90e/public_url" }
];

export const SectionTransition = ({ imageSrc, title, variant = 1 }: { imageSrc: string; title: string; variant?: number }) => {
  const titleAnimations: Record<number, any> = {
    1: { initial: { y: 40, opacity: 0 }, whileInView: { y: 0, opacity: 1 }, transition: { duration: 0.8, ease: "easeOut" } },
    2: { initial: { scale: 0.85, opacity: 0 }, whileInView: { scale: 1, opacity: 1 }, transition: { duration: 1, ease: "easeOut" } },
    3: { initial: { x: -40, opacity: 0 }, whileInView: { x: 0, opacity: 1 }, transition: { duration: 0.8, ease: "easeOut" } },
    4: { initial: { opacity: 0, filter: "blur(12px)", scale: 1.1 }, whileInView: { opacity: 1, filter: "blur(0px)", scale: 1 }, transition: { duration: 0.9, ease: "easeOut" } },
  };

  const imageAnimations = {
    1: "opacity-40 transition-transform duration-1000 group-hover:scale-105",
    2: "opacity-40 transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1",
    3: "opacity-40 transition-all duration-1000 group-hover:scale-[1.04] origin-left",
    4: "opacity-40 transition-all duration-1200 group-hover:scale-[1.03] group-hover:-rotate-1 origin-bottom",
  };

  const currentAnim = titleAnimations[variant as keyof typeof titleAnimations] || titleAnimations[1];
  const currentImgAnim = imageAnimations[variant as keyof typeof imageAnimations] || imageAnimations[1];

  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden border-y border-white/5 group mt-16 mb-24">
      <motion.div className="w-full h-full relative">
        <Image src={imageSrc} fill alt="Transition" className={`object-cover ${currentImgAnim} grayscale mix-blend-screen`} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#05050A] via-transparent to-[#05050A]" />
      <div className="absolute inset-0 bg-brand-accent/5 mix-blend-overlay" />
      
      {title && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h3 
            {...currentAnim}
            className="text-2xl md:text-5xl font-black tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-brand-accent drop-shadow-[0_0_30px_rgba(129,140,248,0.3)] text-center"
          >
            {title}
          </motion.h3>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [showPresentation, setShowPresentation] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activePillar, setActivePillar] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMockupIndex, setSelectedMockupIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panY, setPanY] = useState(0);
  const [selectedCert, setSelectedCert] = useState<{ title: string; issuer?: string; category?: string; image: string; link?: string } | null>(null);
  const [openLadderIndex, setOpenLadderIndex] = useState<number | null>(0);
  const [presentationProgress, setPresentationProgress] = useState(0);
  const [activeCertSection, setActiveCertSection] = useState<'certificates' | 'badges'>('certificates');

  const handleNextMockup = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedMockupIndex !== null) {
      setSelectedMockupIndex((selectedMockupIndex + 1) % mockupImages.length);
      setZoomLevel(1);
      setPanY(0);
    }
  };

  const handlePrevMockup = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedMockupIndex !== null) {
      setSelectedMockupIndex((selectedMockupIndex - 1 + mockupImages.length) % mockupImages.length);
      setZoomLevel(1);
      setPanY(0);
    }
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Native scroll tracking is used for the presentation modal to avoid hydration errors

  useEffect(() => {
    if (showPresentation) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleGlobalScroll = () => {
      if (window.scrollY > 300) setShowScrollTop(true);
      else setShowScrollTop(false);
    };

    window.addEventListener("scroll", handleGlobalScroll);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener("scroll", handleGlobalScroll);
    };
  }, [showPresentation]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="w-full min-h-screen bg-brand-bg text-brand-primary overflow-x-hidden font-sans selection:bg-brand-accent/30 relative">
      {!showPresentation && <Navbar />}
      {/* Global Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 origin-left z-[100] bg-gradient-to-r from-brand-accent via-indigo-500 to-emerald-500 shadow-[0_0_15px_rgba(129,140,248,0.5)]" 
        style={{ scaleX }} 
      />
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#05050A]">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <motion.div 
          animate={{ x: [0, 60, -30, 0], y: [0, -40, 60, 0] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/30 blur-[150px] mix-blend-screen" 
        />
        <motion.div 
          animate={{ x: [0, -70, 40, 0], y: [0, 50, -50, 0] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-slate-800/40 blur-[150px] mix-blend-screen" 
        />
        <motion.div 
          animate={{ x: [0, 40, -40, 0], y: [0, 30, -30, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-[#1e293b]/20 blur-[120px] mix-blend-screen" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div className="flex flex-col items-start text-left order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-brand-success/20 bg-brand-success/5 backdrop-blur-md mb-8 shadow-lg shadow-brand-success/5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-success"></span>
              </span>
              <span className="text-[10px] font-bold text-brand-success uppercase tracking-widest">
                Available for Product & AI Engineering Roles
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter break-words whitespace-normal lg:whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-300 to-slate-500 mb-4 drop-shadow-lg"
            >
              Daffa Dhiyaulhaq Khadafi
            </motion.h1>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-3xl font-semibold mb-6 animate-shimmer bg-[linear-gradient(110deg,#818CF8,45%,#ffffff,55%,#818CF8)] bg-[length:200%_auto] text-transparent bg-clip-text"
            >
              AI-Assisted Product Engineer & Founder
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-white/5 hover:bg-white/10 transition-colors cursor-default group">
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-[3px] shrink-0">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-full h-full object-contain" />
                </div>
                <span className="text-xs md:text-sm font-semibold text-brand-primary">Google AI Professional Certified</span>
              </div>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl shadow-lg shadow-blue-500/5 hover:bg-blue-500/10 transition-colors cursor-default group">
                <div className="w-5 h-5 rounded-sm bg-white flex items-center justify-center p-[2px] shrink-0">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" alt="IBM" className="w-full h-full object-contain" />
                </div>
                <span className="text-xs md:text-sm font-semibold text-blue-300">IBM Product Manager Certified</span>
              </div>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base md:text-lg text-[#D4D4D8] max-w-xl leading-relaxed mb-12 font-medium"
            >
              Transforming ambiguous problem spaces into high-velocity digital products. Combining strategic scoping with modern AI acceleration to build defensible ecosystems.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => setShowPresentation(true)}
                className="group relative px-8 py-4 rounded-xl bg-white text-black font-bold text-base overflow-hidden shadow-[0_0_20px_rgba(129,140,248,0.5)] ring-2 ring-brand-accent/50 ring-offset-2 ring-offset-brand-bg hover:shadow-[0_0_50px_rgba(129,140,248,0.8)] hover:ring-brand-accent transition-all duration-500 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/20 to-brand-success/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center gap-2">
                  Enter The Blueprint ✦
                </span>
              </button>
              
              <div className="flex items-center gap-3 ml-2">
                <a href="https://www.linkedin.com/in/khdfii9/" target="_blank" rel="noreferrer" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400/40 hover:shadow-[0_0_20px_rgba(96,165,250,0.2)] text-white/60 hover:text-blue-400 transition-all duration-300">
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                <a href="https://wa.me/6281946838791" target="_blank" rel="noreferrer" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-[#25D366]/10 hover:border-[#25D366]/50 hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] text-white/60 hover:text-[#25D366] transition-all duration-300">
                  <WhatsappIcon className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}
            className="flex justify-center lg:justify-end order-1 lg:order-2 w-full perspective-1000"
          >
            <motion.div 
              animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-full max-w-[420px] aspect-[4/5] rounded-[2.5rem] overflow-hidden group cursor-default"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }}
                className="absolute inset-0 p-3 bg-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[2.5rem] z-20 flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,#05050A_0deg,#818CF8_120deg,#34D399_240deg,#05050A_360deg)] animate-spin-slow opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative w-full h-full rounded-[1.8rem] bg-[#05050A] overflow-hidden z-30">
                  <Image 
                    src="/assets/my-profile.jpg" 
                    alt="Daffa Dhiyaulhaq Khadafi"
                    fill
                    className="object-cover object-top grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05050A]/90 via-transparent to-white/5 opacity-80 mix-blend-overlay" />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 space-y-32 pb-32">
        <motion.section 
          {...appleTransition}
          className="relative"
        >
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg shadow-indigo-500/5">
              <Target className="w-3.5 h-3.5" /> Core Competencies
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              A Multidimensional Approach to Product Building
            </h2>
            <p className="text-base md:text-lg text-brand-secondary font-medium">
              Tiga pilar fundamental yang mendefinisikan seorang AI-Assisted Product Engineer dalam merancang dan mengeksekusi produk digital defensible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreCompetencies.map((comp, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -6 }}
                className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 ${comp.glow}`}
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-[60px] rounded-full group-hover:scale-125 transition-all pointer-events-none" />
                
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-white/20 transition-all shadow-xl">
                    {comp.icon}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-brand-accent block mb-2">
                    {comp.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-4 leading-snug">
                    {comp.title}
                  </h3>
                  <p className="text-sm md:text-base text-brand-secondary leading-relaxed font-medium">
                    {comp.desc}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-2">
                  {comp.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[11px] font-medium text-white/50 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          {...appleTransition}
          className="relative"
        >
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-accent/20 bg-brand-accent/5 text-brand-accent text-xs font-bold uppercase tracking-widest mb-4 shadow-lg shadow-brand-accent/5">
              <Cpu className="w-3.5 h-3.5" /> Modern Toolstack
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              The Builder&apos;s Arsenal
            </h2>
            <p className="text-base md:text-lg text-brand-secondary font-medium">
              Alat dan teknologi mutakhir yang digunakan untuk mengeksekusi ide dari konsep hingga siap produksi secara presisi.
            </p>
          </div>

          <div className="space-y-6">
            {arsenalGroups.map((group, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
                className={`relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-r ${group.borderGradient} animate-gradient-xy group`}
              >
                <div className="relative bg-[#05050A]/95 backdrop-blur-xl rounded-[23px] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#05050A]/70 transition-all duration-500 shadow-xl z-10">
                <div className="flex items-center gap-4 min-w-[280px]">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                    {group.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{group.category}</h3>
                    <p className="text-xs text-brand-secondary">{group.desc}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 flex-1 md:justify-end">
                  {group.tools.map((tool, tIdx) => (
                    <span 
                      key={tIdx}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs md:text-sm font-medium hover:bg-white/10 hover:text-white hover:border-brand-accent/40 transition-all cursor-default shadow-sm hover:scale-105"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          {...appleTransition}
          className="relative"
        >
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg shadow-emerald-500/5">
              <ShieldCheck className="w-3.5 h-3.5" /> Credentials & Mastery
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Certifications & Foundations
            </h2>
            <p className="text-base md:text-lg text-brand-secondary font-medium">
              Sertifikasi resmi dan fondasi keahlian di bidang Artificial Intelligence, Product Management, dan Business Analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-7 bg-gradient-to-br from-indigo-950/40 via-white/5 to-white/5 backdrop-blur-2xl border border-indigo-500/20 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col justify-between group"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-all" />
              
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                    Google AI Professional
                  </span>
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                  Artificial Intelligence Concepts & Implementation
                </h3>
                <p className="text-brand-secondary text-base md:text-lg leading-relaxed font-medium mb-6">
                  Official Google certification validating advanced artificial intelligence concepts, prompt orchestration, machine learning intuitions, and real-world AI implementation strategies.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Google & Coursera Certified</span>
                    <span className="text-xs text-white/50">Verified Credential</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 px-3.5 py-1.5 rounded-lg border border-indigo-500/20">
                  AI Architecture Specialist
                </span>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-5 bg-gradient-to-br from-blue-950/30 via-white/5 to-white/5 backdrop-blur-2xl border border-blue-500/20 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col justify-between group"
            >
              <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all" />
              
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest">
                    IBM Product Manager
                  </span>
                  <span className="text-3xl">💼</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                  Digital Business & Product Leadership
                </h3>
                <p className="text-brand-secondary text-base leading-relaxed font-medium mb-6">
                  IBM Enterprise Design Thinking badges paired with an academic background in Digital Business, providing deep mastery over unit economics, retention loops, and Go-to-Market strategies.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden shrink-0">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" alt="IBM" className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Enterprise Design Thinking</span>
                    <span className="text-xs text-white/50">Student</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Credentials Archive</h3>
                <p className="text-xs md:text-sm text-brand-secondary">Eksplorasi sertifikat profesional dan lencana keahlian.</p>
              </div>
              
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <button 
                  onClick={() => setActiveCertSection('certificates')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeCertSection === 'certificates' ? 'bg-brand-accent text-white shadow-[0_0_20px_rgba(129,140,248,0.4)]' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                >
                  Certificates
                </button>
                <button 
                  onClick={() => setActiveCertSection('badges')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeCertSection === 'badges' ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                >
                  Badges
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeCertSection === 'certificates' ? (
                <motion.div
                  key="certificates"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {certificatesList.map((cert, cIdx) => (
                    <motion.div
                      key={cIdx}
                      whileHover={{ y: -6, scale: 1.02 }}
                      onClick={() => setSelectedCert(cert)}
                      className="cursor-pointer group relative bg-white/5 backdrop-blur-xl border border-white/10 hover:border-brand-accent/50 rounded-2xl overflow-hidden p-4 shadow-xl transition-all block"
                    >
                      <div className="relative aspect-[16/11] w-full rounded-xl overflow-hidden bg-[#0A0C10] mb-4">
                        <Image 
                          src={cert.image} 
                          alt={cert.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-2 border border-white/20 shadow-xl">
                            <ZoomIn className="w-4 h-4 text-brand-accent" /> Inspect Certificate
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent block mb-1">
                          {cert.issuer} • {cert.category}
                        </span>
                        <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-brand-accent transition-colors">
                          {cert.title}
                        </h4>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="badges"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                >
                  {badgesList.map((badge, bIdx) => (
                    <motion.div
                      key={bIdx}
                      whileHover={{ y: -5, scale: 1.05 }}
                      onClick={() => setSelectedCert({ ...badge, issuer: "Credential", category: "Badge" })}
                      className="cursor-pointer group relative block bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-md border border-white/10 hover:border-emerald-500/50 rounded-3xl p-4 shadow-xl flex flex-col items-center text-center transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 rounded-3xl transition-colors duration-500" />
                      <div className="absolute -inset-[1px] bg-gradient-to-b from-emerald-500/30 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                      
                      <div className="relative w-full aspect-square mb-3 z-10 flex items-center justify-center">
                        <Image 
                          src={badge.image} 
                          alt={badge.title}
                          fill
                          className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-500 scale-90 group-hover:scale-100"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 rounded-3xl transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <ZoomIn className="w-5 h-5 text-emerald-400" />
                        </div>
                      </div>
                      <h4 className="relative z-10 text-[10px] font-bold text-white/80 group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2 px-1">
                        {badge.title}
                      </h4>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* ======================================================== */}
        {/* FINAL CTA SECTION / FOOTER                               */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-5xl mx-auto mt-32 mb-12 p-12 md:p-16 rounded-[3rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden group"
        >
          {/* Inner Glow Background */}
          <div className="absolute inset-0 z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-1000">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] max-w-[800px] bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.15)_0%,rgba(16,185,129,0.05)_40%,transparent_70%)] blur-[80px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 leading-tight">
              Let&apos;s build defensible zero-to-one products.
            </h2>
            <p className="text-slate-400 text-lg mt-4 max-w-2xl mx-auto text-center font-medium">
              Currently open for product leadership, AI engineering roles, and high-impact collaborations.
            </p>

            <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-6">
              <a 
                href="mailto:daffadhiyaulhaqkhadafi@gmail.com"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-full shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] hover:scale-105 transition-all"
              >
                Start a Conversation ✦
              </a>

              <div className="flex items-center gap-4">
                <a href="https://github.com/daffak" target="_blank" rel="noreferrer" className="p-3 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white text-slate-400 transition-all flex items-center justify-center group/btn" aria-label="Github">
                  <GithubIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                </a>
                <a href="https://www.linkedin.com/in/khdfii9/" target="_blank" rel="noreferrer" className="p-3 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white text-slate-400 transition-all flex items-center justify-center group/btn" aria-label="LinkedIn">
                  <LinkedinIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                </a>
                <a href="https://wa.me/6281946838791" target="_blank" rel="noreferrer" className="p-3 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white text-slate-400 transition-all flex items-center justify-center group/btn" aria-label="WhatsApp">
                  <WhatsappIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                </a>
                <a href="mailto:daffadhiyaulhaqkhadafi@gmail.com" className="p-3 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white text-slate-400 transition-all flex items-center justify-center group/btn" aria-label="Email">
                  <MailIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Sign-off */}
        <div className="text-slate-600 text-sm text-center flex flex-col items-center gap-2 pb-8">
          <p>© 2026 Daffa Dhiyaulhaq Khadafi. All rights reserved.</p>
          <p className="flex items-center gap-1.5 justify-center">
            Designed & Vibe-Coded with Next.js, Tailwind, and AI Copilots
          </p>
        </div>

      </div>

      <AnimatePresence>
        {showScrollTop && !showPresentation && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 p-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:border-brand-accent/50 transition-all shadow-2xl"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPresentation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-[#05050A] flex flex-col"
          >
            <div className="fixed top-6 right-6 z-[60] flex items-center gap-4">
              <button 
                onClick={() => setShowPresentation(false)}
                className="group flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#0A0C10]/80 backdrop-blur-xl border border-white/10 hover:border-brand-accent/50 hover:bg-brand-accent/10 transition-all shadow-[0_0_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(129,140,248,0.3)] hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4 text-brand-secondary group-hover:text-brand-accent transition-colors" />
                <span className="text-xs font-bold tracking-widest uppercase text-white/80 group-hover:text-white transition-colors">Kembali</span>
              </button>
            </div>

            <motion.div 
              className="fixed top-0 left-0 right-0 h-1.5 origin-left z-[60] bg-gradient-to-r from-brand-accent via-indigo-500 to-emerald-500 bg-[length:200%_200%] animate-gradient-xy shadow-[0_0_20px_rgba(168,85,247,0.5)]" 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: presentationProgress }}
              transition={{ type: "spring", stiffness: 100, damping: 30, restDelta: 0.001 }}
            />

            <div 
              onScroll={(e) => {
                const target = e.currentTarget;
                if (target.scrollHeight > target.clientHeight) {
                  setPresentationProgress(target.scrollTop / (target.scrollHeight - target.clientHeight));
                }
              }}
              className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-hide"
            >
              
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-[-1]">
                 <div className="absolute top-[5%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.03)_0%,transparent_60%)] blur-[100px]" />
                 <div className="absolute top-[15%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.03)_0%,transparent_60%)] blur-[120px]" />
                 <div className="absolute top-[35%] right-[-5%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.02)_0%,transparent_60%)] blur-[100px]" />
                 <div className="absolute top-[55%] left-[5%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.03)_0%,transparent_60%)] blur-[120px]" />
                 <div className="absolute top-[75%] right-[-10%] w-[75vw] h-[75vw] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.02)_0%,transparent_60%)] blur-[150px]" />
                 <div className="absolute bottom-[5%] left-[-20%] w-[90vw] h-[90vw] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.02)_0%,transparent_60%)] blur-[150px]" />
              </div>

              <div className="relative w-full aspect-[21/9] max-h-[60vh] min-h-[300px] overflow-hidden bg-[#0A0C10]">
                <div 
                  className="absolute inset-0 z-0 bg-cover bg-center opacity-70"
                  style={{ 
                    backgroundImage: "url('/assets/cover-gerakasa.png')",
                    maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)"
                  }}
                />
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center -mt-24 mb-12 px-6 text-center">
                <motion.div 
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="relative p-5 rounded-3xl bg-[#05050A]/90 backdrop-blur-xl border border-white/10 shadow-2xl mb-8 flex items-center justify-center group"
                >
                  <div className="absolute inset-0 rounded-3xl bg-brand-accent/20 blur-2xl group-hover:bg-brand-accent/40 transition-colors animate-pulse" />
                  
                  <div className="absolute inset-[-2px] rounded-3xl bg-[conic-gradient(from_0deg,#05050A_0deg,#818CF8_120deg,#34D399_240deg,#05050A_360deg)] opacity-40 animate-spin-slow" style={{ animationDuration: '6s' }} />
                  
                  <div className="absolute inset-0 bg-[#05050A] rounded-3xl z-10" />
                  
                  <Image src="/assets/logo-gerakasa.png" width={90} height={90} alt="Gerakasa Logo" className="relative z-20 drop-shadow-[0_0_30px_rgba(129,140,248,0.6)]" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-4 drop-shadow-2xl">
                  Founder Blueprint
                </h1>
                <h2 className="text-xl md:text-2xl font-medium text-brand-accent tracking-widest uppercase">
                  Fitness Intelligence Super App
                </h2>
              </div>

              <div className="absolute left-6 md:left-12 lg:left-24 top-[60vh] bottom-0 w-px bg-gradient-to-b from-brand-accent/50 via-brand-success/30 to-transparent pointer-events-none hidden md:block z-0" />

              <SectionTransition imageSrc="/assets/transition_thesis.jpg" title="Initiation" variant={1} />
              
              <section className="relative min-h-screen w-full flex flex-col justify-center py-32 px-6 md:px-24 lg:px-48">
                <div className="absolute top-1/2 right-[5%] -translate-y-1/2 text-[45vh] font-black text-white/[0.02] pointer-events-none select-none tracking-tighter z-0">
                  01
                </div>

                <div className="relative z-10 w-full max-w-5xl ml-auto md:ml-0">
                  <motion.div {...fadeUp} className="mb-24">
                    <h2 className="text-brand-accent font-bold tracking-widest uppercase mb-6 text-sm flex items-center gap-6">
                      <span className="w-12 h-px bg-brand-accent/50" /> Chapter 01
                    </h2>
                    <motion.h3 
                      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-brand-accent/50 tracking-tight leading-tight"
                    >
                      The Strategic Thesis & <br/>Problem Discovery
                    </motion.h3>
                  </motion.div>

                  <div className="flex flex-col gap-32">
                    <motion.div {...fadeUp}>
                      <div className="flex items-start gap-8">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-brand-accent shrink-0 shadow-[0_0_30px_rgba(129,140,248,0.2)] mt-2 hidden md:flex">
                          <Brain className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="text-3xl font-bold text-white mb-6">The Decision Fatigue</h4>
                          <p className="text-xl text-brand-secondary leading-relaxed font-medium">
                            Dunia fitness tidak kekurangan pilihan; konten gratis berlimpah, sasana olahraga semakin modern, dan wearable semakin canggih. Masalah utamanya adalah fragmentasi ekosistem yang luar biasa. Pengguna dipaksa menyatukan sendiri tujuan, jadwal, metrik kemajuan, dan layanan profesional secara terpisah. 
                          </p>
                          <div className="mt-8 bg-brand-accent/5 border border-brand-accent/20 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 blur-[50px] rounded-full" />
                            <p className="text-xl text-white leading-relaxed font-medium relative z-10">
                              Gerakasa merespons satu pain point sederhana: pengguna sering kali memiliki niat yang kuat, namun terhambat oleh kelelahan mengambil keputusan (<span className="text-brand-accent font-bold">decision fatigue</span>) saat harus menjawab, <span className="italic font-bold">&quot;Hari ini harus ngapain?&quot;</span>.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div {...fadeUp}>
                      <div className="flex items-start gap-8">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-brand-success shrink-0 shadow-[0_0_30px_rgba(52,211,153,0.2)] mt-2 hidden md:flex">
                          <BarChart2 className="w-8 h-8" />
                        </div>
                        <div className="w-full">
                          <h4 className="text-3xl font-bold text-white mb-12">Market Data & Momentum</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 hover:border-brand-success/40 transition-colors shadow-2xl group">
                              <span className="block text-7xl font-black tracking-tighter text-white mb-2 group-hover:scale-105 transition-transform origin-left">37.4<span className="text-brand-success text-4xl">%</span></span>
                              <span className="text-sm font-bold uppercase tracking-widest text-brand-secondary">Kurang Aktivitas Fisik (SKI)</span>
                            </div>
                            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 hover:border-brand-success/40 transition-colors shadow-2xl group">
                              <span className="block text-7xl font-black tracking-tighter text-white mb-2 group-hover:scale-105 transition-transform origin-left">235<span className="text-brand-success text-4xl">M</span></span>
                              <span className="text-sm font-bold uppercase tracking-widest text-brand-secondary">Pengguna Internet ID</span>
                            </div>
                          </div>

                          <p className="text-xl text-brand-secondary leading-relaxed font-medium">
                            Analisis ruang masalah didasarkan pada data nyata. Publikasi SKI 2023 menunjukkan hambatan terbesarnya bukanlah kemalasan semata, melainkan tidak ada waktu (48,7%) dan kurangnya pendampingan.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                  </div>
                </div>
              </section>

              <SectionTransition imageSrc="/assets/transition_loop.jpg" title="The Core Engine" variant={2} />
              
              <section className="relative min-h-screen w-full flex flex-col justify-center py-32 px-6 md:px-24 lg:px-48 border-t border-white/5">
                <div className="absolute top-1/2 right-[5%] -translate-y-1/2 text-[45vh] font-black text-white/[0.02] pointer-events-none select-none tracking-tighter z-0">
                  02
                </div>

                <div className="relative z-10 w-full max-w-5xl ml-auto md:ml-0">
                  <motion.div {...fadeUp} className="mb-24">
                    <h2 className="text-brand-accent font-bold tracking-widest uppercase mb-6 text-sm flex items-center gap-6">
                      <span className="w-12 h-px bg-brand-accent/50" /> Chapter 02
                    </h2>
                    <motion.h3 
                      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-brand-accent/50 tracking-tight leading-tight"
                    >
                      Systems Architecture & <br/>G-Taxonomy
                    </motion.h3>
                  </motion.div>

                  <div className="flex flex-col gap-32">
                    
                    <motion.div {...fadeUp}>
                      <h4 className="text-3xl font-bold text-white mb-12 flex items-center gap-4">
                        <Layers className="w-8 h-8 text-brand-success" />
                        The 5-Pillar Architecture
                      </h4>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-5 flex flex-col relative">
                          <div className="absolute left-6 top-8 bottom-8 w-px border-l-2 border-dashed border-white/10" />
                          {pillarContent.map((pillar, idx) => (
                            <button 
                              key={idx}
                              onClick={() => setActivePillar(idx)}
                              className={`relative flex items-center gap-6 p-4 text-left group transition-all duration-300 ${activePillar === idx ? "opacity-100 scale-105" : "opacity-40 hover:opacity-80"}`}
                            >
                              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-colors z-10 ${activePillar === idx ? "bg-brand-success border-brand-success text-brand-bg shadow-[0_0_30px_rgba(52,211,153,0.5)]" : "bg-[#05050A] border-white/20 text-white"}`}>
                                {idx + 1}
                              </div>
                              <span className={`text-xl font-bold transition-colors ${activePillar === idx ? "text-white" : "text-white/70"}`}>
                                {pillar.title}
                              </span>
                            </button>
                          ))}
                        </div>

                        <div className="lg:col-span-7 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-12 min-h-[350px] flex items-center shadow-2xl relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-tr from-brand-success/5 to-transparent pointer-events-none" />
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activePillar}
                              initial={{ opacity: 0, x: 30 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -30 }}
                              transition={{ duration: 0.4, ease: "circOut" }}
                              className="flex flex-col gap-6 relative z-10"
                            >
                              <div className="w-20 h-20 rounded-[1.5rem] bg-brand-surface border border-white/10 flex items-center justify-center text-brand-success shadow-[0_0_40px_rgba(52,211,153,0.2)]">
                                {pillarContent[activePillar].icon}
                              </div>
                              <h5 className="text-3xl font-bold text-white">{pillarContent[activePillar].title}</h5>
                              <p className="text-xl text-brand-secondary leading-relaxed">
                                {pillarContent[activePillar].desc}
                              </p>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div {...fadeUp}>
                      <h4 className="text-3xl font-bold text-white mb-12 flex items-center gap-4">
                        <RefreshCcw className="w-8 h-8 text-brand-warning" />
                        The Daily Core Loop
                      </h4>

                      <div className="relative w-full py-20 px-8 lg:px-20 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-brand-warning/10 to-transparent pointer-events-none" />
                        
                        <div className="absolute top-[120px] bottom-[120px] left-1/2 -translate-x-1/2 w-0 border-l-2 border-dashed border-white/20 z-0 hidden md:block" />

                        <div className="flex flex-col items-center gap-16 relative z-10">
                          <div className="bg-[#05050A] border border-white/20 px-10 py-8 rounded-[2rem] flex items-center gap-8 shadow-2xl w-full max-w-lg hover:border-brand-warning/50 transition-colors">
                            <Database className="w-12 h-12 text-white/60" />
                            <div>
                              <div className="text-white font-bold text-2xl mb-1">Fitness Graph</div>
                              <div className="text-white/40 text-sm tracking-widest uppercase">Data & Context</div>
                            </div>
                          </div>
                          
                          <div className="bg-brand-warning/10 backdrop-blur-xl border border-brand-warning/40 px-12 py-10 rounded-[2.5rem] flex items-center gap-8 shadow-[0_0_60px_rgba(251,191,36,0.2)] w-full max-w-xl scale-105">
                            <Cpu className="w-14 h-14 text-brand-warning" />
                            <div>
                              <div className="text-white font-bold text-3xl mb-1">G-Intelligence</div>
                              <div className="text-brand-warning/80 text-sm uppercase tracking-widest font-bold">Processing Engine</div>
                            </div>
                          </div>

                          <div className="bg-[#05050A] border border-white/20 px-10 py-8 rounded-[2rem] flex items-center gap-8 shadow-2xl w-full max-w-lg hover:border-brand-warning/50 transition-colors">
                            <LayoutTemplate className="w-12 h-12 text-white/60" />
                            <div>
                              <div className="text-white font-bold text-2xl mb-1">G-Today</div>
                              <div className="text-white/40 text-sm tracking-widest uppercase">Next Best Action</div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </motion.div>

                  </div>
                </div>
              </section>

              <SectionTransition imageSrc="/assets/transition_scoping.jpg" title="Focus & Scope" variant={3} />
              
              <section className="relative min-h-screen w-full flex flex-col justify-center py-32 px-6 md:px-24 lg:px-48 border-t border-white/5">
                <div className="absolute top-1/2 right-[5%] -translate-y-1/2 text-[45vh] font-black text-white/[0.02] pointer-events-none select-none tracking-tighter z-0">
                  03
                </div>

                <div className="relative z-10 w-full max-w-5xl ml-auto md:ml-0">
                  <motion.div {...fadeUp} className="mb-24">
                    <h2 className="text-brand-accent font-bold tracking-widest uppercase mb-6 text-sm flex items-center gap-6">
                      <span className="w-12 h-px bg-brand-accent/50" /> Chapter 03
                    </h2>
                    <motion.h3 
                      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-brand-accent/50 tracking-tight leading-tight"
                    >
                      Ruthless Scoping & <br/>MVP Wedge
                    </motion.h3>
                  </motion.div>

                  <div className="flex flex-col gap-32">
                    
                    <motion.div {...fadeUp}>
                      <h4 className="text-3xl font-bold text-white mb-6">The MVP Wedge (Why Strength First?)</h4>
                      <div className="bg-white/5 border-l-4 border-brand-accent p-8 rounded-r-3xl backdrop-blur-xl mb-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-accent/5 blur-[50px] rounded-full" />
                        <p className="text-xl text-white leading-relaxed font-medium relative z-10">
                          Membangun Super App sejak hari pertama adalah jebakan klasik (anti-pattern). MVP Gerakasa secara radikal dibatasi hanya pada vertikal latihan kekuatan (<span className="text-brand-accent font-bold">Strength & General Fitness</span>).
                        </p>
                      </div>
                      <p className="text-xl text-brand-secondary leading-relaxed font-medium">
                        Pemilihan ini didasarkan pada metrik input/output yang sangat terukur (beban, repetisi, durasi, indikator RPE), sehingga algoritma adaptasi dapat divalidasi dengan cepat tanpa harus bergantung pada kemitraan sasana fisik (gym venue) di fase awal.
                      </p>
                    </motion.div>

                    <motion.div {...fadeUp}>
                      <h4 className="text-3xl font-bold text-white mb-12 flex items-center gap-4">
                        <Scale className="w-8 h-8 text-white/50" />
                        In-Scope vs. Ruthlessly Deferred
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 hover:border-brand-success/50 transition-all duration-500 shadow-2xl overflow-hidden hover:shadow-[0_0_50px_rgba(52,211,153,0.15)]">
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-success/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="relative z-10">
                            <h5 className="text-2xl font-bold text-brand-success mb-2">In-Scope</h5>
                            <p className="text-brand-secondary text-sm tracking-widest uppercase font-bold mb-8">The Core Engine</p>
                            <ul className="space-y-6">
                              {[
                                "G-Today Action Engine", 
                                "Adaptive G-Journey", 
                                "Strength & RPE Logging", 
                                "Basic Fitness IQ",
                                "Human Escalation Logic"
                              ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-white font-medium text-lg">
                                  <CheckCircle2 className="w-6 h-6 text-brand-success shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 hover:border-brand-warning/50 transition-all duration-500 shadow-2xl overflow-hidden hover:shadow-[0_0_50px_rgba(251,191,36,0.15)]">
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-warning/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="relative z-10">
                            <h5 className="text-2xl font-bold text-brand-warning mb-2">Ruthlessly Deferred</h5>
                            <p className="text-brand-secondary text-sm tracking-widest uppercase font-bold mb-8">Super-App Bloat</p>
                            <ul className="space-y-6">
                              {[
                                "Gym Marketplace", 
                                "ClassPass Credits System", 
                                "Hardware & Wearables SDK", 
                                "Social Feed & Forums"
                              ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-white/50 font-medium text-lg">
                                  <Lock className="w-6 h-6 text-brand-warning/50 shrink-0" />
                                  <span className="line-through">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <p className="mt-8 text-lg text-brand-secondary leading-relaxed font-medium">
                        Ambisi ekosistem dieliminasi dari fase MVP. Kompleksitas harus beroperasi di balik layar sistem, bukan membebani antarmuka pengguna.
                      </p>
                    </motion.div>

                    <motion.div {...fadeUp}>
                      <h4 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
                        <ShieldAlert className="w-8 h-8 text-brand-accent" />
                        AI-First, Human Escalation
                      </h4>
                      <p className="text-xl text-brand-secondary leading-relaxed font-medium mb-12">
                        Sistem AI tidak dirancang untuk menggantikan pelatih manusia (coach), melainkan sebagai tuas pengungkit (<span className="text-white italic">leverage</span>).
                      </p>

                      <div className="flex flex-col gap-6">
                        <div className="bg-[#05050A] border border-white/20 p-8 rounded-2xl flex items-center gap-6 shadow-xl ml-0 w-full max-w-2xl relative">
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-brand-accent rounded-full blur-md opacity-50 hidden md:block" />
                          <Cpu className="w-10 h-10 text-brand-accent shrink-0" />
                          <div>
                            <h5 className="text-xl font-bold text-white mb-2">AI Routine Orchestration</h5>
                            <p className="text-brand-secondary">AI menangani triase, pengaturan jadwal, dan pemantauan adaptasi rutin secara efisien tanpa intervensi.</p>
                          </div>
                        </div>

                        <div className="w-px h-12 bg-gradient-to-b from-brand-accent to-brand-warning ml-12 border-l-2 border-dashed border-white/20 hidden md:block" />

                        <div className="bg-brand-warning/10 border border-brand-warning/40 p-8 rounded-2xl flex items-center gap-6 shadow-xl md:ml-8 w-full max-w-2xl relative">
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-brand-warning rounded-full blur-md opacity-50 hidden md:block" />
                          <Users className="w-10 h-10 text-brand-warning shrink-0" />
                          <div>
                            <h5 className="text-xl font-bold text-brand-warning mb-2">Human Expert Escalation</h5>
                            <p className="text-white/80">Sistem memiliki logika penjaga (guardrails). Jika mendeteksi rasa sakit, ketidaknyamanan, atau kebuntuan progres (plateau), pengguna langsung dieskalasi untuk berkonsultasi dengan pakar profesional.</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>

              <SectionTransition imageSrc="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80" title="The Strategy" variant={4} />
              
              <section className="relative min-h-screen w-full flex flex-col justify-center py-32 px-6 md:px-24 lg:px-48 border-t border-white/5">
                <div className="absolute top-1/2 right-[5%] -translate-y-1/2 text-[45vh] font-black text-white/[0.02] pointer-events-none select-none tracking-tighter z-0">
                  04
                </div>

                <div className="relative z-10 w-full max-w-5xl ml-auto md:ml-0">
                  <motion.div {...fadeUp} className="mb-24">
                    <h2 className="text-brand-accent font-bold tracking-widest uppercase mb-6 text-sm flex items-center gap-6">
                      <span className="w-12 h-px bg-brand-accent/50" /> Chapter 04
                    </h2>
                    <motion.h3 
                      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-brand-accent/50 tracking-tight leading-tight"
                    >
                      Business Model, Flywheel <br/>& Competitive Moat
                    </motion.h3>
                  </motion.div>

                  <div className="flex flex-col gap-32">
                    
                    <motion.div {...fadeUp}>
                      <h4 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
                        <TrendingUp className="w-8 h-8 text-brand-success" />
                        The Monetization Value Ladder
                      </h4>
                      <p className="text-xl text-brand-secondary leading-relaxed font-medium mb-12">
                        Produk yang hebat harus memiliki unit ekonomi yang masuk akal. Monetisasi Gerakasa dibangun melalui <span className="text-white font-bold">tangga nilai</span> tanpa mengunci utilitas dasar, memungkinkan terbangunnya kebiasaan pengguna secara masif.
                      </p>
                      
                      <div className="flex flex-col gap-4 pl-4 md:pl-8">
                        {[
                          { tier: "Tier 1: Free Base", title: "Core Logging & G-Today", desc: "Membangun kebiasaan massif, akuisisi pengguna tanpa gesekan.", color: "text-white", bg: "bg-white", borderHover: "hover:border-white/50", bgHover: "hover:bg-white/10" },
                          { tier: "Tier 2: Gerakasa+", title: "Advanced Adaptive Intelligence", desc: "Langganan konsumen premium untuk analitik dan adaptasi otomatis.", color: "text-brand-success", bg: "bg-brand-success", borderHover: "hover:border-brand-success/50", bgHover: "hover:bg-brand-success/10" },
                          { tier: "Tier 3: G-Coach", title: "Expert Service Take-rate", desc: "Komisi 15-20% dari transaksi konsultasi atau pelatih pribadi.", color: "text-brand-accent", bg: "bg-brand-accent", borderHover: "hover:border-brand-accent/50", bgHover: "hover:bg-brand-accent/10" },
                          { tier: "Tier 4: Gerakasa Pro", title: "Coach Management SaaS", desc: "Langganan B2B ringan untuk pelatih mengelola banyak klien.", color: "text-brand-warning", bg: "bg-brand-warning", borderHover: "hover:border-brand-warning/50", bgHover: "hover:bg-brand-warning/10" },
                          { tier: "Tier 5: G-Access", title: "B2B Infrastructure & Booking", desc: "Komisi penyaluran trafik/booking ke sasana fisik mitra.", color: "text-purple-400", bg: "bg-purple-400", borderHover: "hover:border-purple-400/50", bgHover: "hover:bg-purple-400/10" },
                        ].map((item, idx) => (
                          <div key={idx} 
                            className="flex flex-col md:flex-row md:items-start group relative cursor-pointer"
                            onClick={() => setOpenLadderIndex(openLadderIndex === idx ? null : idx)}
                          >
                            <div className={`hidden md:block w-3 h-3 rounded-full ${item.bg} mr-6 z-10 relative mt-6 transition-all duration-300 opacity-40 group-hover:opacity-100 group-hover:scale-150 group-hover:shadow-[0_0_20px_currentColor] ${openLadderIndex === idx ? 'opacity-100 scale-150 shadow-[0_0_20px_currentColor]' : ''}`} />
                            {idx !== 4 && <div className="hidden md:block absolute left-1.5 top-6 bottom-[-24px] w-px bg-white/10 z-0" />}
                            
                            <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 w-full transition-all duration-500 flex flex-col gap-4 z-10 ${item.bgHover} ${item.borderHover} ${openLadderIndex === idx ? item.bgHover + ' ' + item.borderHover : ''} md:ml-[calc(2rem*var(--indent))]`} style={{ "--indent": idx } as React.CSSProperties}>
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                  <span className={`text-xs font-bold tracking-widest uppercase ${item.color} mb-1 block`}>{item.tier}</span>
                                  <span className="text-xl font-bold text-white">{item.title}</span>
                                </div>
                                <div className={`text-white/50 transition-transform duration-300 ${openLadderIndex === idx ? 'rotate-180 text-white' : 'group-hover:text-white'}`}>
                                  <ChevronDown className="w-5 h-5" />
                                </div>
                              </div>
                              
                              <AnimatePresence>
                                {openLadderIndex === idx && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pt-4 border-t border-white/10 mt-2">
                                      <p className="text-brand-secondary text-sm md:text-base font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div {...fadeUp}>
                      <h4 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
                        <Target className="w-8 h-8 text-brand-accent" />
                        Competitive Landscape
                      </h4>
                      <p className="text-xl text-brand-secondary leading-relaxed font-medium mb-12">
                        Lanskap kebugaran di Indonesia terfragmentasi. Alih-alih bersaing membuka sasana atau memproduksi konten video generik, Gerakasa memosisikan dirinya murni sebagai <span className="text-white font-bold bg-white/10 px-2 py-1 rounded-md">Intelligence Layer</span> yang mengorkestrasi seluruh ekosistem.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#05050A] border border-white/10 rounded-2xl p-8 opacity-60">
                          <h5 className="text-lg font-bold text-white/80 mb-2">Physical Venues</h5>
                          <p className="text-brand-secondary/60 text-sm">e.g. FIT HUB, F45</p>
                          <p className="mt-4 text-white/50 font-medium text-sm leading-relaxed">Capex besar, terikat lokasi fisik, sulit ditingkatkan secara eksponensial.</p>
                        </div>
                        <div className="bg-[#05050A] border border-white/10 rounded-2xl p-8 opacity-60">
                          <h5 className="text-lg font-bold text-white/80 mb-2">Booking & Aggregators</h5>
                          <p className="text-brand-secondary/60 text-sm">e.g. DOOgether, ClassPass</p>
                          <p className="mt-4 text-white/50 font-medium text-sm leading-relaxed">Fokus pada transaksi, tidak memiliki konteks tujuan kebugaran pengguna.</p>
                        </div>
                        <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(129,140,248,0.15)] relative overflow-hidden md:scale-105">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 blur-[50px] rounded-full pointer-events-none" />
                          <h5 className="text-xl font-bold text-brand-accent mb-2">Gerakasa</h5>
                          <p className="text-brand-accent/60 text-xs font-bold tracking-widest uppercase mb-4">Intelligence Layer</p>
                          <p className="text-white font-medium text-sm leading-relaxed relative z-10">Mengarahkan pengguna <span className="italic">kapan</span> dan <span className="italic">di mana</span> mereka harus menggunakan layanan fisik berdasarkan data objektif.</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div {...fadeUp}>
                      <h4 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
                        <Atom className="w-8 h-8 text-brand-success" />
                        The Unfair Advantage (Moat)
                      </h4>
                      <p className="text-xl text-brand-secondary leading-relaxed font-medium mb-16 md:mb-24">
                        Pertahanan utama (moat) bukanlah model prompt AI generik, melainkan <span className="text-white font-bold">Personal Fitness Graph</span>. Profil yang kaya membuat intelligence semakin mustahil direplikasi dari nol oleh platform lain.
                      </p>

                      <div className="relative w-full max-w-3xl mx-auto aspect-square md:aspect-video flex items-center justify-center my-10">
                        <div className="absolute w-[90%] md:w-[70%] h-[90%] md:h-auto md:aspect-square rounded-full border border-dashed border-white/20 m-auto z-0" />
                        
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                          className="absolute w-[90%] md:w-[70%] h-[90%] md:h-auto md:aspect-square rounded-full flex items-start justify-center z-10 pointer-events-none"
                        >
                          <div className="w-4 h-4 rounded-full bg-brand-success shadow-[0_0_30px_rgba(52,211,153,1)] -mt-2" />
                        </motion.div>

                        <div className="relative z-20 bg-[#05050A] border-2 border-brand-success shadow-[0_0_50px_rgba(52,211,153,0.3)] w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center text-center p-4">
                          <Database className="w-8 h-8 text-brand-success mb-2" />
                          <span className="text-xs md:text-sm font-bold text-white uppercase tracking-widest leading-tight">Data Moat<br/>Flywheel</span>
                        </div>

                        <div className="absolute top-[-10%] md:top-[0%] left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-xl border border-brand-accent/40 rounded-xl p-4 shadow-xl text-center min-w-[150px] md:min-w-[180px] z-30">
                          <span className="block text-brand-accent font-bold mb-1">1. Relevant Journey</span>
                          <span className="text-xs text-white/60">Rekomendasi adaptif</span>
                        </div>
                        
                        <div className="absolute right-[-5%] md:right-[0%] top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-xl border border-brand-success/40 rounded-xl p-4 shadow-xl text-center min-w-[150px] md:min-w-[180px] z-30">
                          <span className="block text-brand-success font-bold mb-1">2. Higher Retention</span>
                          <span className="text-xs text-white/60">Pengguna bertahan lama</span>
                        </div>

                        <div className="absolute bottom-[-10%] md:bottom-[0%] left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-xl border border-brand-warning/40 rounded-xl p-4 shadow-xl text-center min-w-[150px] md:min-w-[180px] z-30">
                          <span className="block text-brand-warning font-bold mb-1">3. Richer Graph</span>
                          <span className="text-xs text-white/60">Data profil lebih kaya</span>
                        </div>

                        <div className="absolute left-[-5%] md:left-[0%] top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-xl border border-purple-400/40 rounded-xl p-4 shadow-xl text-center min-w-[150px] md:min-w-[180px] z-30">
                          <span className="block text-purple-400 font-bold mb-1">4. Unfair Advantage</span>
                          <span className="text-xs text-white/60">AI semakin presisi</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>

              <SectionTransition imageSrc="/assets/transition_loop.jpg" title="Metrics & Scale" variant={1} />
              
              <section className="relative min-h-screen w-full flex flex-col justify-center py-32 px-6 md:px-24 lg:px-48 border-t border-white/5">
                <div className="absolute top-1/2 right-[5%] -translate-y-1/2 text-[45vh] font-black text-white/[0.02] pointer-events-none select-none tracking-tighter z-0">
                  05
                </div>

                <div className="relative z-10 w-full max-w-5xl ml-auto md:ml-0">
                  <motion.div {...fadeUp} className="mb-24">
                    <h2 className="text-brand-accent font-bold tracking-widest uppercase mb-6 text-sm flex items-center gap-6">
                      <span className="w-12 h-px bg-brand-accent/50" /> Chapter 05
                    </h2>
                    <motion.h3 
                      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-brand-accent/50 tracking-tight leading-tight"
                    >
                      Validation Gates,<br/>Hard Metrics & Roadmap
                    </motion.h3>
                  </motion.div>

                  <div className="flex flex-col gap-32">
                    
                    <motion.div {...fadeUp}>
                      <h4 className="text-3xl font-bold text-white mb-6">Target MVP Validation Gates</h4>
                      <p className="text-xl text-brand-secondary leading-relaxed font-medium mb-12">
                        MVP tidak diukur dari seberapa banyak fitur yang diluncurkan, melainkan dari pembuktian nilai berulang (<span className="text-white italic">repeated value</span>).
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
                          <h5 className="text-6xl font-black text-white mb-2 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)] group-hover:scale-105 transition-transform origin-left">&gt;30<span className="text-3xl text-brand-success">%</span></h5>
                          <p className="text-brand-secondary font-bold tracking-widest uppercase text-xs mb-2">D7 Retention</p>
                          <p className="text-white/60 text-sm">Sinyal kebiasaan awal yang kuat.</p>
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                            <motion.div initial={{ width: 0 }} whileInView={{ width: "35%" }} transition={{ duration: 1.5, delay: 0.2 }} viewport={{ once: true }} className="h-full bg-brand-success shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                          </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
                          <h5 className="text-6xl font-black text-white mb-2 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)] group-hover:scale-105 transition-transform origin-left">&ge;3</h5>
                          <p className="text-brand-secondary font-bold tracking-widest uppercase text-xs mb-2">Actions / WAU</p>
                          <p className="text-white/60 text-sm">Ambang batas nilai inti terpenuhi.</p>
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                            <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1.5, delay: 0.4 }} viewport={{ once: true }} className="h-full bg-brand-success shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                          </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
                          <h5 className="text-6xl font-black text-brand-warning mb-2 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)] group-hover:scale-105 transition-transform origin-left">0</h5>
                          <p className="text-brand-secondary font-bold tracking-widest uppercase text-xs mb-2">Safety Incidents</p>
                          <p className="text-white/60 text-sm">Logika penjaga mutlak (guardrails).</p>
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                            <motion.div initial={{ width: 0 }} whileInView={{ width: "5%" }} transition={{ duration: 1.5, delay: 0.6 }} viewport={{ once: true }} className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div {...fadeUp}>
                      <h4 className="text-3xl font-bold text-white mb-6">Execution Roadmap (0–24 Months)</h4>
                      <p className="text-xl text-brand-secondary leading-relaxed font-medium mb-16">
                        Skala produk dibangun melalui fase ekspansi yang terstruktur. Aturan emas: <span className="text-white font-bold">Vertikal baru tidak akan dibuka sebelum vertikal saat ini mencetak metrik retensi yang tervalidasi.</span>
                      </p>

                      <div className="relative pl-8 md:pl-0">
                        <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-white/10 rounded-full" />
                        <motion.div 
                          initial={{ height: 0 }}
                          whileInView={{ height: "100%" }}
                          transition={{ duration: 2.5, ease: "easeInOut" }}
                          viewport={{ once: true, margin: "-100px" }}
                          className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 w-1 bg-brand-accent rounded-full shadow-[0_0_15px_rgba(129,140,248,0.5)] origin-top" 
                        />

                        <div className="flex flex-col gap-12 relative z-10">
                          {[
                            { phase: "Phase 0-1", title: "Discovery & Alpha Strength", desc: "Fokus ke validasi masalah & peluncuran eksklusif vertikal latihan kekuatan.", side: "left" },
                            { phase: "Phase 2-3", title: "Beta & Paid Signal", desc: "Peluncuran eksperimen pilot berbayar dan validasi demand (Gerakasa+).", side: "right" },
                            { phase: "Phase 4-5", title: "Horizontal Proof & Local Ecosystem", desc: "Ekspansi ke olahraga lari dan rilis fitur pemesanan sasana/acara lokal.", side: "left" },
                            { phase: "Phase 6", title: "Network & B2B Expansion", desc: "Skalakan jaringan secara masif dan luncurkan modul Enterprise/B2B.", side: "right" }
                          ].map((node, i) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, x: -30 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.6, delay: i * 0.15 }}
                              viewport={{ once: true, margin: "-50px" }}
                              className={`flex items-center ${node.side === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'} w-full`}
                            >
                              <div className="hidden md:block md:w-1/2" />
                              
                              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#05050A] border-4 border-brand-accent shadow-[0_0_15px_rgba(129,140,248,0.8)] z-10 flex items-center justify-center">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10"/></svg>
                              </div>
                              
                              <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${node.side === 'left' ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                                <motion.div 
                                  initial={{ opacity: 0, x: node.side === 'left' ? -20 : 20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.5, delay: i * 0.3 }}
                                  viewport={{ once: true }}
                                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                                >
                                  <span className="text-brand-accent font-bold tracking-widest uppercase text-xs mb-2 block">{node.phase}</span>
                                  <h5 className="text-xl font-bold text-white mb-2">{node.title}</h5>
                                  <p className="text-brand-secondary text-sm font-medium">{node.desc}</p>
                                </motion.div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div {...fadeUp}>
                      <h4 className="text-3xl font-bold text-white mb-6">Founder Anti-Patterns & Risk Mitigation</h4>
                      <p className="text-xl text-brand-secondary leading-relaxed font-medium mb-12">
                        Hierarki keputusan perusahaan secara ketat menempatkan Keamanan & Kepercayaan Pengguna (<span className="text-white italic">User Safety & Trust</span>) di urutan pertama.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#1A0B0B]/40 backdrop-blur-2xl border border-red-500/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(239,68,68,0.05)] hover:border-red-500/40 transition-colors">
                          <h5 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Risk: Super-App Bloat</h5>
                          <p className="text-white/60 mb-6 text-sm">Fitur bertambah lebih cepat dari validasi data.</p>
                          <div className="bg-[#05050A] border border-white/5 p-4 rounded-xl">
                            <span className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1 block">Mitigation</span>
                            <p className="text-white font-medium text-sm">Strict validation gates before feature expansion.</p>
                          </div>
                        </div>

                        <div className="bg-[#1A0B0B]/40 backdrop-blur-2xl border border-orange-500/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(249,115,22,0.05)] hover:border-orange-500/40 transition-colors">
                          <h5 className="text-xl font-bold text-orange-400 mb-2 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Risk: AI Gimmick</h5>
                          <p className="text-white/60 mb-6 text-sm">AI sekadar menjadi chatbot hiasan tanpa orkestrasi nyata.</p>
                          <div className="bg-[#05050A] border border-white/5 p-4 rounded-xl">
                            <span className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1 block">Mitigation</span>
                            <p className="text-white font-medium text-sm">AI bounded to orchestration and actionable daily outputs, not open-ended chat.</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>

              <SectionTransition imageSrc="/assets/transition_scoping.jpg" title="The Visual Identity" variant={2} />
              
              <section className="relative w-full py-32 border-t border-white/5 overflow-hidden">
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-24">
                  <motion.div {...fadeUp} className="mb-16 text-center md:text-left">
                    <h2 className="text-brand-accent font-bold tracking-widest uppercase mb-4 text-sm flex items-center justify-center md:justify-start gap-4">
                      <span className="w-12 h-px bg-brand-accent/50 hidden md:block" /> Interface Highlights
                    </h2>
                    <motion.h3 
                      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-brand-accent/50 tracking-tight leading-tight"
                    >
                      Translating complex orchestration <br className="hidden md:block" /> into a frictionless user experience.
                    </motion.h3>
                  </motion.div>
                </div>
                
                <motion.div {...fadeUp} className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                    {mockupImages.map((src, i) => {
                      const isEvenRow = Math.floor(i / 4) % 2 === 0;
                      const hoverColors = [
                        "hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]",
                        "hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]",
                        "hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]",
                        "hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]",
                        "hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
                        "hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]",
                      ];
                      const bgColors = [
                        "group-hover:bg-indigo-500/10",
                        "group-hover:bg-emerald-500/10",
                        "group-hover:bg-rose-500/10",
                        "group-hover:bg-amber-500/10",
                        "group-hover:bg-purple-500/10",
                        "group-hover:bg-cyan-500/10",
                      ];
                      const hoverClass = hoverColors[i % hoverColors.length];
                      const bgClass = bgColors[i % bgColors.length];
                      
                      return (
                        <motion.div 
                          key={i}
                          whileHover={{ y: -10, scale: 1.02 }}
                          initial={{ opacity: 0, x: isEvenRow ? 50 : -50, y: 20 }}
                          whileInView={{ opacity: 1, x: 0, y: 0 }}
                          transition={{ duration: 0.6, delay: (i % 4) * 0.15 }}
                          viewport={{ once: true }}
                          onClick={() => { setSelectedMockupIndex(i); setZoomLevel(1); setPanY(0); }}
                          className={`cursor-pointer aspect-[9/19] rounded-[2rem] md:rounded-[2.5rem] border-[6px] border-white/10 bg-[#0A0A0E] shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-300 relative overflow-hidden flex items-center justify-center group ${hoverClass}`}
                        >
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-xl z-20" />
                          
                          <div className="relative w-full h-full overflow-hidden">
                            <Image 
                              src={src}
                              alt={`UI Mockup ${i + 1}`}
                              fill
                              className="object-cover md:object-contain transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                          </div>
                          <div className={`absolute inset-0 bg-transparent transition-colors duration-500 pointer-events-none z-10 ${bgClass}`} />
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </section>

              <SectionTransition imageSrc="/assets/transition_thesis.jpg" title="The Specification" variant={3} />
              
              <section className="relative min-h-screen w-full flex flex-col justify-center py-32 px-6 md:px-24 lg:px-48 border-t border-white/5">
                <div className="absolute top-1/2 left-[5%] -translate-y-1/2 text-[45vh] font-black text-white/[0.02] pointer-events-none select-none tracking-tighter z-0">
                  06
                </div>

                <div className="relative z-10 w-full max-w-6xl mx-auto">
                  <motion.div {...fadeUp} className="mb-16">
                    <h2 className="text-brand-accent font-bold tracking-widest uppercase mb-6 text-sm flex items-center gap-6">
                      <span className="w-12 h-px bg-brand-accent/50" /> Chapter 06
                    </h2>
                    <motion.h3 
                      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-brand-accent/50 tracking-tight leading-tight"
                    >
                      The Master Specifications
                    </motion.h3>
                    <p className="text-xl text-brand-secondary font-medium mt-6 max-w-2xl">
                      A 10-point deep dive into the high-signal executive blueprint driving the development of Gerakasa.
                    </p>
                  </motion.div>

                  <motion.div {...fadeUp} className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative z-10">
                    <div className="w-full lg:w-[35%] flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible scrollbar-hide pb-4 lg:pb-0 snap-x snap-mandatory">
                      {masterSpecs.map((spec, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveTab(idx)}
                          className={`snap-start shrink-0 lg:w-full text-left px-6 py-4 rounded-xl transition-all duration-300 font-bold flex items-center gap-4 ${
                            activeTab === idx 
                            ? "bg-white/10 border-l-4 border-brand-accent text-white shadow-xl" 
                            : "text-slate-500 hover:bg-white/5 hover:text-slate-300 border-l-4 border-transparent"
                          }`}
                        >
                          <span className={`text-xs tracking-widest uppercase ${activeTab === idx ? "text-brand-accent" : "text-slate-600"}`}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="whitespace-nowrap lg:whitespace-normal">{spec.title}</span>
                        </button>
                      ))}
                    </div>

                    {/* Right Column: Content Display Area */}
                    <div className="w-full lg:w-[65%] min-h-[300px] flex items-center">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="bg-[#05050A]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group w-full"
                        >
                          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 blur-[100px] rounded-full group-hover:bg-brand-accent/10 transition-colors duration-700" />
                          <h4 className="text-brand-accent font-bold tracking-widest uppercase mb-6 flex items-center gap-4">
                            Point {String(activeTab + 1).padStart(2, '0')}
                          </h4>
                          <h5 className="text-3xl md:text-4xl font-bold text-white mb-8">
                            {masterSpecs[activeTab].title}
                          </h5>
                          <div className="text-base md:text-lg text-brand-secondary leading-relaxed font-medium">
                            {masterSpecs[activeTab].content}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* -------------------------------------------------------- */}
              {/* THE GRAND FINALE (Outro Section)                           */}
              {/* -------------------------------------------------------- */}
              <section className="relative min-h-[80vh] w-full flex flex-col items-center justify-center py-32 px-6 border-t border-white/10 overflow-hidden bg-[#05050A] z-20">
                <div className="absolute inset-0 bg-gradient-to-t from-brand-accent/5 to-transparent pointer-events-none" />
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="relative z-10 w-full max-w-4xl bg-white/5 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-12 md:p-20 text-center shadow-[0_0_100px_rgba(129,140,248,0.15)] flex flex-col items-center"
                >
                  <div className="relative w-24 h-24 rounded-full flex items-center justify-center mb-10 group">
                    {/* Rotating glowing border */}
                    <div className="absolute inset-0 rounded-full border border-brand-accent/30 bg-brand-accent/5 backdrop-blur-sm" />
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                      className="absolute inset-[-4px] rounded-full border-t-2 border-r-2 border-brand-accent/80 opacity-70"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }} 
                      transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                      className="absolute inset-[-8px] rounded-full border-b-2 border-l-2 border-brand-success/50 opacity-50"
                    />
                    {/* Pulsing glow */}
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="absolute inset-0 bg-brand-accent/20 blur-xl rounded-full"
                    />
                    {/* Icon */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                      className="relative z-10 text-brand-accent drop-shadow-[0_0_15px_rgba(129,140,248,0.8)]"
                    >
                      <Atom className="w-12 h-12" />
                    </motion.div>
                  </div>
                  
                  <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-brand-accent">
                    Let&apos;s build defensible<br/>zero-to-one products.
                  </h2>
                  <p className="text-xl md:text-2xl text-brand-secondary font-medium mb-12 max-w-2xl">
                    Open to product leadership, AI engineering roles, and high-impact collaborations.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-md mx-auto">
                    <a 
                      href="https://wa.me/6281946838791" 
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#25D366]/80 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:shadow-[0_0_40px_rgba(37,211,102,0.6)] hover:scale-105 flex items-center justify-center gap-3"
                    >
                      <WhatsappIcon className="w-6 h-6" />
                      Contact via WhatsApp
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/khdfii9/" 
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-full font-bold text-lg transition-all hover:scale-105 flex justify-center"
                    >
                      Connect on LinkedIn
                    </a>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  viewport={{ once: true }}
                  onClick={() => setShowPresentation(false)}
                  className="mt-16 text-white/40 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold flex items-center gap-2 group"
                >
                  <XCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Close Blueprint
                </motion.button>
              </section>

            </div>
            
            {/* Scroll to Top inside Presentation */}
            <motion.button
              onClick={() => {
                const el = document.querySelector('.scrollbar-hide');
                if(el) el.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:border-brand-accent/50 transition-all shadow-2xl"
            >
              <ChevronUp className="w-5 h-5" />
            </motion.button>
            
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedMockupIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMockupIndex(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-12"
          >
            <motion.button 
              className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 rounded-full p-2 z-50 transition-colors"
              onClick={() => setSelectedMockupIndex(null)}
            >
              <X className="w-8 h-8" />
            </motion.button>
            
            <button 
              className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all z-50 shadow-xl"
              onClick={handlePrevMockup}
            >
              <ArrowLeft className="w-8 h-8" />
            </button>

            <button 
              className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all z-50 shadow-xl"
              onClick={handleNextMockup}
            >
              <ArrowRight className="w-8 h-8" />
            </button>

            {/* Zoom Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
              <button 
                className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
                onClick={(e) => { e.stopPropagation(); setZoomLevel(prev => Math.max(0.5, prev - 0.25)); }}
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <div className="text-white/90 font-medium min-w-[3rem] text-center text-sm">{Math.round(zoomLevel * 100)}%</div>
              <button 
                className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
                onClick={(e) => { e.stopPropagation(); setZoomLevel(prev => Math.min(3, prev + 0.25)); }}
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Pan Controls (Vertical Scroll simulation) */}
            {zoomLevel > 1 && (
              <div className="absolute right-4 md:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-2xl">
                <button 
                  onClick={(e) => { e.stopPropagation(); setPanY(p => p + 200); }}
                  className="text-white/50 hover:text-white bg-white/5 hover:bg-white/20 p-3 rounded-full transition-all active:scale-95"
                  title="Scroll Up"
                >
                  <ChevronUp className="w-6 h-6" />
                </button>
                <div className="w-full h-px bg-white/10 my-1" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setPanY(p => p - 200); }}
                  className="text-white/50 hover:text-white bg-white/5 hover:bg-white/20 p-3 rounded-full transition-all active:scale-95"
                  title="Scroll Down"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>
            )}

            <motion.div
              key={selectedMockupIndex}
              initial={{ scale: 0.9, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-[400px] md:max-w-[500px] h-[80vh] md:h-full flex items-center justify-center rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="relative w-full h-full transition-transform duration-300 ease-out"
                style={{ transform: `translateY(${panY}px) scale(${zoomLevel})` }}
              >
                <Image
                  src={mockupImages[selectedMockupIndex]}
                  alt={`Enlarged Mockup ${selectedMockupIndex + 1}`}
                  fill
                  className="object-contain"
                  quality={100}
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certificate Lightbox Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6"
          >
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-[10000] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 shadow-2xl"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] bg-[#0A0C10] border border-white/20 rounded-3xl overflow-y-auto shadow-2xl flex flex-col mt-8 md:mt-0"
            >
              <div className="relative w-full h-[45vh] md:h-[60vh] shrink-0 bg-black/40 p-4">
                <Image
                  src={selectedCert.image}
                  alt={selectedCert.title}
                  fill
                  className="object-contain"
                  quality={100}
                />
              </div>
              <div className="p-4 md:p-6 bg-white/5 backdrop-blur-xl border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-accent block mb-1">
                    {selectedCert.issuer} {selectedCert.issuer && "•"} {selectedCert.category}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-white">{selectedCert.title}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {selectedCert.link && selectedCert.link !== "#" && (
                    <a
                      href={selectedCert.link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-2.5 rounded-xl bg-brand-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-accent/90 transition-colors shadow-lg flex items-center justify-center"
                    >
                      Lihat Asli
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-colors shadow-lg"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
