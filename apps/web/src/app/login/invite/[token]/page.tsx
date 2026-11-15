import { BrandMark } from "@classos/ui";
import { previewInvite } from "@classos/auth";
import Link from "next/link";
import { AcceptInviteForm } from "./AcceptInviteForm";

export default async function InviteAcceptPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const preview = await previewInvite(token);

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        alignContent: "center",
        padding: "32px 20px 48px",
        gap: 20,
        maxWidth: 440,
        margin: "0 auto",
      }}
    >
      <BrandMark />
      <h1
        style={{
          margin: 0,
          fontFamily: "var(--co-font-brand)",
          fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
          letterSpacing: "-0.03em",
        }}
      >
        Accept invite
      </h1>
      {!preview.ok ? (
        <p style={{ color: "var(--co-warn)" }}>{preview.error}</p>
      ) : (
        <>
          <p style={{ margin: 0, color: "var(--co-ink-muted)", lineHeight: 1.5 }}>
            Join <strong style={{ color: "var(--co-ink)" }}>{preview.schoolName}</strong>{" "}
            as <strong style={{ color: "var(--co-ink)" }}>{preview.role}</strong>{" "}
            ({preview.email}).
          </p>
          <AcceptInviteForm token={token} email={preview.email} />
        </>
      )}
      <Link href="/login" style={{ color: "var(--co-accent)" }}>
        ← Sign in instead
      </Link>
    </main>
  );
}
