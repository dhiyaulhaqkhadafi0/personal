"use client";

import { useState } from "react";
import { Cpu, Binary, Network, Activity, ShieldCheck, ArrowRight } from "lucide-react";

interface NodeDetail {
  id: string;
  code: string;
  title: string;
  question: string;
  keywords: string[];
  coordinates: { x: number; y: number };
  icon: typeof Cpu;
}

const MAP_NODES: NodeDetail[] = [
  {
    id: "physical",
    code: "FRONTIER / 01",
    title: "PHYSICAL INTELLIGENCE",
    question: "How can intelligent systems perceive, reason about, and safely interact with physical environments?",
    keywords: ["Robotics", "Embodied Intelligence", "Physical Sensing", "Human-Machine Interaction"],
    coordinates: { x: 50, y: 15 },
    icon: Cpu,
  },
  {
    id: "digital-twins",
    code: "FRONTIER / 04",
    title: "DIGITAL TWIN INTELLIGENCE",
    question: "How can world models construct high-fidelity representations of physical environments to test futures safely?",
    keywords: ["Simulation", "World Models", "Predictive Systems", "Scenario Intelligence"],
    coordinates: { x: 18, y: 45 },
    icon: Binary,
  },
  {
    id: "collective",
    code: "FRONTIER / 02",
    title: "COLLECTIVE INTELLIGENCE",
    question: "How can heterogeneous multiple agents coordinate toward shared objectives without centralization failure?",
    keywords: ["Multi-Agent Systems", "Distributed Intelligence", "Agent Coordination", "Collective Decisions"],
    coordinates: { x: 82, y: 45 },
    icon: Network,
  },
  {
    id: "resilience",
    code: "FRONTIER / 03",
    title: "RESILIENCE TECHNOLOGY",
    question: "How can intelligent systems assist humans in absorbing disruptions, climate events, and systemic shocks?",
    keywords: ["Disaster Response", "Infrastructure Resilience", "Environmental Intel", "Emergency Protocols"],
    coordinates: { x: 30, y: 82 },
    icon: Activity,
  },
  {
    id: "autonomy",
    code: "FRONTIER / 05",
    title: "SAFE AUTONOMOUS SYSTEMS",
    question: "How can capable autonomous systems remain observable, strictly bounded, and under meaningful human authority?",
    keywords: ["Human-in-the-Loop", "Permission Boundaries", "Agent Safety", "Controlled Autonomy"],
    coordinates: { x: 70, y: 82 },
    icon: ShieldCheck,
  },
];

