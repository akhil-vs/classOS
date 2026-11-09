"use client";

import { create } from "zustand";
import type {
  BoardState,
  BoardTool,
  BoardWidgetInstance,
  Point,
  Stroke,
  SuggestionChip,
  UnitSystem,
} from "./types";

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function recogniseFromStroke(stroke: Stroke): SuggestionChip | null {
  if (stroke.points.length < 8) return null;
  const xs = stroke.points.map((p) => p.x);
  const ys = stroke.points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX;
  const height = maxY - minY;
  const last = stroke.points[stroke.points.length - 1]!;

  // Heuristic stubs — real ink models plug in later (Phase 0: do not block UI).
  if (width > 80 && height > 40 && height / Math.max(width, 1) < 0.75) {
    return {
      id: uid("chip"),
      label: "Quadratic ax²+bx+c=0?",
      intent: "quadratic",
      x: last.x,
      y: last.y,
    };
  }
  if (width > 100 && height < 36) {
    return {
      id: uid("chip"),
      label: "Linear ax+b=c?",
      intent: "linear",
      x: last.x,
      y: last.y,
    };
  }
  if (width > 40 && height > 60) {
    return {
      id: uid("chip"),
      label: "Balance reaction?",
      intent: "balancer",
      x: last.x,
      y: last.y,
    };
  }
  return {
    id: uid("chip"),
    label: "Open graph?",
    intent: "graph",
    x: last.x,
    y: last.y,
  };
}

function strokeHits(stroke: Stroke, point: Point, pad = 8): boolean {
  for (const p of stroke.points) {
    if (Math.hypot(p.x - point.x, p.y - point.y) <= pad) return true;
  }
  return false;
}

interface BoardStore extends BoardState {
  setTool: (tool: BoardTool) => void;
  setAiEnabled: (enabled: boolean) => void;
  setUnitSystem: (system: UnitSystem) => void;
  setAssumptionBanner: (banner?: string) => void;
  setTopicId: (topicId?: string) => void;
  beginStroke: (point: Point) => string;
  extendStroke: (id: string, point: Point) => void;
  extendStrokeBatch: (id: string, points: Point[]) => void;
  endStroke: (id: string) => void;
  selectAt: (point: Point) => void;
  moveSelectedStrokes: (dx: number, dy: number) => void;
  deleteSelection: () => void;
  selectWidget: (widgetId: string | null) => void;
  removeWidget: (widgetId: string) => void;
  undo: () => void;
  clearBoard: () => void;
  confirmChip: (chipId: string) => void;
  dismissChip: (chipId: string) => void;
  insertTemplate: (kind: BoardWidgetInstance["kind"]) => void;
}

const initial: BoardState = {
  tool: "pen",
  aiEnabled: true,
  unitSystem: "si",
  strokes: [],
  chips: [],
  widgets: [],
  selectedStrokeIds: [],
  selectedWidgetIds: [],
  timeline: [],
};

