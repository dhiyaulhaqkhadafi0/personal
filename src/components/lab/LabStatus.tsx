import { LAB_METRICS } from "@/lib/hcftl";

export function LabStatus() {
  const items = [
    { label: "INSTITUTIONAL STATE", value: LAB_METRICS.state, isTag: true, highlight: "#7DD3FC" },
    { label: "VERSION", value: LAB_METRICS.version, isTag: false, highlight: null },
    { label: "FORMAL EXPERIMENTS", value: LAB_METRICS.experiments.toString(), isTag: false, highlight: null },
    { label: "PUBLISHED RESEARCH", value: LAB_METRICS.publications.toString(), isTag: false, highlight: null },
    { label: "OPEN RELEASES", value: LAB_METRICS.releases.toString(), isTag: false, highlight: null },
    { label: "CURRENT PRIORITY", value: LAB_METRICS.priority, isTag: true, highlight: "#818CF8" },
  ];

  return (
    <section id="overview" className="py-12 border-b border-white/[0.06] bg-[#080B10]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-[#7DD3FC]" />
            <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase font-semibold">
              LAB STATUS // INSTRUMENTATION STRIP
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#66717F]">
            TELEMETRY: VERIFIED 00:00 UTC
          </span>
        </div>

        {/* Grid of status tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-xl bg-[#0D1117] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <span className="text-[10px] font-mono text-[#66717F] tracking-wider mb-2 line-clamp-1">
                {item.label}
              </span>
              <div>
                {item.isTag ? (
                  <span
                    className="inline-block px-2.5 py-1 rounded text-xs font-mono font-bold tracking-wider"
                    style={{
                      backgroundColor: `${item.highlight}18`,
                      color: item.highlight ?? "#F4F7FA",
                      border: `1px solid ${item.highlight}40`,
                    }}
                  >
                    {item.value}
                  </span>
                ) : (
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-[#F4F7FA] tracking-tight">
                    {item.value}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
