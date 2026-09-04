import { AUTONOMY_LEVELS } from "@/lib/hcftl";

export function AutonomyScale() {
  return (
    <section className="py-20 border-b border-white/[0.06] bg-[#080B10]/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
              <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
                07B {"//"} AUTONOMY CLASSIFICATION
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F7FA] tracking-tight">
              Autonomy Scale (A0 → A5)
            </h2>
          </div>
          <div className="text-xs font-mono text-[#A2ACB9] max-w-md bg-[#0D1117] p-3 rounded-xl border border-white/10">
            <span className="text-[#34D399] font-bold">POLICY NOTICE:</span> HCFTL tracks autonomy
            independently from intelligence. Consequential actions must preserve meaningful human authority.
          </div>
        </div>

        {/* Autonomy Level Tiles */}
        <div className="space-y-3 mb-10">
          {AUTONOMY_LEVELS.map((lvl) => {
            const isCore = lvl.posture === "DEFAULT_FOCUS";
            const isElevated = lvl.posture === "ELEVATED_REVIEW";

            return (
              <div
                key={lvl.code}
                className={`p-5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCore
                    ? "bg-[#0D1117] border-white/[0.08] hover:border-[#7DD3FC]/30"
                    : isElevated
                    ? "bg-[#0D1117]/80 border-amber-500/20"
                    : "bg-[#05070A] border-red-500/20 opacity-75"
                }`}
              >
                <div className="flex items-start md:items-center gap-4">
                  <span
                    className={`text-sm font-mono font-bold px-3 py-1.5 rounded-lg border ${
                      isCore
                        ? "bg-[#7DD3FC]/10 border-[#7DD3FC]/30 text-[#7DD3FC]"
                        : isElevated
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        : "bg-red-500/10 border-red-500/30 text-red-400"
                    }`}
                  >
                    {lvl.code}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-[#F4F7FA] font-mono">
                      {lvl.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A2ACB9] font-light leading-relaxed">
                      {lvl.description}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <span
                    className={`inline-block px-3 py-1 rounded-md text-[11px] font-mono tracking-wider font-semibold border ${
                      isCore
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : isElevated
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    {lvl.postureLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
