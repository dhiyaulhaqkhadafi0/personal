import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function LabFounder() {
  return (
    <section className="py-28 bg-[#05070A] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* INSTITUTION / FOUNDER NOTE */}
        <div className="pb-20 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 mb-10">
            <span className="w-2 h-2 rounded-none bg-[#7DD3FC]" />
            <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
              INSTITUTION {"//"} FOUNDER NOTE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-6">
              <h3 className="text-2xl sm:text-4xl font-bold text-[#F4F7FA] tracking-tight leading-snug">
                HCFTL is currently an independent, founder-led research initiative.
              </h3>

              <div className="space-y-1 pt-2">
                <div className="text-lg font-bold text-[#F4F7FA]">
                  Daffa Dhiyaulhaq Khadafi
                </div>
                <div className="text-xs font-mono text-[#7DD3FC] tracking-wider uppercase">
                  Founder & Research Director
                </div>
              </div>

              <p className="text-base text-[#A2ACB9] font-light leading-relaxed max-w-2xl">
                AI-Assisted Product Engineer exploring how small, AI-augmented teams can participate
                meaningfully in frontier technology development—operating with the institutional
                rigour typically reserved for major research organizations.
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#080B10] border border-white/10 hover:border-[#7DD3FC]/40 text-xs font-mono text-[#F4F7FA] hover:text-[#7DD3FC] transition-all tracking-wider uppercase"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Personal Site</span>
              </Link>
            </div>
          </div>
        </div>

        {/* HCFTL INSTITUTIONAL CLOSING LAYER (Preserves immersion before shared footer) */}
        <div className="pt-20">
          <div className="p-8 sm:p-12 bg-[#080B10] border border-white/[0.08] relative font-mono">
            {/* Top Bar with facility stamps */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-white/[0.06] gap-4">
              <div>
                <div className="text-sm font-bold text-[#F4F7FA] tracking-wider uppercase">
                  HCFTL / HUMAN CENTERED FRONTIER TECHNOLOGY LAB
                </div>
                <div className="text-[11px] text-[#66717F]">
                  INDEPENDENT APPLIED RESEARCH FACILITY &bull; EST. 2026
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[#34D399] font-bold">SIGNAL CORE ACTIVE</span>
                <span className="text-white/20">|</span>
                <span className="text-[#66717F]">FOUNDATION PHASE 1.0</span>
              </div>
            </div>

            {/* Coordinates / Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs mb-8">
              <div>
                <span className="text-[10px] text-[#66717F] block uppercase tracking-wider mb-1">
                  FACILITY TYPE
                </span>
                <span className="text-[#A2ACB9]">APPLIED RESEARCH</span>
              </div>
              <div>
                <span className="text-[10px] text-[#66717F] block uppercase tracking-wider mb-1">
                  GOVERNANCE
                </span>
                <span className="text-[#A2ACB9]">INDEPENDENT / FOUNDER-LED</span>
              </div>
              <div>
                <span className="text-[10px] text-[#66717F] block uppercase tracking-wider mb-1">
                  REGISTRY
                </span>
                <span className="text-[#A2ACB9]">FOUNDATION LOCK (000)</span>
              </div>
              <div>
                <span className="text-[10px] text-[#66717F] block uppercase tracking-wider mb-1">
                  SURFACE
                </span>
                <span className="text-[#A2ACB9]">PUBLIC INTERFACE /LAB</span>
              </div>
            </div>

            {/* Bottom Copyright & Citation Notice */}
            <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#66717F]">
              <div>
                &copy; 2026 HCFTL. All rights reserved. Non-commercial scientific citation permitted with attribution.
              </div>
              <div className="text-[#7DD3FC]/80">
                STATION ID: HCFTL-JKT-HQ-01
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
