import { Lock } from "lucide-react";

export function ExperimentRegistry() {
  return (
    <section id="registry" className="py-24 border-b border-white/[0.06] bg-[#05070A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
              <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
                08 // EXPERIMENTAL RECORDS
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F4F7FA] tracking-tight">
              Experiment Registry
            </h2>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-[#0D1117] border border-white/10 text-[#7DD3FC] font-semibold">
              FORMAL EXPERIMENTS // 000
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-[#0D1117] border border-white/10 text-[#66717F]">
              REGISTRY STATUS: FOUNDATION LOCK
            </span>
          </div>
        </div>

        {/* Registry Table Shell */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#080B10] overflow-hidden shadow-2xl">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#0D1117] border-b border-white/[0.08] text-[11px] font-mono tracking-wider text-[#66717F] uppercase">
            <div className="col-span-2">EXP ID</div>
            <div className="col-span-4">EXPERIMENT TITLE</div>
            <div className="col-span-2">FRONTIER</div>
            <div className="col-span-1">SAFETY</div>
            <div className="col-span-1">EVIDENCE</div>
            <div className="col-span-2 text-right">STATUS</div>
          </div>

          {/* Empty State Row */}
          <div className="p-8 sm:p-14 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-[#0D1117] border border-white/10 flex items-center justify-center mb-4 text-[#7DD3FC]">
              <Lock className="w-5 h-5" />
            </div>

            <div className="inline-block px-2.5 py-1 rounded bg-[#7DD3FC]/10 border border-[#7DD3FC]/20 text-xs font-mono text-[#7DD3FC] tracking-widest mb-3">
              EXP-000 // REGISTRY LOCKED
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#F4F7FA] mb-3 font-mono">
              NO FORMAL EXPERIMENT OPEN
            </h3>

            <p className="text-sm text-[#A2ACB9] max-w-lg leading-relaxed font-light mb-6">
              HCFTL is currently establishing its institutional, research, safety, and publication foundations
              before formally opening Experiment 001. All subsequent experiments will be registered here with
              full telemetry and verifiable reproduction packages.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-[#66717F]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse" />
              <span>AWAITING FOUNDATION MILESTONE RATIFICATION</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
