import {
  addCounts,
  formatFormula,
  multiplyCounts,
  parseFormula,
  type AtomCounts,
} from "./formula";

export interface ReactionSide {
  formula: string;
}

export interface BalanceInput {
  reactants: string[];
  products: string[];
}

export interface BalancedSpecies {
  formula: string;
  coefficient: number;
  atoms: AtomCounts;
}

export interface BalanceResult {
  ok: boolean;
  reactants: BalancedSpecies[];
  products: BalancedSpecies[];
  equation: string;
  steps: string[];
  refused?: string;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/** Exact integer balancer via bounded search (classroom-sized equations). */
export function balanceEquation(input: BalanceInput): BalanceResult {
  const reactants = input.reactants.map((formula) => formula.trim()).filter(Boolean);
  const products = input.products.map((formula) => formula.trim()).filter(Boolean);

  if (reactants.length === 0 || products.length === 0) {
    return {
      ok: false,
      reactants: [],
      products: [],
      equation: "",
      steps: [],
      refused: "Need at least one reactant and one product.",
    };
  }

  let reactantAtoms: AtomCounts[];
  let productAtoms: AtomCounts[];
  try {
    reactantAtoms = reactants.map(parseFormula);
    productAtoms = products.map(parseFormula);
  } catch (error) {
    return {
      ok: false,
      reactants: [],
      products: [],
      equation: "",
      steps: [],
      refused: error instanceof Error ? error.message : "Parse error",
    };
  }

  const atoms = [
    ...new Set([
      ...reactantAtoms.flatMap((c) => Object.keys(c)),
      ...productAtoms.flatMap((c) => Object.keys(c)),
    ]),
  ].sort();

  const n = reactants.length + products.length;
  const maxCoeff = n <= 3 ? 8 : 6;

  const steps = [
    `Species: ${[...reactants, ...products].join(", ")}.`,
    `Elements to conserve: ${atoms.join(", ")}.`,
    "Search smallest positive integer coefficients (exact arithmetic).",
  ];

  const solution = searchCoefficients(
    reactantAtoms,
    productAtoms,
    atoms,
    maxCoeff,
  );

  if (!solution) {
    return {
      ok: false,
      reactants: [],
      products: [],
      equation: "",
      steps,
      refused:
        "Could not balance within curriculum search bounds, or equation is out of scope.",
    };
  }

  const reactantCoeffs = solution.slice(0, reactants.length);
  const productCoeffs = solution.slice(reactants.length);

  const left = reactants.map((formula, i) =>
    formatFormula(formula, reactantCoeffs[i]!),
  );
  const right = products.map((formula, i) =>
    formatFormula(formula, productCoeffs[i]!),
  );
  const equation = `${left.join(" + ")} → ${right.join(" + ")}`;
  steps.push(`Balanced equation: ${equation}.`);
  steps.push("Coefficients scale molecules only — formulas (subscripts) stay fixed.");

  return {
    ok: true,
    reactants: reactants.map((formula, i) => ({
      formula,
      coefficient: reactantCoeffs[i]!,
      atoms: multiplyCounts(reactantAtoms[i]!, reactantCoeffs[i]!),
    })),
    products: products.map((formula, i) => ({
      formula,
      coefficient: productCoeffs[i]!,
      atoms: multiplyCounts(productAtoms[i]!, productCoeffs[i]!),
    })),
    equation,
    steps,
  };
}

function searchCoefficients(
  reactants: AtomCounts[],
  products: AtomCounts[],
  atoms: string[],
  maxCoeff: number,
): number[] | null {
  const total = reactants.length + products.length;
  const coeffs = Array.from({ length: total }, () => 1);
  let best: number[] | null = null;
  let bestSum = Number.POSITIVE_INFINITY;

  function ok(): boolean {
    for (const atom of atoms) {
      let left = 0;
      let right = 0;
      reactants.forEach((counts, i) => {
        left += (counts[atom] ?? 0) * coeffs[i]!;
      });
      products.forEach((counts, i) => {
        right += (counts[atom] ?? 0) * coeffs[reactants.length + i]!;
      });
      if (left !== right) return false;
    }
    return true;
  }

  function rec(index: number) {
    if (index === total) {
      if (!ok()) return;
      const sum = coeffs.reduce((a, b) => a + b, 0);
      if (sum < bestSum) {
        bestSum = sum;
        best = [...coeffs];
      }
      return;
    }
    for (let c = 1; c <= maxCoeff; c++) {
      coeffs[index] = c;
      rec(index + 1);
      if (best && bestSum === total) return; // all ones — optimal
    }
  }

  rec(0);
  return best;
}

export function explainBalanceTemplate(result: BalanceResult) {
  return {
    templateId: "chem.balance.v1",
    verified: result.ok,
    equation: result.equation,
    steps: result.steps,
    refused: result.refused,
  };
}

export function totalAtoms(side: BalancedSpecies[]): AtomCounts {
  return side.reduce<AtomCounts>(
    (acc, species) => addCounts(acc, species.atoms),
    {},
  );
}

export { lcm, gcd };
