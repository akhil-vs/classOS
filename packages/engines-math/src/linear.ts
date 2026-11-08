import { formatFraction, frac, type Fraction } from "./fraction";

export interface LinearSystemInput {
  a1: number;
  b1: number;
  c1: number;
  a2: number;
  b2: number;
  c2: number;
}

export type LinearNature =
  | "unique"
  | "infinite"
  | "none";

export interface LinearSolution {
  nature: LinearNature;
  x?: Fraction;
  y?: Fraction;
  steps: string[];
  numericCheck: { ok: boolean; warning?: string };
}

/**
 * Solve a1 x + b1 y = c1 ; a2 x + b2 y = c2 with exact rationals.
 * Two-path: plug numeric approximations back into both equations.
 */
export function solveLinearSystem(input: LinearSystemInput): LinearSolution {
  const a1 = frac(input.a1);
  const b1 = frac(input.b1);
  const c1 = frac(input.c1);
  const a2 = frac(input.a2);
  const b2 = frac(input.b2);
  const c2 = frac(input.c2);

  // D = a1 b2 - a2 b1
  const D = frac(input.a1 * input.b2 - input.a2 * input.b1);
  const Dx = frac(input.c1 * input.b2 - input.c2 * input.b1);
  const Dy = frac(input.a1 * input.c2 - input.a2 * input.c1);

  const steps = [
    `Write as a₁x + b₁y = c₁ and a₂x + b₂y = c₂.`,
    `D = a₁b₂ − a₂b₁ = ${formatFraction(D)}.`,
    `Dₓ = c₁b₂ − c₂b₁ = ${formatFraction(Dx)}.`,
    `Dᵧ = a₁c₂ − a₂c₁ = ${formatFraction(Dy)}.`,
  ];

  if (D.n !== 0) {
    const x = frac(Dx.n * D.d, Dx.d * D.n);
    const y = frac(Dy.n * D.d, Dy.d * D.n);
    steps.push(`D ≠ 0 ⇒ unique solution x = Dₓ/D = ${formatFraction(x)}, y = Dᵧ/D = ${formatFraction(y)}.`);
    const numericCheck = checkLinear(input, x.n / x.d, y.n / y.d);
    return { nature: "unique", x, y, steps, numericCheck };
  }

  if (Dx.n === 0 && Dy.n === 0) {
    steps.push("D = Dₓ = Dᵧ = 0 ⇒ infinitely many solutions (dependent equations).");
    return {
      nature: "infinite",
      steps,
      numericCheck: { ok: true },
    };
  }

  steps.push("D = 0 but Dₓ or Dᵧ ≠ 0 ⇒ no solution (parallel lines).");
  return {
    nature: "none",
    steps,
    numericCheck: { ok: true },
  };
}

function checkLinear(input: LinearSystemInput, x: number, y: number) {
  const r1 = input.a1 * x + input.b1 * y - input.c1;
  const r2 = input.a2 * x + input.b2 * y - input.c2;
  const ok = Math.abs(r1) < 1e-6 && Math.abs(r2) < 1e-6;
  return {
    ok,
    warning: ok
      ? undefined
      : "Symbolic and numeric paths disagree; withhold answer.",
  };
}

export function explainLinearTemplate(solution: LinearSolution) {
  return {
    templateId: "math.linear.system.v1",
    verified: solution.numericCheck.ok,
    nature: solution.nature,
    x: solution.x ? formatFraction(solution.x) : undefined,
    y: solution.y ? formatFraction(solution.y) : undefined,
    steps: solution.steps,
  };
}
