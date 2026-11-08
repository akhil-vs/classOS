"use client";

import {
  explainAPTemplate,
  formatFraction,
  solveAP,
} from "@classos/engines-math";
import { PointerSlider } from "@classos/input-kit";
import { useMemo, useState } from "react";

export function APLab({
  onExplain,
}: {
  onExplain?: (payload: unknown) => void;
}) {
  const [a, setA] = useState(2);
  const [d, setD] = useState(3);
  const [n, setN] = useState(5);

  const result = useMemo(() => solveAP({ a, d, n }), [a, d, n]);
  const terms = useMemo(
    () => Array.from({ length: n }, (_, i) => a + i * d),
    [a, d, n],
  );

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          padding: 10,
          borderRadius: 10,
          background: "rgba(0,0,0,0.25)",
          minHeight: 64,
          alignItems: "center",
        }}
        aria-label="AP terms"
      >
        {terms.map((term, index) => (
          <span
            key={`${term}-${index}`}
            style={{
              minWidth: 36,
              minHeight: 36,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              border:
                index === n - 1
                  ? "1px solid var(--co-accent)"
                  : "1px solid var(--co-border)",
              fontFamily: "var(--co-font-mono)",
              fontSize: 13,
            }}
          >
            {term}
          </span>
        ))}
      </div>
      <PointerSlider label="a (first term)" value={a} min={-5} max={10} step={1} onChange={setA} />
      <PointerSlider label="d (common difference)" value={d} min={-5} max={8} step={1} onChange={setD} />
      <PointerSlider label="n (number of terms)" value={n} min={1} max={10} step={1} onChange={setN} />
      <div style={{ fontFamily: "var(--co-font-mono)", fontSize: 13 }}>
        aₙ = {formatFraction(result.term)} · Sₙ = {formatFraction(result.sum)}
      </div>
      <button
        type="button"
        onClick={() => onExplain?.(explainAPTemplate(result))}
        style={{
          minHeight: "var(--co-hit)",
          borderRadius: 10,
          border: "1px solid var(--co-accent)",
          background: "rgba(198, 242, 109, 0.12)",
          color: "var(--co-accent)",
          cursor: "pointer",
        }}
      >
        Explain verified steps
      </button>
    </div>
  );
}
