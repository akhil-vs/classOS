# ClassOS product plan

AI-powered interactive blackboard for CBSE Mathematics, Physics and Chemistry.

This document turns the full topic-by-topic source plan into an actionable build and rollout plan. Source PDF: [`ClassOS_Full_Topic-by-Topic_Plan_CBSE.pdf`](./ClassOS_Full_Topic-by-Topic_Plan_CBSE.pdf).

## Product thesis

What the teacher writes is recognised; the board responds with a verified interactive demonstration; the student leaves with the misconception fixed. Concept before calculation. The computer algebra system, simulators and curated databases calculate; the AI explains and never invents answers. The teacher stays in control — suggestions appear as chips and nothing opens unless tapped.

## Scope

| In scope (phase plan) | Later |
| --- | --- |
| Maths, Physics, Chemistry | Biology and other subjects (same pattern) |
| Classes 9–12 first, then 6–8 foundation | Broader middle-school depth |
| English + Hindi first | Other regional languages |
| Toolbar / templates before free-hand diagrams | Messy handwriting, free-hand circuits and organic structures |

**Hard gate:** validate every chapter list against the current CBSE curriculum document before development of that chapter starts. Lists in this repo are a content checklist, not a locked syllabus.

## Inventory snapshot

| Band | Units |
| --- | --- |
| Mathematics Class 9–12 chapters | 53 |
| Physics Class 9–12 chapters | 34 |
| Chemistry Class 9–12 chapters | 28 |
| Foundation topic bundles (6–8, all three subjects) | 24 |
| **Tracked units** | **139** |

Full machine-readable inventory: [`curriculum/inventory.json`](./curriculum/inventory.json).

## Architecture slices

```
Ink / recognition chips
        ↓
Topic module (manifest + modes + misconceptions)
        ↓
┌─────────────┬──────────────────┬────────────────────┐
│ Maths CAS   │ Physics scene →  │ Chemistry RDKit +  │
│ + geometry  │ simulator +      │ reaction knowledge │
│             │ overlays         │ base + virtual lab │
└─────────────┴──────────────────┴────────────────────┘
        ↓
Solve / Check (CBSE steps + golden tests)
```

Details: [`architecture/engines.md`](./architecture/engines.md). Topic packaging: [`curriculum/topic-schema.md`](./curriculum/topic-schema.md).

## Pedagogical system (every topic)

1. See it → Predict → Build it → Derive it → Solve it → Check it  
2. Show the law with live substituted values  
3. Misconception cards with confronting demos  
4. Auto-generated MCQ / assertion-reason / case-based items from board state  
5. Assessment types aligned to CBSE competency pattern; weak-topic reports private to the school (DPDP Act 2023)

## Suggested build order

| Phase | Scope | Why this order |
| --- | --- | --- |
| 1 | Shared base: ink, recognition chip, widget framework, variables, units | Everything depends on this |
| 2 | Class 9–10 Mathematics | Largest teacher demand; shared graph/CAS infrastructure |
| 3 | Class 9–10 Chemistry, then Class 9–10 Physics | Chemistry notation is stricter → reliable sooner; then physics scene pipeline |
| 4 | Pilot in a few schools | Measure recognition errors and unused features before senior secondary |
| 5 | Class 11–12 Mathematics | Calculus lab, 3D, vectors |
| 6 | Class 11–12 Physics | Mechanics → electromagnetism/optics → modern physics |
| 7 | Class 11–12 Chemistry | Physical chemistry → organic mechanisms |
| 8 | Classes 6–8 foundation (+ other subjects later) | Extends reach; reuses engines |
| Ongoing | Free-hand recognition, offline models, regional languages | Improves behind stable simulators |

## Phase 1 exit criteria (platform)

- Strokes capture, undo, replay of ink + widgets  
- Recognition suggestions as opt-in chips  
- Variable/unit model with dimension check  
- One sample widget from each engine stub (graph, scene, molecule)  
- Chapter manifest loader (no hardcoded chapter UI)  
- Blackboard-only mode with AI layer off  

## Phase 2–3 exit criteria (board-exam core)

- All Class 9–10 maths chapters ship under the topic schema ship gate  
- Chemistry: equation balancer, mole calculator, periodic table, Class 9–10 chapter modules  
- Physics: scene builder + Motion / Force / Light / Electricity modules as the first complete slice  
- Golden tests green for every shipped NCERT worked example in those chapters  
- Pilot-ready teacher workflow: lesson planner sequence, record/replay notes  

## Accuracy rules

1. CAS / simulators / curated DBs are source of truth; AI explains only.  
2. Two-path checks; disagreement warns the teacher.  
3. Golden set from NCERT examples/exercises + recent CBSE papers.  
4. Out-of-scope honesty — if not confident, say so.  
5. Assumptions always visible on screen.

## Honest limits

- Messy handwriting, hand-drawn circuits and organic structures take longest → templates/toolbars first.  
- Quantum ideas and organic mechanisms need teacher review before release.  
- Curriculum drift → content as data.  
- Syllabus lists must be re-validated every phase.

## Web application

Concrete browser architecture, routes, stack, runtime split, and web milestones: [`architecture/web-app.md`](./architecture/web-app.md).

## Immediate next engineering work

1. Scaffold the Next.js monorepo (`apps/web`) with full-bleed `/board` ink surface.  
2. Implement Phase 1 shared base + chapter manifest loader (`packages/curriculum`).  
3. First vertical slice: **Class 10 Quadratic Equations** (maths) and **Class 10 Chemical Reactions and Equations** (chemistry) as reference modules that prove the schema end-to-end.  
4. Stand up golden-test harness around NCERT worked examples for those two chapters.  
5. Only then expand across Class 9–10 maths.
