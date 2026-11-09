import { BrandMark } from "@classos/ui";
import Link from "next/link";

/** Phase 6 school-pilot admin stub — after classroom pack. */
export default function SchoolPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      <BrandMark />
      <h1 style={{ fontFamily: "var(--co-font-brand)", letterSpacing: "-0.03em" }}>
        School admin
      </h1>
      <p style={{ color: "var(--co-ink-muted)", lineHeight: 1.5 }}>
        Phase 6 scaffold: school-scoped weak-topic reports stay private (DPDP).
        No cross-school marketplace or cloud student sync in this milestone.
      </p>
      <ul style={{ color: "var(--co-ink-muted)", lineHeight: 1.6 }}>
        <li>Classes / teachers roster — placeholder</li>
        <li>Aggregate weak topics — school-only</li>
        <li>Pilot checklist — phones/laptops already validated in Phase 4</li>
      </ul>
      <p>
        <Link href="/class/board" style={{ color: "var(--co-accent)" }}>
          Open classroom board →
        </Link>
      </p>
    </main>
  );
}
