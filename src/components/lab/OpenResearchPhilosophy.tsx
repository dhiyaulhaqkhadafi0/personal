import { Globe, Code2, LockKeyhole } from "lucide-react";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

export function OpenResearchPhilosophy() {
  const models = [
    {
      title: "OPEN RESEARCH",
      icon: Globe,
      desc: "Full transparency on methods, experimental architectures, raw observations, failure modes, and evaluations.",
      detail: "All theoretical papers, negative findings, and mathematical proofs are published freely.",
    },
    {
      title: "OPEN SOURCE",
      icon: Code2,
      desc: "Software implementations and tooling released under genuine, recognized open-source licenses.",
      detail: "Source code is distributed cleanly without deceptive restrictions or pseudo-open labels.",
    },
    {
      title: "CONTROLLED RELEASE",
      icon: LockKeyhole,
      desc: "High-capability weights, physical actuation triggers, or dual-use datasets gated under bounded access.",
      detail: "Withheld or released in staged boundaries when unrestricted access induces material physical risk.",
    },
  ];

  return (
    <section className="py-24 border-b border-white/[0.06] bg-[#05070A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
              <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
                10 // DISSEMINATION POLICY
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F4F7FA] tracking-tight">
              Open When Responsible. Controlled When Necessary.
            </h2>
          </div>
        </div>

        {/* 3 Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {models.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className="p-7 rounded-2xl bg-[#0D1117] border border-white/[0.08] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/[0.06]">
                    <div className="p-2 rounded-xl bg-[#111720] text-[#7DD3FC] border border-white/10">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold tracking-wider text-[#F4F7FA] font-mono">
                      {m.title}
                    </h3>
                  </div>

                  <p className="text-sm text-[#A2ACB9] leading-relaxed font-light mb-4">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.04] text-xs font-mono text-[#66717F]">
                  {m.detail}
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlight quote */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#080B10] border border-[#818CF8]/20 text-center">
          <blockquote className={`text-xl sm:text-2xl text-[#F4F7FA] font-medium leading-relaxed max-w-2xl mx-auto mb-3 ${lora.className}`}>
            &ldquo;Transparency does not require irresponsible release.&rdquo;
          </blockquote>
          <p className="text-xs font-mono text-[#818CF8]">
            HCFTL DOCTRINE // ETHICAL GOVERNANCE DIRECTIVE
          </p>
        </div>
      </div>
    </section>
  );
}
