import { Lock } from "lucide-react";

export function ExperimentRegistry() {
  return (
    <section id="registry" className="py-28 border-b border-white/[0.08] bg-[#05070A] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-white/[0.08] gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-none bg-[#7DD3FC]" />
              <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
                FORMAL REGISTRY {"//"} SECURE VAULT
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#F4F7FA] tracking-tight">
              Experiment Registry
            </h2>
          </div>
          <div className="max-w-md text-left md:text-right">
            <p className="text-xs font-mono text-[#A2ACB9] leading-relaxed">
              CRYPTOGRAPHIC EXPERIMENT LEDGER. ZERO UNREGISTERED HYPOTHESIS TESTING.
            </p>
            <span className="inline-block mt-2 text-[10px] font-mono text-amber-400 uppercase tracking-wider">
              REGISTRY STATUS: FOUNDATION LOCK
            </span>
          </div>
        </div>

        {/* Sealed Vault Ledger Container */}
        <div className="bg-[#080B10] border border-white/[0.1] font-mono">
          {/* Vault Status Header Bar */}
          <div className="p-6 sm:p-8 border-b border-white/[0.08] bg-[#0D1117]/60">
            <div className="flex items-center justify-between text-xs text-[#7DD3FC] pb-4 mb-6 border-b border-white/[0.06]">
              <span className="font-bold tracking-widest uppercase">
                HCFTL / FORMAL EXPERIMENT REGISTRY
              </span>
              <span className="text-[#66717F] text-[10px]">VAULT REVISION: 2026.01</span>
            </div>

            {/* Registry Metadata Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-xs">
              <div>
                <span className="text-[#66717F] text-[10px] block mb-1 uppercase tracking-wider">
                  REGISTRY STATE
                </span>
                <span className="text-amber-400 font-bold">FOUNDATION LOCK</span>
              </div>
              <div>
                <span className="text-[#66717F] text-[10px] block mb-1 uppercase tracking-wider">
                  FORMAL ENTRIES
                </span>
                <span className="text-[#F4F7FA] font-bold">000</span>
              </div>
              <div>
                <span className="text-[#66717F] text-[10px] block mb-1 uppercase tracking-wider">
                  LAST AUTHORIZED
                </span>
                <span className="text-[#66717F]">—</span>
              </div>
              <div>
                <span className="text-[#66717F] text-[10px] block mb-1 uppercase tracking-wider">
                  SAFETY QUEUE
                </span>
                <span className="text-[#66717F]">—</span>
              </div>
              <div>
                <span className="text-[#66717F] text-[10px] block mb-1 uppercase tracking-wider">
                  PUBLICATION QUEUE
                </span>
                <span className="text-[#66717F]">—</span>
              </div>
            </div>
          </div>

          {/* Ledger Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-3 bg-[#05070A] border-b border-white/[0.06] text-[11px] text-[#66717F] tracking-wider uppercase">
            <div className="col-span-2">ID</div>
            <div className="col-span-4">FRONTIER</div>
            <div className="col-span-2">SAFETY</div>
            <div className="col-span-2">EVIDENCE</div>
            <div className="col-span-2 text-right">STATE</div>
          </div>

          {/* Reserved / Locked Row */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 border-b border-white/[0.04] text-xs text-[#A2ACB9] items-center bg-[#080B10]">
            <div className="col-span-2 font-bold text-[#7DD3FC]">EXP-001</div>
            <div className="col-span-4 text-[#66717F]">───────────────</div>
            <div className="col-span-2 text-[#66717F]">───────</div>
            <div className="col-span-2 text-[#66717F]">───────</div>
            <div className="col-span-2 text-right">
              <span className="px-2 py-0.5 border border-amber-500/30 text-amber-400 bg-amber-500/5 text-[10px]">
                LOCKED
              </span>
            </div>
          </div>

          {/* Vault Seal Centerpiece */}
          <div className="py-20 px-6 sm:px-12 text-center flex flex-col items-center justify-center relative">
            <div className="w-16 h-16 bg-[#0D1117] border border-amber-500/30 flex items-center justify-center mb-6 text-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.08)]">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-xl sm:text-2xl font-bold text-[#F4F7FA] mb-4 tracking-tight uppercase">
              NO EXPERIMENT HAS BEEN FORMALLY AUTHORIZED
            </div>

            <p className="text-xs sm:text-sm text-[#A2ACB9] max-w-lg leading-relaxed font-sans font-light mb-8">
              Institutional foundations, research charters, safety bounds, and verification criteria
              must be formally completed before the registry is opened. All future experimental work
              will be permanently indexed here with reproducible telemetry.
            </p>

            <div className="px-5 py-2.5 bg-[#05070A] border border-white/10 text-[11px] text-[#66717F] flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-400/80 animate-pulse" />
              <span>FOUNDATION LOCK {"//"} HCFTL-2026</span>
              <span className="hidden sm:inline text-white/20">|</span>
              <span className="hidden sm:inline">ZERO PREMATURE DISCLOSURE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
