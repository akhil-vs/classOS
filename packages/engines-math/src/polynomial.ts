import { formatFraction, frac, type Fraction } from "./fraction";

export interface PolynomialInput {
  /** Coefficients highest degree first, e.g. [1, -3, 2] for x² − 3x + 2 */
  coeffs: number[];
}

export interface PolynomialEval {
  coeffs: Fraction[];
  at: Fraction;
  value: Fraction;
  steps: string[];
  numericCheck: { ok: boolean; warning?: string };
}

function mulFrac(a: Fraction, b: Fraction): Fraction {
  return frac(a.n * b.n, a.d * b.d);
}

function addFrac(a: Fraction, b: Fraction): Fraction {
  return frac(a.n * b.d + b.n * a.d, a.d * b.d);
}

function hornerNumeric(coeffs: number[], at: number) {
  return coeffs.reduce((acc, c) => acc * at + c, 0);
}

function formatPoly(coeffs: Fraction[]): string {
  const degree = coeffs.length - 1;
  return coeffs
    .map((c, i) => {
      const power = degree - i;
      const coef = formatFraction(c);
      if (power === 0) return coef;
      if (power === 1) return `${coef}x`;
      return `${coef}x^${power}`;
    })
    .join(" + ");
}

export function evaluatePolynomial(
  input: PolynomialInput,
  at: number,
): PolynomialEval {
  if (input.coeffs.length === 0) {
    throw new Error("Polynomial needs at least one coefficient");
  }
  const coeffs = input.coeffs.map((c) => frac(c));
  const x = frac(at);
  let value = coeffs[0]!;
  for (let i = 1; i < coeffs.length; i++) {
    value = addFrac(mulFrac(value, x), coeffs[i]!);
  }
  const steps = [
    `p(x) = ${formatPoly(coeffs)}.`,
    `Evaluate at x = ${formatFraction(x)} using Horner's method.`,
    `p(${formatFraction(x)}) = ${formatFraction(value)}.`,
  ];

  const numeric = hornerNumeric(input.coeffs, at);
  const exact = value.n / value.d;
  const ok = Math.abs(numeric - exact) < 1e-6;
  return {
    coeffs,
    at: x,
    value,
    steps,
    numericCheck: {
      ok,
      warning: ok
        ? undefined
        : "Symbolic and numeric paths disagree; withhold answer.",
    },
  };
}

/** Factor monic quadratic with integer rational roots when possible. */
export function factorMonicQuadratic(b: number, c: number) {
  const solutionRoots: number[] = [];
  for (let r = -20; r <= 20; r++) {
    if (r * r + b * r + c === 0) solutionRoots.push(r);
  }
  const unique = [...new Set(solutionRoots)].sort((x, y) => x - y);
  const steps = [
    `Consider x² + (${b})x + (${c}).`,
    unique.length
      ? `Rational roots found: ${unique.join(", ")}.`
      : "No small integer roots in search window.",
  ];
  return {
    roots: unique,
    factored:
      unique.length === 2
        ? `(x − ${unique[0]})(x − ${unique[1]})`
        : unique.length === 1
          ? `(x − ${unique[0]})²`
          : undefined,
    steps,
  };
}

export function explainPolynomialTemplate(result: PolynomialEval) {
  return {
    templateId: "math.polynomial.eval.v1",
    verified: result.numericCheck.ok,
    value: formatFraction(result.value),
    steps: result.steps,
  };
}
