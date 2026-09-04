"use client";

import { useState } from "react";
import { Cpu, Binary, Network, Activity, ShieldCheck } from "lucide-react";

interface NodeDetail {
  id: string;
  title: string;
  category: string;
  summary: string;
  coordinates: { x: number; y: number };
  icon: typeof Cpu;
}

const MAP_NODES: NodeDetail[] = [
  {
    id: "physical",
    title: "Physical Intelligence",
    category: "FRONTIER 01",
    summary: "How intelligent agents perceive, reason, manipulate, and coordinate within the real physical world.",
    coordinates: { x: 50, y: 15 },
    icon: Cpu,
  },
  {
    id: "digital-twins",
    title: "Digital Twin Intelligence",
    category: "FRONTIER 04",
    summary: "AI systems constructing high-resolution synthetic representations to simulate futures safely.",
    coordinates: { x: 18, y: 38 },
    icon: Binary,
  },
  {
    id: "collective",
    title: "Collective Intelligence",
    category: "FRONTIER 02",
    summary: "Decentralized coordination frameworks allowing heterogeneous multi-agent systems to solve complex goals.",
    coordinates: { x: 82, y: 38 },
    icon: Network,
  },
  {
    id: "resilience",
    title: "Resilience Technology",
    category: "FRONTIER 03",
    summary: "Adaptive systems designed to endure disruption, system degradation, extreme conditions, and black-swan shocks.",
    coordinates: { x: 25, y: 82 },
    icon: Activity,
  },
  {
    id: "autonomy",
    title: "Safe Autonomous Systems",
    category: "FRONTIER 05",
    summary: "Governance mechanisms, verifiable safety bounds, and telemetry preserving human authority over consequential acts.",
    coordinates: { x: 75, y: 82 },
    icon: ShieldCheck,
  },
];

export function ResearchIntelligenceMap() {
  const [activeNode, setActiveNode] = useState<string>("physical");

  const selectedNode = MAP_NODES.find((n) => n.id === activeNode) || MAP_NODES[0];

  return (
    <section className="py-24 border-b border-white/[0.06] bg-[#080B10]/40 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
              <span className="text-xs font-mono tracking-widest text-[#7DD3FC] uppercase">
                04 {"//"} TOPOLOGY & DOMAINS
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F4F7FA] tracking-tight">
              Research Intelligence Map
            </h2>
          </div>
          <p className="text-xs font-mono text-[#A2ACB9] max-w-sm">
            INTERACTIVE SYSTEM ARCHITECTURE. EXPLORE THE FIVE COUPLING DOMAINS OF HCFTL.
          </p>
        </div>

        {/* Desktop Interactive Topology Map (Hidden on mobile) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-center bg-[#05070A] p-8 rounded-3xl border border-white/[0.08] shadow-2xl relative overflow-hidden min-h-[500px]">
          {/* Interactive Topology Graph Canvas (7 cols) */}
          <div className="col-span-7 relative h-[440px] flex items-center justify-center">
            {/* SVG Connecting Traces */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {MAP_NODES.map((node) => {
                const isActive = activeNode === node.id;
                return (
                  <line
                    key={node.id}
                    x1="50"
                    y1="50"
                    x2={node.coordinates.x}
                    y2={node.coordinates.y}
                    stroke={isActive ? "#7DD3FC" : "rgba(255,255,255,0.12)"}
                    strokeWidth={isActive ? "0.8" : "0.4"}
                    strokeDasharray={isActive ? "none" : "1 1"}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>

            {/* Center Core Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-[#0D1117] border-2 border-[#7DD3FC]/60 shadow-[0_0_30px_rgba(125,211,252,0.2)] flex flex-col items-center justify-center text-center">
                <span className="text-sm font-mono font-bold tracking-wider text-[#F4F7FA]">HCFTL</span>
                <span className="text-[8px] font-mono text-[#7DD3FC] uppercase tracking-widest">NEXUS</span>
              </div>
            </div>

            {/* Interactive Domain Nodes */}
            {MAP_NODES.map((node) => {
              const isActive = activeNode === node.id;
              const Icon = node.icon;

              return (
                <button
                  key={node.id}
                  type="button"
                  onMouseEnter={() => setActiveNode(node.id)}
                  onClick={() => setActiveNode(node.id)}
                  style={{
                    left: `${node.coordinates.x}%`,
                    top: `${node.coordinates.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className={`absolute z-30 flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0D1117] border-[#7DD3FC] text-[#F4F7FA] shadow-[0_0_20px_rgba(125,211,252,0.3)] scale-105"
                      : "bg-[#080B10] border-white/10 text-[#A2ACB9] hover:border-white/30 hover:text-[#F4F7FA]"
                  }`}
                  aria-pressed={isActive}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#7DD3FC]" : "text-[#A2ACB9]"}`} />
                  <span className="text-xs font-mono font-semibold tracking-wide whitespace-nowrap">
                    {node.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Node Detail Card (5 cols) */}
          <div className="col-span-5 flex flex-col justify-center p-6 rounded-2xl bg-[#0D1117] border border-white/10 shadow-inner">
            <span className="text-xs font-mono text-[#7DD3FC] tracking-widest uppercase mb-1">
              {selectedNode.category} {"//"} SELECTED DOMAIN
            </span>
            <h3 className="text-2xl font-bold text-[#F4F7FA] mb-4">
              {selectedNode.title}
            </h3>
            <p className="text-sm text-[#A2ACB9] leading-relaxed mb-6 font-light">
              {selectedNode.summary}
            </p>
            <div className="flex items-center gap-2 pt-4 border-t border-white/[0.08]">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
              <span className="text-xs font-mono text-[#34D399]">
                RESEARCH POSTURE: ACTIVE EXPLORATION
              </span>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Topology: Vertical Structured Nodes */}
        <div className="lg:hidden flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#7DD3FC]/30 text-center mb-2">
            <span className="text-xs font-mono font-bold tracking-widest text-[#7DD3FC]">
              HCFTL NEXUS {"//"} CORE ARCHITECTURE
            </span>
          </div>

          {MAP_NODES.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                className="p-5 rounded-2xl bg-[#0D1117] border border-white/[0.08] hover:border-[#7DD3FC]/40 transition-all flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#7DD3FC]" />
                    <h3 className="text-base font-semibold text-[#F4F7FA] font-mono">
                      {node.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#66717F]">
                    {node.category}
                  </span>
                </div>
                <p className="text-xs text-[#A2ACB9] leading-relaxed font-light">
                  {node.summary}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
