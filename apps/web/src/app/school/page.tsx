import { BrandMark } from "@classos/ui";
import Link from "next/link";
import { SchoolPilotClient } from "./SchoolPilotClient";

/** Phase 6 — small school pilot after hardened classroom pack. */
export default function SchoolPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 48px" }}>
      <BrandMark />
      <h1 style={{ fontFamily: "var(--co-font-brand)", letterSpacing: "-0.03em" }}>
        School pilot
      </h1>
      <p style={{ color: "var(--co-ink-muted)", lineHeight: 1.5 }}>
        Small Phase 6 pilot checklist after Phase 5 local-first `/join`. Reports
        stay school-private on this device (DPDP). Deferred: cloud sync,
        Devanagari ink, Class 9–10 maths inventory breadth, full physics sims.
      </p>

      <ol style={{ color: "var(--co-ink-muted)", lineHeight: 1.7, paddingLeft: 18 }}>
        <li>Confirm Phase 4 Learn + personal board on phones/laptops.</li>
        <li>
          Teacher starts `/class/board`, shares join code, opens Predict, ends
          class.
        </li>
        <li>Students vote on `/join/[code]` — presence and tallies update locally.</li>
        <li>Review device-local session summaries below (no cloud roster).</li>
        <li>Note recognition errors and unused chips for breadth prioritisation.</li>
      </ol>

      <p style={{ margin: "20px 0" }}>
        <Link href="/class/board" style={{ color: "var(--co-accent)" }}>
          Open classroom board →
        </Link>
      </p>

      <SchoolPilotClient />
    </main>
  );
}
