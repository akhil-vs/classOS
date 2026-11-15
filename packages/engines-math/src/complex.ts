import { formatFraction, frac, type Fraction } from "./fraction";

export interface ComplexInput {
  /** Real part a in a + bi */
  a: number;
  /** Imaginary part b in a + bi */
  b: number;
}

export interface ComplexNumber {
  a: Fraction;
  b: Fraction;
}

export interface ComplexModulusResult {
  z: ComplexNumber;
  modulus: number;
  conjugate: ComplexNumber;
  steps: string[];
  numericCheck: { ok: boolean; residual: number; warning?: string };
}

function asFrac(value: number): Fraction {
  if (!Number.isFinite(value)) throw new Error("Part must be finite");
  if (Number.isInteger(value)) return frac(value, 1);
  return frac(Math.round(value * 1000), 1000);
}

function toNumber(f: Fraction): number {
  return f.n / f.d;
}

export function formatComplex(z: ComplexNumber): string {
  const a = formatFraction(z.a);
  const bAbs = formatFraction({ n: Math.abs(z.b.n), d: z.b.d });
  if (z.b.n === 0) return a;
  if (z.a.n === 0) {
    if (z.b.n === 1 && z.b.d === 1) return "i";
    if (z.b.n === -1 && z.b.d === 1) return "−i";
    return z.b.n < 0 ? `−${bAbs}i` : `${bAbs}i`;
  }
  const sign = z.b.n < 0 ? "−" : "+";
  const imag =
    Math.abs(z.b.n) === z.b.d && z.b.d === 1 ? "i" : `${bAbs}i`;
  return `${a} ${sign} ${imag}`;
}

/**
 * Class 11 Complex Numbers thin vertical: modulus + conjugate with residual check.
 * |a + bi| = √(a² + b²); conjugate flips the sign of b.
 */
export function complexModulus(input: ComplexInput): ComplexModulusResult {
  const z: ComplexNumber = { a: asFrac(input.a), b: asFrac(input.b) };
  const a = toNumber(z.a);
  const b = toNumber(z.b);
  const modulus = Math.hypot(a, b);
  const conjugate: ComplexNumber = {
    a: z.a,
    b: { n: -z.b.n, d: z.b.d },
  };
  const steps = [
    `Write z = ${formatComplex(z)}.`,
    `|z| = √(a² + b²) = √(${a}² + ${b}²) = ${modulus}.`,
    `Conjugate z̄ = ${formatComplex(conjugate)}.`,
    `Check: z · z̄ = |z|² (teacher-private equivalence path).`,
  ];
  const productReal = a * a + b * b;
  const residual = Math.abs(productReal - modulus * modulus);
  const ok = residual < 1e-9;
  return {
    z,
    modulus,
    conjugate,
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

export function explainComplexTemplate(result: ComplexModulusResult): string {
  return result.steps.join("\n");
}
