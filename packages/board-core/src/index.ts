export { BoardShell } from "./BoardShell";
export { ChipLayer } from "./ChipLayer";
export { InkCanvas } from "./InkCanvas";
export {
  INK_LATENCY_BUDGET_MS,
  createRafCoalescer,
  estimateLatencyMs,
  latencyMs,
} from "./inkLatency";
export {
  PILOT_CHIP_INTENTS,
  allowedIntentsForTopic,
  analyseInk,
  clusterNearbyStrokes,
  correctChipIntent,
  cycleChipIntent,
  labelForIntent,
  mergePendingChips,
  recogniseFromStroke,
  recogniseFromStrokes,
} from "./recognise";
export type { ChipIntent, InkFeatures } from "./recognise";
export { useBoardStore } from "./store";
export {
  ALL_TEMPLATES,
  pilotPrimaryTemplates,
  secondaryTemplates,
  templatesForTopic,
} from "./templates";
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
