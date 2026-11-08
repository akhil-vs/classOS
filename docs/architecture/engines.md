# ClassOS Engine Requirements

Source of truth for calculations and simulations: CAS, physics simulators, and curated chemistry databases. The AI layer explains and never invents numerical results.

## Shared platform base (Phase 1)

| Capability | Requirement |
| --- | --- |
| Input parity | Pointer Events + keyboard: every required action works on touch and on mouse/keyboard |
| Board core | Shared ink + recognition chips + widget host for personal `/board` and classroom `/class/board` |
| Optional ink on Learn | Finger/stylus/mouse drawing optional; templates and typed entry default on phones |
| Confirm-to-open | Recognition chips never open a widget until the student or teacher confirms |
| Widget framework | Reusable interactive modules (graphs, scenes, molecule views, assessment cards) |
| Variables + units | Every quantity carries units; dimension checker for formula validation |
| Modes | See it → Predict → Build it → Derive it → Solve it → Check it (self-paced or teacher-led) |
| Content as data | Chapter manifests update without code changes |
| Device fallback | Heavy WASM may run on server for low-end phones; answers must match on-device engines |

## Mathematics engine

| Component | Approach |
| --- | --- |
| Exact algebra | Browser CAS (SymPy/WASM) for exact arithmetic, solving, calculus, matrices |
| Step generator | Rule-based CBSE-style templates reviewed by CBSE subject teachers; AI only phrases steps |
| Dynamic geometry | Constraint solver so dragged figures keep relations (JSXGraph or similar) |
| Two-path verification | Symbolic + numerical check; disagreement flagged, not shown as truth |
| Proof support | Line-by-line algebraic validity checking; no full automated theorem proving |

## Physics engine

| Domain | Approach |
| --- | --- |
| Pipeline | Scene builder → shared scene description → simulator → overlays |
| Mechanics | Custom RK4 for textbook accuracy; rigid-body only when needed |
| Circuits | Modified nodal analysis; RC/LR transient; phasors for AC |
| Fields | GPU grid computation for E/B/potential maps |
| Optics | Analytic ray tracing; numerical wave computation for interference/diffraction |
| Thermo / kinetic theory | Particle simulation + analytic curves shown together |
| Verification | Simulation checked against closed-form formula within tolerance |
| Practicals | NCERT virtual procedures with readings, graphs, error discussion |

Physics board rules: assumption banner (frictionless, ideal string, etc.), force/energy/graph overlays toggle, units always visible.

## Chemistry engine

| Component | Approach |
| --- | --- |
| Cheminformatics | RDKit (WASM) for structures, formulas, masses, substructure match; name-to-structure |
| Rendering | 3D molecule/orbital viewer + 2D bond-line depiction |
| Balancing / stoichiometry | Exact rational arithmetic only |
| Physical chemistry | Shared with maths/physics engines (rate laws, Nernst, gas laws, thermo cycles) |
| Safety / scope | Refuse products outside curated curriculum DB; hazardous demos virtual only |

### Cross-chapter chemistry tools

- Equation balancer (Class 9–12)
- Mole and stoichiometry calculator
- Molecule viewer
- Mechanism player (Class 11–12 organic)
- Named-reaction library (Class 12 organic)
- Virtual lab (NCERT practicals)
- Periodic table explorer

### Three linked views

Every substance switches between macroscopic (observation), particle, and symbolic (formula/equation). Tapping a species highlights it in all three.
