import { AUTONOMY_LEVELS } from "@/lib/hcftl";
import { Shield, AlertTriangle, ShieldAlert } from "lucide-react";

export function AutonomyScale() {
  const defaultEnvelope = AUTONOMY_LEVELS.filter(
    (lvl) => lvl.code === "A0" || lvl.code === "A1" || lvl.code === "A2" || lvl.code === "A3"
  );
  const elevatedReview = AUTONOMY_LEVELS.filter((lvl) => lvl.code === "A4");
  const outsideTarget = AUTONOMY_LEVELS.filter((lvl) => lvl.code === "A5");

  return (
    <section className="py-28 border-b border-white/[0.08] bg-[#080B10]/50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-white/[0.08] gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-none bg-[#7DD3FC]" />
              <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
                POLICY SPECIFICATION {"//"} A0 → A5
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#F4F7FA] tracking-tight">
              Autonomy Scale
            </h2>
          </div>
          <div className="max-w-md text-left md:text-right">
            <p className="text-xs font-mono text-[#A2ACB9] leading-relaxed">
              AUTONOMY IS TRACKED INDEPENDENTLY FROM INTELLIGENCE. AGENCY CANNOT ESCAPE HUMAN GOVERNANCE.
            </p>
            <span className="inline-block mt-2 text-[10px] font-mono text-[#34D399] uppercase tracking-wider">
              POLICY: CONSTRAINED ACTUATION DOCTRINE
            </span>
          </div>
        </div>

        {/* Structured Envelopes */}
        <div className="space-y-8">
          {/* LANE 1: DEFAULT RESEARCH ENVELOPE (A0 - A3) */}
          <div className="p-6 sm:p-8 bg-[#0D1117] border border-white/[0.1]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/[0.06] gap-2">
              <div className="flex items-center gap-3">
                <span className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Shield className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs font-mono font-bold text-[#34D399] tracking-wider uppercase block">
                    DEFAULT RESEARCH ENVELOPE // A0 → A3
                  </span>
                  <span className="text-[11px] font-mono text-[#66717F]">
                    PERMITTED FOR STANDARD EXPERIMENTAL DESIGNS UNDER DIRECT RESEARCHER OVERSIGHT
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest self-start sm:self-auto">
                AUTHORIZED ENVELOPE
              </span>
            </div>

            <div className="space-y-3">
              {defaultEnvelope.map((lvl) => (
                <div
                  key={lvl.code}
                  className="p-4 bg-[#080B10] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start md:items-center gap-4">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 bg-[#7DD3FC]/10 border border-[#7DD3FC]/30 text-[#7DD3FC]">
                      {lvl.code}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#F4F7FA] font-mono">{lvl.name}</h4>
                      <p className="text-xs text-[#A2ACB9] font-light leading-relaxed">
                        {lvl.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 border border-emerald-500/20 text-emerald-400 bg-emerald-500/5 self-start md:self-auto">
                    {lvl.postureLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CRITICAL DIVIDER: HUMAN AUTHORITY BOUNDARY */}
          <div className="relative py-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t-2 border-dashed border-amber-500/40" />
            </div>
            <div className="relative px-6 py-2 bg-[#05070A] border-2 border-amber-500/60 flex items-center gap-3 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest shadow-xl">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>HUMAN AUTHORITY BOUNDARY</span>
              <span className="hidden sm:inline text-[#66717F]">{"//"} ZERO UNGOVERNED AGENCY</span>
            </div>
          </div>

          {/* LANE 2: ELEVATED REVIEW (A4) */}
          <div className="p-6 sm:p-8 bg-[#0D1117] border border-amber-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/[0.06] gap-2">
              <div className="flex items-center gap-3">
                <span className="p-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400 tracking-wider uppercase block">
                    ELEVATED REVIEW ENVELOPE // A4
                  </span>
                  <span className="text-[11px] font-mono text-[#66717F]">
                    HIGH AUTONOMY. MANDATES DUAL-KEY AUTHORIZATION AND AIR-GAPPED OVERRIDE
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-widest self-start sm:self-auto">
                RESTRICTED ACCESS
              </span>
            </div>

            {elevatedReview.map((lvl) => (
              <div
                key={lvl.code}
                className="p-4 bg-[#080B10] border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start md:items-center gap-4">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    {lvl.code}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#F4F7FA] font-mono">{lvl.name}</h4>
                    <p className="text-xs text-[#A2ACB9] font-light leading-relaxed">
                      {lvl.description}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 border border-amber-500/30 text-amber-400 bg-amber-500/5 self-start md:self-auto">
                  {lvl.postureLabel}
                </span>
              </div>
            ))}
          </div>

          {/* LANE 3: OUTSIDE DEFAULT TARGET (A5) */}
          <div className="p-6 sm:p-8 bg-[#0D1117] border border-red-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/[0.06] gap-2">
              <div className="flex items-center gap-3">
                <span className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/20">
                  <ShieldAlert className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs font-mono font-bold text-red-400 tracking-wider uppercase block">
                    OUTSIDE DEFAULT TARGET // A5
                  </span>
                  <span className="text-[11px] font-mono text-[#66717F]">
                    FULL AUTONOMOUS AGENCY WITHOUT HUMAN REVERSION IS EXCLUDED FROM STANDARD RESEARCH CHARTERS
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/30 uppercase tracking-widest self-start sm:self-auto">
                DISALLOWED BY DEFAULT
              </span>
            </div>

            {outsideTarget.map((lvl) => (
              <div
                key={lvl.code}
                className="p-4 bg-[#080B10] border border-red-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start md:items-center gap-4">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 bg-red-500/10 border border-red-500/30 text-red-400">
                    {lvl.code}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#F4F7FA] font-mono">{lvl.name}</h4>
                    <p className="text-xs text-[#A2ACB9] font-light leading-relaxed">
                      {lvl.description}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 border border-red-500/30 text-red-400 bg-red-500/5 self-start md:self-auto">
                  {lvl.postureLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
