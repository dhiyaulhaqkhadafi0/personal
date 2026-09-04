import { RESEARCH_OUTPUTS } from "@/lib/hcftl";
import { BookOpen, FileText, Database, History } from "lucide-react";

export function ResearchOutputs() {
  const getIcon = (label: string) => {
    switch (label) {
      case "Research Notes":
        return <FileText className="w-4 h-4 text-[#7DD3FC]" />;
      case "Formal Publications":
        return <BookOpen className="w-4 h-4 text-[#818CF8]" />;
      case "Open Research Releases":
        return <Database className="w-4 h-4 text-[#34D399]" />;
      case "Failure Log":
        return <History className="w-4 h-4 text-amber-400" />;
      default:
        return null;
    }
  };

  return (
    <section id="research" className="py-24 border-b border-white/[0.06] bg-[#080B10]/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
              <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
                09 // DISCLOSURE & OUTPUTS
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F4F7FA] tracking-tight">
              Research Outputs
            </h2>
          </div>
          <p className="text-xs font-mono text-[#A2ACB9] max-w-sm">
            ALL PUBLIC KNOWLEDGE RELEASES, FORMAL EVALUATIONS, AND ANOMALY LOGS.
          </p>
        </div>

        {/* Output Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {RESEARCH_OUTPUTS.map((out) => (
            <div
              key={out.label}
              className="p-6 rounded-2xl bg-[#0D1117] border border-white/[0.08] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-[#111720] border border-white/10">
                    {getIcon(out.label)}
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[#A2ACB9] border border-white/10">
                    {out.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#F4F7FA] mb-2 font-mono">
                  {out.label}
                </h3>
                <p className="text-xs text-[#A2ACB9] leading-relaxed font-light mb-6">
                  {out.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.04] text-[11px] font-mono text-[#66717F] italic">
                Outputs appear here post-review.
              </div>
            </div>
          ))}
        </div>

        {/* Negative Results Statement */}
        <div className="p-6 rounded-2xl bg-[#05070A] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="text-sm font-mono font-medium text-[#F4F7FA]">
              &ldquo;Negative results are research results.&rdquo;
            </span>
          </div>
          <p className="text-xs font-mono text-[#66717F]">
            HCFTL DOCTRINE // ZERO HIDING OF ANOMALIES OR EXPERIMENT FAILURES
          </p>
        </div>
      </div>
    </section>
  );
}
