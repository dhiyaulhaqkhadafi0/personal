# HCFTL Work System

This document defines how HCFTL work should be organized before individual research projects are started.

## 1. Institutional hierarchy

HCFTL work follows this order:

1. **Lab doctrine** — mission, values, human-centered principles.
2. **Governance** — safety, autonomy, publication, decision rights.
3. **Research system** — hypotheses, experiment design, evidence, reproducibility.
4. **Infrastructure** — simulation, data, observability, documentation, repositories.
5. **Experiment portfolio** — only after the first four layers are stable.

Projects must not redefine the lab's doctrine merely to make a demo easier or faster.

## 2. Working artifacts

Every significant HCFTL initiative will eventually maintain:

- Research Charter
- Research Question / Hypothesis
- Scope and Non-Scope
- Safety Classification
- Autonomy Classification
- Architecture Note
- Experiment Plan
- Evaluation Plan
- Failure Log
- Results Report
- Release Decision
- Changelog

## 3. Safety classification

### GREEN
Low-risk positive-use research such as simulation, disaster response, accessibility, education, environmental monitoring, safe robotics, and benign tooling.

Default posture: eligible for public documentation and open release after normal review.

### AMBER
Dual-use or higher-capability work such as powerful autonomous agents, physical systems with meaningful real-world authority, advanced cyber defense, high-impact robotics, or sensitive infrastructure simulations.

Default posture: additional safety review, bounded capabilities, controlled testing, least-privilege access, and selective release.

### RED
Work whose practical purpose materially enables weapons, autonomous human targeting, pathogens, offensive exploitation, destructive cyber operations, or similarly harmful capabilities.

Default posture: not built or released by HCFTL.

## 4. Autonomy classification

HCFTL tracks autonomy independently from intelligence.

- **A0 — Advisory:** system only displays information.
- **A1 — Recommend:** system proposes actions; human executes.
- **A2 — Assisted:** system may prepare actions; human explicitly approves execution.
- **A3 — Bounded Autonomy:** system acts autonomously inside a narrow pre-authorized sandbox with hard limits.
- **A4 — Supervisory Autonomy:** broader autonomy with human monitoring and intervention controls; requires elevated review.
- **A5 — Unbounded / Consequential Autonomy:** not an acceptable default research target for HCFTL.

Consequential actions must preserve meaningful human authority.

## 5. Research lifecycle

### Gate 0 — Institutional fit
Does the work fit HCFTL's mission and boundaries?

### Gate 1 — Research charter
Define question, assumptions, expected benefit, scope, non-scope, and success criteria.

### Gate 2 — Safety review
Classify risk, autonomy, data sensitivity, deployment boundary, misuse surface, and stop conditions.

### Gate 3 — Simulation / sandbox
Prefer isolated, synthetic, simulated, or otherwise bounded testing before real-world deployment.

### Gate 4 — Evidence
Measure results against predefined metrics. Record failures and unexpected behavior.

### Gate 5 — Reproduction
Confirm that the result can be repeated and that claims match observed evidence.

### Gate 6 — Release review
Choose between public release, partial release, controlled access, internal retention, or non-release.

### Gate 7 — Publication
Publish methods, limitations, evidence, version, known failures, and safety notes appropriate to the release level.

## 6. Evidence standard

HCFTL distinguishes clearly between:

- concept;
- prototype;
- controlled experiment;
- reproducible result;
- validated real-world result;
- production-grade system.

A visually impressive demo is not sufficient evidence of reliability, generality, or safety.

Claims must never be stronger than the evidence available.

## 7. Failure policy

Failures are first-class research artifacts.

Record:

- what failed;
- environment;
- reproduction steps where safe;
- observed behavior;
- expected behavior;
- suspected cause;
- mitigation;
- whether the failure changes the research claim or release decision.

## 8. Release philosophy

HCFTL distinguishes:

- **Open Research** — methods, findings, architecture, evaluation, research notes.
- **Open Source** — source code released under an actual open-source license.
- **Controlled Release** — selected capabilities, configurations, datasets, integrations, or deployment controls are withheld or gated because unrestricted release is not responsible.

Do not label use-restricted code as "open source" when the license is not genuinely open source.

## 9. Website publication model

The public `/lab` surface will eventually contain:

- Lab Overview
- Manifesto
- Research Domains
- Safety & Governance
- Experiment Registry
- Research Notes
- Publications
- Failure / Lessons Log
- Open-source repositories where applicable
- Changelog

Each experiment page should show its status, evidence level, safety class, autonomy class, version, limitations, and release posture.

## 10. Repository workflow

Recommended branch convention:

- `main` — production-ready website state.
- `feat/<name>` — isolated feature work.
- HCFTL work begins on `feat/hcftl-lab` and should not be merged until the currently pending Blog Studio integration is resolved.

The lab branch is intentionally based on the latest Blog Studio branch so it inherits the intended future website state. After Blog Studio reaches `main`, HCFTL should be reconciled against the updated `main` before release.

## 11. Current institutional milestone

The current milestone is **HCFTL Foundation Complete**.

Completion means:

- blueprint ratified;
- work system documented;
- public safety charter drafted;
- `/lab` information architecture defined;
- repository convention defined;
- navigation entry prepared;
- no Experiment 001 opened prematurely.
