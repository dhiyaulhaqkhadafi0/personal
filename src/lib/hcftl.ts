export interface ResearchFrontier {
  id: string;
  number: string;
  title: string;
  description: string;
  keywords: string[];
  status: string;
}

export interface ResearchStage {
  code: string;
  name: string;
  summary: string;
}

export interface EvidenceLevel {
  level: number;
  name: string;
  description: string;
}

export interface SafetyClass {
  tier: 'GREEN' | 'AMBER' | 'RED';
  title: string;
  description: string;
  examples: string[];
  posture: string;
  colorHex: string;
  bgRgba: string;
}

export interface AutonomyLevel {
  code: 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5';
  name: string;
  description: string;
  posture: 'DEFAULT_FOCUS' | 'ELEVATED_REVIEW' | 'NOT_TARGET';
  postureLabel: string;
}

export interface LabStatusMetrics {
  state: string;
  version: string;
  experiments: number;
  publications: number;
  releases: number;
  priority: string;
}

export const LAB_METRICS: LabStatusMetrics = {
  state: 'FOUNDATION',
  version: '1.0',
  experiments: 0,
  publications: 0,
  releases: 0,
  priority: 'INSTITUTIONAL FOUNDATION',
};

export const RESEARCH_FRONTIERS: ResearchFrontier[] = [
  {
    id: 'physical-intelligence',
    number: '01',
    title: 'Physical Intelligence',
    description:
      'How intelligent systems perceive, reason about, and interact with physical environments.',
    keywords: [
      'Robotics',
      'Embodied Intelligence',
      'Physical Sensing',
      'Human-Machine Interaction',
    ],
    status: 'FIELD OPEN',
  },
  {
    id: 'collective-intelligence',
    number: '02',
    title: 'Collective Intelligence',
    description:
      'How multiple intelligent agents can coordinate toward shared objectives without centralization bottlenecks.',
    keywords: [
      'Multi-Agent Systems',
      'Distributed Intelligence',
      'Agent Coordination',
      'Collective Decision Systems',
    ],
    status: 'FIELD OPEN',
  },
  {
    id: 'resilience-technology',
    number: '03',
    title: 'Resilience Technology',
    description:
      'Technologies that help humans respond to disruption, uncertainty, and extreme environments.',
    keywords: [
      'Disaster Response',
      'Infrastructure Resilience',
      'Environmental Intelligence',
      'Emergency Systems',
    ],
    status: 'FIELD OPEN',
  },
  {
    id: 'digital-twin-intelligence',
    number: '04',
    title: 'Digital Twin Intelligence',
    description:
      'AI systems that build high-fidelity representations of physical environments and reason about possible futures.',
    keywords: [
      'Simulation',
      'World Models',
      'Predictive Systems',
      'Scenario Intelligence',
    ],
    status: 'FIELD OPEN',
  },
  {
    id: 'safe-autonomous-systems',
    number: '05',
    title: 'Safe Autonomous Systems',
    description:
      'Exploring how increasingly capable autonomous systems can remain observable, bounded, auditable, and under meaningful human authority.',
    keywords: [
      'Human-in-the-Loop',
      'Permission Boundaries',
      'Agent Safety',
      'Observability',
      'Controlled Autonomy',
    ],
    status: 'FIELD OPEN',
  },
];

export const RESEARCH_STAGES: ResearchStage[] = [
  { code: 'R01', name: 'Question', summary: 'Formulate an empirical problem or fundamental challenge' },
  { code: 'R02', name: 'Research Charter', summary: 'Define assumptions, scope boundaries, and falsifiable success criteria' },
  { code: 'R03', name: 'Safety Classification', summary: 'Assess risk tier, autonomy boundaries, and stop conditions' },
  { code: 'R04', name: 'Simulation', summary: 'Isolate and test within bounded digital twin environments first' },
  { code: 'R05', name: 'Experiment', summary: 'Execute controlled runs with continuous multi-channel telemetry' },
  { code: 'R06', name: 'Evidence', summary: 'Measure outcomes, record deviations, and register full telemetry' },
  { code: 'R07', name: 'Reproduction', summary: 'Verify that observed results can be repeated deterministically' },
  { code: 'R08', name: 'Release Review', summary: 'Evaluate governance between open, bounded, or internal retention' },
  { code: 'R09', name: 'Publication', summary: 'Disclose findings, peer notes, limitations, and failure logs' },
];

