import { BrandMark } from "@classos/ui";
import Link from "next/link";
import { ClassBoardClient } from "./ClassBoardClient";

/** Phase 5 — hardened local-first classroom board after learner pilot. */
export default function ClassBoardPage() {
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
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link href="/board" style={chip}>
            Personal board
          </Link>
          <Link href="/school" style={chip}>
            School pilot
          </Link>
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
