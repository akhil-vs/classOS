import { BrandMark } from "@classos/ui";
import Link from "next/link";
import { AuthBar } from "../../components/AuthBar";
import { requirePageSession } from "../../lib/auth";
import { SchoolAdminClient } from "./SchoolAdminClient";
import { SchoolPilotClient } from "./SchoolPilotClient";

/** LMS L1 school surface — admin roster + school-scoped session summaries. */
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
        {session.user.schoolName ?? "Your school"} — LMS L1 tenancy. Session lists
        and roster stay inside this school only.
      </p>

      {isAdmin && <SchoolAdminClient />}

      {!isAdmin && (
        <p style={{ margin: "0 0 20px", fontSize: 14, color: "var(--co-ink-muted)" }}>
          Showing your classroom sessions. Roster and invites require school_admin.
        </p>
      )}

      <p style={{ margin: "0 0 20px" }}>
        <Link href="/class/board" style={{ color: "var(--co-accent)" }}>
          Open classroom board →
        </Link>
      </p>

      <SchoolPilotClient />
    </main>
  );
}