export const useBoardStore = create<BoardStore>((set, get) => ({
  ...initial,
  setTool: (tool) => set({ tool }),
  setAiEnabled: (enabled) =>
    set((state) => ({
      aiEnabled: enabled,
      chips: enabled ? state.chips : [],
      timeline: [
        ...state.timeline,
        { type: "ai", enabled, at: Date.now() },
      ],
    })),
  setUnitSystem: (system) =>
    set((state) => ({
      unitSystem: system,
      timeline: [...state.timeline, { type: "units", system, at: Date.now() }],
    })),
  setAssumptionBanner: (banner) => set({ assumptionBanner: banner }),
  setTopicId: (topicId) => set({ topicId }),
  beginStroke: (point) => {
    const id = uid("stroke");
    const stroke: Stroke = {
      id,
      points: [point],
      color: "var(--co-chalk)",
      width: 2.5,
    };
    set((state) => ({
      strokes: [...state.strokes, stroke],
      selectedStrokeIds: [],
      selectedWidgetIds: [],
    }));
    return id;
  },
  extendStroke: (id, point) => {
    set((state) => ({
      strokes: state.strokes.map((stroke) =>
        stroke.id === id
          ? { ...stroke, points: [...stroke.points, point] }
          : stroke,
      ),
    }));
  },
  extendStrokeBatch: (id, points) => {
    if (points.length === 0) return;
    set((state) => ({
      strokes: state.strokes.map((stroke) =>
        stroke.id === id
          ? { ...stroke, points: [...stroke.points, ...points] }
          : stroke,
      ),
    }));
  },
  endStroke: (id) => {
    const stroke = get().strokes.find((item) => item.id === id);
    if (!stroke) return;
    const events = [
      ...get().timeline,
      { type: "stroke" as const, stroke, at: Date.now() },
    ];
    if (!get().aiEnabled) {
      set({ timeline: events });
      return;
    }
    const chip = recogniseFromStroke(stroke);
    if (!chip) {
      set({ timeline: events });
      return;
    }
    set({
      timeline: [...events, { type: "chip", chip, at: Date.now() }],
      chips: [...get().chips, chip],
    });
  },
  selectAt: (point) => {
    const strokes = get().strokes;
    let hit: Stroke | undefined;
    for (let i = strokes.length - 1; i >= 0; i--) {
      const stroke = strokes[i]!;
      if (strokeHits(stroke, point)) {
        hit = stroke;
        break;
      }
    }
    const strokeIds = hit ? [hit.id] : [];
    set((state) => ({
      selectedStrokeIds: strokeIds,
      selectedWidgetIds: [],
      timeline: [
        ...state.timeline,
        { type: "select", strokeIds, widgetIds: [], at: Date.now() },
      ],
    }));
  },
  moveSelectedStrokes: (dx, dy) => {
    const selected = new Set(get().selectedStrokeIds);
    if (selected.size === 0) return;
    set((state) => ({
      strokes: state.strokes.map((stroke) =>
        selected.has(stroke.id)
          ? {
              ...stroke,
              points: stroke.points.map((point) => ({
                x: point.x + dx,
                y: point.y + dy,
              })),
            }
          : stroke,
      ),
    }));
  },
  deleteSelection: () => {
    const strokeIds = new Set(get().selectedStrokeIds);
    const widgetIds = new Set(get().selectedWidgetIds);
    if (strokeIds.size === 0 && widgetIds.size === 0) return;
    set((state) => ({
      strokes: state.strokes.filter((stroke) => !strokeIds.has(stroke.id)),
      widgets: state.widgets.filter((widget) => !widgetIds.has(widget.id)),
      selectedStrokeIds: [],
      selectedWidgetIds: [],
    }));
  },
  selectWidget: (widgetId) =>
    set((state) => ({
      selectedWidgetIds: widgetId ? [widgetId] : [],
      selectedStrokeIds: widgetId ? [] : state.selectedStrokeIds,
      timeline: [
        ...state.timeline,
        {
          type: "select",
          strokeIds: [],
          widgetIds: widgetId ? [widgetId] : [],
          at: Date.now(),
        },
      ],
    })),
  removeWidget: (widgetId) =>
    set((state) => ({
      widgets: state.widgets.filter((widget) => widget.id !== widgetId),
      selectedWidgetIds: state.selectedWidgetIds.filter((id) => id !== widgetId),
    })),
  undo: () => {
    set((state) => {
      if (state.strokes.length === 0) return state;
      return {
        strokes: state.strokes.slice(0, -1),
        selectedStrokeIds: [],
        timeline: [...state.timeline, { type: "undo", at: Date.now() }],
      };
    });
  },
  clearBoard: () =>
    set({
      strokes: [],
      chips: [],
      widgets: [],
      selectedStrokeIds: [],
      selectedWidgetIds: [],
      timeline: [],
      assumptionBanner: undefined,
    }),
  confirmChip: (chipId) => {
    const chip = get().chips.find((item) => item.id === chipId);
    if (!chip) return;
    const widget: BoardWidgetInstance = {
      id: uid("widget"),
      kind: chip.intent,
      title: chip.label.replace(/\?$/, ""),
    };
    set((state) => ({
      chips: state.chips.filter((item) => item.id !== chipId),
      widgets: [...state.widgets, widget],
      timeline: [
        ...state.timeline,
        { type: "open-widget", widget, at: Date.now() },
      ],
    }));
  },
  dismissChip: (chipId) =>
    set((state) => ({
      chips: state.chips.filter((item) => item.id !== chipId),
    })),
  insertTemplate: (kind) => {
    const titles: Record<BoardWidgetInstance["kind"], string> = {
      graph: "Function graph",
      scene: "Inclined plane",
      molecule: "Molecule view",
      quadratic: "Quadratic lab",
      balancer: "Equation balancer",
      linear: "Linear equations",
      geometry: "Geometry slice",
    };
    const widget: BoardWidgetInstance = {
      id: uid("widget"),
      kind,
      title: titles[kind],
    };
    set((state) => ({
      widgets: [...state.widgets, widget],
      timeline: [
        ...state.timeline,
        { type: "open-widget", widget, at: Date.now() },
      ],
    }));
  },
}));
