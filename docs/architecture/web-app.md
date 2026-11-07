# ClassOS web application plan

Browser-first interactive blackboard for classroom projection and teacher devices, with a later student-device layer. This plan maps the product roadmap onto a concrete web architecture.

Related: [`../PRODUCT_PLAN.md`](../PRODUCT_PLAN.md) · [`engines.md`](./engines.md) · [`../curriculum/topic-schema.md`](../curriculum/topic-schema.md)

## Product surfaces

| Surface | Primary user | Purpose | Phase |
| --- | --- | --- | --- |
| `/board` | Teacher | Full-bleed interactive blackboard (ink, widgets, chips, modes) | 1 |
| `/plan` | Teacher | Lesson planner: chapter → suggested See/Predict/Derive/Solve/Check sequence | 2 |
| `/replay/:id` | Teacher / absent student | Recorded stroke + widget + voice replay and auto class notes | 2–4 |
| `/join/:code` | Student device | QR join for predict votes and Check-it answers | 4+ |
| `/school` | School admin | Classes, teachers, privacy-safe weak-topic reports | 4+ |
| `/author` | Internal | Chapter manifest + golden-test authoring | 1 (internal) |

Classroom default: teacher laptop/tablet drives a projector or large panel. The board UI is **panel-first** (1080p–4K), touch + stylus, with a compact laptop chrome for tools.

## Recommended stack

| Layer | Choice | Why |
| --- | --- | --- |
| App framework | Next.js (App Router) + TypeScript | SSR for auth/school pages; client islands for the board |
| UI | React + CSS modules / design tokens | Large-panel layout control; avoid heavy dashboard chrome on `/board` |
| Board canvas | HTML Canvas / WebGL for ink; React portals for widgets | High-frequency stroke path; widgets as overlays |
| State | Zustand (board session) + URL lesson params | Fast local board state; shareable lesson deep-links |
| Maths CAS | SymPy compiled to WASM (Pyodide or dedicated build) | Exact arithmetic in-browser; AI never calculates |
| Geometry | JSXGraph or custom constraint layer | Drag-invariant figures |
| Chemistry | RDKit.js (WASM) + 3D viewer (3Dmol.js / mol\* ) | Structures, masses, depiction |
| Physics sims | TypeScript engines (RK4, MNA) + WebGL overlays | Deterministic, golden-testable |
| Recognition | On-device or edge model for ink → latex/chem/scene chips | Suggestions only; teacher confirms |
| Explain layer | Server LLM with tool calls into verified engines | Phrases steps from templates; never invents numeric results |
| API / data | Next.js route handlers + Postgres | Schools, lessons, replays, reports |
| Auth | School SSO / email magic link; role: teacher, admin, student | DPDP-aligned access |
| Realtime (later) | WebSocket / SSE for `/join` votes | Classroom predict mode |
| Tests | Vitest + Playwright; golden JSON fixtures per NCERT example | Ship gate |

**Principle:** compute that must be correct runs in **deterministic engines** (client WASM/TS or audited server). The LLM only selects templates, narrates, and proposes chips.

## Runtime split

```
┌─────────────────────────────────────────────────────────┐
│ Teacher browser                                         │
│  ink capture → recognition chips (opt-in)               │
│  topic widgets ← CAS / geometry / scene / RDKit WASM    │
│  two-path verify (symbolic + numeric) locally when possible │
└───────────────────────────┬─────────────────────────────┘
                            │ lesson save, explain, replay
                            ▼
┌─────────────────────────────────────────────────────────┐
│ Web API                                                 │
│  auth, manifests CDN, lesson/replay store               │
│  explain endpoint (LLM + step templates + engine tools) │
│  golden-test CI runner                                  │
│  reaction knowledge base / PYQ bank (read-only to client)│
└─────────────────────────────────────────────────────────┘
```

| Runs in browser | Runs on server |
| --- | --- |
| Ink, widgets, most CAS/solve, sims, molecule view | Auth, school tenancy, replays, weak-topic reports |
| Local two-path checks for interactive edits | LLM explanation with tool-verified answers |
| Chapter manifests cached from CDN | Curated reaction DB writes; content publishing |
| Blackboard-only mode (fully offline-capable later) | Recognition model updates; analytics aggregates |

## Information architecture

### Board layout (single composition)

```
┌──────────────────────────────────────────────────────┐
│ Brand / class chip          modes  units  AI: on/off │
├──────────┬───────────────────────────────────────────┤
│ Tool rail│           Full-bleed board surface        │
│ pen      │  ink + live widgets + assumption banner   │
│ select   │                                           │
│ templates│     [ suggestion chips near strokes ]     │
│ overlays │                                           │
└──────────┴───────────────────────────────────────────┘
│ Lesson topic · misconception card · Check-it tray    │
└──────────────────────────────────────────────────────┘
```

No dashboard chrome on the teaching surface. Planner and reports live on separate routes.

### Core user flows

1. **Teach** — open lesson from planner → write → tap chip → widget opens in mode See/Build → Derive/Solve → Check.
2. **Blackboard only** — AI layer off; plain ink + manual widget insert from templates.
3. **Predict** — freeze sim → students vote on `/join` or hands-up → reveal.
4. **Replay** — export strokes + widget timeline + optional voice → share link.
5. **Correct recognition** — one-tap fix; store teacher-specific correction for future chips.

