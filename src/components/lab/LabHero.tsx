"use client";

import { motion } from "framer-motion";
import { ArrowDown, ShieldCheck, Cpu, Network, Activity, Binary, Compass } from "lucide-react";

const SIGNAL_NODES = [
  { id: "physical", label: "PHYSICAL AI", icon: Cpu, angle: 270, desc: "Embodied & robotic reasoning" },
  { id: "twins", label: "DIGITAL TWINS", icon: Binary, angle: 342, desc: "Predictive world simulations" },
  { id: "collective", label: "COLLECTIVE INTEL", icon: Network, angle: 54, desc: "Multi-agent coordination" },
  { id: "resilience", label: "RESILIENCE", icon: Activity, angle: 126, desc: "Crisis & disruption response" },
  { id: "autonomy", label: "SAFE AUTONOMY", icon: ShieldCheck, angle: 198, desc: "Bounded human-in-the-loop" },
];

export function LabHero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-16 overflow-hidden border-b border-white/[0.06]">
      {/* Background ambient glow - subdued ice cyan & indigo */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(125,211,252,0.07)_0%,rgba(129,140,248,0.03)_50%,transparent_80%)] blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Column: Institutional Text */}
        <div className="lg:col-span-7 flex flex-col items-start">
          {/* Eyebrow & Badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-2 mb-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7DD3FC]/10 border border-[#7DD3FC]/30 text-[#7DD3FC] text-xs font-mono tracking-wider font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] animate-ping" />
              FOUNDATION PHASE
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#0D1117] border border-white/10 text-[#A2ACB9] text-[11px] font-mono">
              EST. 2026
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#0D1117] border border-white/10 text-[#A2ACB9] text-[11px] font-mono">
              FOUNDER-LED
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#0D1117] border border-white/10 text-[#A2ACB9] text-[11px] font-mono">
              INDEPENDENT
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs sm:text-sm font-mono tracking-[0.25em] text-[#7DD3FC] uppercase mb-3"
          >
            HCFTL / INDEPENDENT RESEARCH LAB
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl sm:text-5xl lg:text-[3.75rem] font-bold tracking-tight text-[#F4F7FA] leading-[1.1] mb-6"
          >
            Human Centered <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4F7FA] via-[#7DD3FC] to-[#818CF8]">
              Frontier Technology Lab
            </span>
          </motion.h1>

          <motion.blockquote
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl font-medium text-[#E2E8F0] border-l-2 border-[#7DD3FC] pl-4 py-1 mb-5"
          >
            &ldquo;Building the intelligence layer between AI and the physical world.&rdquo;
          </motion.blockquote>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-sm sm:text-base text-[#A2ACB9] leading-relaxed max-w-2xl mb-8 font-light"
          >
            An independent applied research initiative exploring human-centered artificial intelligence,
            autonomous systems, digital twins, physical intelligence, and technologies designed to expand human
            capability without surrendering human authority.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
          >
            <button
              type="button"
              onClick={() => scrollTo("overview")}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#7DD3FC] text-[#05070A] font-semibold text-sm shadow-[0_0_25px_rgba(125,211,252,0.3)] hover:bg-[#BAE6FD] hover:shadow-[0_0_35px_rgba(125,211,252,0.5)] transition-all cursor-pointer w-full sm:w-auto"
            >
              <span>Enter the Lab</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollTo("process")}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0D1117] text-[#F4F7FA] border border-white/10 hover:border-[#7DD3FC]/50 hover:bg-[#111720] transition-all text-sm font-medium cursor-pointer w-full sm:w-auto"
            >
              <Compass className="w-4 h-4 text-[#7DD3FC]" />
              <span>Research Framework</span>
            </button>
          </motion.div>
        </div>

        {/* Right Column: Research Signal Core SVG Visualization */}
        <div className="lg:col-span-5 flex items-center justify-center relative w-full aspect-square max-w-[440px] mx-auto">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* SVG Lines & Orbit Signals */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 400 400"
              aria-hidden="true"
            >
              {/* Central dashed orbital ring */}
              <circle
                cx="200"
                cy="200"
                r="130"
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
              <circle
                cx="200"
                cy="200"
                r="70"
                fill="none"
                stroke="rgba(125,211,252,0.12)"
                strokeWidth="1"
              />

              {/* Connecting signal lines to nodes */}
              {SIGNAL_NODES.map((node, i) => {
                const rad = (node.angle * Math.PI) / 180;
                const x = 200 + 130 * Math.cos(rad);
                const y = 200 + 130 * Math.sin(rad);
                return (
                  <g key={node.id}>
                    <line
                      x1="200"
                      y1="200"
                      x2={x}
                      y2={y}
                      stroke="rgba(125,211,252,0.2)"
                      strokeWidth="1.2"
                    />
                    {/* Animated data pulse on line */}
                    <circle
                      cx={200 + (130 * ((i % 3 + 1) * 0.25)) * Math.cos(rad)}
                      cy={200 + (130 * ((i % 3 + 1) * 0.25)) * Math.sin(rad)}
                      r="2.5"
                      fill="#7DD3FC"
                      className="animate-ping"
                      style={{ animationDuration: `${3 + i}s` }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Central Node: HCFTL */}
            <div className="relative z-20 w-24 h-24 rounded-2xl bg-[#0D1117] border-2 border-[#7DD3FC]/50 shadow-[0_0_40px_rgba(125,211,252,0.25)] flex flex-col items-center justify-center text-center p-2">
              <span className="text-base font-mono font-bold tracking-widest text-[#F4F7FA]">
                HCFTL
              </span>
              <span className="text-[9px] font-mono text-[#7DD3FC] tracking-wider uppercase">
                CORE
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] mt-1 animate-pulse" />
            </div>

            {/* Orbiting Frontier Nodes */}
            {SIGNAL_NODES.map((node) => {
              const rad = (node.angle * Math.PI) / 180;
              // Translate positions in percentages relative to center (50%)
              const leftPercent = 50 + 36 * Math.cos(rad);
              const topPercent = 50 + 36 * Math.sin(rad);
              const Icon = node.icon;

              return (
                <div
                  key={node.id}
                  style={{
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="absolute z-20 group"
                >
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#080B10] border border-white/10 group-hover:border-[#7DD3FC]/60 transition-all shadow-md group-hover:shadow-[0_0_20px_rgba(125,211,252,0.2)]">
                    <Icon className="w-3.5 h-3.5 text-[#7DD3FC]" />
                    <span className="text-[10px] font-mono font-semibold tracking-wider text-[#F4F7FA] whitespace-nowrap">
                      {node.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
