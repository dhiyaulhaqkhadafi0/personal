import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

export function ResearchOutputs() {
  const archiveItems = [
    {
      index: "01",
      title: "RESEARCH NOTES",
      count: "000",
      status: "No public research notes.",
      detail:
        "Preliminary working notes, theoretical explorations, and mathematical drafts will be archived here as research charters mature.",
    },
    {
      index: "02",
      title: "PUBLICATIONS",
      count: "000",
      status: "No reviewed publications.",
      detail:
        "Formal manuscripts require minimum Level 04 Reproducible Result verification before external peer review submission.",
    },
    {
      index: "03",
      title: "OPEN RESEARCH RELEASES",
      count: "000",
      status: "No public releases.",
      detail:
        "Executable reproduction packages, telemetry datasets, and open-source models will be released under permissive, audited licenses.",
    },
    {
      index: "04",
      title: "FAILURE RECORDS",
      count: "000",
      status: "No recorded experiment failures.",
      detail:
        "HCFTL mandates publication of disproven hypotheses, null findings, and anomalies to prevent redundant dead-ends across the field.",
    },
  ];

  return (
    <section id="research" className="py-28 border-b border-white/[0.08] bg-[#080B10]/50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-white/[0.08] gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-none bg-[#7DD3FC]" />
              <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
                INSTITUTIONAL LEDGER {"//"} 04 CHANNELS
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#F4F7FA] tracking-tight">
              Research Archive
            </h2>
          </div>
          <div className="max-w-md text-left md:text-right">
            <p className="text-xs font-mono text-[#A2ACB9] leading-relaxed">
              PUBLIC RECORD OF ALL SCIENTIFIC WORK, BENCHMARKS, DATASETS, AND ANOMALIES.
            </p>
            <span className="inline-block mt-2 text-[10px] font-mono text-[#7DD3FC] uppercase tracking-wider">
              ARCHIVE PROTOCOL: ACTIVE
            </span>
          </div>
        </div>

        {/* Institutional Ledger Rows (Replacing generic card grid) */}
        <div className="border-t border-white/[0.08] divide-y divide-white/[0.06] font-mono mb-16">
          {archiveItems.map((item) => (
            <div
              key={item.index}
              className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start hover:bg-white/[0.01] transition-colors px-2"
            >
              {/* Category Number & Title */}
              <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-4">
                <span className="text-xs text-[#7DD3FC] font-bold">
                  {item.index} {"//"}
                </span>
                <span className="text-base sm:text-lg font-bold text-[#F4F7FA] tracking-wider">
                  {item.title}
                </span>
                <span className="md:hidden text-xs text-[#66717F] font-bold">{item.count}</span>
              </div>

              {/* Status and Detail */}
              <div className="md:col-span-6 space-y-2">
                <div className="text-sm text-[#F4F7FA] font-medium font-sans">
                  {item.status}
                </div>
                <div className="text-xs text-[#A2ACB9] font-light leading-relaxed font-sans">
                  {item.detail}
                </div>
              </div>

              {/* Item Count */}
              <div className="hidden md:flex md:col-span-2 justify-end">
                <span className="text-sm font-bold text-white/30 px-3 py-1 bg-[#05070A] border border-white/[0.08]">
                  {item.count}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Negative Results Doctrine Ledger Note */}
        <div className="p-8 sm:p-10 bg-[#05070A] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <blockquote className={`text-xl sm:text-2xl text-[#F4F7FA] font-medium ${lora.className}`}>
              &ldquo;Negative results are research results.&rdquo;
            </blockquote>
            <p className="text-xs font-mono text-[#A2ACB9] font-light">
              Experimental falsification carries equal epistemic weight to positive confirmations.
              HCFTL pledges zero concealment of unverified hypotheses.
            </p>
          </div>
          <div className="shrink-0 text-xs font-mono text-[#66717F] border border-white/[0.08] px-4 py-2 bg-[#080B10]">
            HCFTL DOCTRINE // UNBIASED RECORD
          </div>
        </div>
      </div>
    </section>
  );
}
