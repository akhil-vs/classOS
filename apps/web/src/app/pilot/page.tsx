import { BrandMark } from "@classos/ui";
import Link from "next/link";
import { PilotNotesClient } from "./PilotNotesClient";

/** Capture Phase 4–6 pilot evidence before further Class 11–12 breadth. */
export default function PilotNotesPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 48px" }}>
      <BrandMark />
      <h1
        style={{
          fontFamily: "var(--co-font-brand)",
          letterSpacing: "-0.03em",
          fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
        }}
      >
        Pilot notes
      </h1>
      <p style={{ color: "var(--co-ink-muted)", lineHeight: 1.5 }}>
        Device-local evidence for learner, classroom, and school pilots. Use
        these notes to decide what teachers actually use before more inventory
        breadth. Nothing leaves this browser.
      </p>
      <PilotNotesClient />
      <p style={{ marginTop: 28 }}>
        <Link href="/school" style={{ color: "var(--co-accent)" }}>
          School pilot →
        </Link>
        {" · "}
        <Link href="/progress" style={{ color: "var(--co-accent)" }}>
          Progress
        </Link>
        {" · "}
        <Link href="/" style={{ color: "var(--co-accent)" }}>
          Home
        </Link>
      </p>
    </main>
  );
}
