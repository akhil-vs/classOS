import { balanceEquation, type BalanceInput, type BalanceResult } from "./balancer";
import { parseFormula, type AtomCounts } from "./formula";

export type ReactionType =
  | "combination"
  | "decomposition"
  | "displacement"
  | "double_displacement"
  | "unknown";

export interface ClassificationResult {
  type: ReactionType;
  label: string;
  steps: string[];
  balanced: BalanceResult;
  colourChangeAlone: boolean;
}

function elementCount(atoms: AtomCounts): number {
  return Object.keys(atoms).length;
}

function isElement(formula: string): boolean {
  try {
    return elementCount(parseFormula(formula)) === 1;
  } catch {
    return false;
  }
}

function isCompound(formula: string): boolean {
  try {
    return elementCount(parseFormula(formula)) >= 2;
  } catch {
    return false;
  }
}

/**
 * Classify a classroom reaction by stoichiometry pattern (NCERT types).
 * Engines decide; AI only explains the verified type + balanced equation.
 */
export function classifyReaction(input: BalanceInput): ClassificationResult {
  const balanced = balanceEquation(input);
  const reactants = input.reactants.map((s) => s.trim()).filter(Boolean);
  const products = input.products.map((s) => s.trim()).filter(Boolean);
  const steps = [
    `Reactants (${reactants.length}): ${reactants.join(", ") || "—"}.`,
    `Products (${products.length}): ${products.join(", ") || "—"}.`,
  ];

  // Colour-change-only demos are physical changes — not classified as reactions.
  const colourChangeAlone =
    reactants.length === 1 &&
    products.length === 1 &&
    reactants[0] === products[0];

  if (colourChangeAlone) {
    steps.push(
      "Same formula on both sides — observation may be colour/state only, not a chemical type.",
    );
    return {
      type: "unknown",
      label: "Not a chemical reaction type (observation-only)",
      steps,
      balanced,
      colourChangeAlone: true,
    };
  }

  if (reactants.length >= 2 && products.length === 1) {
    steps.push("Multiple reactants → one product ⇒ combination.");
    return {
      type: "combination",
      label: "Combination",
      steps: [...steps, ...(balanced.ok ? balanced.steps : [])],
      balanced,
      colourChangeAlone: false,
    };
  }

  if (reactants.length === 1 && products.length >= 2) {
    steps.push("One reactant → multiple products ⇒ decomposition.");
    return {
      type: "decomposition",
      label: "Decomposition",
      steps: [...steps, ...(balanced.ok ? balanced.steps : [])],
      balanced,
      colourChangeAlone: false,
    };
  }

  if (reactants.length === 2 && products.length === 2) {
    const [r0, r1] = reactants;
    const hasElement = isElement(r0!) || isElement(r1!);
    const hasCompound = isCompound(r0!) || isCompound(r1!);
    if (hasElement && hasCompound) {
      steps.push("Element + compound → two products ⇒ displacement.");
      return {
        type: "displacement",
        label: "Displacement",
        steps: [...steps, ...(balanced.ok ? balanced.steps : [])],
        balanced,
        colourChangeAlone: false,
      };
    }
    if (isCompound(r0!) && isCompound(r1!)) {
      steps.push("Compound + compound → two products ⇒ double displacement.");
      return {
        type: "double_displacement",
        label: "Double displacement",
        steps: [...steps, ...(balanced.ok ? balanced.steps : [])],
        balanced,
        colourChangeAlone: false,
      };
    }
  }

  steps.push("Pattern not in the Class 10 type templates — withhold a forced label.");
  return {
    type: "unknown",
    label: "Out of scope / unclear",
    steps,
    balanced,
    colourChangeAlone: false,
  };
}

export function explainClassificationTemplate(result: ClassificationResult) {
  return {
    templateId: "chem.reaction-types.v1",
    verified: result.type !== "unknown" || result.colourChangeAlone,
    type: result.type,
    label: result.label,
    equation: result.balanced.ok ? result.balanced.equation : undefined,
    steps: result.steps,
    colourChangeAlone: result.colourChangeAlone,
  };
}
