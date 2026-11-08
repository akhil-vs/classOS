import { formatFraction, frac, type Fraction } from "./fraction";

export interface APInput {
  a: number;
  d: number;
  n: number;
}

export interface APResult {
  a: Fraction;
  d: Fraction;
  n: number;
  term: Fraction;
  sum: Fraction;
  steps: string[];
  numericCheck: { ok: boolean; warning?: string };
}

/** nth term and sum of first n terms for an arithmetic progression. */
export function solveAP(input: APInput): APResult {
  if (!Number.isInteger(input.n) || input.n < 1) {
    throw new Error("n must be a positive integer");
  }
  const a = frac(input.a);
  const d = frac(input.d);
  const n = input.n;
  const term = frac(a.n * d.d + (n - 1) * d.n * a.d, a.d * d.d);
  // S_n = n/2 * (2a + (n-1)d)
  const twoA = frac(2 * a.n, a.d);
  const nMinus1d = frac((n - 1) * d.n, d.d);
  const inside = frac(
    twoA.n * nMinus1d.d + nMinus1d.n * twoA.d,
    twoA.d * nMinus1d.d,
  );
  const sum = frac(n * inside.n, 2 * inside.d);

  const steps = [
    `AP with first term a = ${formatFraction(a)}, common difference d = ${formatFraction(d)}.`,
    `n-th term aₙ = a + (n − 1)d = ${formatFraction(term)}.`,
    `Sum Sₙ = n/2 [2a + (n − 1)d] = ${formatFraction(sum)}.`,
  ];

  const termNum = input.a + (n - 1) * input.d;
  const sumNum = (n / 2) * (2 * input.a + (n - 1) * input.d);
  const ok =
    Math.abs(termNum - term.n / term.d) < 1e-6 &&
    Math.abs(sumNum - sum.n / sum.d) < 1e-6;

  return {
    a,
    d,
    n,
    term,
    sum,
    steps,
    numericCheck: {
      ok,
      warning: ok
        ? undefined
        : "Symbolic and numeric paths disagree; withhold answer.",
    },
  };
}

export function explainAPTemplate(result: APResult) {
  return {
    templateId: "math.ap.v1",
    verified: result.numericCheck.ok,
    term: formatFraction(result.term),
    sum: formatFraction(result.sum),
    steps: result.steps,
  };
}
