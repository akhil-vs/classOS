export { BoardShell } from "./BoardShell";
export { ChipLayer } from "./ChipLayer";
export { InkCanvas } from "./InkCanvas";
export {
  INK_LATENCY_BUDGET_MS,
  createRafCoalescer,
  estimateLatencyMs,
  latencyMs,
} from "./inkLatency";
export { useBoardStore } from "./store";
export type {
  BoardEvent,
  BoardState,
  BoardTool,
  BoardWidgetInstance,
  Point,
  Stroke,
  SuggestionChip,
  UnitSystem,
} from "./types";
