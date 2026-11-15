import { BrandMark } from "@classos/ui";
import Link from "next/link";
import { AuthBar } from "../../../components/AuthBar";
import { requirePageSession } from "../../../lib/auth";
import { ClassBoardClient } from "./ClassBoardClient";

/** Phase 5 classroom board — LMS L0: teachers only. */
export default async function ClassBoardPage() {
  await requirePageSession("class_live", { next: "/class/board" });
  return (
    <main>
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--co-border)",
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <BrandMark compact />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/board" style={chip}>
            Personal board
          </Link>
          <Link href="/school" style={chip}>
            School
          </Link>
          <AuthBar />
        </div>
      </div>
      <ClassBoardClient />
    </main>
  );
}

const chip = {
  minHeight: 40,
  display: "inline-flex",
  alignItems: "center",
  padding: "0 12px",
  borderRadius: 999,
  border: "1px solid var(--co-border)",
} as const;
