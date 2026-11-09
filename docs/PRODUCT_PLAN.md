# ClassOS product plan

AI-powered interactive learning and blackboard app for CBSE Mathematics, Physics and Chemistry.

This document turns the full topic-by-topic source plan into an actionable build and rollout plan. Source PDF: [`ClassOS_Full_Topic-by-Topic_Plan_CBSE.pdf`](./ClassOS_Full_Topic-by-Topic_Plan_CBSE.pdf). Content checklist: [`curriculum/inventory.json`](./curriculum/inventory.json). This file is the engineering and product spine; the PDF is the chapter/topic content manifest.

## Product thesis

What the learner or teacher writes (or enters) is recognised; the board responds with a verified interactive demonstration; the student leaves with the misconception fixed. Concept before calculation. The computer algebra system, simulators and curated databases calculate; the AI explains and never invents answers. A human stays in control — suggestions appear as chips and nothing opens unless confirmed.

ClassOS ships in three modes that share engines and curriculum data:

1. **Learn** — student self-study on phone or laptop.  
2. **Personal blackboard** — freeform interactive board for one student.  
3. **Classroom board** — teacher live board on a projector/large panel, with students joining on phones for Predict and Check-it.

## Product laws (absorbed decisions)

These rules override feature enthusiasm when they conflict:

1. **Faithful transcription** — recognition never silently corrects ink. A student's sign error is diagnostic information; the board keeps what was written.  
2. **Suggest only, never auto-act** — high confidence may show a preview chip; it never replaces ink or opens a widget. Teacher or student tap is always the trigger.  
3. **Literal OCR, then separate equivalence** — transcription stays literal. A distinct CAS step checks whether each line follows from the previous. “Line 3 does not follow from line 2” is shown only on a **teacher-private** channel, never as public-board shame. Equivalence checking is sequenced into Maths Phase 2 verticals; misconception cards remain the Learn/Predict pedagogical layer.  
4. **Split accuracy gates** — do not collapse quality into one percentage:  
   - Symbol- and expression-level recognition on messy handwriting (not typed/clean samples)  
   - Solution correctness = 100% on the verified golden set (CAS/sims are deterministic)  
   - Step-format conformance to CBSE style via teacher-reviewed templates  
   Grow goldens toward thousands across chapters over time; license NCERT and past-paper material carefully.  
5. **Localised step templates** — exam-style Given / Formula / Substitution / Answer strings are authored per language (`en`, `hi`, later regional). Do not LLM-translate steps. The LLM is confined to free-form explanation and Q&A, always with the CAS/sim result shown beside it.  
6. **Pen latency vs recognition RTT** — pen-to-ink ≤ 16 ms on mid-range tablets is a hard NFR, separate from recognition round-trip. Offline degraded mode (cached manifests/engines, optional smaller on-device recogniser, clear “recognition unavailable”) is a Phase 0/1 requirement, not only an Ongoing nice-to-have.  
7. **Visible reactive links** — when constants link to plots/results, show connectors or coloured halos; allow unlink and freeze; surface cycles and unit mismatches with a clear message. No silent global recompute.  
8. **Local-first classroom** — Phase 5 `/join` stays minimal (votes/answers) with the teacher device as hub on the classroom network before accounts-heavy cloud student sync; DPDP Act 2023 from the start; full student board sync only after pilot.  
9. **Physics foundations early** — unit system, scene description, assumption banner, and closed-form verification start in Phase 1b in parallel with Phase 1, not only when Physics content chapters ship.

Details: [`architecture/engines.md`](./architecture/engines.md) · [`architecture/web-app.md`](./architecture/web-app.md).

## Scope

| In scope (phase plan) | Later |
| --- | --- |
| Maths, Physics, Chemistry | Biology and other subjects (same pattern) |
| Classes 9–12 first, then 6–8 foundation | Broader middle-school depth |
| Student Learn + personal board on mobile/laptop | Parent views |
| Classroom live board + `/join` + school reports | Cross-school content marketplace; full student board sync |
| Touch and non-touch (mouse + keyboard) parity | Stylus polish; panel/vendor touch-frame matrix |
| English + Hindi first (UI + step templates) | Other regional languages; Devanagari/regional handwriting recognition |
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

Full machine-readable inventory: [`curriculum/inventory.json`](./curriculum/inventory.json). Phase numbers in that file match this document’s build order (not the PDF’s older phase table).

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

Prefer **scope cuts under the topic schema ship gate** over calendar promises. First shippable maths slices remain Class 10 Quadratic Equations (plus one linear/geometry vertical); Phase 2 still targets full Class 9–10 maths from the inventory.

