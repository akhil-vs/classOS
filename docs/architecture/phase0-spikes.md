# Phase 0 spikes (school de-risk)

Run **in parallel with Phase 1 wrap-up**. These spikes de-risk school pilots; they must not block UI work on a perfect handwriting corpus.

## 1. Pen latency ≤ 16 ms

**Target:** Pointer move → visible ink within 16 ms on a mid-range tablet (personal + classroom board).

**Spike approach (implemented in `board-core`):**

1. Coalesce pointer samples with `requestAnimationFrame` — never push every move into Zustand synchronously.
2. Draw the active stroke incrementally on the canvas; full redraw only when the stroke ends or selection changes.
3. Keep recognition off the hot path — chips appear on stroke end, never during move.

**Harness:** `packages/board-core/src/inkLatency.ts` exposes a sample buffer + `estimateLatencyMs` helper used by unit tests. Device measurement stays a manual pilot checklist item until Playwright tablet runs exist.

**Out of scope for Phase 0:** ML handwriting models, stylus tilt/pressure polish, Devanagari ink.

## 2. Offline degrade

**Target:** Learn shells and personal board drafts remain usable when school Wi‑Fi drops; engines that already run on-device keep answering.

**Spike approach:**

| Layer | Online | Offline degrade |
| --- | --- | --- |
| Browse / manifests | Network | Cache last-fetched manifests in IndexedDB (`packages/curriculum` cache helper) |
| Learn + board UI | Network first paint | Service worker precache of app shell (`apps/web/public/sw.js`) |
| Explain LLM | Server | Refuse politely — engines stay source of truth; no invented narration |
| Heavy WASM fallback | Server | Show “engine unavailable offline”; on-device CAS/balancer still run |

**Rule:** Never pretend cloud sync succeeded. Offline banner is mandatory when `navigator.onLine === false` or SW reports degraded mode.

**Out of scope:** Cloud student sync, multi-device merge, classroom live votes offline.

## 3. Golden / licensing notes

Goldens for reference chapters live in `packages/golden-tests`. Licensing constraints for future CAS/RDKit/WASM deps are recorded in [`licensing.md`](./licensing.md).

**Rule:** A chapter cannot move to `status: "shipped"` without green goldens + recorded syllabus validation + teacher review flags (see topic ship gate).