## Monorepo layout (proposed)

```
apps/
  web/                 # Next.js: board, plan, join, school, author
packages/
  board-core/          # ink engine, chip UI, session model
  widgets/             # graph, scene, molecule, assessment shells
  engines-math/        # CAS bridge, step templates, geometry
  engines-physics/     # scene schema, RK4, circuits, optics
  engines-chem/        # RDKit bridge, balancer, mechanisms, KB client
  curriculum/          # manifests JSON (from docs/curriculum)
  golden-tests/        # NCERT/CBSE fixtures + runners
  ui/                  # shared tokens, bilingual strings
```

## Data model (minimal)

| Entity | Key fields |
| --- | --- |
| `School` | id, name, locale defaults, DPDP settings |
| `User` | id, schoolId, role, language |
| `ClassSection` | schoolId, grade, section, subject |
| `ChapterManifest` | id, subject, classLevel, syllabusYear, topics[] |
| `TopicModule` | schema in `topic-schema.md` |
| `LessonSession` | teacherId, topicId, boardState blob, mode timeline |
| `Replay` | sessionId, strokeEvents, widgetEvents, notesMd |
| `RecognitionCorrection` | teacherId, inkFeatures, correctedIntent |
| `AssessmentAttempt` | studentId?, sessionId, items, scores (school-private) |
| `GoldenCase` | topicId, source (NCERT/CBSE), input, expected engine output |

Board state is an event-sourced timeline (ink + widget ops) so replay and sync stay tractable.

## API sketch

| Method | Path | Role |
| --- | --- | --- |
| `GET` | `/api/manifests/:id` | Load chapter/topic module |
| `POST` | `/api/sessions` | Create lesson session |
| `PATCH` | `/api/sessions/:id` | Persist board timeline checkpoints |
| `POST` | `/api/explain` | LLM narration bound to engine tool results |
| `POST` | `/api/recognize` | Optional server/edge ink recognition |
| `POST` | `/api/join/:code/vote` | Predict-mode votes |
| `GET` | `/api/replays/:id` | Replay payload |
| `GET` | `/api/reports/weak-topics` | Admin/teacher, school-scoped |

`/api/explain` contract: client sends board state + requested template id; server may call the same deterministic solvers; response is prose + structured steps already verified.

## Non-functional requirements

| Concern | Target |
| --- | --- |
| Board interaction | Ink latency &lt; 16 ms on mid-range classroom tablets |
| Widget open | &lt; 300 ms after chip tap for cached engines |
| WASM load | Lazy per subject; show progress; cache via service worker later |
| Projection | 16:9 and 16:10; UI scales to 1920×1080 minimum |
| Accessibility | Colour-blind-safe palettes, large text, captions, read-aloud |
| Language | `en` + `hi` UI and explanations first; bilingual numerals toggle |
| Privacy | Student analytics private to school; DPDP Act 2023 |
| Accuracy | Chapter ship gate = golden tests + teacher review |
| Offline (later) | Cached manifests + WASM engines for blackboard-only |

## Security & safety

- Teacher confirmation required before any recognition result mutates the board.
- Chemistry refuses out-of-curriculum product prediction; hazardous demos are virtual only.
- LLM sandboxed: no raw calculator path; only tool outputs may appear as answers.
- School data isolation; no cross-school report leakage.
- Content publishing is signed; clients verify manifest integrity in production.

## Web delivery phases (mapped to product phases)

| Web milestone | Delivers | Product phase |
| --- | --- | --- |
| **W0 – Skeleton** | Next.js app, `/board` blank ink, auth stub, manifest loader | 1 start |
| **W1 – Board base** | Chips, widgets host, units, AI on/off, sample graph/scene/molecule stubs | 1 |
| **W2 – Maths vertical** | Class 10 Quadratic Equations module + CAS + golden tests in CI | 2 start |
| **W3 – Chem vertical** | Class 10 Reactions module + balancer + beaker views | 3 start |
| **W4 – Classroom pack** | Lesson planner, replay, Class 9–10 maths breadth | 2–3 |
| **W5 – Pilot** | `/join` votes, school admin, Hindi pack, telemetry for unused chips | 4 |
| **W6+** | 11–12 engines, physics depth, mechanisms, foundation 6–8 | 5–8 |

## Immediate implementation order

1. Scaffold `apps/web` with `/board` full-bleed ink surface and tool rail.  
2. Add `packages/curriculum` consuming `docs/curriculum/inventory.json` + topic schema.  
3. Implement widget host + three stubs (function graph, inclined-plane scene, molecule).  
4. Wire SymPy WASM for the quadratic reference topic.  
5. Add `/api/explain` stub that only returns template steps for verified CAS output.  
6. Stand Vitest golden fixtures for NCERT Class 10 Quadratic worked examples.  
7. Repeat pattern for Chemical Reactions balancer.

## Out of scope for first web MVP

- Free-hand organic structure and circuit recognition (toolbars/templates only).  
- Student accounts depth beyond ephemeral `/join` codes.  
- Biology and other subjects.  
- Fully offline PWA (design for it; ship online-first).  
- Automated theorem proving.
