import {
  add,
  cmp,
  div,
  formatFraction,
  frac,
  isPerfectSquare,
  mul,
  neg,
  sqrtInt,
  sub,
  toNumber,
  type Fraction,
} from "./fraction";

export type RootNature =
  | "two_distinct_real"
  | "two_equal_real"
  | "no_real";

export interface QuadraticInput {
  a: number;
  b: number;
  c: number;
}

export interface ExactRoot {
  kind: "rational" | "irrational" | "none";
  /** Human-readable exact form, e.g. "(5±√13)/2" or "3" */
  latex: string;
  numeric?: number;
}

export interface QuadraticSolution {
  a: Fraction;
  b: Fraction;
  c: Fraction;
  discriminant: Fraction;
  nature: RootNature;
  roots: ExactRoot[];
  steps: string[];
  numericCheck: {
    ok: boolean;
    residuals: number[];
    warning?: string;
  };
}

function asFrac(value: number): Fraction {
  if (!Number.isFinite(value)) throw new Error("Coefficient must be finite");
  if (Number.isInteger(value)) return frac(value, 1);
  // Capture common classroom decimals as fractions with denom ≤ 1000
  const scaled = Math.round(value * 1000);
  return frac(scaled, 1000);
}

function natureFromD(D: Fraction): RootNature {
  const c = cmp(D, frac(0));
  if (c > 0) return "two_distinct_real";
  if (c === 0) return "two_equal_real";
  return "no_real";
}

function formatSigned(f: Fraction): string {
  const s = formatFraction(f);
  return f.n < 0 ? s : `+${s}`;
}

/**
 * Deterministic quadratic CAS.
 * Exact rational path is the source of truth; a numeric residual check
 * provides the second path required by ClassOS accuracy rules.
 * SymPy WASM can replace this bridge later without changing the API.
 */
export function solveQuadratic(input: QuadraticInput): QuadraticSolution {
  const a = asFrac(input.a);
  const b = asFrac(input.b);
  const c = asFrac(input.c);

  if (a.n === 0) {
    throw new Error("Not a quadratic: coefficient a must be non-zero");
  }

  const discriminant = sub(mul(b, b), mul(mul(frac(4), a), c));
  const nature = natureFromD(discriminant);
  const steps = [
    `Identify coefficients: a = ${formatFraction(a)}, b = ${formatFraction(b)}, c = ${formatFraction(c)}.`,
    `Compute discriminant D = b² − 4ac = ${formatFraction(discriminant)}.`,
  ];

  const roots: ExactRoot[] = [];

  if (nature === "no_real") {
    steps.push("D < 0 ⇒ no real roots (complex roots out of Class 10 scope).");
    roots.push({ kind: "none", latex: "no real roots" });
  } else if (nature === "two_equal_real") {
    const root = div(neg(b), mul(frac(2), a));
    steps.push(
      `D = 0 ⇒ equal real roots x = −b / (2a) = ${formatFraction(root)}.`,
    );
    roots.push({
      kind: "rational",
      latex: formatFraction(root),
      numeric: toNumber(root),
    });
    roots.push({
      kind: "rational",
      latex: formatFraction(root),
      numeric: toNumber(root),
    });
  } else {
    // D > 0
    const twoA = mul(frac(2), a);
    if (discriminant.d === 1 && isPerfectSquare(discriminant.n)) {
      const sqrtD = frac(sqrtInt(discriminant.n));
      const r1 = div(add(neg(b), sqrtD), twoA);
      const r2 = div(sub(neg(b), sqrtD), twoA);
      steps.push(
        `D is a perfect square ⇒ rational roots x = (−b ± √D) / (2a).`,
      );
      steps.push(`x₁ = ${formatFraction(r1)}, x₂ = ${formatFraction(r2)}.`);
      roots.push({
        kind: "rational",
        latex: formatFraction(r1),
        numeric: toNumber(r1),
      });
      roots.push({
        kind: "rational",
        latex: formatFraction(r2),
        numeric: toNumber(r2),
      });
    } else {
      const dStr = formatFraction(discriminant);
      const twoAStr = formatFraction(twoA);
      const negB = formatFraction(neg(b));
      steps.push(
        `D > 0 and not a perfect square ⇒ irrational roots x = (${negB} ± √(${dStr})) / (${twoAStr}).`,
      );
      const sqrtNum = Math.sqrt(toNumber(discriminant));
      const n1 = (-toNumber(b) + sqrtNum) / toNumber(twoA);
      const n2 = (-toNumber(b) - sqrtNum) / toNumber(twoA);
      roots.push({
        kind: "irrational",
        latex: `(${negB}+√(${dStr}))/(${twoAStr})`,
        numeric: n1,
      });
      roots.push({
        kind: "irrational",
        latex: `(${negB}-√(${dStr}))/(${twoAStr})`,
        numeric: n2,
      });
    }
  }

  const numericCheck = twoPathCheck(input, roots);
  if (!numericCheck.ok) {
    steps.push(
      "Warning: symbolic and numeric paths disagree — withhold answer.",
    );
  }

  return {
    a,
    b,
    c,
    discriminant,
    nature,
    roots,
    steps,
    numericCheck,
  };
}

function twoPathCheck(input: QuadraticInput, roots: ExactRoot[]) {
  const residuals: number[] = [];
  for (const root of roots) {
    if (root.kind === "none" || root.numeric === undefined) continue;
    const x = root.numeric;
    const residual = input.a * x * x + input.b * x + input.c;
    residuals.push(residual);
  }
  const ok = residuals.every((r) => Math.abs(r) < 1e-6);
  return {
    ok: residuals.length === 0 ? true : ok,
    residuals,
    warning: ok
      ? undefined
      : "Symbolic and numeric paths disagree; do not show as truth.",
  };
}

export function natureLabel(nature: RootNature): string {
  switch (nature) {
    case "two_distinct_real":
      return "Two distinct real roots";
    case "two_equal_real":
      return "Two equal real roots";
    case "no_real":
      return "No real roots";
  }
}

export function formatQuadratic(input: QuadraticInput): string {
  const a = asFrac(input.a);
  const b = asFrac(input.b);
  const c = asFrac(input.c);
  const aPart =
    a.n === 1 && a.d === 1
      ? "x²"
      : a.n === -1 && a.d === 1
        ? "−x²"
        : `${formatFraction(a)}x²`;
  const bPart =
    b.n === 0 ? "" : b.d === 1 && Math.abs(b.n) === 1
      ? `${b.n < 0 ? "−" : "+"}x`
      : `${formatSigned(b)}x`;
  const cPart = c.n === 0 ? "" : formatSigned(c);
  return `${aPart}${bPart}${cPart}=0`;
}

export function explainQuadraticTemplate(solution: QuadraticSolution) {
  return {
    templateId: "math.quadratic.solve.v1",
    verified: solution.numericCheck.ok,
    nature: natureLabel(solution.nature),
    discriminant: formatFraction(solution.discriminant),
    roots: solution.roots.map((root) => root.latex),
    steps: solution.steps,
  };
}
