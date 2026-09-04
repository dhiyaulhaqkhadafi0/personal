import { SAFETY_CLASSES } from "@/lib/hcftl";
import { ShieldCheck, AlertTriangle, Ban } from "lucide-react";

export function LabSafetyFramework() {
  const getIcon = (tier: string) => {
    switch (tier) {
      case "GREEN":
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case "AMBER":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "RED":
        return <Ban className="w-5 h-5 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <section id="safety" className="py-24 border-b border-white/[0.06] bg-[#05070A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
              <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
                07 // GOVERNANCE & SAFETY
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F4F7FA] tracking-tight">
              Capability Must Remain Governable
            </h2>
          </div>
          <p className="text-xs font-mono text-[#A2ACB9] max-w-sm">
            THREE-TIER RISK CLASSIFICATION MANDATE BEFORE ANY EXPERIMENTAL DESIGN CAN INITIATE.
          </p>
        </div>

        {/* Safety Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAFETY_CLASSES.map((sc) => (
            <div
              key={sc.tier}
              className="p-7 rounded-2xl bg-[#0D1117] border transition-all flex flex-col justify-between"
              style={{
                borderColor: `${sc.colorHex}30`,
                boxShadow: `0 4px 25px ${sc.colorHex}08`,
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    {getIcon(sc.tier)}
                    <span
                      className="text-xs font-mono font-bold tracking-wider"
                      style={{ color: sc.colorHex }}
                    >
                      CLASS // {sc.tier}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#F4F7FA] mb-3">
                  {sc.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A2ACB9] leading-relaxed font-light mb-6">
                  {sc.description}
                </p>

                <div className="mb-6">
                  <div className="text-[10px] font-mono text-[#66717F] uppercase tracking-wider mb-2">
                    SCOPE TYPOLOGY:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sc.examples.map((ex) => (
                      <span
                        key={ex}
                        className="px-2 py-0.5 rounded bg-[#111720] border border-white/[0.06] text-[11px] font-mono text-[#A2ACB9]"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="p-3 rounded-xl text-center text-xs font-mono font-bold tracking-wider"
                style={{
                  backgroundColor: `${sc.colorHex}15`,
                  color: sc.colorHex,
                  border: `1px solid ${sc.colorHex}35`,
                }}
              >
                {sc.posture}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
