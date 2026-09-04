import { Globe, Code2, LockKeyhole } from "lucide-react";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

export function OpenResearchPhilosophy() {
  const models = [
    {
      code: "MODE 01",
      title: "OPEN RESEARCH",
      icon: Globe,
      desc: "Full transparency on methods, experimental architectures, raw observations, failure modes, and evaluations.",
      detail: "All theoretical papers, negative findings, and mathematical proofs are published freely.",
    },
    {
      code: "MODE 02",
      title: "OPEN SOURCE",
      icon: Code2,
      desc: "Software implementations and tooling released under genuine, recognized open-source licenses.",
      detail: "Source code is distributed cleanly without deceptive restrictions or pseudo-open labels.",
    },
    {
      code: "MODE 03",
      title: "CONTROLLED RELEASE",
      icon: LockKeyhole,
      desc: "High-capability weights, physical actuation triggers, or dual-use datasets gated under bounded access.",
      detail: "Withheld or released in staged boundaries when unrestricted access induces material physical risk.",
    },
  ];

  return (
    <section className="py-28 border-b border-white/[0.08] bg-[#05070A] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 pb-8 border-b border-white/[0.08] gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-none bg-[#7DD3FC]" />
              <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
                DISSEMINATION POLICY {"//"} ETHICAL DIRECTIVE
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#F4F7FA] tracking-tight">
              Open When Responsible. Controlled When Necessary.
            </h2>
          </div>
          <div className="max-w-md text-left md:text-right">
            <p className="text-xs font-mono text-[#A2ACB9] leading-relaxed">
              BALANCING MAXIMUM SCIENTIFIC VELOCITY WITH RIGOROUS BIO/CYBER-PHYSICAL RISK MITIGATION.
            </p>
          </div>
        </div>

        {/* 3 Modes Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {models.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className="p-8 bg-[#0D1117] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06] font-mono text-xs">
                    <span className="text-[#7DD3FC] font-bold">{m.code}</span>
                    <Icon className="w-4 h-4 text-[#A2ACB9]" />
                  </div>

                  <h3 className="text-lg font-bold tracking-wider text-[#F4F7FA] font-mono mb-3">
                    {m.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#A2ACB9] leading-relaxed font-light mb-6">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.04] text-[11px] font-mono text-[#66717F]">
                  {m.detail}
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlight quote */}
        <div className="p-8 sm:p-12 bg-[#080B10] border border-white/10 text-center">
          <blockquote
            className={`text-xl sm:text-2xl text-[#F4F7FA] font-medium leading-relaxed max-w-2xl mx-auto mb-4 ${lora.className}`}
          >
            &ldquo;Transparency does not require irresponsible release.&rdquo;
          </blockquote>
          <p className="text-xs font-mono text-[#7DD3FC]">
            HCFTL ETHICAL GOVERNANCE DIRECTIVE {"//"} PRINCIPLE 10
          </p>
        </div>
      </div>
    </section>
  );
}
