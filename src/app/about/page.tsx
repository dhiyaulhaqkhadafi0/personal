"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Rocket, Lightbulb, Code2, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";

export default function AboutPage() {
  const values = [
    {
      icon: <Rocket className="w-6 h-6 text-brand-accent" />,
      title: "High-Velocity Execution",
      desc: "Tidak ada waktu untuk sekadar wacana. Fokus pada eksekusi cepat, iterasi, dan validasi pasar nyata.",
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-yellow-400" />,
      title: "AI-First Approach",
      desc: "Memanfaatkan AI secara maksimal bukan hanya sebagai fitur, tapi sebagai fondasi pembangunan produk.",
    },
    {
      icon: <Code2 className="w-6 h-6 text-emerald-400" />,
      title: "Defensible Architecture",
      desc: "Membangun sistem yang scalable dan aman sejak hari pertama (zero-to-one).",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-400" />,
      title: "User-Centric Design",
      desc: "Setiap baris kode ditulis untuk memecahkan masalah pengguna yang sebenarnya.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#05050A] text-white pt-32 pb-24 relative overflow-hidden flex-1">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-brand-accent transition-colors mb-12 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Kembali</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-purple-400">Saya</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-16">
              Saya adalah seorang <strong className="text-white">AI-Assisted Product Engineer</strong>. Misi saya adalah mengubah ruang masalah yang ambigu menjadi produk digital berkecepatan tinggi dan defensible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0A0C10] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-brand-accent/20 to-indigo-900/20 border border-brand-accent/30 p-10 md:p-12 rounded-[3rem] text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Mari Bangun Sesuatu yang Besar</h2>
            <p className="text-white/70 mb-8 max-w-lg mx-auto">
              Apakah Anda memiliki ide produk gila, butuh bantuan untuk AI integration, atau ingin bertukar pikiran?
            </p>
            <Link href="mailto:daffadhiyaulhaqkhadafi@gmail.com" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-accent text-white font-bold rounded-full hover:bg-brand-accent/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(129,140,248,0.4)]">
              Mulai Percakapan <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
}
