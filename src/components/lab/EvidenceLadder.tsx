import { EVIDENCE_LADDER } from "@/lib/hcftl";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

export function EvidenceLadder() {
  return (
    <section className="py-20 border-b border-white/[0.06] bg-[#05070A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
          <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
            06B {"//"} EVIDENCE STANDARD
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F7FA] tracking-tight mb-4">
          The Evidence Ladder
        </h2>
        <p className="text-sm text-[#A2ACB9] max-w-2xl mb-12 font-light leading-relaxed">
          HCFTL enforces a strict taxonomy of evidence. Claims must never exceed the verifiable state of
          experimental observation.
        </p>

        {/* Stepped Maturity Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {EVIDENCE_LADDER.map((item) => (
            <div
              key={item.level}
              className="p-5 rounded-xl bg-[#0D1117] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-[#7DD3FC]">
                  LEVEL {item.level} {"//"} 0{item.level}
                </span>
                <span className="w-2 h-2 rounded-full bg-white/10" />
              </div>

              <h3 className="text-base font-bold text-[#F4F7FA] mb-2 font-mono">
                {item.name}
              </h3>
              <p className="text-xs text-[#A2ACB9] leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mandatory Principle Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#080B10] border border-white/10 relative overflow-hidden">
          <div className="max-w-3xl">
            <blockquote className={`text-base sm:text-xl text-[#F4F7FA] font-medium leading-relaxed mb-3 ${lora.className}`}>
              &ldquo;A beautiful demo is evidence of a demo. It is not evidence of reliability, safety, or general intelligence.&rdquo;
            </blockquote>
            <p className="text-xs font-mono text-[#66717F]">
              HCFTL EVIDENCE PROTOCOL {"//"} OPERATIONAL DOCTRINE
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
