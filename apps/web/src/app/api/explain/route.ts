import { explainBalanceTemplate, type BalanceResult } from "@classos/engines-chem";
import {
  explainAPTemplate,
  explainLinearTemplate,
  explainPolynomialTemplate,
  explainQuadraticTemplate,
  type APResult,
  type LinearSolution,
  type PolynomialEval,
  type QuadraticSolution,
} from "@classos/engines-math";
import { NextResponse } from "next/server";

type TemplatePayload = {
  templateId?: string;
  verified?: boolean;
  steps?: string[];
  equation?: string;
  refused?: string;
  nature?: string;
  discriminant?: string;
  roots?: string[];
  x?: string;
  y?: string;
  term?: string;
  sum?: string;
  value?: string;
};

/**
 * Explain stub: only narrates template steps from verified engine output.
 * Never invents numeric results — if verification failed, refuse.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    topicId?: string;
    engineResult?: unknown;
  };

  const result = body.engineResult as
    | QuadraticSolution
    | LinearSolution
    | APResult
    | PolynomialEval
    | BalanceResult
    | TemplatePayload
    | undefined;

  if (!result) {
    return NextResponse.json(
      { error: "Missing verified engine result." },
      { status: 400 },
    );
  }

  if ("templateId" in result && result.templateId) {
    return fromTemplate(result, body.topicId);
  }

  if ("discriminant" in result && "roots" in result) {
    return fromTemplate(
      explainQuadraticTemplate(result as QuadraticSolution),
      body.topicId,
    );
  }

  if ("nature" in result && ("x" in result || result.nature !== undefined) && !("roots" in result) && !("term" in result)) {
    return fromTemplate(
      explainLinearTemplate(result as LinearSolution),
      body.topicId,
    );
  }

  if ("term" in result && "sum" in result) {
    return fromTemplate(explainAPTemplate(result as APResult), body.topicId);
  }

  if ("value" in result && "at" in result) {
    return fromTemplate(
      explainPolynomialTemplate(result as PolynomialEval),
      body.topicId,
    );
  }

  if ("equation" in result || "ok" in result) {
    return fromTemplate(
      explainBalanceTemplate(result as BalanceResult),
      body.topicId,
    );
  }

  return NextResponse.json(
    {
      error:
        "Unrecognized engine payload. Explain only accepts verified engine output.",
    },
    { status: 400 },
  );
}

function fromTemplate(explained: TemplatePayload, topicId?: string) {
  if (!explained.verified) {
    return NextResponse.json({
      prose:
        explained.refused ??
        "I will not show an answer — verification failed or the item is out of scope.",
      templateId: explained.templateId,
      verified: false,
    });
  }

  const lines = [
    `Verified engine narration${topicId ? ` for ${topicId}` : ""}.`,
  ];
  if (explained.discriminant) {
    lines.push(
      `Discriminant D = ${explained.discriminant} → ${explained.nature}.`,
    );
  }
  if (explained.roots) {
    lines.push(`Roots: ${explained.roots.join(", ")}.`);
  }
  if (explained.x && explained.y) {
    lines.push(`Solution: (${explained.x}, ${explained.y}).`);
  }
  if (explained.nature && !explained.discriminant && !explained.x) {
    lines.push(`Nature: ${explained.nature}.`);
  }
  if (explained.term) {
    lines.push(`aₙ = ${explained.term}; Sₙ = ${explained.sum}.`);
  }
  if (explained.value) {
    lines.push(`Value: ${explained.value}.`);
  }
  if (explained.equation) {
    lines.push(`Equation: ${explained.equation}.`);
  }
  lines.push("", "Steps:");
  for (const [index, step] of (explained.steps ?? []).entries()) {
    lines.push(`${index + 1}. ${step}`);
  }

  return NextResponse.json({
    prose: lines.join("\n"),
    steps: explained.steps,
    templateId: explained.templateId,
    verified: true,
  });
}
