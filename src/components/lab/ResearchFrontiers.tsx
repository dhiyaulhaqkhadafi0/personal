import { RESEARCH_FRONTIERS } from "@/lib/hcftl";

export function ResearchFrontiers() {
  return (
    <section id="frontiers" className="py-24 border-b border-white/[0.06] bg-[#05070A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
              <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
                05 // RESEARCH DOMAINS
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F4F7FA] tracking-tight">
              Research Frontiers
            </h2>
          </div>
          <p className="text-xs font-mono text-[#A2ACB9] max-w-sm">
            THE FIVE CORE FIELDS UNDER ACTIVE THEORETICAL & METHODOLOGICAL DEVELOPMENT.
          </p>
        </div>

        {/* Frontier Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESEARCH_FRONTIERS.map((frontier) => (
            <div
              key={frontier.id}
              className="p-6 sm:p-7 rounded-2xl bg-[#0D1117] border border-white/[0.08] hover:border-[#7DD3FC]/40 transition-all flex flex-col justify-between hover:shadow-[0_4px_25px_rgba(125,211,252,0.06)] group"
            >
              <div>
                {/* Header: Frontier Code & Status */}
                <div className="flex items-center justify-between text-xs font-mono mb-4 pb-3 border-b border-white/[0.06]">
                  <span className="text-[#7DD3FC] font-semibold tracking-wider">
                    FRONTIER / {frontier.number}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] tracking-widest">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    {frontier.status}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-[#F4F7FA] mb-3 group-hover:text-[#7DD3FC] transition-colors">
                  {frontier.title}
                </h3>
                <p className="text-sm text-[#A2ACB9] leading-relaxed font-light mb-6">
                  {frontier.description}
                </p>
              </div>

              {/* Research Keywords */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#66717F] mb-2.5">
                  CORE FOCUS NODES:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {frontier.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 rounded-md bg-[#111720] border border-white/[0.06] text-[#A2ACB9] text-[11px] font-mono"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
