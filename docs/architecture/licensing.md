# Licensing notes (Phase 0 spike)

ClassOS engines calculate; third-party libraries must stay compatible with school distribution (installable PWA, on-device WASM, optional server fallback).

## Current in-repo engines

| Component | Implementation | License posture |
| --- | --- | --- |
| Quadratic / linear CAS bridge | First-party TypeScript (`@classos/engines-math`) | Repo license; no third-party CAS yet |
| Units / dimensions | First-party TypeScript | Repo license |
| Equation balancer | First-party TypeScript (`@classos/engines-chem`) | Repo license |
| Inclined-plane closed form | First-party TypeScript (`@classos/engines-physics`) | Repo license |
| Golden fixtures | First-party NCERT-style representatives | Curriculum references only — not a verbatim textbook dump |

## Planned / future dependencies

| Dependency | Likely use | Notes before adopting |
| --- | --- | --- |
| SymPy (WASM / Pyodide) | Exact algebra beyond the TS bridge | BSD-3; bundle size + WASM load on low-end phones; keep server fallback parity |
| JSXGraph or similar | Dynamic geometry | License + accessibility review; templates first |
| RDKit.js | Structures, masses, substructure | BSD-style; WASM size; refuse out-of-curriculum products in our layer |
| 3D molecule viewer | Chem linked views | Prefer permissive licenses; no telemetry SDKs in school builds |
| LLM provider | Explain narration only | Vendor DPA for school data; never send answers that bypass engines |

## Hard rules

1. **Engines stay replaceable** — public TS APIs (`solveQuadratic`, `balanceEquation`, `solveIncline`, …) must not leak vendor types.
2. **No GPL in the student PWA hot path** without an explicit legal review recorded here.
3. **Curriculum text** — goldens cite NCERT/CBSE sources by id; do not paste copyrighted full solutions into the repo.
4. **School privacy** — learner progress is private; class reports school-scoped (DPDP Act 2023). Cloud sync stays deferred.

## Review checklist (before adding a WASM/CAS dep)

- [ ] License compatible with distribution model
- [ ] Bundle / lazy-load plan for Learn first paint
- [ ] On-device vs server fallback parity tested on one golden
- [ ] No phone-home / analytics in the engine build
- [ ] Entry added to this file
