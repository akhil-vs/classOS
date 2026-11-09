# ClassOS critical path

One-line rule: **Platform → one maths vertical → one chem vertical → learner pilot → classroom → breadth.**

Implement in this order. Do not pull deferred work forward.

## Ordered phases

| Order | Phase | Scope | Gate |
| --- | --- | --- | --- |
| 1 | **Phase 1 — platform base** | Ink, chips, Learn, personal board, units, manifests | Bottleneck. Everything else sits on this. |
| ‖ | **Phase 0 — school de-risk spikes** | Pen latency ≤16 ms, offline degrade, golden/licensing notes | Parallel with Phase 1 wrap-up only. Do not block UI on a perfect handwriting corpus. |
| 1b | **Phase 1b — thin physics** | Scene type + assumption banner + one closed-form check | While Phase 1 finishes. No full Physics sims. |
| 2 | **Phase 2 — maths vertical** | Quadratic (+ one linear/geometry slice) under ship gate; teacher-private equivalence | Vertical, not breadth. Class 9–10 inventory is the target, not the next sprint. |
| 3 | **Phase 3 — chem vertical** | Reactions balancer to the same bar as quadratic | Physics Class 9–10 only after 1b is real. |
| 4 | **Phase 4 — learner pilot** | Phones/laptops on Learn + personal board | Before any classroom infra. |
| 5 → 6 | **Classroom pack → school pilot** | Local-first `/join` classroom pack, then school pilot | After learner pilot evidence. |
| 7 → 10 | **Breadth** | Class 11–12 maths → physics → chem → 6–8 | Only after pilots show what teachers actually use. |

## Defer / ongoing (do not pull forward)

- Cloud student sync
- Devanagari handwriting
- Free-hand circuits / organics
- Content marketplace
- Panel-vendor matrix
- Business / onboarding

## Exit criteria pointers

- Phase 1: [`PRODUCT_PLAN.md`](./PRODUCT_PLAN.md) § Phase 1 exit criteria
- Ship gate: [`curriculum/topic-schema.md`](./curriculum/topic-schema.md) § Ship gate
- Phase 0 NFRs: [`architecture/web-app.md`](./architecture/web-app.md) · [`architecture/phase0-spikes.md`](./architecture/phase0-spikes.md)
- Licensing: [`architecture/licensing.md`](./architecture/licensing.md)
