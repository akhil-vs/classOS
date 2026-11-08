# ClassOS product plan

AI-powered interactive learning and blackboard app for CBSE Mathematics, Physics and Chemistry.

This document turns the full topic-by-topic source plan into an actionable build and rollout plan. Source PDF: [`ClassOS_Full_Topic-by-Topic_Plan_CBSE.pdf`](./ClassOS_Full_Topic-by-Topic_Plan_CBSE.pdf).

## Product thesis

What the learner or teacher writes (or enters) is recognised; the board responds with a verified interactive demonstration; the student leaves with the misconception fixed. Concept before calculation. The computer algebra system, simulators and curated databases calculate; the AI explains and never invents answers. A human stays in control — suggestions appear as chips and nothing opens unless confirmed.

ClassOS ships in three modes that share engines and curriculum data:

1. **Learn** — student self-study on phone or laptop.  
2. **Personal blackboard** — freeform interactive board for one student.  
3. **Classroom board** — teacher live board on a projector/large panel, with students joining on phones for Predict and Check-it.

## Scope

| In scope (phase plan) | Later |
| --- | --- |
| Maths, Physics, Chemistry | Biology and other subjects (same pattern) |
| Classes 9–12 first, then 6–8 foundation | Broader middle-school depth |
| Student Learn + personal board on mobile/laptop | Parent views |
| Classroom live board + `/join` + school reports | Cross-school content marketplace |
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
Learn UI  ·  Personal /board  ·  Classroom /class/board + /join
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

1. See it → Predict → Build it → Derive it → Solve it → Check it  
2. Show the law with live substituted values  
3. Misconception cards with confronting demos  
4. Auto-generated MCQ / assertion-reason / case-based items from board/widget state  
5. Practice aligned to CBSE competency pattern; learner progress private; class reports school-private (DPDP Act 2023)

Predict is self-paced in Learn/personal board, and class-voted via `/join` on the classroom board.

## Suggested build order

| Phase | Scope | Why this order |
| --- | --- | --- |
| 1 | Shared base: Learn shell, personal board (ink/chips/widgets), input-kit, units | Everything depends on this |
| 2 | Class 9–10 Mathematics | Highest demand; shared graph/CAS |
| 3 | Class 9–10 Chemistry, then Physics | Chemistry notation stricter first |
| 4 | Learner pilot (phones/laptops) on Learn + personal board | Validate before live class complexity |
| 5 | Classroom board pack: live session, `/join`, planner, school admin | Reuses board-core; adds realtime |
| 6 | Classroom pilot in a few schools | Measure recognition errors and unused chips |
| 7 | Class 11–12 Mathematics | Calculus lab, 3D, vectors |
| 8 | Class 11–12 Physics | Mechanics → EM/optics → modern |
| 9 | Class 11–12 Chemistry | Physical chemistry → organic mechanisms |
| 10 | Classes 6–8 foundation (+ other subjects later) | Extends reach; reuses engines |
| Ongoing | Free-hand recognition, offline PWA, regional languages | Behind stable simulators |

## Phase 1 exit criteria (platform)

- `/learn/[topicId]` usable at 360px and 1280px  
- `/board` personal blackboard: ink, chips (confirm-to-open), AI on/off, widget host  
- Pointer + keyboard parity for sliders, drags, value entry, chip confirm  
- Variable/unit model with dimension check  
- One sample widget from each engine stub (graph, scene, molecule)  
- Chapter manifest loader (no hardcoded chapter UI)  

## Phase 2–3 exit criteria (board-exam core)

- All Class 9–10 maths chapters ship under the topic schema ship gate  
- Chemistry and Physics Class 9–10 slices as in the web plan  
- Golden tests green for shipped NCERT worked examples  
- Practice + personal progress for shipped topics  

## Phase 5 exit criteria (classroom)

- Teacher `/class/board` projection-ready with live chips and assumption banner  
- `/join` Predict votes and Check-it on student phones  
- Lesson planner sequence + class replay/notes  
- School-scoped weak-topic report  

## Accuracy rules

1. CAS / simulators / curated DBs are source of truth; AI explains only.  
2. Two-path checks; disagreement warns and withholds the answer.  
3. Golden set from NCERT examples/exercises + recent CBSE papers.  
4. Out-of-scope honesty — if not confident, say so.  
5. Assumptions always visible on screen.

## Honest limits

- Messy handwriting, hand-drawn circuits and organic structures take longest → templates/toolbars first.  
- Quantum ideas and organic mechanisms need teacher review before release.  
- Curriculum drift → content as data.  
- Syllabus lists must be re-validated every phase.  
- Low-end phones may use server engine fallback for heavy WASM.

## Web application

Learn, personal blackboard, and classroom board architecture: [`architecture/web-app.md`](./architecture/web-app.md).

## Immediate next engineering work

1. Scaffold Next.js with `/browse`, `/learn/[topicId]`, and `/board`.  
2. Implement Phase 1: Learn shell + personal board-core + input-kit + manifests.  
3. First verticals: **Class 10 Quadratic Equations** and **Class 10 Chemical Reactions and Equations**.  
4. Golden-test harness for those chapters.  
5. Expand Class 9–10 maths; add classroom live pack after learner pilot.
