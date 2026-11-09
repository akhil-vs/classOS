# ClassOS web application plan

Progressive web app for CBSE Mathematics, Physics and Chemistry with **three surfaces** that share the same engines and topic modules:

1. **Learn** — student self-study on phone or laptop (guided modes).  
2. **Blackboard (personal)** — freeform interactive board for one learner.  
3. **Classroom board** — teacher drives a projected/large board; students join on their devices for Predict votes and Check-it.

Touch and non-touch (mouse + keyboard) parity is mandatory on every surface.

Related: [`../PRODUCT_PLAN.md`](../PRODUCT_PLAN.md) · [`engines.md`](./engines.md) · [`../curriculum/topic-schema.md`](../curriculum/topic-schema.md)

## Product thesis (web)

What is written or entered is recognised; the board responds with a verified interactive demonstration; the student leaves with the misconception fixed. Concept before calculation. CAS, simulators and curated databases calculate; the AI explains and never invents answers. A human stays in control — recognition appears as chips and nothing opens unless the teacher or student confirms it.

Product laws (faithful transcription, suggest-only / no auto-act, teacher-private equivalence, offline degrade, local-first classroom): [`../PRODUCT_PLAN.md`](../PRODUCT_PLAN.md). Engine contracts: [`engines.md`](./engines.md).

## Product modes at a glance

| Mode | Primary user | Device | Board behaviour |
| --- | --- | --- | --- |
| Learn | Student | Phone / laptop | Guided See → Predict → Build → Derive → Solve → Check |
| Personal blackboard | Student | Phone / laptop / tablet | Freeform ink + templates + chips + widgets |
| Classroom board | Teacher (+ class) | Teacher laptop/tablet → projector or large panel; students on phones | Live shared board; AI chips; student `/join` for votes/answers |

Shared underneath: topic manifests, engines, misconception cards, golden tests, bilingual UI.

## Devices and input

| Device | Typical mode | Primary input | Also supported |
| --- | --- | --- | --- |
| Phone (portrait) | Learn, join classroom, light personal board | Touch | Bluetooth keyboard |
| Tablet | Personal board, Learn, teacher board | Touch + optional stylus | Mouse if attached |
| Laptop / desktop | Learn, personal board, teacher drive | Mouse + keyboard | Trackpad |
| Projector / large panel | Classroom board (display of teacher session) | Driven by teacher device | — |

### Input contract (mandatory)

All interactive widgets use a **pointer-agnostic layer** (Pointer Events): one code path for finger and mouse.

| Action | Touch | Mouse / keyboard |
| --- | --- | --- |
| Select control | Tap | Click |
| Change a value | Slider / stepper / keypad sheet | Slider, scroll wheel, or typed field |
| Drag a point / object | One-finger drag | Click-drag |
| Pan / zoom stage | Pinch + two-finger pan | Scroll wheel / trackpad + optional buttons |
| Enter maths / chem | Template chips + symbol keypad | Keyboard + LaTeX-friendly field |
| Draw on blackboard | Finger / stylus ink | Mouse ink; or skip ink and use insert tools |
| Confirm recognition chip | Tap chip | Click chip / Enter when focused |
| Undo / modes | On-screen buttons | Buttons + shortcuts (`Z`, `1`–`6` for modes) |

**Rule:** every gesture required to complete a topic or board action must have a non-touch equivalent. No feature may be touch-only or mouse-only for required paths.

Hit targets ≥ 44×44 CSS px on small screens. Classroom board chrome may be denser on large panels.

---

## 1. Learn (student self-study)

### Surfaces

| Surface | Purpose | Phase |
| --- | --- | --- |
| `/` | Home: continue learning, pick class/subject | W0 |
| `/browse` | Class → subject → chapter → topic | W0 |
| `/learn/[topicId]` | Guided topic workspace | W1 |
| `/practice/[topicId]` | Check-it / PYQ-style practice | W2 |
| `/progress` | Personal weak topics and mastery | W4 |
| `/settings` | Language, input prefs, text size | W1 |

