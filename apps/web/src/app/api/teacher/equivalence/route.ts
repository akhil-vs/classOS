import {
  linearAnswerEquivalent,
  quadraticRootsEquivalent,
} from "@classos/engines-math";
import { NextResponse } from "next/server";

/**
 * Teacher-private equivalence — not for student scoreboards.
 * Results must stay in the teacher session (DPDP: learner work private).
 */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    kind?: "linear" | "quadratic";
    problem?: Record<string, number>;
    studentX?: number;
    studentRoots?: number[];
  };

  if (body.kind === "linear" && body.problem && body.studentX !== undefined) {
    const result = linearAnswerEquivalent(
      {
        a: Number(body.problem.a),
        b: Number(body.problem.b),
        c: Number(body.problem.c ?? 0),
      },
      body.studentX,
    );
    return NextResponse.json(result);
  }

  if (body.kind === "quadratic" && body.problem && body.studentRoots) {
    const result = quadraticRootsEquivalent(
      {
        a: Number(body.problem.a),
        b: Number(body.problem.b),
        c: Number(body.problem.c),
      },
      body.studentRoots,
    );
    return NextResponse.json(result);
  }

  return NextResponse.json(
    { error: "Expected kind linear|quadratic with problem + student answer" },
    { status: 400 },
  );
}
