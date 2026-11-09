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
