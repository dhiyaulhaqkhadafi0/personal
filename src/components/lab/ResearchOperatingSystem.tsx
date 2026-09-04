import { RESEARCH_STAGES } from "@/lib/hcftl";

export function ResearchOperatingSystem() {
  return (
    <section id="process" className="py-24 border-b border-white/[0.06] bg-[#080B10]/50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
              <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
                06 // METHODOLOGY
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F4F7FA] tracking-tight">
              From Question to Evidence
            </h2>
          </div>
          <p className="text-xs font-mono text-[#A2ACB9] max-w-sm">
            THE HCFTL RESEARCH OPERATING SYSTEM (ROS) GOVERNS RIGOROUS PROGRESSION THROUGH NINE GATES.
          </p>
        </div>

        {/* Pipeline Container */}
        <div className="relative">
          {/* Desktop & Tablet Segmented Pipeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESEARCH_STAGES.map((stage, idx) => (
              <div
                key={stage.code}
                className="p-5 rounded-xl bg-[#0D1117] border border-white/[0.08] hover:border-[#7DD3FC]/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-3">
                    <span className="text-[#7DD3FC] font-bold px-2 py-0.5 rounded bg-[#7DD3FC]/10 border border-[#7DD3FC]/20">
                      GATE // {stage.code}
                    </span>
                    <span className="text-[11px] font-mono text-[#66717F]">
                      STEP {idx + 1} OF 9
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#F4F7FA] mb-2 group-hover:text-[#7DD3FC] transition-colors">
                    {stage.name}
                  </h3>
                  <p className="text-xs text-[#A2ACB9] leading-relaxed font-light">
                    {stage.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-[#66717F]">
                  <span>MANDATORY CRITERIA</span>
                  <span className="text-[#34D399]">VERIFIABLE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
