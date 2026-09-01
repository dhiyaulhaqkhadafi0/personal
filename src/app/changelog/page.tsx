"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Rocket, Wrench, Sparkles } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";

export default function ChangelogPage() {
  const logs = [
    {
      version: "v1.1.0",
      date: "September 2026",
      type: "feature", // feature, fix, update
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      title: "Subscription Form & Legal Pages",
      changes: [
        "Menambahkan form *subscription* dengan animasi Framer Motion dan ikon *paper plane* kustom.",
        "Merombak tata letak footer menjadi komponen global.",
        "Menambahkan halaman *About*, *Privacy Policy*, *Terms*, dan *Changelog* dengan desain *vibe-coded*.",
        "Memperbarui Favicon situs agar sesuai dengan persona profil."
      ]
    },
    {
      version: "v1.0.0",
      date: "Agustus 2026",
      type: "launch",
      icon: <Rocket className="w-5 h-5 text-emerald-400" />,
      title: "Gerakasa Portfolio Launch",
      changes: [
        "Merilis iterasi pertama dari portofolio personal.",
        "Mengimplementasikan *Hero Section*, *Credentials Archive*, dan *Blueprint Section*.",
        "Mengintegrasikan Next.js 16 (Turbopack) dengan Tailwind CSS untuk kecepatan maksimal.",
        "Membuat UI dinamis menggunakan animasi *scroll* dan *hover states*."
      ]
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#05050A] text-white pt-32 pb-24 relative overflow-hidden flex-1">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />

        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-brand-accent transition-colors mb-12 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Kembali</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Changelog</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed">
              Catatan perjalanan pembangunan situs ini. Mengadopsi prinsip <span className="text-white font-medium">Build in Public</span>, saya mencatat setiap iterasi dan pembaruan fitur di sini.
            </p>
          </motion.div>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {logs.map((log, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                {/* Icon Marker */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#05050A] bg-[#0A0C10] shadow-[0_0_20px_rgba(0,0,0,0.5)] z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:scale-110 group-hover:border-white/20 transition-all">
                  {log.icon}
                </div>
                
                {/* Content Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white tracking-widest">{log.version}</span>
                    <span className="text-xs text-white/40 font-medium uppercase tracking-widest">{log.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{log.title}</h3>
                  <ul className="space-y-3">
                    {log.changes.map((change, i) => (
                      <li key={i} className="flex gap-3 text-sm text-white/60 leading-relaxed">
                        <span className="text-white/20 mt-0.5">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>
      </main>
    </>
  );
}
