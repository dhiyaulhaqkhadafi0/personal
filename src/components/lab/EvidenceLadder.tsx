import { EVIDENCE_LADDER } from "@/lib/hcftl";
import { Lora } from "next/font/google";
import { ArrowUp } from "lucide-react";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

export function EvidenceLadder() {
  // Ladder reversed so 06 is at the top and 01 is at the base
  const ladderReversed = [...EVIDENCE_LADDER].reverse();

  return (
    <section className="py-28 border-b border-white/[0.08] bg-[#05070A] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 pb-8 border-b border-white/[0.08] gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-none bg-[#7DD3FC]" />
              <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
                MATURITY AXIS {"//"} 06 LEVELS
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#F4F7FA] tracking-tight">
              The Evidence Ladder
            </h2>
          </div>
          <div className="max-w-md text-left md:text-right">
            <p className="text-xs font-mono text-[#A2ACB9] leading-relaxed">
              STRICT TAXONOMY OF SCIENTIFIC PROOF. CLAIMS NEVER EXCEED VERIFIED EXPERIMENTAL STATE.
            </p>
            <span className="inline-block mt-2 text-[10px] font-mono text-[#7DD3FC] uppercase tracking-wider">
              EVIDENCE VERIFICATION PROTOCOL
            </span>
          </div>
        </div>

        {/* 2-Column: Ladder on Left, Institutional Mandate on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Vertical Linear Maturity Ladder (60% width) */}
          <div className="lg:col-span-7 space-y-4 relative">
            <div className="text-xs font-mono text-[#66717F] uppercase tracking-widest pb-2 border-b border-white/[0.06] flex items-center justify-between">
              <span>PROGRESSION LADDER (01 → 06)</span>
              <span>HIGHEST RIGOUR (TOP)</span>
            </div>

            {ladderReversed.map((item, idx) => (
              <div key={item.level} className="relative">
                {/* Rung Box */}
                <div className="p-5 sm:p-6 bg-[#0D1117] border border-white/[0.08] hover:border-white/20 transition-all flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4 sm:gap-6">
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-[#7DD3FC] shrink-0">
                      0{item.level}
                    </span>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base sm:text-lg font-bold text-[#F4F7FA] font-mono tracking-tight">
                          {item.name.toUpperCase()}
                        </h3>
                        {item.level === 6 && (
                          <span className="px-2 py-0.5 text-[9px] font-mono border border-purple-500/30 text-purple-400 bg-purple-500/5 uppercase">
                            APEX
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-[#A2ACB9] font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:block text-right shrink-0">
                    <span className="text-[10px] font-mono text-[#66717F] block">
                      STAGE {item.level}/6
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      {item.level >= 4 ? "PEER REPRODUCIBLE" : "INTERNAL DESIGN"}
                    </span>
                  </div>
                </div>

                {/* Ascending Vector Arrow between rungs */}
                {idx < ladderReversed.length - 1 && (
                  <div className="flex items-center justify-center py-1 text-white/20">
                    <ArrowUp className="w-3.5 h-3.5 text-[#7DD3FC]/60" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Column: Evidence Mandate & Doctrine Panel (40% width) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Core Mandate Banner */}
            <div className="p-7 bg-[#080B10] border border-white/10 relative">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#7DD3FC] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#7DD3FC]" />
                HCFTL EVIDENCE MANDATE
              </div>

              <div className="text-sm font-mono text-[#F4F7FA] leading-relaxed mb-6 font-semibold">
                &ldquo;Current HCFTL evidence must always be stated explicitly.&rdquo;
              </div>

              <p className="text-xs text-[#A2ACB9] font-light leading-relaxed mb-6">
                HCFTL categorically rejects the conflation of preliminary software prototypes with
                scientifically validated systems. Every public statement, release, and disclosure must
                unambiguously map to its exact level on this ladder.
              </p>

              <div className="p-4 bg-[#05070A] border border-white/[0.06] font-mono text-[11px] space-y-2">
                <div className="text-[#66717F]">CURRENT LAB EVIDENCE LEVEL:</div>
                <div className="text-[#34D399] font-bold">
                  LEVEL 01 {"//"} THEORETICAL & ARCHITECTURAL CHARTER
                </div>
                <div className="text-[#66717F] text-[10px] pt-1">
                  NO CLAIMS OF LEVEL 04+ WILL BE MADE PRIOR TO FORMAL REPRODUCIBILITY AUDITS.
                </div>
              </div>
            </div>

            {/* Doctrine Quotation Box */}
            <div className="p-7 bg-[#0D1117] border border-white/[0.08]">
              <blockquote
                className={`text-lg text-[#F4F7FA] font-medium leading-relaxed mb-4 ${lora.className}`}
              >
                &ldquo;A beautiful demo is evidence of a demo. It is not evidence of reliability, safety,
                or general intelligence.&rdquo;
              </blockquote>
              <div className="text-[11px] font-mono text-[#66717F]">
                HCFTL EVIDENCE PROTOCOL {"//"} FOUNDING TENET
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
