import { BrandMark } from "@classos/ui";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 16px" }}>
      <BrandMark />
      <h1 style={{ fontFamily: "var(--co-font-brand)", letterSpacing: "-0.03em" }}>
        You are offline
      </h1>
      <p style={{ color: "var(--co-ink-muted)", lineHeight: 1.5 }}>
        Cached Learn shells and personal board drafts can still open. Explain is
        unavailable offline — on-device engines remain the source of truth.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
        <Link href="/board" style={link}>
          Personal board
        </Link>
        <Link href="/browse" style={link}>
          Browse (cached)
        </Link>
      </div>
    </main>
  );
}

const link = {
  minHeight: "var(--co-hit)",
  display: "inline-flex",
  alignItems: "center",
  padding: "0 16px",
  borderRadius: 999,
  border: "1px solid var(--co-border)",
} as const;
