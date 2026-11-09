import { formatFraction, type Fraction } from "./fraction";
import { solveLinear, type LinearInput } from "./linear";
import { solveQuadratic, type QuadraticInput } from "./quadratic";

/**
 * Teacher-private equivalence checks.
 * Results are for teacher / author tooling — not student-facing scoreboards.
 * Learner attempts stay private (DPDP); only the teacher session sees match detail.
 */

export interface EquivalenceResult {
  equivalent: boolean;
  method: string;
  detail: string;
  teacherPrivate: true;
}

function fracEqual(a: Fraction, b: Fraction): boolean {
  return a.n === b.n && a.d === b.d;
}

/** Compare a student linear answer (value or equation) to the engine solution. */
export function linearAnswerEquivalent(
  problem: LinearInput,
  studentX: number,
): EquivalenceResult {
  const solution = solveLinear(problem);
  if (solution.kind !== "unique" || !solution.x) {
    return {
      equivalent: false,
      method: "linear-unique-root",
      detail: `Engine kind is ${solution.kind}; no unique x to match.`,
      teacherPrivate: true,
    };
  }
  const student = solveLinear({ a: 1, b: -studentX, c: 0 });
  const ok =
    student.kind === "unique" &&
    student.x !== null &&
    fracEqual(student.x, solution.x);
  return {
    equivalent: ok,
    method: "linear-exact-fraction",
    detail: ok
      ? `Student x matches engine x = ${formatFraction(solution.x)}.`
      : `Student x ≠ engine x = ${formatFraction(solution.x)}.`,
    teacherPrivate: true,
  };
}

/** Multiset compare of quadratic roots (order-independent). */
export function quadraticRootsEquivalent(
  problem: QuadraticInput,
  studentRoots: number[],
): EquivalenceResult {
  const solution = solveQuadratic(problem);
  if (!solution.numericCheck.ok) {
    return {
      equivalent: false,
      method: "quadratic-two-path",
      detail: solution.numericCheck.warning ?? "Two-path disagreement.",
      teacherPrivate: true,
    };
  }
  if (solution.nature === "no_real") {
    const ok = studentRoots.length === 0;
    return {
      equivalent: ok,
      method: "quadratic-no-real",
      detail: ok
        ? "Student correctly reported no real roots."
        : "Engine has no real roots; student supplied values.",
      teacherPrivate: true,
    };
  }
  const expected = solution.roots
    .map((root) => root.numeric)
    .filter((value): value is number => value !== undefined)
    .sort((a, b) => a - b);
  const got = [...studentRoots].sort((a, b) => a - b);
  if (expected.length !== got.length) {
    return {
      equivalent: false,
      method: "quadratic-root-count",
      detail: `Expected ${expected.length} roots, got ${got.length}.`,
      teacherPrivate: true,
    };
  }
  const ok = expected.every((value, i) => Math.abs(value - got[i]!) < 1e-6);
  return {
    equivalent: ok,
    method: "quadratic-numeric-multiset",
    detail: ok
      ? "Student roots match engine roots (order-independent)."
      : `Expected [${expected.join(", ")}], got [${got.join(", ")}].`,
    teacherPrivate: true,
  };
}
