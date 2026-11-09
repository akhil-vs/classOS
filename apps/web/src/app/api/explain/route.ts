import { explainBalanceTemplate, type BalanceResult } from "@classos/engines-chem";
import {
  explainLinearTemplate,
  explainQuadraticTemplate,
  type LinearSolution,
  type QuadraticSolution,
} from "@classos/engines-math";
import { NextResponse } from "next/server";

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
    | BalanceResult
    | {
        templateId?: string;
        verified?: boolean;
        steps?: string[];
        equation?: string;
        refused?: string;
      }
    | undefined;

  if (!result) {
    return NextResponse.json(
      { error: "Missing verified engine result." },
      { status: 400 },
    );
  }

  if ("nature" in result && "discriminant" in result) {
    const explained = explainQuadraticTemplate(result);
    if (!explained.verified) {
      return NextResponse.json({
        prose:
          "I will not show an answer — the symbolic and numeric checks disagree. Adjust the inputs or review the equation.",
        templateId: explained.templateId,
        verified: false,
      });
    }
    const prose = [
      `Using verified CAS output for ${body.topicId ?? "quadratic"}.`,
      `Discriminant D = ${explained.discriminant} → ${explained.nature}.`,
      `Roots: ${explained.roots.join(", ")}.`,
      "",
      "CBSE-style steps:",
      ...explained.steps.map((step, index) => `${index + 1}. ${step}`),
    ].join("\n");
    return NextResponse.json({
      prose,
      steps: explained.steps,
      templateId: explained.templateId,
      verified: true,
    });
  }

  if ("kind" in result && "numericCheck" in result && !("nature" in result)) {
    const linear = result as LinearSolution;
    if (!linear.numericCheck.ok) {
      return NextResponse.json({
        prose:
          linear.numericCheck.warning ??
          "I will not show an answer — checks disagree.",
        verified: false,
      });
    }
    const prose = [
      `Using verified linear CAS for ${body.topicId ?? "linear"}.`,
      "",
      ...explainLinearTemplate(linear)
        .split("\n")
        .map((step, index) => `${index + 1}. ${step}`),
    ].join("\n");
    return NextResponse.json({ prose, verified: true });
  }

  if ("templateId" in result && result.templateId === "chem.balance.v1") {
    if (!result.verified) {
      return NextResponse.json({
        prose:
          result.refused ??
          "I cannot explain an unbalanced or out-of-scope equation.",
        verified: false,
        templateId: result.templateId,
      });
    }
    const prose = [
      `Verified balancer result${body.topicId ? ` for ${body.topicId}` : ""}.`,
      `Equation: ${result.equation}`,
      "",
      "Steps:",
      ...(result.steps ?? []).map((step, index) => `${index + 1}. ${step}`),
    ].join("\n");
    return NextResponse.json({
      prose,
      steps: result.steps,
      templateId: result.templateId,
      verified: true,
    });
  }

  if ("equation" in result || "ok" in result) {
    const balance = result as BalanceResult;
    const explained = explainBalanceTemplate(balance);
    if (!explained.verified) {
      return NextResponse.json({
        prose: explained.refused ?? "Unable to balance.",
        verified: false,
        templateId: explained.templateId,
      });
    }
    const prose = [
      "Verified chemical equation balance.",
      `Equation: ${explained.equation}`,
      "",
      "Steps:",
      ...explained.steps.map((step, index) => `${index + 1}. ${step}`),
    ].join("\n");
    return NextResponse.json({
      prose,
      steps: explained.steps,
      templateId: explained.templateId,
      verified: true,
    });
  }

  return NextResponse.json(
    {
      error:
        "Unrecognized engine payload. Explain only accepts verified CAS or balancer output.",
    },
    { status: 400 },
  );
}
