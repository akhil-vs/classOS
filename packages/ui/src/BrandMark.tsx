export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 8,
        fontFamily: "var(--co-font-brand)",
        letterSpacing: "-0.03em",
      }}
    >
      <span
        style={{
          fontSize: compact ? 22 : 34,
          fontWeight: 700,
          color: "var(--co-ink)",
        }}
      >
        ClassOS
      </span>
      {!compact && (
        <span
          style={{
            fontSize: 13,
            color: "var(--co-ink-muted)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Learn · Board
        </span>
      )}
    </div>
  );
}
