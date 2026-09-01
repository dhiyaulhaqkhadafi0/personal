"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Scale, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";

export default function TermsPage() {
  const terms = [
    {
      icon: <FileText className="w-6 h-6 text-brand-accent" />,
      title: "Ketentuan Penggunaan",
      content: "Dengan mengakses dan menggunakan situs web ini, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari persyaratan ini, Anda tidak diperkenankan menggunakan layanan kami.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
      title: "Kekayaan Intelektual",
      content: "Konten, desain, tata letak, dan grafis pada situs ini adalah milik Daffa Dhiyaulhaq Khadafi dan dilindungi oleh undang-undang hak cipta. Reproduksi tanpa izin tertulis dilarang keras.",
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-yellow-400" />,
      title: "Penolakan Tanggung Jawab (Disclaimer)",
      content: "Informasi yang diberikan di situs ini hanya untuk tujuan informasi umum. Kami tidak memberikan jaminan, tersurat maupun tersirat, atas kelengkapan atau keakuratan informasi tersebut.",
    },
    {
      icon: <Scale className="w-6 h-6 text-rose-400" />,
      title: "Perubahan Ketentuan",
      content: "Kami berhak untuk memperbarui atau mengubah Syarat dan Ketentuan ini kapan saja tanpa pemberitahuan sebelumnya. Penggunaan berkelanjutan Anda atas situs web ini setelah perubahan apa pun menandakan penerimaan Anda terhadap ketentuan baru.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#05050A] text-white pt-32 pb-24 relative overflow-hidden flex-1">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />
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
              Syarat & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">Ketentuan</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed">
              Aturan main saat menggunakan situs dan layanan kami. Kami membuatnya tetap sederhana agar Anda mengerti hak dan kewajiban Anda.
            </p>
          </motion.div>

          <div className="space-y-6">
            {terms.map((term, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#0A0C10] border border-white/10 p-8 rounded-[2rem] hover:bg-white/5 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    {term.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{term.title}</h3>
                </div>
                <p className="text-white/60 leading-relaxed text-sm md:text-base md:pl-16">
                  {term.content}
                </p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center text-white/40 text-sm"
          >
            Jika Anda memiliki pertanyaan terkait syarat dan ketentuan ini, silakan <a href="mailto:daffadhiyaulhaqkhadafi@gmail.com" className="text-brand-accent hover:underline">hubungi kami</a>.
          </motion.div>
        </div>
      </main>
    </>
  );
}
