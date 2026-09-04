import { Navbar } from "../../components/shared/navbar";

export const metadata = {
  title: "HCFTL — Human Centered Frontier Technology Lab",
  description:
    "Independent applied research lab exploring human-centered frontier technologies with AI, safety, evidence, and responsible experimentation.",
};

export default function LabPage() {
  return (
    <main className="min-h-screen bg-[#05050A] text-white">
      <Navbar />

      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-24 pt-36 md:px-10 md:pt-44">
        <div className="max-w-4xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.28em] text-brand-accent">
            Independent Applied Research Lab · Foundation Phase
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl md:text-7xl">
            Human Centered Frontier Technology Lab
          </h1>

          <p className="mt-7 max-w-3xl text-base leading-8 text-white/60 md:text-lg">
            HCFTL explores how AI can help humans build safer, smarter, and more capable systems for the physical world. The lab is currently establishing its institutional foundation, research standards, safety governance, and publication system before opening its first formal experiment.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 text-sm text-white/55">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">Human-centered</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">Evidence-led</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">Safety-aware</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">Simulation-first</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">Responsible release</span>
          </div>

          <div className="mt-14 border-t border-white/10 pt-7">
            <p className="text-sm leading-7 text-white/45">
              Status: HCFTL Foundation in progress. No formal Experiment 001 has been opened yet.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
