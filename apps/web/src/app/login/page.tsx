import { BrandMark } from "@classos/ui";
import { listDemoAccounts } from "@classos/auth";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next && params.next.startsWith("/") ? params.next : "/";
  const demos = listDemoAccounts();

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        alignContent: "center",
        padding: "32px 20px 48px",
        gap: 24,
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
        Sign in
      </h1>
      <p style={{ margin: 0, color: "var(--co-ink-muted)", lineHeight: 1.5 }}>
        LMS L0 — school accounts for Learn, classroom, and reports. Demo school
        is seeded for local pilots.
      </p>
      <LoginForm next={next} />
      <section style={{ display: "grid", gap: 8 }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--co-ink-muted)",
          }}
        >
          Demo accounts
        </div>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "grid",
            gap: 8,
            fontSize: 13,
            color: "var(--co-ink-muted)",
          }}
        >
          {demos.map((account) => (
            <li key={account.email}>
              <code style={{ color: "var(--co-ink)" }}>{account.email}</code>
              {" · "}
              {account.role}
              {" · "}
              <code>{account.passwordHint}</code>
            </li>
          ))}
        </ul>
      </section>
      <Link href="/" style={{ color: "var(--co-accent)" }}>
        ← Back home
      </Link>
    </main>
  );
}
