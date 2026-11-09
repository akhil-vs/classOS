import { describe, expect, it } from "vitest";
import {
  INK_LATENCY_BUDGET_MS,
  estimateLatencyMs,
  latencyMs,
} from "./inkLatency";

describe("ink latency spike", () => {
  it("flags samples within the 16 ms budget", () => {
    const report = estimateLatencyMs([
      { pointerTs: 0, paintTs: 8 },
      { pointerTs: 16, paintTs: 28 },
      { pointerTs: 32, paintTs: 44 },
    ]);
    expect(latencyMs({ pointerTs: 0, paintTs: 8 })).toBe(8);
    expect(report.budgetMs).toBe(INK_LATENCY_BUDGET_MS);
    expect(report.withinBudget).toBe(true);
  });

  it("fails the budget when p95 exceeds 16 ms", () => {
    const report = estimateLatencyMs([
      { pointerTs: 0, paintTs: 10 },
      { pointerTs: 20, paintTs: 50 },
    ]);
    expect(report.withinBudget).toBe(false);
  });
});