export const EVIDENCE_LADDER: EvidenceLevel[] = [
  { level: 1, name: 'Concept', description: 'Theoretical hypothesis, analytical framing, and architectural assumptions' },
  { level: 2, name: 'Prototype', description: 'Functional implementation proving engineering feasibility in sandbox' },
  { level: 3, name: 'Controlled Experiment', description: 'Isolated execution under structured, measurable constraints' },
  { level: 4, name: 'Reproducible Result', description: 'Consistent outcomes verified across independent test runs' },
  { level: 5, name: 'Real-World Validation', description: 'Tested under operational noise, edge conditions, and environmental friction' },
  { level: 6, name: 'Production System', description: 'Hardened, observable, and governed system operating under continuous supervision' },
];

export const SAFETY_CLASSES: SafetyClass[] = [
  {
    tier: 'GREEN',
    title: 'Positive-Use Research',
    description:
      'Low-risk research focused on humanitarian assistance, environmental monitoring, simulation, accessibility, and benign tooling.',
    examples: ['Accessibility Systems', 'Disaster Response', 'Physical Simulation', 'Benign Robotics'],
    posture: 'OPEN AFTER STANDARD REVIEW',
    colorHex: '#34D399',
    bgRgba: 'rgba(52, 211, 153, 0.08)',
  },
  {
    tier: 'AMBER',
    title: 'Higher-Capability / Dual-Use',
    description:
      'Powerful autonomous systems, advanced cyber defense, high-impact robotics, or sensitive infrastructure models that carry tangible dual-use risk.',
    examples: ['Autonomous Agent Collectives', 'Advanced Cyber Defense', 'High-Force Physical Actuation'],
    posture: 'BOUNDED / CONTROLLED RELEASE',
    colorHex: '#FBBF24',
    bgRgba: 'rgba(251, 191, 36, 0.08)',
  },
  {
    tier: 'RED',
    title: 'Prohibited Research',
    description:
      'Capabilities whose practical purpose materially enables weapons, autonomous human targeting, pathogen engineering, or destructive offensive cyber systems.',
    examples: ['Autonomous Targeting', 'Harmful Weaponization', 'Pathogen Design', 'Offensive Cyber Weapons'],
    posture: 'NOT PURSUED / STRICT PROHIBITION',
    colorHex: '#F87171',
    bgRgba: 'rgba(248, 113, 113, 0.08)',
  },
];

export const AUTONOMY_LEVELS: AutonomyLevel[] = [
  {
    code: 'A0',
    name: 'Advisory',
    description: 'System only displays contextual data, analysis, and sensor telemetry without formulating recommendations.',
    posture: 'DEFAULT_FOCUS',
    postureLabel: 'CORE HCFTL RESEARCH TARGET',
  },
  {
    code: 'A1',
    name: 'Recommend',
    description: 'System evaluates possible paths and proposes courses of action; execution rests exclusively with the human.',
    posture: 'DEFAULT_FOCUS',
    postureLabel: 'CORE HCFTL RESEARCH TARGET',
  },
  {
    code: 'A2',
    name: 'Assisted',
    description: 'System prepares and stages actions; execution proceeds only upon explicit human authorization.',
    posture: 'DEFAULT_FOCUS',
    postureLabel: 'CORE HCFTL RESEARCH TARGET',
  },
  {
    code: 'A3',
    name: 'Bounded Autonomy',
    description: 'System acts autonomously within a strictly pre-authorized sandbox governed by cryptographic or hard physical tripwires.',
    posture: 'DEFAULT_FOCUS',
    postureLabel: 'CORE HCFTL RESEARCH TARGET',
  },
  {
    code: 'A4',
    name: 'Supervisory Autonomy',
    description: 'Autonomous execution across broader domains with active human monitoring, intervention controls, and kill-switches.',
    posture: 'ELEVATED_REVIEW',
    postureLabel: 'REQUIRES INSTITUTIONAL SAFETY REVIEW',
  },
  {
    code: 'A5',
    name: 'Unbounded Consequential Autonomy',
    description: 'Unconstrained execution with irreversible real-world authority devoid of human intervention safeguards.',
    posture: 'NOT_TARGET',
    postureLabel: 'NOT A RESEARCH TARGET FOR HCFTL',
  },
];

export const RESEARCH_OUTPUTS = [
  { label: 'Research Notes', value: 0, status: '0 PUBLIC', desc: 'Working memos, architecture notes, and methodology briefs.' },
  { label: 'Formal Publications', value: 0, status: '0 PUBLIC', desc: 'Peer-reviewed papers, empirical findings, and technical reports.' },
  { label: 'Open Research Releases', value: 0, status: '0 RELEASES', desc: 'Open data sets, model weights, and replication packages.' },
  { label: 'Failure Log', value: 0, status: '0 RECORDED', desc: 'Documented anomalies, falsified hypotheses, and negative results.' },
];

export const LAB_NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'frontiers', label: 'Frontiers' },
  { id: 'process', label: 'Process' },
  { id: 'safety', label: 'Safety' },
  { id: 'registry', label: 'Registry' },
  { id: 'research', label: 'Research' },
];
