# ClassOS

Interactive CBSE Maths, Physics and Chemistry — **Learn** on phones/laptops, a **personal blackboard**, and a **classroom board** for live teaching.

Engines (CAS, simulators, curated databases) calculate; the AI explains and never invents answers. Touch and mouse/keyboard are both first-class.

## Critical path

**Platform → one maths vertical → one chem vertical → learner pilot → classroom → breadth.**

See [`docs/CRITICAL_PATH.md`](docs/CRITICAL_PATH.md). Do not pull deferred work (cloud sync, Devanagari ink, free-hand circuits/organics, marketplace) forward.

## Modes

| Mode | Who | What |
| --- | --- | --- |
| Learn | Student | Guided topic path on phone or laptop |
| Personal blackboard | Student | Freeform ink + widgets on their device |
| Classroom board | Teacher + class | Projected live board; students join to vote/answer |

## Quick start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

| Route | Purpose |
| --- | --- |
| `/` | Home / continue learning |
| `/browse` | Class → subject → chapter → topic |
| `/learn/[topicId]` | Guided Learn workspace |
| `/board` | Personal blackboard |
| `/progress` | Learner-pilot personal progress |
| `/class/board` | Classroom live pack (local-first) |
| `/join/[code]` | Student Predict vote |
| `/school` | School admin stub |
| `/settings` | Language / input prefs stub |
| `/author` | Internal manifest + ship-gate list |

```bash
pnpm test
pnpm --filter @classos/web build
```

## Monorepo

```
apps/web                 Next.js App Router
packages/board-core      Ink, chips, AI on/off, units, select, session timeline
packages/topic-ui        Guided Learn shell
packages/input-kit       Pointer + keyboard controls, QuantityField
packages/widgets         Graph, scene, molecule, quadratic, linear, geometry, balancer
packages/engines-math    Quadratic / linear / geometry + units + teacher equivalence
packages/engines-physics Inclined-plane scene + closed-form check (Phase 1b)
packages/engines-chem    Exact equation balancer
packages/class-live      Local-first live session + /join protocol
packages/curriculum      Inventory + topic manifests + ship gate
packages/golden-tests    NCERT fixtures for reference chapters
packages/ui              Tokens + shared chrome
```

## Planning docs

| Doc | Purpose |
| --- | --- |
| [`docs/CRITICAL_PATH.md`](docs/CRITICAL_PATH.md) | Ordered phases + defer list |
| [`docs/PRODUCT_PLAN.md`](docs/PRODUCT_PLAN.md) | Product and phased build plan |
| [`docs/curriculum/inventory.json`](docs/curriculum/inventory.json) | Topic/chapter inventory |
| [`docs/curriculum/topic-schema.md`](docs/curriculum/topic-schema.md) | Topic module data contract |
| [`docs/architecture/engines.md`](docs/architecture/engines.md) | Engine requirements |
| [`docs/architecture/web-app.md`](docs/architecture/web-app.md) | Learn + personal board + classroom web plan |
| [`docs/architecture/phase0-spikes.md`](docs/architecture/phase0-spikes.md) | Latency / offline / golden spikes |
| [`docs/architecture/licensing.md`](docs/architecture/licensing.md) | Third-party engine licensing notes |
| [`docs/ClassOS_Full_Topic-by-Topic_Plan_CBSE.pdf`](docs/ClassOS_Full_Topic-by-Topic_Plan_CBSE.pdf) | Source topic-by-topic plan |

Validate each chapter against the current CBSE syllabus before development starts.
