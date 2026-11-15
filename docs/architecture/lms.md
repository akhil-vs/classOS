# ClassOS as a learning management system

Plan to grow ClassOS from a **local-first interactive board + Learn pilot** into a **school-grade LMS** with login, tenancy, and access restrictions — without abandoning the product thesis (engines calculate; AI explains; teacher/student confirm chips).

Related: [`../PRODUCT_PLAN.md`](../PRODUCT_PLAN.md) · [`../CRITICAL_PATH.md`](../CRITICAL_PATH.md) · [`web-app.md`](./web-app.md) · [`licensing.md`](./licensing.md)

**One-line rule for this track:** **Identity → school tenancy → roles → class membership → then cloud progress / live class auth.** Do not bolt accounts onto open teacher APIs first.

---

## Why this track exists

Phases 1–6 shipped Learn, personal board, local-first `/class/board` + `/join`, and device-local `/school` summaries. That is enough to validate pedagogy. It is **not** an LMS yet:

| Today | Gap for a proper LMS |
| --- | --- |
| No real login (settings auth stub) | Users, sessions, password/SSO, invite flows |
| `/class/board`, `/school`, `/author`, teacher APIs are open | Role checks on every sensitive route and API |
| Join uses free-text `studentLabel` | Bound identity (or short-lived guest tokens) |
| Progress / school summaries device-local | School-scoped Postgres; no cross-school leakage |
| In-memory live class store | Durable sessions tied to teacher + section |
| Anyone can hit `/api/teacher/equivalence` | Teacher-only, school-scoped |

This document is the **LMS + auth track**. Curriculum breadth (Phases 7–10) continues in parallel once pilots speak; LMS work unblocks shared progress, rostered classes, and real access control.

---

## Product shape (LMS)

ClassOS remains three learning surfaces, plus school administration:

```
┌─────────────────────────────────────────────────────────────┐
│ School tenancy (isolation boundary)                         │
│  Admin · Teachers · Students · Class sections · Roster      │
├───────────────┬─────────────────────┬───────────────────────┤
│ Learn         │ Personal /board     │ Classroom live        │
│ (student)     │ (student)           │ (teacher + /join)     │
├───────────────┴─────────────────────┴───────────────────────┤
│ Progress · Assignments · Reports (role-scoped)              │
└─────────────────────────────────────────────────────────────┘
```

| Persona | Primary jobs |
| --- | --- |
| **Student** | Sign in → continue Learn → personal board → join live class → see own progress |
| **Teacher** | Sign in → manage sections → start live board → review class weak topics → private equivalence |
| **School admin** | Provision school → invite teachers/students → assign classes → privacy-safe reports |
| **Platform author** (internal) | Ship-gate / manifests (`/author`) — not a school role |

**Deferred (still out of early LMS):** parent portals, marketplace, cross-school content, business billing UX.

---

## Roles and capabilities

### Role enum

| Role | Scope | Notes |
| --- | --- | --- |
| `platform_author` | Global (ClassOS ops) | Manifest / ship-gate tools |
| `school_admin` | One `schoolId` | Roster, teachers, DPDP settings, aggregate reports |
| `teacher` | One `schoolId` + section memberships | Classroom board, equivalence, class reports |
| `student` | One `schoolId` + section enrollments | Learn, board, own progress, join own class live |
| `guest_join` | Single live session token | Optional: Predict vote only; no progress; expires with session |

A user may hold **one school-scoped role** per school. Platform author is separate (staff accounts).

### Capability matrix (access restrictions)

| Capability | Student | Teacher | School admin | Guest join | Anonymous |
| --- | --- | --- | --- | --- | --- |
| Browse public curriculum index | ✓ | ✓ | ✓ | — | ✓ (read-only marketing/pilot) |
| `/learn`, `/board` with saved progress | ✓ | ✓ (preview) | — | — | Local-only draft optional |
| Own `/progress` | ✓ | — | — | — | — |
| Start/end `/class/board` live | — | ✓ | — | — | — |
| `/join` Predict / Check-it | ✓ (rostered) | — | — | ✓ limited | — (remove open label join) |
| Teacher equivalence API | — | ✓ | — | — | — |
| Class weak-topic report | — | ✓ (own sections) | ✓ (school) | — | — |
| `/school` admin UI | — | read limited | ✓ | — | — |
| `/author` ship gate | — | — | — | — | platform_author only |
| Invite / deactivate users | — | invite students to section* | ✓ | — | — |

\*Teachers may invite students **into sections they teach**, not create school-wide accounts unless admin allows.

### Hard rules

1. **School isolation** — every query filters by `schoolId` from the session; never trust a client-supplied school id alone.  
2. **Least privilege** — student tokens cannot call teacher or admin APIs.  
3. **No student scoreboards** — equivalence and peer vote maps stay teacher-private (existing product rule).  
4. **DPDP Act 2023** — learner progress private; class aggregates school-scoped; retention and export/delete on the school admin surface.  
5. **Join codes alone are not auth** — codes grant presence only after an authenticated student (or issued guest token) binds to the live session.  
6. **Offline Learn** — signed-in students may keep a local draft cache; sync is best-effort after LMS L2; never sync another user’s data onto the device.

