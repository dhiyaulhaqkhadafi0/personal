import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { LabHero } from "@/components/lab/LabHero";
import { LabSectionNav } from "@/components/lab/LabSectionNav";
import { LabStatus } from "@/components/lab/LabStatus";
import { LabManifesto } from "@/components/lab/LabManifesto";
import { ResearchIntelligenceMap } from "@/components/lab/ResearchIntelligenceMap";
import { ResearchFrontiers } from "@/components/lab/ResearchFrontiers";
import { ResearchOperatingSystem } from "@/components/lab/ResearchOperatingSystem";
import { EvidenceLadder } from "@/components/lab/EvidenceLadder";
import { LabSafetyFramework } from "@/components/lab/LabSafetyFramework";
import { AutonomyScale } from "@/components/lab/AutonomyScale";
import { ExperimentRegistry } from "@/components/lab/ExperimentRegistry";
import { ResearchOutputs } from "@/components/lab/ResearchOutputs";
import { OpenResearchPhilosophy } from "@/components/lab/OpenResearchPhilosophy";
import { LabFounder } from "@/components/lab/LabFounder";

export const metadata: Metadata = {
  title: "HCFTL — Human Centered Frontier Technology Lab | Daffa Dhiyaulhaq Khadafi",
  description:
    "HCFTL is an independent human-centered frontier technology lab exploring AI, physical intelligence, autonomous systems, digital twins, resilience technology, and responsible research.",
  alternates: {
    canonical: "https://khadafidaffa.com/lab",
  },
  openGraph: {
    title: "HCFTL — Human Centered Frontier Technology Lab | Daffa Dhiyaulhaq Khadafi",
    description:
      "HCFTL is an independent human-centered frontier technology lab exploring AI, physical intelligence, autonomous systems, digital twins, resilience technology, and responsible research.",
    url: "https://khadafidaffa.com/lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HCFTL — Human Centered Frontier Technology Lab | Daffa Dhiyaulhaq Khadafi",
    description:
      "HCFTL is an independent human-centered frontier technology lab exploring AI, physical intelligence, autonomous systems, digital twins, resilience technology, and responsible research.",
  },
};

export default function LabPage() {
  return (
    <main className="min-h-screen bg-[#05070A] text-[#F4F7FA] selection:bg-[#7DD3FC]/20 selection:text-[#BAE6FD] relative overflow-x-hidden font-sans">
      {/* Global subtle technical grid overlay */}
      <div
        className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Global Navbar */}
      <Navbar />

      <div className="relative z-10">
        {/* 01: Facility Entrance */}
        <LabHero />

        {/* Local Sticky Navigation */}
        <LabSectionNav />

        {/* 02: Laboratory Status */}
        <LabStatus />

        {/* 03: Why HCFTL Exists (Manifesto) */}
        <LabManifesto />

        {/* 04: Research Intelligence Map */}
        <ResearchIntelligenceMap />

        {/* 05: Research Frontiers */}
        <ResearchFrontiers />

        {/* 06: Research Operating System (From Question to Evidence) */}
        <ResearchOperatingSystem />

        {/* 06B: Evidence Ladder */}
        <EvidenceLadder />

        {/* 07: Human Authority & Safety Framework */}
        <LabSafetyFramework />

        {/* 07B: Autonomy Scale */}
        <AutonomyScale />

        {/* 08: Experiment Registry (Locked/Foundation) */}
        <ExperimentRegistry />

        {/* 09: Research Outputs (0 Public / Negative Results) */}
        <ResearchOutputs />

        {/* 10: Open Research Philosophy */}
        <OpenResearchPhilosophy />

        {/* 11: Founder / Institution Leadership & Lab Footer */}
        <LabFounder />
      </div>
    </main>
  );
}
