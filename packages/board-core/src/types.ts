export type BoardTool = "pen" | "select" | "template";

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

export type WidgetKind =
  | "graph"
  | "scene"
  | "molecule"
  | "quadratic"
  | "balancer"
  | "linear"
  | "polynomial"
  | "ap";

export interface SuggestionChip {
  id: string;
  label: string;
  intent: WidgetKind;
  x: number;
  y: number;
}

export interface BoardWidgetInstance {
  id: string;
  kind: WidgetKind;
  title: string;
}

export type BoardEvent =
  | { type: "stroke"; stroke: Stroke; at: number }
  | { type: "undo"; at: number }
  | { type: "chip"; chip: SuggestionChip; at: number }
  | { type: "open-widget"; widget: BoardWidgetInstance; at: number }
  | { type: "clear-chips"; at: number }
  | { type: "ai"; enabled: boolean; at: number };

export interface BoardState {
  tool: BoardTool;
  aiEnabled: boolean;
  strokes: Stroke[];
  chips: SuggestionChip[];
  widgets: BoardWidgetInstance[];
  timeline: BoardEvent[];
  topicId?: string;
}
