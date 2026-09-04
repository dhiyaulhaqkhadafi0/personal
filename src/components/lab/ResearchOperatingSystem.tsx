import { RESEARCH_STAGES } from "@/lib/hcftl";
import { ArrowRight, ArrowLeft, ArrowDown } from "lucide-react";

export function ResearchOperatingSystem() {
  // S-Curve layout grouping:
  // Row 1: R01, R02, R03 (L -> R)
  // Row 2: R06, R05, R04 (reversed display: L <- R)
  // Row 3: R07, R08, R09 (L -> R)
  const row1 = [RESEARCH_STAGES[0], RESEARCH_STAGES[1], RESEARCH_STAGES[2]];
  const row2 = [RESEARCH_STAGES[5], RESEARCH_STAGES[4], RESEARCH_STAGES[3]]; // Displayed L to R: R06, R05, R04
  const row3 = [RESEARCH_STAGES[6], RESEARCH_STAGES[7], RESEARCH_STAGES[8]];

  return (
    <section id="process" className="py-28 border-b border-white/[0.08] bg-[#080B10]/60 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 pb-8 border-b border-white/[0.08] gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-none bg-[#7DD3FC]" />
              <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
                RESEARCH OPERATING SYSTEM {"//"} 09 GATES
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#F4F7FA] tracking-tight">
              From Question to Evidence
            </h2>
          </div>
          <div className="max-w-md text-left md:text-right">
            <p className="text-xs font-mono text-[#A2ACB9] leading-relaxed">
              CONTINUOUS UNCOMPROMISING RESEARCH PIPELINE. NO EXPERIMENT SKIPS A GATE.
            </p>
            <span className="inline-block mt-2 text-[10px] font-mono text-[#34D399] uppercase tracking-wider">
              PIPELINE INTEGRITY: ENFORCED
            </span>
          </div>
        </div>

        {/* Desktop Connected S-Curve Pipeline Engine (Hidden on Mobile) */}
        <div className="hidden lg:block relative font-mono">
          {/* ROW 1: R01 -> R02 -> R03 */}
          <div className="grid grid-cols-3 gap-6 relative">
            {row1.map((stage, i) => (
              <div
                key={stage.code}
                className="relative p-6 bg-[#0D1117] border border-white/[0.1] hover:border-[#7DD3FC]/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-white/[0.06]">
                    <span className="text-[#7DD3FC] font-bold tracking-wider">
                      GATE // {stage.code}
                    </span>
                    <span className="text-[10px] text-[#66717F]">STEP 0{i + 1} OF 09</span>
                  </div>
                  <h3 className="text-base font-bold text-[#F4F7FA] mb-2 font-sans tracking-tight">
                    {stage.name}
                  </h3>
                  <p className="text-xs text-[#A2ACB9] font-sans font-light leading-relaxed">
                    {stage.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-[#66717F]">
                  <span>GATE AUDIT</span>
                  <span className="text-[#34D399]">MANDATORY</span>
                </div>

                {/* Connector Arrow for R01 and R02 pointing Right */}
                {i < 2 && (
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-[#05070A] border border-white/20 flex items-center justify-center text-[#7DD3FC]">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* TURN 1: Vertical Conduit Downward from R03 to R04 */}
          <div className="flex justify-end pr-16 py-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#05070A] border border-[#7DD3FC]/30 text-[10px] text-[#7DD3FC]">
              <span>SIGNAL CONDUIT</span>
              <ArrowDown className="w-3 h-3 animate-bounce" />
            </div>
          </div>

          {/* ROW 2: R06 <- R05 <- R04 */}
          <div className="grid grid-cols-3 gap-6 relative">
            {row2.map((stage, i) => (
              <div
                key={stage.code}
                className="relative p-6 bg-[#0D1117] border border-white/[0.1] hover:border-[#7DD3FC]/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-white/[0.06]">
                    <span className="text-[#7DD3FC] font-bold tracking-wider">
                      GATE // {stage.code}
                    </span>
                    <span className="text-[10px] text-[#66717F]">
                      {stage.code === "R04" ? "STEP 04 OF 09" : stage.code === "R05" ? "STEP 05 OF 09" : "STEP 06 OF 09"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#F4F7FA] mb-2 font-sans tracking-tight">
                    {stage.name}
                  </h3>
                  <p className="text-xs text-[#A2ACB9] font-sans font-light leading-relaxed">
                    {stage.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-[#66717F]">
                  <span>GATE AUDIT</span>
                  <span className="text-[#34D399]">MANDATORY</span>
                </div>

                {/* Connector Arrow: from R04 to R05 (right to center) and R05 to R06 (center to left) */}
                {i > 0 && (
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-[#05070A] border border-white/20 flex items-center justify-center text-[#7DD3FC]">
                    <ArrowLeft className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* TURN 2: Vertical Conduit Downward from R06 to R07 */}
          <div className="flex justify-start pl-16 py-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#05070A] border border-[#7DD3FC]/30 text-[10px] text-[#7DD3FC]">
              <ArrowDown className="w-3 h-3 animate-bounce" />
              <span>REPRODUCIBILITY TRANSITION</span>
            </div>
          </div>

          {/* ROW 3: R07 -> R08 -> R09 */}
          <div className="grid grid-cols-3 gap-6 relative">
            {row3.map((stage, i) => (
              <div
                key={stage.code}
                className="relative p-6 bg-[#0D1117] border border-white/[0.1] hover:border-[#7DD3FC]/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-white/[0.06]">
                    <span className="text-[#7DD3FC] font-bold tracking-wider">
                      GATE // {stage.code}
                    </span>
                    <span className="text-[10px] text-[#66717F]">STEP 0{i + 7} OF 09</span>
                  </div>
                  <h3 className="text-base font-bold text-[#F4F7FA] mb-2 font-sans tracking-tight">
                    {stage.name}
                  </h3>
                  <p className="text-xs text-[#A2ACB9] font-sans font-light leading-relaxed">
                    {stage.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-[#66717F]">
                  <span>GATE AUDIT</span>
                  <span className="text-[#34D399]">MANDATORY</span>
                </div>

                {/* Connector Arrow for R07 and R08 pointing Right */}
                {i < 2 && (
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-[#05070A] border border-white/20 flex items-center justify-center text-[#7DD3FC]">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / Tablet Vertical Telemetry Rail */}
        <div className="lg:hidden relative pl-6 border-l-2 border-[#7DD3FC]/30 space-y-6">
          {RESEARCH_STAGES.map((stage, idx) => (
            <div
              key={stage.code}
              className="relative p-5 bg-[#0D1117] border border-white/[0.08] rounded-none"
            >
              {/* Rail Node Indicator */}
              <span className="absolute -left-[31px] top-6 w-3 h-3 bg-[#05070A] border-2 border-[#7DD3FC] rounded-full" />

              <div className="flex items-center justify-between text-xs font-mono mb-2 pb-2 border-b border-white/[0.06]">
                <span className="text-[#7DD3FC] font-bold">GATE // {stage.code}</span>
                <span className="text-[10px] text-[#66717F]">PHASE {idx + 1}/9</span>
              </div>

              <h3 className="text-base font-bold text-[#F4F7FA] mb-1.5">{stage.name}</h3>
              <p className="text-xs text-[#A2ACB9] font-light leading-relaxed">{stage.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