---

## Authentication design

### Recommended stack

| Piece | Choice | Why |
| --- | --- | --- |
| App | Next.js App Router (existing) | Middleware + Route Handlers |
| Auth library | Auth.js (Auth.js / NextAuth v5) **or** Better Auth | Session cookies, credentials + OAuth providers |
| Session | HTTP-only secure cookie; server-side session store | No tokens in `localStorage` for roles |
| Password | Argon2id / bcrypt via auth lib | School email+password first |
| Later SSO | Google Workspace / Microsoft Entra OIDC | Indian school IT reality |
| DB | Postgres | Users, memberships, sessions, progress (as sketched in `web-app.md`) |
| Tenancy | `schoolId` on every membership row | Isolation boundary |

**Do not** invent a custom JWT-in-localStorage scheme. Keep engines and board-core auth-agnostic; enforce at the web API / middleware layer.

### Login surfaces

| Route | Purpose |
| --- | --- |
| `/login` | Email + password (and later SSO buttons) |
| `/login/invite/[token]` | Accept school / section invite → set password |
| `/logout` | End session |
| `/settings/account` | Language prefs + security (replace auth stub copy) |

Home (`/`) becomes role-aware: student continue-learning; teacher “open classroom”; admin “school”.

### Identity lifecycle

1. **School bootstrap** — platform creates `School` + first `school_admin` invite.  
2. **Teachers** — admin invites by email → teacher sets password → assigned to `ClassSection`s.  
3. **Students** — admin (or teacher) roster import / invites → student sets password → enrolled in sections.  
4. **Deactivate** — soft-disable login; retain academic records per school retention policy.  
5. **Delete / export** — school admin DPDP tools (export JSON; delete personal fields; keep anonymised aggregates if required).

### Guest join (transition only)

For the first classroom-with-auth release, allow **teacher-issued guest tokens** (QR embeds signed `guest` claim + `liveClassId` + expiry) so a phone without an account can still vote. Guests:

- Cannot open `/progress`, `/board` sync, or teacher APIs.  
- Appear on the roster as `Guest-N`, not as durable learners.  
- Vanish when the live session ends.

Target end-state: rostered students only; guests off by school policy default.

---

## Route and API access map

### Pages

| Route | Anonymous | Student | Teacher | School admin | Platform |
| --- | --- | --- | --- | --- | --- |
| `/`, `/browse` | Limited | ✓ | ✓ | ✓ | ✓ |
| `/learn/[topicId]`, `/board` | Optional local | ✓ | ✓ | — | ✓ |
| `/progress` | — | own | — | — | — |
| `/class/board`, `/class/plan` | — | — | ✓ | — | — |
| `/join/[code]` | — | ✓ / guest | — | — | — |
| `/school` | — | — | limited | ✓ | — |
| `/author` | — | — | — | — | ✓ |
| `/login`, invite | ✓ | — | — | — | — |

### APIs (enforce on every handler)

| Path | Allowed roles |
| --- | --- |
| `GET /api/topics`, `GET /api/manifests/:id` | Authenticated school members (anon read of shipped public pilot set optional) |
| `POST /api/explain` | Authenticated; rate-limited; no PII in prompts beyond topic state |
| `POST /api/sessions`, `PATCH /api/sessions/:id` | Owner student (or teacher preview) |
| `GET /api/progress` | Owner student |
| `POST /api/class/live` | Teacher (creates session bound to `teacherId` + optional `classSectionId`) |
| `GET /api/class/live?list=school` | School admin (full); teacher (own sessions) |
| `POST /api/join/:code/presence\|vote\|answer` | Student enrolled in section **or** valid guest token |
| `POST /api/teacher/equivalence` | Teacher |
| `GET /api/reports/weak-topics` | Teacher (section) / school admin (school) |
| Author / publish APIs | Platform author |

Middleware checklist for each protected handler:

1. Resolve session → user id + role + `schoolId`.  
2. Authorize capability.  
3. Load resource; assert `resource.schoolId === session.schoolId`.  
4. For student-owned resources, assert `resource.userId === session.userId`.

---

## Data model (LMS additions)

Extends the minimal model in [`web-app.md`](./web-app.md):

| Entity | Key fields | Purpose |
| --- | --- | --- |
| `School` | id, name, locale, dpdPFlags, guestJoinPolicy | Tenancy root |
| `User` | id, email, name, status | Global login identity |
| `Membership` | userId, schoolId, role | School-scoped role |
| `ClassSection` | schoolId, grade, section, subject, year | Teaching group |
| `SectionTeacher` | sectionId, userId | Who may start live for this section |
| `Enrollment` | sectionId, userId | Student roster |
| `Invite` | tokenHash, schoolId, role, sectionId?, expiresAt | Onboarding |
| `LiveClass` | + teacherId, schoolId, classSectionId | Replace label-only teacher |
| `JoinPresence` | + userId or guestId | Replace free-text label as primary key |
| `LearnSession` / `Progress` | userId, schoolId, topicId, … | Cloud progress (LMS L2+) |
| `Assignment` (L5) | sectionId, topicIds, dueAt | Homework / practice sets |
| `AuditLog` | actorId, schoolId, action, at | Admin-sensitive actions |

