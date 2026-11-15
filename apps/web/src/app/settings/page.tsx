import { BrandMark } from "@classos/ui";
import Link from "next/link";
import { SettingsClient } from "./SettingsClient";

export default function SettingsPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      <BrandMark />
      <h1
        style={{
          fontFamily: "var(--co-font-brand)",
          letterSpacing: "-0.03em",
          marginTop: 24,
        }}
      >
        Settings
      </h1>
      <p style={{ color: "var(--co-ink-muted)" }}>
        Language, input preferences, and text size persist on this device.
      </p>
      <SettingsClient />
      <p style={{ marginTop: 24 }}>
        <Link href="/" style={{ color: "var(--co-accent)" }}>
          ← Back home
        </Link>
      </p>
    </main>
  );
}
