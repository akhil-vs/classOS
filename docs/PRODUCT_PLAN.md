# ClassOS product plan

AI-powered interactive learning app for CBSE Mathematics, Physics and Chemistry.

This document turns the full topic-by-topic source plan into an actionable build and rollout plan. Source PDF: [`ClassOS_Full_Topic-by-Topic_Plan_CBSE.pdf`](./ClassOS_Full_Topic-by-Topic_Plan_CBSE.pdf).

## Product thesis

A student opens a topic on their **phone or laptop**, explores a verified interactive demonstration, and leaves with the misconception fixed. Concept before calculation. The computer algebra system, simulators and curated databases calculate; the AI explains and never invents answers. The learner stays in control — advanced suggestions are optional and never force an action.

**Not in scope for the web product:** classroom projection, live teacher blackboard, or QR class-join workflows.

## Scope

| In scope (phase plan) | Later |
| --- | --- |
| Maths, Physics, Chemistry | Biology and other subjects (same pattern) |
| Classes 9–12 first, then 6–8 foundation | Broader middle-school depth |
| Student self-study on mobile + laptop | Optional school/parent progress views |
| Touch and non-touch (mouse + keyboard) parity | Stylus polish |
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
Student topic workspace (phone or laptop)
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

Details: [`architecture/engines.md`](./architecture/engines.md) · [`architecture/web-app.md`](./architecture/web-app.md). Topic packaging: [`curriculum/topic-schema.md`](./curriculum/topic-schema.md).

## Pedagogical system (every topic)

1. See it → Predict → Build it → Derive it → Solve it → Check it (student-paced)  
2. Show the law with live substituted values  
3. Misconception cards with confronting demos  
4. Auto-generated MCQ / assertion-reason / case-based items from the live widget state  
5. Practice aligned to CBSE competency pattern; personal weak-topic progress stays private to the learner (DPDP Act 2023)

## Suggested build order

| Phase | Scope | Why this order |
| --- | --- | --- |
| 1 | Shared learn workspace: responsive shell, input-kit, widgets, units | Everything depends on this |
| 2 | Class 9–10 Mathematics | Highest learner demand; shared graph/CAS infrastructure |
| 3 | Class 9–10 Chemistry, then Class 9–10 Physics | Chemistry notation is stricter → reliable sooner; then physics scene pipeline |
| 4 | Learner pilot on real phones and laptops | Measure drop-off by device and mode before senior secondary |
| 5 | Class 11–12 Mathematics | Calculus lab, 3D, vectors |
| 6 | Class 11–12 Physics | Mechanics → electromagnetism/optics → modern physics |
| 7 | Class 11–12 Chemistry | Physical chemistry → organic mechanisms |
| 8 | Classes 6–8 foundation (+ other subjects later) | Extends reach; reuses engines |
| Ongoing | Free-hand recognition, offline PWA cache, regional languages | Improves behind stable simulators |

## Phase 1 exit criteria (platform)

- `/learn/[topicId]` usable at 360px phone and 1280px laptop widths  
- Pointer + keyboard parity for sliders, drags, value entry  
- Variable/unit model with dimension check  
- One sample widget from each engine stub (graph, scene, molecule)  
- Chapter manifest loader (no hardcoded chapter UI)  
- Guided modes work without ink; ink/draw remains optional  

## Phase 2–3 exit criteria (board-exam core)

- All Class 9–10 maths chapters ship under the topic schema ship gate  
- Chemistry: equation balancer, mole calculator, periodic table, Class 9–10 chapter modules  
- Physics: scene builder + Motion / Force / Light / Electricity modules as the first complete slice  
- Golden tests green for every shipped NCERT worked example in those chapters  
- Practice + personal progress for shipped topics  

## Accuracy rules

1. CAS / simulators / curated DBs are source of truth; AI explains only.  
2. Two-path checks; disagreement warns the learner and withholds the answer.  
3. Golden set from NCERT examples/exercises + recent CBSE papers.  
4. Out-of-scope honesty — if not confident, say so.  
5. Assumptions always visible on screen.

## Honest limits

- Messy handwriting, hand-drawn circuits and organic structures take longest → templates/toolbars first (especially on phones).  
- Quantum ideas and organic mechanisms need teacher review before release.  
- Curriculum drift → content as data.  
- Syllabus lists must be re-validated every phase.  
- Low-end phones may use server engine fallback for heavy WASM.

## Web application

Student mobile/laptop architecture, input parity, routes, stack, and milestones: [`architecture/web-app.md`](./architecture/web-app.md).

## Immediate next engineering work

1. Scaffold the Next.js app with mobile-first `/browse` and `/learn/[topicId]`.  
2. Implement Phase 1 learn workspace + `input-kit` (touch and mouse/keyboard) + chapter manifests.  
3. First vertical slice: **Class 10 Quadratic Equations** and **Class 10 Chemical Reactions and Equations**.  
4. Stand up golden-test harness around NCERT worked examples for those two chapters.  
5. Only then expand across Class 9–10 maths.
