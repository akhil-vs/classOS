/**
 * Phase 0 pen-latency spike helpers.
 * Target: pointer sample → paint ≤ 16 ms on mid-range tablets.
 */

export const INK_LATENCY_BUDGET_MS = 16;

export interface LatencySample {
  pointerTs: number;
  paintTs: number;
}

export function latencyMs(sample: LatencySample): number {
  return sample.paintTs - sample.pointerTs;
}

export function estimateLatencyMs(samples: LatencySample[]): {
  p50: number;
  p95: number;
  withinBudget: boolean;
  budgetMs: number;
} {
  if (samples.length === 0) {
    return {
      p50: 0,
      p95: 0,
      withinBudget: true,
      budgetMs: INK_LATENCY_BUDGET_MS,
    };
  }
  const values = samples.map(latencyMs).sort((a, b) => a - b);
  const p50 = values[Math.floor(values.length * 0.5)] ?? 0;
  const p95 = values[Math.floor(values.length * 0.95)] ?? values[values.length - 1]!;
  return {
    p50,
    p95,
    withinBudget: p95 <= INK_LATENCY_BUDGET_MS,
    budgetMs: INK_LATENCY_BUDGET_MS,
  };
}

/** Coalesce pointer points until the next animation frame. */
export function createRafCoalescer(onFlush: (points: Array<{ x: number; y: number }>) => void) {
  let buffer: Array<{ x: number; y: number }> = [];
  let frame = 0;

  return {
    push(point: { x: number; y: number }) {
      buffer.push(point);
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const batch = buffer;
        buffer = [];
        frame = 0;
        if (batch.length) onFlush(batch);
      });
    },
    flushNow() {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      const batch = buffer;
      buffer = [];
      if (batch.length) onFlush(batch);
    },
    cancel() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      buffer = [];
    },
  };
}
