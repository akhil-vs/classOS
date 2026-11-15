export type BoardTool = "pen" | "select" | "template";

export type UnitSystem = "si" | "classroom";

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
}

export interface SuggestionChip {
  id: string;
  label: string;
  intent: "quadratic" | "balancer" | "graph" | "scene" | "molecule" | "linear" | "geometry";
  x: number;
  y: number;
  /** 0–1 heuristic confidence; correction sets this to 1. */
  confidence?: number;
  /** Other allowed intents the learner can cycle to in one tap. */
  alternatives?: Array<
    "quadratic" | "balancer" | "graph" | "scene" | "molecule" | "linear" | "geometry"
  >;
  /** True when ink was ambiguous — learner should pick before confirming. */
  needsPick?: boolean;
  /** Strokes that produced this suggestion (cluster ids). */
  sourceStrokeIds?: string[];
}

export interface BoardWidgetInstance {
  id: string;
  kind: "graph" | "scene" | "molecule" | "quadratic" | "balancer" | "linear" | "geometry";
  title: string;
  /** Top-left offset on the board overlay (select tool can move widgets). */
  x?: number;
  y?: number;
}

export type BoardEvent =
  | { type: "stroke"; stroke: Stroke; at: number }
  | { type: "undo"; at: number }
  | { type: "chip"; chip: SuggestionChip; at: number }
  | { type: "open-widget"; widget: BoardWidgetInstance; at: number }
  | { type: "clear-chips"; at: number }
  | { type: "ai"; enabled: boolean; at: number }
  | { type: "select"; strokeIds: string[]; widgetIds: string[]; at: number }
  | { type: "units"; system: UnitSystem; at: number };

export interface BoardState {
  tool: BoardTool;
  aiEnabled: boolean;
  unitSystem: UnitSystem;
  strokes: Stroke[];
  chips: SuggestionChip[];
  widgets: BoardWidgetInstance[];
  selectedStrokeIds: string[];
  selectedWidgetIds: string[];
  timeline: BoardEvent[];
  topicId?: string;
  /** Live assumption string from the active scene widget (Phase 1b). */
  assumptionBanner?: string;
}
