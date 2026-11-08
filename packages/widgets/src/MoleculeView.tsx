"use client";

import { useState } from "react";

const ATOMS = [
  { id: "O", x: 140, y: 78, r: 18, fill: "#ef6b5b", mass: 16 },
  { id: "H1", x: 100, y: 110, r: 10, fill: "#e8f0e9", mass: 1 },
  { id: "H2", x: 180, y: 110, r: 10, fill: "#e8f0e9", mass: 1 },
];

export function MoleculeView() {
  const [selected, setSelected] = useState("O");
  const [rotation, setRotation] = useState(0);
  const atom = ATOMS.find((item) => item.id === selected) ?? ATOMS[0]!;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <svg
        viewBox="0 0 280 160"
        width="100%"
        height={160}
        role="img"
        aria-label="Water molecule"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") setRotation((r) => r - 8);
          if (event.key === "ArrowRight") setRotation((r) => r + 8);
          if (event.key === "Tab") return;
        }}
      >
        <rect width="280" height="160" fill="rgba(0,0,0,0.25)" rx="8" />
        <g transform={`rotate(${rotation} 140 90)`}>
          <line x1="140" y1="78" x2="100" y2="110" stroke="var(--co-chalk)" strokeWidth="4" />
          <line x1="140" y1="78" x2="180" y2="110" stroke="var(--co-chalk)" strokeWidth="4" />
          {ATOMS.map((item) => (
            <circle
              key={item.id}
              cx={item.x}
              cy={item.y}
              r={item.r}
              fill={item.fill}
              stroke={selected === item.id ? "var(--co-accent)" : "transparent"}
              strokeWidth={3}
              style={{ cursor: "pointer" }}
              onClick={() => setSelected(item.id)}
            />
          ))}
        </g>
      </svg>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {ATOMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelected(item.id)}
            style={{
              minHeight: "var(--co-hit)",
              padding: "0 12px",
              borderRadius: 999,
              border:
                selected === item.id
                  ? "1px solid var(--co-accent)"
                  : "1px solid var(--co-border)",
              background: "transparent",
              color: "var(--co-ink)",
              cursor: "pointer",
            }}
          >
            {item.id}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setRotation((r) => r + 15)}
          style={{
            minHeight: "var(--co-hit)",
            padding: "0 12px",
            borderRadius: 999,
            border: "1px solid var(--co-border)",
            background: "transparent",
            color: "var(--co-ink)",
            cursor: "pointer",
          }}
        >
          Rotate
        </button>
      </div>
      <div style={{ fontFamily: "var(--co-font-mono)", fontSize: 13 }}>
        Selected {atom.id} · approx mass {atom.mass} u · H₂O total 18 u
      </div>
    </div>
  );
}
