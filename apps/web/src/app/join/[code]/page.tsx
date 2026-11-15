import { BrandMark } from "@classos/ui";
import { AuthBar } from "../../../components/AuthBar";
import { requirePageSession } from "../../../lib/auth";
import { JoinClient } from "./JoinClient";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const session = await requirePageSession("join_live", {
    next: `/join/${code}`,
  });

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <BrandMark compact />
        <AuthBar />
      </div>
      <h1 style={{ fontFamily: "var(--co-font-brand)", letterSpacing: "-0.03em" }}>
        Join class
      </h1>
      <p style={{ color: "var(--co-ink-muted)", lineHeight: 1.45 }}>
        Signed in as {session.user.name}. You cannot drive the teacher board —
        Predict votes stay on the classroom device.
      </p>
      <JoinClient code={code.toUpperCase()} studentName={session.user.name} />
    </main>
  );
}
