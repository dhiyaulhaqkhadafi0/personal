import { RESEARCH_FRONTIERS } from "@/lib/hcftl";

export function ResearchFrontiers() {
  return (
    <section id="frontiers" className="py-28 border-b border-white/[0.08] bg-[#05070A] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 pb-8 border-b border-white/[0.08] gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-none bg-[#7DD3FC]" />
              <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
                INDEX {"//"} 05 DOMAINS
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#F4F7FA] tracking-tight">
              Research Frontiers
            </h2>
          </div>
          <div className="max-w-md text-left md:text-right">
            <p className="text-xs font-mono text-[#A2ACB9] leading-relaxed">
              FORMAL TOPOLOGY OF FIVE INQUIRY DOMAINS GOVERNED BY THE HCFTL HUMAN-CENTERED THESIS.
            </p>
            <span className="inline-block mt-2 text-[10px] font-mono text-[#66717F] uppercase tracking-wider">
              REGISTRATION: ACTIVE METHODOLOGICAL INCUBATION
            </span>
          </div>
        </div>

        {/* Frontier Index: Staggered Editorial Modules */}
        <div className="space-y-12">
          {RESEARCH_FRONTIERS.map((frontier, idx) => {
            const isEven = idx % 2 === 1;

            return (
              <div
                key={frontier.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-10 border-b border-white/[0.06] relative ${
                  isEven ? "lg:pl-16" : "lg:pr-16"
                }`}
              >
                {/* Index Number & Large Typography */}
                <div className="lg:col-span-4 flex flex-col justify-between">
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-4xl sm:text-6xl font-mono font-bold text-white/20 tracking-tighter">
                      {frontier.number}
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-[10px] font-mono px-2 py-0.5 border border-emerald-500/30 text-emerald-400 bg-emerald-500/5 uppercase tracking-widest">
                      {frontier.status}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-[#F4F7FA] tracking-tight uppercase leading-tight">
                    {frontier.title}
                  </h3>

                  <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-[#7DD3FC]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
                    <span>DOMAIN COORD // HCFTL-F0{idx + 1}</span>
                  </div>
                </div>

                {/* Scope & Focus Area */}
                <div className="lg:col-span-5 space-y-6">
                  <p className="text-base sm:text-lg text-[#E2E8F0] font-light leading-relaxed">
                    {frontier.description}
                  </p>

                  <div className="pt-4 border-t border-white/[0.04]">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[#66717F] mb-3">
                      INVESTIGATION NODES
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {frontier.keywords.map((kw) => (
                        <div
                          key={kw}
                          className="flex items-center gap-2 text-xs font-mono text-[#A2ACB9]"
                        >
                          <span className="text-[#7DD3FC]/50 text-[10px]">■</span>
                          <span>{kw}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Institutional Metadata Specification */}
                <div className="lg:col-span-3 bg-[#080B10] p-5 border border-white/[0.06] rounded-none font-mono text-[11px] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[#66717F]">
                    <span>PROGRAM</span>
                    <span className="text-[#F4F7FA]">FRONTIER</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[#66717F]">
                    <span>AUTHORITY</span>
                    <span className="text-[#34D399]">HUMAN-DIRECTED</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[#66717F]">
                    <span>EXPERIMENTS</span>
                    <span className="text-[#7DD3FC]">000 (IN DESIGN)</span>
                  </div>
                  <div className="flex items-center justify-between text-[#66717F]">
                    <span>PROTOCOL</span>
                    <span className="text-[#F4F7FA]">HCFTL-ROS-v1</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
