"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";

export default function PrivacyPage() {
  const sections = [
    {
      icon: <Database className="w-6 h-6 text-brand-accent" />,
      title: "Data yang Kami Kumpulkan",
      content: "Kami hanya mengumpulkan informasi yang Anda berikan secara sukarela, seperti nama dan alamat email saat Anda berlangganan *newsletter* atau menghubungi kami. Kami tidak secara diam-diam melacak data pribadi Anda.",
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      title: "Penggunaan Informasi",
      content: "Informasi yang Anda berikan hanya digunakan untuk tujuan yang telah Anda setujui: mengirimkan pembaruan, sumber daya, dan membalas pertanyaan Anda. Kami tidak akan pernah menjual atau menyewakan data Anda kepada pihak ketiga.",
    },
    {
      icon: <Lock className="w-6 h-6 text-yellow-400" />,
      title: "Keamanan Data",
      content: "Kami menerapkan langkah-langkah keamanan standar industri untuk melindungi informasi Anda. Namun, perlu diingat bahwa tidak ada transmisi data melalui internet yang 100% aman.",
    },
    {
      icon: <Eye className="w-6 h-6 text-blue-400" />,
      title: "Hak Privasi Anda",
      content: "Anda berhak untuk meminta penghapusan, pembaruan, atau akses ke data pribadi Anda yang kami simpan. Kapan pun Anda ingin berhenti berlangganan, Anda bisa mengklik tautan *unsubscribe* di email kami tanpa syarat apa pun.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#05050A] text-white pt-32 pb-24 relative overflow-hidden flex-1">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 font-bold text-xs uppercase tracking-widest mb-6">
              Diperbarui: Sep 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Kebijakan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Privasi</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed">
              Transparansi dan privasi adalah hak Anda. Dokumen ini menjelaskan dengan sederhana bagaimana kami menangani data Anda. Tidak ada jargon hukum yang membingungkan.
            </p>
          </motion.div>

          <div className="space-y-8">
            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-white/20 transition-all flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#0A0C10] border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">{section.title}</h3>
                  <p className="text-white/60 leading-relaxed text-sm md:text-base">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
