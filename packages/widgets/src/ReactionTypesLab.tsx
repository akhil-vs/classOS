"use client";

import {
  classifyReaction,
  explainClassificationTemplate,
} from "@classos/engines-chem";
import { useMemo, useState, type CSSProperties } from "react";

const TEMPLATES = [
  {
    label: "Combination",
    reactants: "H2, O2",
    products: "H2O",
    expect: "combination",
  },
  {
    label: "Decomposition",
    reactants: "CaCO3",
    products: "CaO, CO2",
    expect: "decomposition",
  },
  {
    label: "Displacement",
    reactants: "Zn, CuSO4",
    products: "ZnSO4, Cu",
    expect: "displacement",
  },
  {
    label: "Double displacement",
    reactants: "Na2SO4, BaCl2",
    products: "BaSO4, NaCl",
    expect: "double_displacement",
  },
  {
    label: "Colour only?",
    reactants: "CuSO4",
    products: "CuSO4",
    expect: "unknown",
  },
] as const;

export function ReactionTypesLab({
  onExplain,
}: {
  onExplain?: (payload: unknown) => void;
}) {
  const [reactants, setReactants] = useState("H2, O2");
  const [products, setProducts] = useState("H2O");
  const [predict, setPredict] = useState<string | null>(null);

  const result = useMemo(
    () =>
      classifyReaction({
        reactants: reactants.split(",").map((s) => s.trim()),
        products: products.split(",").map((s) => s.trim()),
      }),
    [reactants, products],
  );

  const predictMatch =
    predict === null
      ? null
      : predict === result.type ||
          (predict === "not_reaction" && result.colourChangeAlone);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div
        role="note"
        style={{ fontSize: 12, color: "var(--co-warn)", lineHeight: 1.4 }}
      >
        Assumptions: classify by what happens to reactants · colour change alone
        is not enough · engines decide the type.
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {TEMPLATES.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              setReactants(preset.reactants);
              setProducts(preset.products);
              setPredict(null);
            }}
            style={chipStyle(false)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <label style={{ display: "grid", gap: 6, fontSize: 13 }}>
        Reactants
        <input
          value={reactants}
          onChange={(event) => setReactants(event.target.value)}
          style={fieldStyle}
        />
      </label>
      <label style={{ display: "grid", gap: 6, fontSize: 13 }}>
        Products
        <input
          value={products}
          onChange={(event) => setProducts(event.target.value)}
          style={fieldStyle}
        />
      </label>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontSize: 12, color: "var(--co-ink-muted)" }}>
          Predict the type before revealing
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(
            [
              ["combination", "Combination"],
              ["decomposition", "Decomposition"],
              ["displacement", "Displacement"],
              ["double_displacement", "Double displacement"],
              ["not_reaction", "Not a reaction"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPredict(value)}
              style={chipStyle(predict === value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          border: "1px solid var(--co-border)",
          borderRadius: 10,
          padding: 12,
          display: "grid",
          gap: 6,
          fontSize: 13,
        }}
      >
        <div>
          Engine type: <strong>{result.label}</strong>
        </div>
        {result.balanced.ok && (
          <div style={{ fontFamily: "var(--co-font-mono)" }}>
            {result.balanced.equation}
          </div>
        )}
        {predict !== null && (
          <div
            style={{
              color: predictMatch ? "var(--co-accent)" : "var(--co-warn)",
            }}
          >
            {predictMatch
              ? "Predict matches the verified type."
              : "Predict differs — check reactant → product pattern, not colour alone."}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onExplain?.(explainClassificationTemplate(result))}
        style={{
          minHeight: "var(--co-hit)",
          borderRadius: 10,
          border: "1px solid var(--co-accent)",
          background: "rgba(198, 242, 109, 0.12)",
          color: "var(--co-accent)",
          cursor: "pointer",
        }}
      >
        Explain verified classification
      </button>
    </div>
  );
}

const fieldStyle: CSSProperties = {
  minHeight: "var(--co-hit)",
  borderRadius: 10,
  border: "1px solid var(--co-border)",
  background: "var(--co-bg-elevated)",
  color: "var(--co-ink)",
  padding: "0 12px",
};

function chipStyle(active: boolean): CSSProperties {
  return {
    minHeight: 36,
    padding: "0 10px",
    borderRadius: 999,
    border: active ? "1px solid var(--co-accent)" : "1px solid var(--co-border)",
    background: active ? "rgba(198, 242, 109, 0.14)" : "transparent",
    color: "var(--co-ink)",
    cursor: "pointer",
  };
}