### Layouts

**Phone (stacked)**

```
┌─────────────────────────┐
│ Topic title · mode tabs │
├─────────────────────────┤
│   Interactive stage     │
├─────────────────────────┤
│ Controls / keypad       │
├─────────────────────────┤
│ Steps · Check · AI tip  │
└─────────────────────────┘
```

**Laptop (split)**

```
┌──────────────────────────────────────────────────────┐
│ ClassOS · topic crumb · modes · settings             │
├────────────────────────────┬─────────────────────────┤
│   Interactive stage        │ Controls · steps · Check│
└────────────────────────────┴─────────────────────────┘
```

### Flows

1. Browse → See → Predict (self) → Build → Derive → Solve → Check.  
2. Quick practice with randomised numericals.  
3. Resume last topic from home.  
4. Ask explain; answer must cite verified engine output.

---

## 2. Blackboard — personal

Personal freeform board for homework, revision, and open exploration. Same ink/widget stack as the classroom board, without live class sync.

### Surfaces

| Surface | Purpose | Phase |
| --- | --- | --- |
| `/board` | Personal interactive blackboard | W1 |
| `/board?topic=` | Board preloaded with a topic’s templates/widgets | W2 |
| `/replay/:id` | Replay of a saved personal board session | W4 |

### Layout

```
┌──────────────────────────────────────────────────────┐
│ ClassOS board     modes · units · AI: on/off · save  │
├──────────┬───────────────────────────────────────────┤
│ Tool rail│           Board surface                   │
│ pen      │  ink + live widgets + assumption banner   │
│ select   │                                           │
│ templates│     [ suggestion chips near strokes ]     │
│ overlays │                                           │
└──────────┴───────────────────────────────────────────┘
│ Topic (optional) · misconception · Check-it tray     │
└──────────────────────────────────────────────────────┘
```

On phones: tool rail collapses to a bottom sheet; chips stack above the tray; templates preferred over long freehand.

### Behaviour

- **AI on:** ink/typed input → recognition chips (suggest / preview only) → student confirms → widget/solver opens. Never auto-act; never silently rewrite strokes (faithful transcription).  
- **AI off (plain board):** ink and manual template insert only; no chips — always one control away.  
- **Persistent tools:** pen, eraser, colour, undo stay reachable; undo covers AI chip accept/reject as well as ink.  
- **Show the law:** governing formula overlay with live substituted values.  
- **Reactive links:** when a constant drives a plot or result, show a thin connector or coloured halo; unlink / freeze available; cycle and unit mismatches show a clear message.  
- **Misconception cards:** optional side card when a known error pattern is detected or topic is linked.  
- **Teacher-private equivalence (classroom / teacher role):** CAS “line N does not follow from line N−1” appears on a private channel only — never as public-board annotations.  
- **Record:** stroke + widget timeline for later replay and notes.  
- **Correction loop:** wrong recognition fixed in one tap/click; improves that user’s future chips.  
- **Offline degrade:** cached manifests and on-device engines keep widgets/Solve usable; if recognition is unavailable, show an explicit message and keep plain board + templates working.

### Flows

1. Open blank board → write `x^2-5x+6=0` or insert quadratic template → confirm chip → graph + solve path.  
2. Start from a Learn topic → “Open on board” carries widget state into freeform mode.  
3. Save / replay a revision session.

---

## 3. Classroom board

Teacher-led live board for a real class. Reuses the personal blackboard engine; adds session sync, projection layout, and student join. Prefer a **local-first hub**: the teacher device hosts the live session on the classroom network; `/join` carries only votes and Check-it answers until post-pilot cloud sync.

### Surfaces

| Surface | Purpose | Phase |
| --- | --- | --- |
| `/class/board` | Teacher classroom blackboard (projection-ready) | W5 |
| `/class/plan` | Lesson planner: chapter → suggested mode sequence | W5 |
| `/join/:code` | Student join (QR / code) for Predict votes and Check-it | W5 |
| `/class/replay/:id` | Class session replay + auto notes for absentees | W5 |
| `/school` | School admin: classes, teachers, privacy-safe reports | W5 |

