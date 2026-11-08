# ClassOS web application plan

Student-first progressive web app for CBSE Mathematics, Physics and Chemistry. Learners use it alone on a **phone or laptop**, with the same topics working under **touch and non-touch** (mouse + keyboard) input. Classroom projection and live teacher-board mode are out of scope for this plan.

Related: [`../PRODUCT_PLAN.md`](../PRODUCT_PLAN.md) · [`engines.md`](./engines.md) · [`../curriculum/topic-schema.md`](../curriculum/topic-schema.md)

## Product thesis (web)

A student opens a topic, explores a verified interactive demo, predicts outcomes, changes values, walks CBSE-style steps, and checks understanding — on the device they already have. Engines calculate; the AI explains. Nothing “clever” runs until the student chooses it.

## Devices and input

| Device | Layout | Primary input | Also supported |
| --- | --- | --- | --- |
| Phone (portrait) | Single column: demo → controls → steps | Touch (tap, drag, pinch-zoom where needed) | Bluetooth keyboard |
| Tablet | Prefer split when wide enough | Touch + optional stylus | Mouse if attached |
| Laptop / desktop | Split: interactive stage + side panel | Mouse + keyboard | Trackpad gestures |

### Input contract (mandatory)

All interactive widgets use a **pointer-agnostic layer** (Pointer Events): one code path for finger and mouse.

| Action | Touch | Mouse / keyboard |
| --- | --- | --- |
| Select control | Tap | Click |
| Change a value | Slider / stepper / keypad sheet | Slider, scroll wheel, or typed field |
| Drag a point / object | One-finger drag | Click-drag |
| Pan / zoom stage | Pinch + two-finger pan | Scroll wheel / trackpad + optional buttons |
| Enter maths / chem | Template chips + symbol keypad | Keyboard + LaTeX-friendly field |
| Draw (optional) | Finger / stylus ink | Mouse ink or skip drawing and use tools |
| Undo / modes | On-screen buttons | Buttons + shortcuts (`Z`, `1`–`6` for modes) |

**Rule:** every gesture that is required to complete a topic must have a non-touch equivalent. No feature may be touch-only or mouse-only.

Hit targets ≥ 44×44 CSS px on small screens. Dense desktop chrome is allowed only at `min-width` breakpoints.

## Product surfaces

| Surface | Purpose | Phase |
| --- | --- | --- |
| `/` | Home: continue learning, pick class/subject | W0 |
| `/learn/[topicId]` | Topic workspace (demo + modes + check) | W1 |
| `/browse` | Class → subject → chapter → topic index | W0 |
| `/practice/[topicId]` | Check-it / PYQ-style practice from board state | W2 |
| `/progress` | Personal weak topics and mastery (private to learner) | W4 |
| `/settings` | Language, input prefs, text size, reduced motion | W1 |
| `/author` | Internal manifests + golden fixtures | W0 (internal) |

Deep links are first-class: a topic URL must be openable on phone or laptop with no classroom code.

## Responsive information architecture

### Phone (stacked)

```
┌─────────────────────────┐
│ Topic title · mode tabs │
├─────────────────────────┤
│                         │
│   Interactive stage     │
│   (graph / sim / mol)   │
│                         │
├─────────────────────────┤
│ Controls / keypad       │
├─────────────────────────┤
│ Steps · Check · AI tip  │
└─────────────────────────┘
```

### Laptop (split)

```
┌──────────────────────────────────────────────────────┐
│ ClassOS · topic crumb · modes · settings             │
├────────────────────────────┬─────────────────────────┤
│                            │ Controls & values       │
│   Interactive stage        │ Derive / Solve steps    │
│                            │ Misconception card      │
│                            │ Check-it tray           │
└────────────────────────────┴─────────────────────────┘
```

## Core student flows

1. **Learn a topic** — Browse → See it → Predict (self: pick an outcome, then reveal) → Build it → Derive it → Solve it → Check it.  
2. **Quick practice** — Jump to Check-it / randomised numericals for a chapter.  
3. **Explore freely** — Open a widget from templates (graph, scene, molecule) without a guided path.  
4. **Resume** — Home shows last topic + incomplete Check-it sets.  
5. **Fix a stuck step** — Ask explain; answer must cite verified engine output.

Guided modes replace the old classroom “teacher taps chips” loop: the student advances mode tabs; optional ink/recognition is a power feature, not the default path on phones.

## Recommended stack

| Layer | Choice | Why |
| --- | --- | --- |
| App framework | Next.js (App Router) + TypeScript | SSR browse/SEO; client islands for topic workspace |
| UI | React + responsive tokens; mobile-first CSS | One codebase for phone and laptop |
| Input | Pointer Events + keyboard shortcuts map | Touch and mouse share behaviour |
| Stage | Canvas / WebGL where needed; DOM controls beside | Sims stay smooth; forms stay accessible |
| State | Zustand (topic session) + URL topic id | Shareable links; resume locally then sync |
| Maths CAS | SymPy WASM (lazy) | Exact results on-device when capable |
| Geometry | JSXGraph or equivalent | Drag points with pointer |
| Chemistry | RDKit.js + 3D viewer | Structures on phone with simplified chrome |
| Physics | TypeScript sims + light WebGL | Deterministic, testable |
| Heavy WASM fallback | Server engine API when device is low-end | Same answers; slower path OK |
| Explain | Server LLM + engine tools only | Narrates verified steps |
| Data | Postgres | Accounts, progress, attempts |
| Auth | Email / phone OTP or OAuth; learner account | Personal progress; DPDP-aligned |
| PWA | Installable; offline cached topics later | Phone home-screen use |
| Tests | Vitest golden fixtures + Playwright phone & desktop projects | Ship gate |

