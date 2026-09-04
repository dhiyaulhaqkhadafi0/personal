import Link from "next/link";
import { ArrowLeft, UserCheck } from "lucide-react";

export function LabFounder() {
  return (
    <section className="py-24 border-b border-white/[0.06] bg-[#080B10]/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
            11 // LEADERSHIP & INSTITUTION
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="p-8 sm:p-10 rounded-2xl bg-[#0D1117] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#7DD3FC] font-semibold">
              <UserCheck className="w-4 h-4" />
              <span>FOUNDER / RESEARCH DIRECTOR</span>
            </div>

            <h3 className="text-2xl font-bold text-[#F4F7FA]">
              Daffa Dhiyaulhaq Khadafi
            </h3>

            <p className="text-sm text-[#A2ACB9] leading-relaxed font-light">
              AI-Assisted Product Engineer exploring how small, AI-augmented teams can participate
              meaningfully in frontier technology development.
            </p>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#111720] border border-white/10 text-xs font-mono text-[#F4F7FA] hover:text-[#7DD3FC] hover:border-[#7DD3FC]/40 transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Personal Site</span>
          </Link>
        </div>

        {/* Institutional Footer */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#66717F]">
          <div>
            &copy; 2026 HCFTL — Human Centered Frontier Technology Lab. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>FOUNDATION EDITION 1.0</span>
            <span>&bull;</span>
            <span>INDEPENDENT FACILITY</span>
          </div>
        </div>
      </div>
    </section>
  );
}
