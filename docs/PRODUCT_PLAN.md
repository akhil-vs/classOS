# ClassOS product plan

AI-powered interactive learning and blackboard app for CBSE Mathematics, Physics and Chemistry.

This document turns the full topic-by-topic source plan into an actionable build and rollout plan. Source PDF: [`ClassOS_Full_Topic-by-Topic_Plan_CBSE.pdf`](./ClassOS_Full_Topic-by-Topic_Plan_CBSE.pdf).

**Critical path (authoritative order):** [`CRITICAL_PATH.md`](./CRITICAL_PATH.md)  
One-line rule: **Platform → one maths vertical → one chem vertical → learner pilot → classroom → breadth.**

## Product thesis

What the learner or teacher writes (or enters) is recognised; the board responds with a verified interactive demonstration; the student leaves with the misconception fixed. Concept before calculation. The computer algebra system, simulators and curated databases calculate; the AI explains and never invents answers. A human stays in control — suggestions appear as chips and nothing opens unless confirmed.

ClassOS ships in three modes that share engines and curriculum data:

1. **Learn** — student self-study on phone or laptop.  
2. **Personal blackboard** — freeform interactive board for one student.  
3. **Classroom board** — teacher live board on a projector/large panel, with students joining on phones for Predict and Check-it.

## Scope

| In scope (phase plan) | Later / deferred |
| --- | --- |
| Maths, Physics, Chemistry | Biology and other subjects (same pattern) |
| Classes 9–12 first, then 6–8 foundation | Broader middle-school depth |
| Student Learn + personal board on mobile/laptop | Parent views |
| Classroom live board + `/join` + school reports | Cross-school content marketplace |
| Touch and non-touch (mouse + keyboard) parity | Stylus polish |
| English + Hindi first | Other regional languages |
| Toolbar / templates before free-hand diagrams | Messy handwriting, free-hand circuits and organic structures |
| Local-first classroom pack | Cloud student sync |
| Latin ink heuristics | Devanagari handwriting |
| — | Panel-vendor matrix, business/onboarding |

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

## Build order (critical path)

| Phase | Scope | Why this order |
| --- | --- | --- |
| **1** | Shared base: Learn shell, personal board (ink/chips/widgets), units, manifests | Bottleneck — everything depends on this |
| **0** ‖ | Pen latency ≤16 ms, offline degrade, golden/licensing notes | Parallel with Phase 1 wrap-up only; do not block UI on handwriting corpus |
| **1b** | Scene type + assumption banner + one closed-form check | Thin physics while Phase 1 finishes — no full sims |
| **2** | Quadratic (+ one linear/geometry slice) under ship gate; teacher-private equivalence | Vertical, not Class 9–10 maths breadth |
| **3** | Reactions balancer to the same ship bar as quadratic | Physics Class 9–10 only after 1b is real |
| **4** | Learner pilot (phones/laptops) on Learn + personal board | Validate before live class complexity |
| **5** | Local-first `/join` classroom pack | Reuses board-core; adds live session |
| **6** | School pilot | Measure recognition errors and unused chips |
| **7** | Class 11–12 Mathematics | After pilots show what teachers use |
| **8** | Class 11–12 Physics | Mechanics → EM/optics → modern |
| **9** | Class 11–12 Chemistry | Physical chemistry → organic mechanisms |
| **10** | Classes 6–8 foundation | Extends reach; reuses engines |

## Phase 1 exit criteria (platform)

- `/learn/[topicId]` usable at 360px and 1280px  
- `/board` personal blackboard: ink, chips (confirm-to-open), AI on/off, widget host  
- Pointer + keyboard parity for sliders, drags, value entry, chip confirm  
- Variable/unit model with dimension check **in the UI**  
- Select tool: hit-test, move, delete (keyboard + pointer)  
- One sample widget from each engine stub (graph, scene, molecule)  
- Chapter manifest loader (no hardcoded chapter UI)  

## Phase 0 exit criteria (spikes)

- Ink path coalesces pointer samples; latency harness documents ≤16 ms budget  
- Offline degrade: SW app shell + banner; explain refuses offline  
- Licensing notes recorded for future SymPy/RDKit WASM  

## Phase 1b exit criteria (thin physics)

- Shared `SceneDescription` type  
- Assumption banner driven by scene flags  
- Inclined-plane closed-form + residual check (no full RK4 yet)  

## Phase 2–3 exit criteria (verticals, not breadth)

- Class 10 Quadratic ships under the topic schema ship gate (`status: "shipped"`)  
- One linear + one geometry slice under the same gate discipline  
- Teacher-private equivalence API (not student scoreboards)  
- Class 10 Reactions balancer ships to the same bar  
- Golden tests green for shipped NCERT worked examples  
- Class 9–10 maths **inventory** remains the target catalogue — not the next sprint  

## Phase 4–6 exit criteria

- **Phase 4 (now):** Learn + personal board usable at **360px and laptop** widths on shipped **Quadratic** and **Reactions** only. Explicitly watch and harden: recognition chip noise, unused templates, units vs assumption confusion, offline banner behaviour. `/progress` stays the learner-pilot path.  
- **Phase 5 (after Phase 4 evidence):** Harden local-first `/class/board` + `/join` classroom pack — do not expand classroom until pilot notes land.  
- **Phase 6 (after Phase 5):** Small school pilot; `/school` admin stub; school-scoped reports only.  

Do **not** pull forward during Phase 4: Class 9–10 maths inventory breadth, full physics sims, cloud sync, or Devanagari ink.  

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

1. ~~Scaffold Next.js with `/browse`, `/learn/[topicId]`, and `/board`.~~  
2. ~~Phase 1 platform base + Phase 0 spikes + Phase 1b closed-form.~~  
3. ~~Quadratic + Reactions verticals under ship gate; linear/geometry slice.~~  
4. **Phase 4 learner pilot** — Learn + personal board at 360px/laptop on Quadratic + Reactions; chip noise, templates, units/assumptions, offline banner.  
5. Harden local-first `/join` classroom pack (**Phase 5**) only after pilot evidence.  
6. Small school pilot (**Phase 6**) after Phase 5.  
7. Do **not** pull forward: Class 9–10 maths inventory breadth, full physics sims, cloud sync, Devanagari ink, free-hand circuits/organics, marketplace, panel matrix, onboarding.
