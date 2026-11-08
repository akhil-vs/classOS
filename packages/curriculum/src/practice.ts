import { balanceEquation } from "@classos/engines-chem";
import {
  formatFraction,
  natureLabel,
  solveAP,
  solveLinearSystem,
  solveQuadratic,
} from "@classos/engines-math";
import { getTopicById } from "./loader";

export interface PracticeItem {
  id: string;
  topicId: string;
  prompt: string;
  choices?: string[];
  /** Exact expected answer string for typed / choice check */
  answer: string;
  hint: string;
  engine: "quadratic" | "linear" | "ap" | "balancer" | "polynomial";
}

function pick<T>(items: T[], index: number): T {
  return items[index % items.length]!;
}

/** Deterministic practice items from a topic id + seed (for replayable Check-it). */
export function generatePracticeItems(
  topicId: string,
  seed = 1,
  count = 3,
): PracticeItem[] {
  const topic = getTopicById(topicId);
  const widget = topic?.widget ?? "quadratic";
  const items: PracticeItem[] = [];

  for (let i = 0; i < count; i++) {
    const n = seed + i;
    if (widget === "quadratic" || topicId.includes("quadratic")) {
      const bank = [
        { a: 1, b: -5, c: 6 },
        { a: 1, b: -2, c: 1 },
        { a: 1, b: 1, c: 1 },
        { a: 2, b: -7, c: 3 },
      ];
      const input = pick(bank, n);
      const solved = solveQuadratic(input);
      items.push({
        id: `${topicId}.q.${n}`,
        topicId,
        prompt: `Nature of roots for ${input.a}x² + (${input.b})x + (${input.c}) = 0?`,
        choices: [
          "Two distinct real roots",
          "Two equal real roots",
          "No real roots",
        ],
        answer: natureLabel(solved.nature),
        hint: `Compute D = b² − 4ac = ${formatFraction(solved.discriminant)}.`,
        engine: "quadratic",
      });
      continue;
    }

    if (widget === "linear" || topicId.includes("linear")) {
      const bank = [
        { a1: 1, b1: 1, c1: 5, a2: 1, b2: -1, c2: 1 },
        { a1: 2, b1: 3, c1: 8, a2: 1, b2: -1, c2: 1 },
        { a1: 1, b1: 1, c1: 2, a2: 2, b2: 2, c2: 5 },
      ];
      const input = pick(bank, n);
      const solved = solveLinearSystem(input);
      const answer =
        solved.nature === "unique"
          ? `(${formatFraction(solved.x!)}, ${formatFraction(solved.y!)})`
          : solved.nature;
      items.push({
        id: `${topicId}.l.${n}`,
        topicId,
        prompt: `Solve: ${input.a1}x+${input.b1}y=${input.c1}; ${input.a2}x+${input.b2}y=${input.c2}`,
        choices:
          solved.nature === "unique"
            ? undefined
            : ["unique", "infinite", "none"],
        answer,
        hint: "Compare D, Dₓ, Dᵧ.",
        engine: "linear",
      });
      continue;
    }

    if (widget === "ap" || topicId.includes(".ap.")) {
      const bank = [
        { a: 2, d: 3, n: 5 },
        { a: 5, d: -2, n: 6 },
        { a: 1, d: 1, n: 10 },
      ];
      const input = pick(bank, n);
      const solved = solveAP(input);
      items.push({
        id: `${topicId}.ap.${n}`,
        topicId,
        prompt: `AP a=${input.a}, d=${input.d}. Find aₙ for n=${input.n}.`,
        answer: formatFraction(solved.term),
        hint: "aₙ = a + (n − 1)d",
        engine: "ap",
      });
      continue;
    }

    if (widget === "balancer" || topicId.includes("chemical-reactions")) {
      const bank = [
        { reactants: ["H2", "O2"], products: ["H2O"] },
        { reactants: ["H2", "Cl2"], products: ["HCl"] },
        { reactants: ["Fe", "S"], products: ["FeS"] },
      ];
      const input = pick(bank, n);
      const solved = balanceEquation(input);
      items.push({
        id: `${topicId}.b.${n}`,
        topicId,
        prompt: `Balance: ${input.reactants.join(" + ")} → ${input.products.join(" + ")}`,
        answer: solved.equation,
        hint: "Only change coefficients, never subscripts.",
        engine: "balancer",
      });
      continue;
    }

    // polynomial / default
    items.push({
      id: `${topicId}.p.${n}`,
      topicId,
      prompt: "Evaluate p(x) = x² − 3x + 2 at x = 2",
      answer: "0",
      hint: "Substitute carefully or use Horner.",
      engine: "polynomial",
    });
  }

  return items;
}

export function gradePracticeAnswer(item: PracticeItem, response: string) {
  const normalize = (value: string) =>
    value.replace(/\s+/g, "").toLowerCase().replace(/→/g, "->");
  const ok = normalize(response) === normalize(item.answer);
  return {
    ok,
    expected: item.answer,
    feedback: ok
      ? "Correct — matches the verified engine output."
      : `Not yet. Verified answer: ${item.answer}`,
  };
}
