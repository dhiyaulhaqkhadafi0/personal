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
    <section id="safety" className="py-28 border-b border-white/[0.08] bg-[#05070A] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 pb-8 border-b border-white/[0.08] gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-none bg-[#7DD3FC]" />
              <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
                SAFETY SPECIFICATION {"//"} 03 TIERS
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#F4F7FA] tracking-tight">
              Capability Must Remain Governable
            </h2>
          </div>
          <div className="max-w-md text-left md:text-right">
            <p className="text-xs font-mono text-[#A2ACB9] leading-relaxed">
              MANDATORY THREE-TIER RISK CLASSIFICATION BEFORE EXPERIMENTAL DESIGNS COMMENCE.
            </p>
            <span className="inline-block mt-2 text-[10px] font-mono text-[#34D399] uppercase tracking-wider">
              GOVERNANCE PROTOCOL: RATIFIED
            </span>
          </div>
        </div>

        {/* Safety Classes Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAFETY_CLASSES.map((sc) => (
            <div
              key={sc.tier}
              className="p-8 bg-[#0D1117] border flex flex-col justify-between"
              style={{
                borderColor: `${sc.colorHex}35`,
                boxShadow: `0 4px 30px ${sc.colorHex}08`,
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    {getIcon(sc.tier)}
                    <span
                      className="text-xs font-mono font-bold tracking-wider"
                      style={{ color: sc.colorHex }}
                    >
                      CLASS // {sc.tier}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#66717F]">
                    RISK TIER 0{sc.tier === "GREEN" ? "1" : sc.tier === "AMBER" ? "2" : "3"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#F4F7FA] mb-3 tracking-tight">
                  {sc.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A2ACB9] leading-relaxed font-light mb-8">
                  {sc.description}
                </p>

                <div className="mb-8">
                  <div className="text-[10px] font-mono text-[#66717F] uppercase tracking-wider mb-2.5">
                    SCOPE TYPOLOGY:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sc.examples.map((ex) => (
                      <span
                        key={ex}
                        className="px-2.5 py-1 bg-[#111720] border border-white/[0.08] text-[11px] font-mono text-[#A2ACB9]"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="p-3 text-center text-xs font-mono font-bold tracking-wider uppercase border"
                style={{
                  backgroundColor: `${sc.colorHex}15`,
                  color: sc.colorHex,
                  borderColor: `${sc.colorHex}40`,
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
