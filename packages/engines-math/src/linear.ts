import {
  div,
  formatFraction,
  frac,
  mul,
  sub,
  toNumber,
  type Fraction,
} from "./fraction";

export interface LinearInput {
  /** ax + b = c  (or ax + b = 0 when c omitted) */
  a: number;
  b: number;
  c?: number;
}

export interface LinearSolution {
  a: Fraction;
  b: Fraction;
  c: Fraction;
  /** Exact solution for x when unique */
  x: Fraction | null;
  kind: "unique" | "identity" | "contradiction";
  steps: string[];
  numericCheck: {
    ok: boolean;
    residual: number;
    warning?: string;
  };
}

function asFrac(value: number): Fraction {
  if (!Number.isFinite(value)) throw new Error("Coefficient must be finite");
  if (Number.isInteger(value)) return frac(value, 1);
  return frac(Math.round(value * 1000), 1000);
}

/**
 * Solve ax + b = c with exact rationals + numeric residual check.
 * Teacher-private equivalence can compare student forms against `x`.
 */
export function solveLinear(input: LinearInput): LinearSolution {
  const a = asFrac(input.a);
  const b = asFrac(input.b);
  const c = asFrac(input.c ?? 0);
  const steps = [
    `Write the equation: ${formatFraction(a)}x ${formatSigned(b)} = ${formatFraction(c)}.`,
  ];

  if (a.n === 0) {
    const lhs = b;
    if (lhs.n === c.n && lhs.d === c.d) {
      steps.push("0·x + b = c with b = c ⇒ identity (true for all x).");
      return {
        a,
        b,
        c,
        x: null,
        kind: "identity",
        steps,
        numericCheck: { ok: true, residual: 0 },
      };
    }
    steps.push("0·x + b = c with b ≠ c ⇒ contradiction (no solution).");
    return {
      a,
      b,
      c,
      x: null,
      kind: "contradiction",
      steps,
      numericCheck: { ok: true, residual: 0 },
    };
  }

  const rhs = sub(c, b);
  const x = div(rhs, a);
  steps.push(
    `Isolate: ${formatFraction(a)}x = ${formatFraction(c)} − (${formatFraction(b)}) = ${formatFraction(rhs)}.`,
  );
  steps.push(`Divide: x = ${formatFraction(x)}.`);

  const residual = Math.abs(
    toNumber(a) * toNumber(x) + toNumber(b) - toNumber(c),
  );
  const ok = residual < 1e-9;
  return {
    a,
    b,
    c,
    x,
    kind: "unique",
    steps,
    numericCheck: {
      ok,
      residual,
      warning: ok
        ? undefined
        : "Symbolic and numeric paths disagree — withhold answer.",
    },
  };
}

export function formatLinear(input: LinearInput): string {
  const c = input.c ?? 0;
  const aPart =
    input.a === 1 ? "x" : input.a === -1 ? "−x" : `${input.a}x`;
  const bPart =
    input.b === 0
      ? ""
      : input.b > 0
        ? ` + ${input.b}`
        : ` − ${Math.abs(input.b)}`;
  return `${aPart}${bPart} = ${c}`;
}

function formatSigned(f: Fraction): string {
  const s = formatFraction(f);
  return f.n < 0 ? s : `+ ${s}`;
}

/** Pair of linear equations in two variables — thin Class 10 slice. */
export interface LinearPairInput {
  a1: number;
  b1: number;
  c1: number;
  a2: number;
  b2: number;
  c2: number;
}

export interface LinearPairSolution {
  kind: "unique" | "none" | "infinite";
  x: Fraction | null;
  y: Fraction | null;
  steps: string[];
  numericCheck: { ok: boolean; residual: number; warning?: string };
}

export function solveLinearPair(input: LinearPairInput): LinearPairSolution {
  const a1 = asFrac(input.a1);
  const b1 = asFrac(input.b1);
  const c1 = asFrac(input.c1);
  const a2 = asFrac(input.a2);
  const b2 = asFrac(input.b2);
  const c2 = asFrac(input.c2);

  // a1 x + b1 y = c1
  const det = sub(mul(a1, b2), mul(a2, b1));
  const steps = [
    `System: ${formatFraction(a1)}x + ${formatFraction(b1)}y = ${formatFraction(c1)}, ${formatFraction(a2)}x + ${formatFraction(b2)}y = ${formatFraction(c2)}.`,
    `Determinant Δ = a₁b₂ − a₂b₁ = ${formatFraction(det)}.`,
  ];

  if (det.n === 0) {
    const dx = sub(mul(c1, b2), mul(c2, b1));
    if (dx.n === 0) {
      steps.push("Δ = 0 and Δx = 0 ⇒ infinitely many solutions.");
      return {
        kind: "infinite",
        x: null,
        y: null,
        steps,
        numericCheck: { ok: true, residual: 0 },
      };
    }
    steps.push("Δ = 0 and Δx ≠ 0 ⇒ no solution.");
    return {
      kind: "none",
      x: null,
      y: null,
      steps,
      numericCheck: { ok: true, residual: 0 },
    };
  }

  const x = div(sub(mul(c1, b2), mul(c2, b1)), det);
  const y = div(sub(mul(a1, c2), mul(a2, c1)), det);
  steps.push(`x = Δx/Δ = ${formatFraction(x)}, y = Δy/Δ = ${formatFraction(y)}.`);

  const r1 =
    toNumber(a1) * toNumber(x) + toNumber(b1) * toNumber(y) - toNumber(c1);
  const r2 =
    toNumber(a2) * toNumber(x) + toNumber(b2) * toNumber(y) - toNumber(c2);
  const residual = Math.hypot(r1, r2);
  const ok = residual < 1e-9;
  return {
    kind: "unique",
    x,
    y,
    steps,
    numericCheck: {
      ok,
      residual,
      warning: ok
        ? undefined
        : "Symbolic and numeric paths disagree — withhold answer.",
    },
  };
}

export function explainLinearTemplate(solution: LinearSolution): string {
  return solution.steps.join("\n");
}