**Principle:** deterministic engines calculate; the LLM explains. On low-end phones, prefer server-side engine calls over shipping every WASM module up front.

## Runtime split

```
┌─────────────────────────────────────────────────────────┐
│ Student browser (phone or laptop)                       │
│  topic UI ← pointer/keyboard controls                   │
│  widgets ← local WASM/TS engines when available         │
│  two-path verify locally or via server engines          │
└───────────────────────────┬─────────────────────────────┘
                            │ progress, explain, heavy solve
                            ▼
┌─────────────────────────────────────────────────────────┐
│ Web API                                                 │
│  auth, manifests, progress, practice attempts           │
│  explain (LLM + step templates + engine tools)          │
│  engine fallback for low-end devices                    │
│  golden-test CI                                         │
└─────────────────────────────────────────────────────────┘
```

| Runs on device | Runs on server |
| --- | --- |
| Topic UI, controls, most interactions | Auth, progress sync, practice history |
| Light sims; cached WASM when installed | Heavy CAS/chem when client opts out / fails |
| Local draft progress | LLM explain bound to tool results |
| Manifest cache | Content publish + reaction knowledge base |

## Monorepo layout (proposed)

```
apps/
  web/                 # Next.js student app
packages/
  topic-ui/            # Responsive learn workspace shell
  input-kit/           # Pointer + keyboard bindings, keypad, sliders
  widgets/             # Graph, scene, molecule, assessment shells
  engines-math/        # CAS bridge, step templates, geometry
  engines-physics/     # Scene schema + simulators
  engines-chem/        # RDKit bridge, balancer, mechanisms, KB client
  curriculum/          # Manifests JSON
  golden-tests/        # NCERT/CBSE fixtures + runners
  ui/                  # Tokens, bilingual strings, breakpoints
```

## Data model (minimal)

| Entity | Key fields |
| --- | --- |
| `User` | id, language, grade, inputPrefs, locale |
| `ChapterManifest` | id, subject, classLevel, syllabusYear, topics[] |
| `TopicModule` | schema in `topic-schema.md` |
| `LearnSession` | userId, topicId, modeTimeline, widgetState |
| `PracticeAttempt` | userId, topicId, items, scores, deviceClass |
| `Progress` | userId, topicId, mastery, weakFlags (private) |
| `GoldenCase` | topicId, source, input, expected engine output |

## API sketch

| Method | Path | Role |
| --- | --- | --- |
| `GET` | `/api/manifests/:id` | Chapter/topic module |
| `GET` | `/api/topics` | Browse/filter index |
| `POST` | `/api/sessions` | Start/resume learn session |
| `PATCH` | `/api/sessions/:id` | Save workspace state |
| `POST` | `/api/explain` | Verified step narration |
| `POST` | `/api/engine/:name` | Optional server engine fallback |
| `POST` | `/api/practice` | Submit Check-it / numerical attempts |
| `GET` | `/api/progress` | Learner-scoped mastery |

## Non-functional requirements

| Concern | Target |
| --- | --- |
| Phone usability | Core Learn path usable in portrait at 360 CSS px width |
| Laptop usability | Split workspace from ~900 CSS px upward |
| Input parity | Every required action has touch and keyboard/mouse paths |
| Interaction | Controls respond &lt; 100 ms; sims target 30 fps on mid-range phones |
| Bundle | Topic route lazy-loads only needed engine; initial JS kept lean |
| Accessibility | Focus order, keyboard mode complete, captions, text size, reduced motion |
| Language | `en` + `hi` first |
| Privacy | Progress private to the learner (DPDP Act 2023); no classroom broadcast |
| Accuracy | Chapter ship gate = golden tests + subject-teacher pedagogy review |
| QA matrix | Playwright: Pixel-class phone + desktop Chrome for each shipped topic |

## Security & safety

- Chemistry refuses out-of-curriculum product prediction; hazardous demos virtual only.  
- LLM sandboxed to tool-verified answers.  
- Learner data isolated per account; optional parent/guardian view later.  
- Signed manifests in production.

## Web delivery phases

| Milestone | Delivers |
| --- | --- |
| **W0 – Skeleton** | Next.js app, browse index, responsive shell, auth stub |
| **W1 – Learn workspace** | `/learn/[topicId]` phone+laptop layouts, mode tabs, input-kit, 3 widget stubs |
| **W2 – Maths vertical** | Class 10 Quadratic Equations + CAS + golden CI + practice |
| **W3 – Chem vertical** | Class 10 Reactions + balancer + macro/particle/symbolic views |
| **W4 – Progress & polish** | `/progress`, Hindi, PWA install, low-end engine fallback |
| **W5 – Learner pilot** | Real students on phones and laptops; measure drop-off by mode/device |
| **W6+** | Class 9–10 breadth, then 11–12, physics depth, foundation 6–8 |

## Immediate implementation order

1. Scaffold `apps/web` with mobile-first `/browse` and `/learn/[topicId]` shells.  
2. Build `packages/input-kit` (pointer + keyboard parity for sliders, drags, keypads).  
3. Add `packages/curriculum` from inventory + topic schema.  
4. Widget host + stubs (graph, inclined plane, molecule) tested at 360px and 1280px.  
5. Class 10 Quadratics vertical with typed/coeff controls (ink optional).  
6. `/api/explain` stub + golden NCERT fixtures.  
7. Chemical Reactions vertical with the same responsive shell.

## Out of scope (this plan)

- Classroom live board, projector layouts, QR class join.  
- Teacher lesson planner as a primary surface.  
- Free-hand organic/circuit recognition as the default mobile path (templates first).  
- Biology and other subjects.  
- Automated theorem proving.
