"use client";

import { balanceEquation, explainBalanceTemplate } from "@classos/engines-chem";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";

const PRESETS = [
  { label: "Water", reactants: "H2, O2", products: "H2O" },
  { label: "HCl", reactants: "H2, Cl2", products: "HCl" },
  { label: "Steam + Fe", reactants: "Fe, H2O", products: "Fe3O4, H2" },
];

export function BalancerLab({
  onExplain,
}: {
  onExplain?: (payload: unknown) => void;
}) {
  const [reactants, setReactants] = useState("H2, O2");
  const [products, setProducts] = useState("H2O");
  const [selected, setSelected] = useState<string | null>("H2");
  const [subscriptAttempt, setSubscriptAttempt] = useState<string | null>(null);

  const result = useMemo(() => {
    return balanceEquation({
      reactants: reactants.split(",").map((s) => s.trim()),
      products: products.split(",").map((s) => s.trim()),
    });
  }, [reactants, products]);

  const species = result.ok
    ? [...result.reactants, ...result.products]
    : [];

  function guardFormulaInput(
    value: string,
    setter: (next: string) => void,
  ) {
    // Refuse mid-formula digit edits that look like subscript hacking
    // (e.g. turning H2O into H2O2 by appending). Coefficients belong outside.
    if (/\d{3,}/.test(value.replace(/\s/g, ""))) {
      setSubscriptAttempt(
        "Refuse: do not invent subscripts to balance — change coefficients only.",
      );
      return;
    }
    setSubscriptAttempt(null);
    setter(value);
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              setReactants(preset.reactants);
              setProducts(preset.products);
              setSubscriptAttempt(null);
            }}
            style={chipStyle(false)}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <label style={{ display: "grid", gap: 6, fontSize: 13 }}>
        Reactants (comma-separated formulas)
        <input
          value={reactants}
          onChange={(event) =>
            guardFormulaInput(event.target.value, setReactants)
          }
          style={fieldStyle}
        />
      </label>
      <label style={{ display: "grid", gap: 6, fontSize: 13 }}>
        Products
        <input
          value={products}
          onChange={(event) =>
            guardFormulaInput(event.target.value, setProducts)
          }
          style={fieldStyle}
        />
      </label>
      {subscriptAttempt && (
        <div style={{ color: "var(--co-warn)", fontSize: 13 }}>
          {subscriptAttempt}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          fontSize: 12,
        }}
      >
        <ViewCard title="Macro">
          {result.ok
            ? selected
              ? `Observation focus: ${selected}`
              : "Balanced reaction ready"
            : "Waiting for valid equation"}
        </ViewCard>
        <ViewCard title="Particle">
          {species.map((item) => (
            <button
              key={`${item.formula}-${item.coefficient}`}
              type="button"
              onClick={() => setSelected(item.formula)}
              style={{
                ...chipStyle(selected === item.formula),
                marginBottom: 4,
                width: "100%",
              }}
            >
              {item.coefficient}× {item.formula}
              <div style={{ opacity: 0.7, fontSize: 11 }}>
                {Object.entries(item.atoms)
                  .map(([atom, count]) => `${atom}:${count}`)
                  .join(" ")}
              </div>
            </button>
          ))}
        </ViewCard>
        <ViewCard title="Symbolic">
          <div style={{ fontFamily: "var(--co-font-mono)" }}>
            {result.ok ? result.equation : result.refused}
          </div>
        </ViewCard>
      </div>

      {selected && result.ok && (
        <div style={{ color: "var(--co-ink-muted)", fontSize: 13 }}>
          Highlighted species: {selected} — linked across macro / particle /
          symbolic views. Coefficients scale molecules; formulas stay fixed.
        </div>
      )}

      {result.ok && (
        <button
          type="button"
          onClick={() => onExplain?.(explainBalanceTemplate(result))}
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
      )}
    </div>
  );
}

function ViewCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        border: "1px solid var(--co-border)",
        borderRadius: 10,
        padding: 8,
        minHeight: 88,
        background: "rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ color: "var(--co-ink-muted)", marginBottom: 6 }}>{title}</div>
      {children}
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