### Classroom layout (teacher → projector)

```
┌──────────────────────────────────────────────────────┐
│ ClassOS · class chip · modes · units · AI · end live │
├──────────┬───────────────────────────────────────────┤
│ Tool rail│     Full-bleed board (1080p–4K)           │
│          │  ink + widgets + assumption banner        │
│          │  [ chips — teacher must confirm ]         │
└──────────┴───────────────────────────────────────────┘
│ Live: N joined · Predict open · Check-it summary     │
└──────────────────────────────────────────────────────┘
```

Student `/join` on phones: compact vote / answer UI only — not a second full board unless the teacher pushes “open on student devices.”

### Classroom behaviour

1. **Scene / ink pipeline** — teacher writes or picks a template; system builds board state; simulators/CAS respond.  
2. **Teacher in control** — chips beside writing; nothing opens unless tapped/clicked (suggest-only; no auto-act).  
3. **Predict** — board freezes; students vote via `/join` (or hands-up); then reveal.  
4. **Assumption banner** — textbook idealisations visible; teacher can toggle realism.  
5. **Blackboard-only** — AI layer off for a plain teaching board.  
6. **Record and replay** — strokes, widgets, optional voice → class notes + absentee replay.  
7. **Recognition correction** — one-tap fix; teacher-specific improvement over time.  
8. **Weak-topic report** — per student/class, private to the school (DPDP Act 2023); keep student PII minimal.  
9. **Local-first hub** — teacher device is the session hub; defer full student board sync and heavy accounts until after classroom pilot.

### Classroom flows

1. Lesson planner → start live board → teach with See/Predict/Build/Derive/Solve/Check.  
2. Students scan QR → vote on Predict → receive pushed Check-it items.  
3. End class → replay link + notes for absentees.  
4. School admin reviews aggregate weak topics (not public leaderboards).

---

## Core shared flows (all modes)

| Flow | Learn | Personal board | Classroom |
| --- | --- | --- | --- |
| Guided modes | Primary | Optional when topic-linked | Teacher-led sequence |
| Freeform ink | Optional | Primary | Primary |
| Recognition chips | Rare (templates first) | Yes, confirm to open | Yes, teacher confirms |
| Predict | Self choose + reveal | Optional | Class vote via `/join` |
| Check-it | Personal practice | From board state | Pushed to joined devices |
| Explain (LLM) | Verified steps only | Verified steps only | Verified steps only |
| Replay | Session resume | Personal replay | Class replay + notes |

## Recommended stack

| Layer | Choice | Why |
| --- | --- | --- |
| App framework | Next.js (App Router) + TypeScript | SSR browse/school pages; client islands for board/learn |
| UI | React + responsive tokens | Phone Learn + large-panel classroom from one design system |
| Input | Pointer Events + keyboard map | Touch and mouse share behaviour |
| Board canvas | HTML Canvas / WebGL ink; React widget overlays | High-frequency strokes; widgets as portals |
| State | Zustand (session) + URL ids | Shareable Learn links; live class room state |
| Realtime | WebSocket / SSE for live class + `/join` | Predict votes, presence, pushed Check-it |
| Maths / Physics / Chem engines | SymPy WASM, TS sims, RDKit.js | Same engines in all three modes |
| Heavy WASM fallback | Server engine API | Low-end student phones |
| Recognition | On-device or edge ink → latex/chem/scene chips | Confirm-to-open only; offline may disable recognition |
| Explain | Server LLM + engine tools | Free-form only; CAS/sim result always shown beside; exam steps from localised templates |
| Data | Postgres | Users, schools, sessions, replays, reports |
| Auth | Learner accounts + teacher/school roles | DPDP-aligned |
| PWA | Installable student app | Home-screen Learn / join |
| Tests | Vitest goldens + Playwright phone, desktop, board | Ship gate |

