"use client";

import { motion } from "framer-motion";
import { ArrowDown, Compass, Cpu, Binary, Network, Activity, ShieldCheck } from "lucide-react";

const FRONTIER_NODES = [
  { id: "physical", label: "PHYSICAL AI", icon: Cpu, angle: 270, code: "F01", sub: "EMBODIED" },
  { id: "twins", label: "DIGITAL TWINS", icon: Binary, angle: 342, code: "F04", sub: "WORLD MODEL" },
  { id: "collective", label: "COLLECTIVE INTEL", icon: Network, angle: 54, code: "F02", sub: "MULTI-AGENT" },
  { id: "resilience", label: "RESILIENCE", icon: Activity, angle: 126, code: "F03", sub: "DISRUPTION" },
  { id: "autonomy", label: "SAFE AUTONOMY", icon: ShieldCheck, angle: 198, code: "F05", sub: "HUMAN AUTHORITY" },
];

export function LabHero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 90;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[95vh] flex flex-col justify-center pt-32 pb-20 overflow-hidden border-b border-white/[0.08] bg-[#05070A]">
      {/* Background Architectural Grid & Vignette */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(125,211,252,0.08)_0%,rgba(129,140,248,0.03)_50%,transparent_75%)] blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Command & Facility Identity (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Architectural Header Tape */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-mono tracking-widest text-[#7DD3FC] mb-6 pb-2 border-b border-white/[0.08] w-full"
            >
              <span className="font-semibold uppercase">
                HCFTL {"//"} HUMAN CENTERED FRONTIER TECHNOLOGY LAB
              </span>
              <span className="text-[#66717F] hidden sm:inline">&bull;</span>
              <span className="text-[#A2ACB9] text-[11px]">
                INDEPENDENT APPLIED RESEARCH FACILITY {"//"} EST. 2026
              </span>
            </motion.div>

            {/* Monumental Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F4F7FA] leading-[1.05] mb-6"
            >
              Human-Centered <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4F7FA] via-[#7DD3FC] to-[#818CF8]">
                Frontier Technology
              </span>
            </motion.h1>

            {/* Core Thesis Statement */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl sm:text-2xl text-[#7DD3FC] font-medium leading-snug mb-5 max-w-2xl"
            >
              Building the intelligence layer between AI and the physical world.
            </motion.p>

            {/* Institutional Narrative */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-sm sm:text-base text-[#A2ACB9] leading-relaxed max-w-2xl font-light mb-8"
            >
              An independent applied research initiative exploring human-centered artificial intelligence,
              autonomous systems, digital twins, physical intelligence, and technologies designed to expand human
              capability without surrendering human authority.
            </motion.p>

            {/* Status Pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-2.5 mb-10 font-mono text-xs"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#7DD3FC]/10 border border-[#7DD3FC]/30 text-[#7DD3FC] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#7DD3FC] animate-pulse" />
                FOUNDATION PHASE
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#0D1117] border border-white/10 text-[#A2ACB9]">
                INDEPENDENT
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#0D1117] border border-white/10 text-[#A2ACB9]">
                FOUNDER-LED
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#0D1117] border border-white/10 text-[#66717F] text-[11px]">
                VERSION 1.0
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <button
                type="button"
                onClick={() => scrollTo("overview")}
                className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#7DD3FC] text-[#05070A] font-semibold text-sm shadow-[0_0_25px_rgba(125,211,252,0.3)] hover:bg-[#BAE6FD] hover:shadow-[0_0_35px_rgba(125,211,252,0.5)] transition-all cursor-pointer w-full sm:w-auto"
              >
                <span>Enter the Lab</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollTo("process")}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0D1117] text-[#F4F7FA] border border-white/10 hover:border-[#7DD3FC]/50 hover:bg-[#111720] transition-all text-sm font-medium cursor-pointer w-full sm:w-auto"
              >
                <Compass className="w-4 h-4 text-[#7DD3FC]" />
                <span>Research Framework</span>
              </button>
            </motion.div>
          </div>

          {/* Right Column: Monumental Research Signal Core (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[500px] flex items-center justify-center">
              
              {/* Technical SVG Radar / Coordinate Lines */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 500 500"
                aria-hidden="true"
              >
                {/* Outer Coordinate Ring */}
                <circle
                  cx="250"
                  cy="250"
                  r="210"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
                <circle
                  cx="250"
                  cy="250"
                  r="160"
                  fill="none"
                  stroke="rgba(125,211,252,0.12)"
                  strokeWidth="1"
                />
                <circle
                  cx="250"
                  cy="250"
                  r="90"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />

                {/* Crosshairs */}
                <line x1="250" y1="30" x2="250" y2="470" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                <line x1="30" y1="250" x2="470" y2="250" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

                {/* Direct conduits from center to nodes */}
                {FRONTIER_NODES.map((node, i) => {
                  const rad = (node.angle * Math.PI) / 180;
                  const x = 250 + 160 * Math.cos(rad);
                  const y = 250 + 160 * Math.sin(rad);
                  return (
                    <g key={node.id}>
                      <line
                        x1="250"
                        y1="250"
                        x2={x}
                        y2={y}
                        stroke="rgba(125,211,252,0.25)"
                        strokeWidth="1.2"
                      />
                      {/* Slow Traveling Data Signal */}
                      <circle
                        cx={250 + (160 * ((i % 3 + 1) * 0.28)) * Math.cos(rad)}
                        cy={250 + (160 * ((i % 3 + 1) * 0.28)) * Math.sin(rad)}
                        r="3"
                        fill="#7DD3FC"
                        className="animate-pulse"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Core Institutional Center Node */}
              <div className="relative z-20 w-36 h-36 rounded-2xl bg-[#0D1117] border-2 border-[#7DD3FC]/60 shadow-[0_0_50px_rgba(125,211,252,0.2)] flex flex-col items-center justify-center text-center p-3">
                <div className="text-[10px] font-mono tracking-widest text-[#7DD3FC] uppercase mb-1">
                  CENTRAL HUB
                </div>
                <div className="text-xl font-mono font-extrabold tracking-wider text-[#F4F7FA]">
                  HCFTL
                </div>
                <div className="text-[9px] font-mono text-[#A2ACB9] tracking-wider uppercase mt-0.5">
                  SIGNAL CORE
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                  <span className="text-[9px] font-mono text-[#34D399]">ONLINE</span>
                </div>
              </div>

              {/* Orbiting Satellite Nodes */}
              {FRONTIER_NODES.map((node) => {
                const rad = (node.angle * Math.PI) / 180;
                const leftPercent = 50 + 34 * Math.cos(rad);
                const topPercent = 50 + 34 * Math.sin(rad);
                const Icon = node.icon;

                return (
                  <div
                    key={node.id}
                    style={{
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    className="absolute z-20"
                  >
                    <div className="flex flex-col p-2.5 rounded-xl bg-[#080B10] border border-white/10 hover:border-[#7DD3FC]/60 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(125,211,252,0.2)] min-w-[110px]">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <Icon className="w-3.5 h-3.5 text-[#7DD3FC]" />
                        <span className="text-[9px] font-mono text-[#66717F] font-bold">
                          {node.code}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold tracking-wider text-[#F4F7FA] whitespace-nowrap">
                        {node.label}
                      </span>
                      <span className="text-[8px] font-mono text-[#A2ACB9] truncate">
                        {node.sub}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
