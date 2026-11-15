import { BrandMark } from "@classos/ui";
import Link from "next/link";
import { AuthBar } from "../../components/AuthBar";
import { requirePageSession } from "../../lib/auth";
import { SchoolPilotClient } from "./SchoolPilotClient";

/** Phase 6 school surface — LMS L0: teacher (own) or school_admin. */
export default async function SchoolPage() {
  const session = await requirePageSession("school_view", { next: "/school" });
  const isAdmin = session.user.role === "school_admin";

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 48px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <BrandMark />
        <AuthBar />
      </div>
      <h1 style={{ fontFamily: "var(--co-font-brand)", letterSpacing: "-0.03em" }}>
        {isAdmin ? "School admin" : "School sessions"}
      </h1>
      <p style={{ color: "var(--co-ink-muted)", lineHeight: 1.5 }}>
        {isAdmin
          ? "School-scoped live session summaries for Demo CBSE School. Cloud roster sync arrives in later LMS phases."
          : "Your classroom sessions on this device. School-wide admin tools require the school_admin role."}
      </p>

      <ol style={{ color: "var(--co-ink-muted)", lineHeight: 1.7, paddingLeft: 18 }}>
        <li>Sign in as a teacher to start `/class/board`.</li>
        <li>Students sign in and open `/join/[code]` to vote.</li>
        <li>Review session summaries below (filtered by role).</li>
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
