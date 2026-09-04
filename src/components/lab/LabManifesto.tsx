import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

export function LabManifesto() {
  return (
    <section className="py-24 border-b border-white/[0.06] bg-[#05070A] relative overflow-hidden">
      {/* Subtle coordinate lines in background */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
            03 // INSTITUTIONAL THESIS
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#F4F7FA] tracking-tight leading-[1.25] mb-10">
          Powerful technology should expand human capability — not diminish human agency.
        </h2>

        <div className="space-y-6 text-base sm:text-lg text-[#A2ACB9] leading-relaxed font-light mb-12">
          <p>
            HCFTL begins with a simple question: if artificial intelligence can dramatically expand
            humanity&apos;s ability to create increasingly capable systems, can the same capability be directed toward
            technologies that make people safer, more resilient, and more capable of understanding and shaping the
            world around them?
          </p>
          <p>
            HCFTL explores that question through structured research charters, physics-grounded simulation,
            falsifiable experimentation, reproducible evidence, continuous safety classification, and responsible
            public release.
          </p>
        </div>

        {/* Highlight Manifesto Callout */}
        <div className="relative p-8 sm:p-10 rounded-2xl bg-[#0D1117] border border-[#7DD3FC]/20 shadow-[0_0_30px_rgba(125,211,252,0.05)]">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#7DD3FC] to-[#818CF8] rounded-l-2xl" />
          <p className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase mb-3">
            PRINCIPLE 0.1 // THE PRIME BOUNDARY
          </p>
          <blockquote className={`text-xl sm:text-2xl md:text-3xl text-[#F4F7FA] font-medium leading-snug ${lora.className}`}>
            &ldquo;Capability without responsibility is not progress.&rdquo;
          </blockquote>
          <p className="mt-4 text-xs font-mono text-[#66717F]">
            FOUNDER DIRECTIVE — HCFTL LAB CHARTER V1.0
          </p>
        </div>
      </div>
    </section>
  );
}