**Principle:** deterministic engines calculate; the LLM explains. Classroom and personal boards share `board-core`; Learn reuses widgets without requiring ink.

## Runtime split

```
┌──────────────────────────┐  ┌──────────────────────────┐
│ Student phone / laptop   │  │ Teacher device (+ panel) │
│ Learn · personal /board  │  │ /class/board live        │
│ /join during class       │  │ chips confirm → widgets  │
└────────────┬─────────────┘  └────────────┬─────────────┘
             │                             │
             ▼                             ▼
┌─────────────────────────────────────────────────────────┐
│ Web API + realtime                                      │
│ auth · manifests · progress · class sessions            │
│ explain · engine fallback · golden CI · school reports  │
└─────────────────────────────────────────────────────────┘
```

| Runs on device | Runs on server |
| --- | --- |
| Learn UI, board ink, most CAS/sims | Auth, tenancy, replays, school reports |
| Local two-path checks when possible | Live class fan-out (when not on LAN hub); LLM explain |
| Manifest cache + offline PWA shell | Content publish; reaction KB |
| Personal board drafts | Aggregate weak-topic analytics |
| Classroom hub (teacher device) + `/join` votes | Optional cloud sync of class sessions after pilot |

## Monorepo layout (proposed)

```
apps/
  web/                 # Learn, personal board, classroom, school, author
packages/
  board-core/          # ink, chips, session timeline (personal + classroom)
  topic-ui/            # Guided Learn workspace shell
  input-kit/           # Pointer + keyboard bindings, keypad, sliders
  widgets/             # Graph, scene, molecule, assessment shells
  class-live/          # Live session, /join protocol, presence
  engines-math/
  engines-physics/
  engines-chem/
  curriculum/
  golden-tests/
  ui/
```

## Data model (minimal)

| Entity | Key fields |
| --- | --- |
| `School` | id, name, locale defaults, DPDP settings |
| `User` | id, role (learner/teacher/admin), schoolId?, language, inputPrefs |
| `ClassSection` | schoolId, grade, section, subject |
| `ChapterManifest` / `TopicModule` | see topic schema |
| `LearnSession` | userId, topicId, modeTimeline, widgetState |
| `BoardSession` | userId, mode (`personal`\|`classroom`), stroke/widget events |
| `LiveClass` | teacherId, classSectionId, joinCode, boardSessionId, status |
| `JoinPresence` | liveClassId, studentId, votes, checkAnswers |
| `Replay` | sessionId, events, notesMd |
| `RecognitionCorrection` | userId, inkFeatures, correctedIntent |
| `PracticeAttempt` / `Progress` | learner-scoped |
| `GoldenCase` | topicId, source, expected engine output |

Board state is event-sourced (ink + widget ops) so personal and class replay stay tractable.

## API sketch

| Method | Path | Role |
| --- | --- | --- |
| `GET` | `/api/manifests/:id` | Chapter/topic module |
| `GET` | `/api/topics` | Browse index |
| `POST` | `/api/sessions` | Learn or board session |
| `PATCH` | `/api/sessions/:id` | Checkpoint timeline |
| `POST` | `/api/explain` | Verified narration |
| `POST` | `/api/recognize` | Optional ink recognition |
| `POST` | `/api/engine/:name` | Low-end engine fallback |
| `POST` | `/api/practice` | Check-it attempts |
| `GET` | `/api/progress` | Learner mastery |
| `POST` | `/api/class/live` | Start classroom session + join code |
| `POST` | `/api/join/:code/vote` | Predict vote |
| `POST` | `/api/join/:code/answer` | Check-it answer |
| `GET` | `/api/replays/:id` | Personal or class replay |
| `GET` | `/api/reports/weak-topics` | School-scoped teacher/admin |

## Non-functional requirements

