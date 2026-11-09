import { BrandMark } from "@classos/ui";
import { JoinClient } from "./JoinClient";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px" }}>
      <BrandMark compact />
      <h1 style={{ fontFamily: "var(--co-font-brand)", letterSpacing: "-0.03em" }}>
        Join class
      </h1>
      <p style={{ color: "var(--co-ink-muted)" }}>
        Phone-friendly Predict vote / Check-it stub. Students cannot drive the
        teacher board.
      </p>
      <JoinClient code={code.toUpperCase()} />
    </main>
  );
}