**Migration from pilot:** keep in-memory `class-live` behind a feature flag until `LiveClass` rows exist; map `teacherLabel` → authenticated teacher display name.

---

## Phased LMS delivery

Aligns after Phase 6 school pilot. Do **not** block curriculum breadth on finishing all LMS phases.

| Phase | Name | Delivers | Exit gate |
| --- | --- | --- | --- |
| **L0** | Auth foundation | `/login`, session middleware, `User` + password, role claim on session, protect `/author` + equivalence API | Unauthenticated calls to teacher/author APIs return 401/403 — **implemented** (`@classos/auth`, in-process store; Postgres in L1) |
| **L1** | School tenancy | `School`, `Membership`, school_admin invite, `/school` requires admin, teacher login | Two schools cannot see each other’s data in integration tests |
| **L2** | Student accounts + progress | Student invites, `/progress` server-backed, Learn session checkpoints | Student A cannot read student B progress |
| **L3** | Sections & roster | `ClassSection`, enrollments, teacher section list | Teacher only starts live for assigned sections |
| **L4** | Authenticated classroom | Live class bound to teacher+section; `/join` requires student or guest token; retire open label join | Presence list shows real roster names; forged join rejected |
| **L5** | Assignments | Section topic assignments, due dates, attempt linkage to Check-it | Student sees only own assignments |
| **L6** | Reports & DPDP | Weak-topic aggregates, export/delete, retention settings | Admin-only export; audit log for deletes |
| **L7** | School SSO | OIDC (Google/Microsoft), optional roster sync | Password login still works as fallback |

### Suggested engineering order (first slice)

1. Add Postgres + auth library; `User` / session tables.  
2. Next.js middleware: require auth for `/class/*`, `/school`, `/author`, `/progress`.  
3. Lock `POST /api/teacher/equivalence` and `POST /api/class/live` to `teacher`.  
4. Seed one demo school (admin, teacher, two students) for local `pnpm dev`.  
5. Replace `studentLabel` primary key with `userId` while keeping display name.  
6. Only then: cloud progress sync (lifts the old “defer cloud student sync” item under controlled tenancy).

---

## UX principles (keep ClassOS feel)

- Login is a **door**, not the product — after sign-in, land on Learn or Classroom, not a generic LMS dashboard wall.  
- First student viewport after login: brand + continue topic + one CTA (matches existing Learn home).  
- Teacher first viewport: start/resume live board for today’s section.  
- Do not turn `/` into a multi-widget admin dashboard.  
- Offline banner and PWA shell stay; auth errors get a clear “sign in to sync” path without blocking local practice drafts if school policy allows.

---

## Security & privacy checklist

- [ ] HTTP-only cookies; `Secure` + `SameSite` in production  
- [ ] CSRF protection on cookie sessions  
- [ ] Rate-limit login and `/api/explain`  
- [ ] Join code entropy + expiry with live session  
- [ ] Guest tokens signed, single-session, short TTL  
- [ ] School id on every multi-tenant query  
- [ ] Integration tests for vertical privilege escalation (student → teacher API)  
- [ ] No peer vote map on student snapshots (already true in `class-live`)  
- [ ] Explain prompts scrub roster PII  
- [ ] DPDP: lawful basis, retention, export, delete documented on `/school`

---

## Testing strategy

| Layer | What |
| --- | --- |
| Unit | Capability helper: `can(role, action, resource)` |
| Integration | API 401/403 matrix; cross-school IDOR attempts |
| E2E (Playwright) | Login → student Learn; login → teacher live → student join; admin cannot open `/author` |
| Pilot regression | Anonymous local Learn still works if school enables “open browse” |

---

## Relationship to critical path

| Critical path item | LMS impact |
| --- | --- |
| Phases 1–6 (done / piloting) | Pedagogy validated without accounts |
| “Defer cloud student sync” | **Superseded by L2+** under tenancy — sync only after L0–L1 |
| Phases 7–10 breadth | Independent of LMS; teachers still need login before multi-school pilots |
| Marketplace / parent views | Still deferred |

Update pointer: [`../CRITICAL_PATH.md`](../CRITICAL_PATH.md) lists this LMS track as the post-pilot platform layer.

---

## Immediate next docs / code (when implementation starts)

1. This file is the product + access contract.  
2. Implement L0 against the route/API tables above.  
3. Extend [`web-app.md`](./web-app.md) “Auth stub” language to “Auth per `lms.md`”.  
4. Keep `packages/class-live` protocol pure; pass authenticated ids from `apps/web` route handlers.