| Phase | Scope | Why this order |
| --- | --- | --- |
| 0 | Handwriting corpus design, pen-latency spike, offline degraded-mode spike, golden-set design, chapter-manifest hygiene | De-risk ink, offline schools, and measurable gates before feature sprawl |
| 1 | Shared base: Learn shell, personal board (ink/chips/widgets), input-kit, units, faithful transcription + confirm-to-open | Everything depends on this |
| 1b (parallel with 1) | Physics foundations: unit system, scene description, assumption banner, closed-form verification harness | Avoid bolting physics engine design on at content time |
| 2 | Class 9–10 Mathematics (inventory-driven); teacher-private equivalence in algebra verticals | Highest demand; shared graph/CAS |
| 3 | Class 9–10 Chemistry, then Physics templates on 1b foundations | Chemistry notation stricter first |
| 4 | Learner pilot (phones/laptops) on Learn + personal board | Validate before live class complexity |
| 5 | Classroom board pack: local-first hub, `/join` votes/answers, planner, school admin | Reuses board-core; minimal student data |
| 6 | Classroom pilot in a few schools | Measure recognition errors and unused chips |
| 7 | Class 11–12 Mathematics | Calculus lab, 3D, vectors |
| 8 | Class 11–12 Physics | Mechanics → EM/optics → modern |
| 9 | Class 11–12 Chemistry | Physical chemistry → organic mechanisms |
| 10 | Classes 6–8 foundation (+ other subjects later) | Extends reach; reuses engines |
| Ongoing | Free-hand recognition, richer offline models, regional languages / handwriting, content authoring at scale | Behind stable simulators and pilots |

## Phase 0 exit criteria (spikes)

- Pen-to-ink latency measured ≤ 16 ms on at least one mid-range tablet target  
- Offline degraded path documented and spiked: cached manifests/engines; recognition fails closed with a clear message  
- Golden-set schema and licensing notes for NCERT / past-paper sources  
- Inventory phase numbers aligned with this plan; syllabus-year validation process recorded  

## Phase 1 exit criteria (platform)

- `/learn/[topicId]` usable at 360px and 1280px  
- `/board` personal blackboard: ink, chips (confirm-to-open, never auto-act), AI on/off, widget host, undo for AI actions  
- Faithful transcription: recognition does not silently rewrite strokes  
- Pointer + keyboard parity for sliders, drags, value entry, chip confirm  
- Variable/unit model with dimension check  
- One sample widget from each engine stub (graph, scene, molecule)  
- Chapter manifest loader (no hardcoded chapter UI)  

## Phase 1b exit criteria (physics foundations)

- Shared scene-description type used by the scene stub  
- Assumption banner present on physics scene widgets  
- Closed-form verification helper wired for at least one textbook identity  
- Units/dimension checker reused from Phase 1 base  

## Phase 2–3 exit criteria (board-exam core)

- All Class 9–10 maths chapters ship under the topic schema ship gate  
- Teacher-private equivalence checking available on algebra Solve paths  
- Chemistry and Physics Class 9–10 slices as in the web plan  
- Golden tests green for shipped NCERT worked examples (solution correctness 100% on verified set)  
- Step templates localised for `en` and `hi` on shipped Solve paths  
- Practice + personal progress for shipped topics  

## Phase 5 exit criteria (classroom)

- Teacher `/class/board` projection-ready with live chips and assumption banner  
- Local-first hub path for `/join` Predict votes and Check-it on student phones  
- Lesson planner sequence + class replay/notes  
- School-scoped weak-topic report; minimal student PII; DPDP settings on `School`  

## Accuracy rules

1. CAS / simulators / curated DBs are source of truth; AI explains only.  
2. Two-path checks; disagreement warns and withholds the answer.  
3. Golden set from NCERT examples/exercises + recent CBSE papers (licensed); grow toward thousands across chapters.  
4. Measure recognition, solution correctness, and step-format conformance separately (see Product laws).  
5. Out-of-scope honesty — if not confident, say so.  
6. Assumptions always visible on screen.

## Honest limits

- Messy handwriting, hand-drawn circuits and organic structures take longest → templates/toolbars first.  
- Quantum ideas and organic mechanisms need teacher review before release.  
- Curriculum drift → content as data.  
- Syllabus lists must be re-validated every phase.  
- Low-end phones may use server engine fallback for heavy WASM.  
- Always-online cloud recognition is not assumed; offline degraded mode is required for school reality.  
- Business model and school onboarding are product/ops concerns outside this engineering spine unless explicitly scoped.

## Web application

Learn, personal blackboard, and classroom board architecture: [`architecture/web-app.md`](./architecture/web-app.md).

## Immediate next engineering work

1. Complete Phase 0 spikes (latency, offline degrade, golden-set/licensing notes) alongside remaining scaffold polish.  
2. Finish Phase 1: Learn shell + personal board-core + input-kit + manifests + faithful transcription / confirm-to-open.  
3. Run Phase 1b physics foundations in parallel (units, scene description, assumption banner, verification harness).  
4. First verticals: **Class 10 Quadratic Equations** and **Class 10 Chemical Reactions and Equations**.  
5. Golden-test harness for those chapters; teacher-private equivalence on quadratic Solve.  
6. Expand Class 9–10 maths; add local-first classroom pack after learner pilot.