export function ResearchIntelligenceMap() {
  const [activeId, setActiveId] = useState<string>("physical");
  const selected = MAP_NODES.find((n) => n.id === activeId) || MAP_NODES[0];

  return (
    <section className="py-24 border-b border-white/[0.08] bg-[#05070A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-white/[0.08] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs tracking-widest text-[#7DD3FC]">
              <span>HCFTL {"//"} SECTION 04</span>
              <span className="text-[#66717F]">&bull;</span>
              <span>SIGNATURE INSTRUMENT</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#F4F7FA] tracking-tight">
              Research Intelligence Map
            </h2>
          </div>
          <div className="text-xs font-mono text-[#A2ACB9] max-w-md">
            INTERACTIVE RESEARCH INSTRUMENT. SELECT A FRONTIER NODE TO INSPECT ITS TELEMETRY AND CHARTER BOUNDARY.
          </div>
        </div>

        {/* Master Instrument Console: 65% Canvas + 35% Active Telemetry Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 65% Interactive Topology Canvas (8 cols on lg) */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-[#080B10] border border-white/10 relative overflow-hidden flex flex-col justify-between min-h-[500px]">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between text-xs font-mono text-[#66717F] mb-4 z-20">
              <span className="text-[#7DD3FC]">TOPOLOGY: 5-AXIS DOMAIN MATRIX</span>
              <span>GRID: ACTIVE // 100x100 RESOLUTION</span>
            </div>

            {/* Visual Topology Diagram */}
            <div className="relative flex-1 flex items-center justify-center min-h-[380px]">
              {/* SVG Connecting Trace Net */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {/* Cross Grid Lines */}
                <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="1 2" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="1 2" />

                {/* Circuit Traces to Nodes */}
                {MAP_NODES.map((node) => {
                  const isCur = activeId === node.id;
                  return (
                    <g key={node.id}>
                      <line
                        x1="50"
                        y1="50"
                        x2={node.coordinates.x}
                        y2={node.coordinates.y}
                        stroke={isCur ? "#7DD3FC" : "rgba(255,255,255,0.12)"}
                        strokeWidth={isCur ? "0.8" : "0.3"}
                        strokeDasharray={isCur ? "none" : "1 1.5"}
                        className="transition-all duration-300"
                      />
                      {isCur && (
                        <circle
                          cx={(50 + node.coordinates.x) / 2}
                          cy={(50 + node.coordinates.y) / 2}
                          r="1"
                          fill="#7DD3FC"
                          className="animate-ping"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Central Human Node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="w-24 h-24 rounded-2xl bg-[#0D1117] border-2 border-[#7DD3FC]/70 shadow-[0_0_35px_rgba(125,211,252,0.25)] flex flex-col items-center justify-center text-center p-2">
                  <span className="text-xs font-mono font-extrabold tracking-wider text-[#F4F7FA]">HCFTL</span>
                  <span className="text-[8px] font-mono text-[#7DD3FC] tracking-wider uppercase mt-0.5">HUMAN CORE</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#34D399] mt-1.5 animate-pulse" />
                </div>
              </div>

              {/* Frontier Nodes */}
              {MAP_NODES.map((node) => {
                const isCur = activeId === node.id;
                const Icon = node.icon;

                return (
                  <button
                    key={node.id}
                    type="button"
                    onMouseEnter={() => setActiveId(node.id)}
                    onClick={() => setActiveId(node.id)}
                    style={{
                      left: `${node.coordinates.x}%`,
                      top: `${node.coordinates.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    className={`absolute z-30 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isCur
                        ? "bg-[#0D1117] border-[#7DD3FC] text-[#F4F7FA] shadow-[0_0_25px_rgba(125,211,252,0.35)] scale-105"
                        : "bg-[#05070A] border-white/10 text-[#A2ACB9] hover:border-white/30 hover:text-[#F4F7FA]"
                    }`}
                    aria-pressed={isCur}
                  >
                    <Icon className={`w-4 h-4 ${isCur ? "text-[#7DD3FC]" : "text-[#A2ACB9]"}`} />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-[#66717F] font-bold tracking-wider">
                        {node.code}
                      </span>
                      <span className="text-xs font-mono font-semibold tracking-wide whitespace-nowrap">
                        {node.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Coordinates Strip */}
            <div className="flex items-center justify-between text-[11px] font-mono text-[#66717F] pt-4 border-t border-white/[0.04] z-20">
              <span>LOCUS: [HCFTL-00-NX]</span>
              <span>HUMAN AUTHORITY ANCHOR: ENFORCED</span>
            </div>
          </div>

          {/* 35% Active Telemetry & Research Panel (4 cols on lg) */}
          <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-[#0D1117] border border-white/10 flex flex-col justify-between shadow-2xl">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
                <span className="text-xs font-mono font-bold text-[#7DD3FC] tracking-wider">
                  {selected.code}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono tracking-wider font-semibold">
                  STATE: OPEN
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-[#F4F7FA] mb-4 font-mono">
                {selected.title}
              </h3>

              {/* Research Question */}
              <div className="mb-6 p-4 rounded-xl bg-[#080B10] border border-white/[0.06]">
                <div className="text-[10px] font-mono text-[#7DD3FC] uppercase tracking-wider mb-2 font-semibold">
                  CORE RESEARCH QUESTION:
                </div>
                <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed font-light">
                  &ldquo;{selected.question}&rdquo;
                </p>
              </div>

              {/* Instrumentation Metrics */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs font-mono p-2.5 rounded-lg bg-[#111720]">
                  <span className="text-[#A2ACB9]">FORMAL EXPERIMENTS</span>
                  <span className="font-bold text-[#F4F7FA]">000</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono p-2.5 rounded-lg bg-[#111720]">
                  <span className="text-[#A2ACB9]">EVIDENCE RECORDED</span>
                  <span className="font-bold text-[#66717F]">NOT ASSESSED</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono p-2.5 rounded-lg bg-[#111720]">
                  <span className="text-[#A2ACB9]">SAFETY ENVELOPE</span>
                  <span className="font-bold text-[#34D399]">BOUNDED</span>
                </div>
              </div>

              {/* Focus Keywords */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#66717F] mb-2.5">
                  METHODOLOGY STACK:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-1 rounded bg-[#080B10] border border-white/[0.08] text-[#A2ACB9] text-[10px] font-mono"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Directive */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#66717F]">
              <span>ACTIVE RESEARCH CELL</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#7DD3FC]" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
