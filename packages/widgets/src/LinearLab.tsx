"use client";

import {
  formatFraction,
  formatLinear,
  solveLinear,
  solveLinearPair,
} from "@classos/engines-math";
import { PointerSlider } from "@classos/input-kit";
import { useMemo, useState } from "react";

export function LinearLab({
  onExplain,
}: {
  onExplain?: (payload: unknown) => void;
}) {
  const [mode, setMode] = useState<"single" | "pair">("single");
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(11);
  const [a1, setA1] = useState(1);
  const [b1, setB1] = useState(1);
  const [c1, setC1] = useState(5);
  const [a2, setA2] = useState(1);
  const [b2, setB2] = useState(-1);
  const [c2, setC2] = useState(1);

  const single = useMemo(() => {
    try {
      return solveLinear({ a, b, c });
    } catch {
      return null;
    }
  }, [a, b, c]);

  const pair = useMemo(
    () => solveLinearPair({ a1, b1, c1, a2, b2, c2 }),
    [a1, b1, c1, a2, b2, c2],
  );

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <ModeChip
          label="ax + b = c"
          active={mode === "single"}
          onClick={() => setMode("single")}
        />
        <ModeChip
          label="Pair (2×2)"
          active={mode === "pair"}
          onClick={() => setMode("pair")}
        />
      </div>

      {mode === "single" ? (
        <>
          <PointerSlider label="a" value={a} min={-5} max={5} step={1} onChange={setA} />
          <PointerSlider label="b" value={b} min={-10} max={10} step={1} onChange={setB} />
          <PointerSlider label="c" value={c} min={-20} max={20} step={1} onChange={setC} />
          <div style={{ fontFamily: "var(--co-font-mono)", fontSize: 13 }}>
            {formatLinear({ a, b, c })}
          </div>
          {single && (
            <div style={{ fontSize: 13, display: "grid", gap: 4 }}>
              <div>Kind: {single.kind}</div>
              {single.x && <div>x = {formatFraction(single.x)}</div>}
              {!single.numericCheck.ok && (
                <div style={{ color: "var(--co-danger)" }}>
                  {single.numericCheck.warning}
                </div>
              )}
              <button
                type="button"
                onClick={() => onExplain?.(single)}
                style={explainBtn}
              >
                Explain verified steps
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <PointerSlider label="a₁" value={a1} min={-5} max={5} step={1} onChange={setA1} />
          <PointerSlider label="b₁" value={b1} min={-5} max={5} step={1} onChange={setB1} />
          <PointerSlider label="c₁" value={c1} min={-10} max={10} step={1} onChange={setC1} />
          <PointerSlider label="a₂" value={a2} min={-5} max={5} step={1} onChange={setA2} />
          <PointerSlider label="b₂" value={b2} min={-5} max={5} step={1} onChange={setB2} />
          <PointerSlider label="c₂" value={c2} min={-10} max={10} step={1} onChange={setC2} />
          <div style={{ fontSize: 13, display: "grid", gap: 4 }}>
            <div>Kind: {pair.kind}</div>
            {pair.x && pair.y && (
              <div>
                x = {formatFraction(pair.x)}, y = {formatFraction(pair.y)}
              </div>
            )}
            {!pair.numericCheck.ok && (
              <div style={{ color: "var(--co-danger)" }}>
                {pair.numericCheck.warning}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ModeChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: 36,
        padding: "0 12px",
        borderRadius: 999,
        border: active ? "1px solid var(--co-accent)" : "1px solid var(--co-border)",
        background: active ? "rgba(198, 242, 109, 0.14)" : "transparent",
        color: "var(--co-ink)",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

const explainBtn = {
  minHeight: "var(--co-hit)",
  borderRadius: 10,
  border: "1px solid var(--co-accent)",
  background: "rgba(198, 242, 109, 0.12)",
  color: "var(--co-accent)",
  cursor: "pointer",
} as const;