| Concern | Target |
| --- | --- |
| Phone Learn | Usable in portrait at 360 CSS px |
| Laptop Learn / personal board | Split or tool-rail layout from ~900 CSS px |
| Classroom panel | 16:9 / 16:10; scales to 1920×1080 minimum |
| Input parity | Required actions work touch and mouse/keyboard |
| Ink latency | &lt; 16 ms pen-to-ink on mid-range tablets (personal + classroom); separate from recognition RTT |
| Offline | Degraded mode: cached manifests/engines; plain board + templates; recognition fails closed with a message |
| Join latency | Vote appears on teacher board &lt; 1 s on school Wi-Fi / LAN hub |
| Bundle | Lazy engines per subject; lean Learn first paint |
| Accessibility | Focus order, keyboard-complete Learn, captions, text size |
| Language | `en` + `hi` first (UI + step templates); regional handwriting later |
| Privacy | Learner progress private; class reports school-only (DPDP); minimal student PII on `/join` |
| Accuracy | Split gates: recognition / solution correctness / step-format; goldens + subject-teacher review |
| QA matrix | Playwright: phone, desktop, and board projection width; panel/vendor touch-frame matrix later |

## Security & safety

- Recognition never mutates the board without explicit confirm (student or teacher); no auto-act.  
- Faithful transcription: never silently correct ink.  
- Equivalence failures stay teacher-private.  
- Chemistry refuses out-of-curriculum products; hazardous demos virtual only.  
- LLM sandboxed to tool-verified answers; exam steps from localised templates only.  
- School data isolation; no cross-school leakage.  
- Join codes expire with the live session; students cannot drive the teacher board by default.

## Web delivery phases

Aligns with [`../PRODUCT_PLAN.md`](../PRODUCT_PLAN.md) Phases 0–10 (calendar weeks are indicative engineering slices, not a substitute for the product phase table).

| Milestone | Delivers |
| --- | --- |
| **W0 – Spikes + skeleton** | Latency / offline degrade spikes; Next.js app, browse, auth stub, manifest loader |
| **W1 – Learn + board base (+ 1b)** | `/learn`, `/board` ink+chips+widget host, input-kit, 3 stubs, AI on/off, units + scene foundations |
| **W2 – Maths vertical** | Class 10 Quadratics on Learn + board; CAS; teacher-private equivalence; golden CI; practice |
| **W3 – Chem vertical** | Class 10 Reactions; balancer; linked views |
| **W4 – Progress & personal replay** | `/progress`, Hindi step templates, PWA offline shell, personal `/replay`, low-end fallback |
| **W5 – Classroom pack** | `/class/board`, `/class/plan`, local-first `/join`, school admin, class replay |
| **W6 – Pilots** | Learner pilot (phones/laptops) + classroom pilot in a few schools |
| **W7+** | Class 9–10 breadth, then 11–12, physics depth, foundation 6–8 |

## Immediate implementation order

1. Phase 0 spikes: pen latency, offline degrade, golden-set/licensing notes.  
2. Scaffold polish: `/browse`, `/learn/[topicId]`, `/board`.  
3. `packages/input-kit` + `board-core` (ink, chips, AI on/off, faithful transcription) shared by personal board.  
4. Phase 1b in parallel: units, scene description, assumption banner, verification harness.  
5. `packages/curriculum` from inventory + topic schema.  
6. Widget stubs on both Learn and Board at 360px and 1280px (and 1920 width smoke test).  
7. Class 10 Quadratics vertical (typed controls + optional ink + equivalence).  
8. Explain stub + NCERT goldens (localised step templates).  
9. Chemical Reactions vertical.  
10. Only after W4: local-first classroom (`class-live`, `/join`, projection chrome).

## Out of scope for early milestones

- Free-hand organic/circuit recognition as the default phone path (templates first).  
- Biology and other subjects.  
- Automated theorem proving.  
- Students remotely controlling the teacher’s live board (view/vote/answer only unless teacher enables).  
- Cloud-scale student board sync before classroom pilot.  
- Auto-act recognition (chips may auto-*suggest* only).
