"use client";

import { create } from "zustand";
import type {
  BoardState,
  BoardTool,
  BoardWidgetInstance,
  Point,
  Stroke,
  SuggestionChip,
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

  // Heuristic stubs — real ink models plug in later.
  if (width > 80 && height > 40 && height / Math.max(width, 1) < 0.75) {
    return {
      id: uid("chip"),
      label: "Quadratic ax²+bx+c=0?",
      intent: "quadratic",
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

interface BoardStore extends BoardState {
  setTool: (tool: BoardTool) => void;
  setAiEnabled: (enabled: boolean) => void;
  setTopicId: (topicId?: string) => void;
  beginStroke: (point: Point) => string;
  extendStroke: (id: string, point: Point) => void;
  endStroke: (id: string) => void;
  undo: () => void;
  clearBoard: () => void;
  confirmChip: (chipId: string) => void;
  dismissChip: (chipId: string) => void;
  insertTemplate: (kind: BoardWidgetInstance["kind"] | string) => void;
}

const initial: BoardState = {
  tool: "pen",
  aiEnabled: true,
  strokes: [],
  chips: [],
  widgets: [],
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
  setTopicId: (topicId) => set({ topicId }),
  beginStroke: (point) => {
    const id = uid("stroke");
    const stroke: Stroke = {
      id,
      points: [point],
      color: "var(--co-chalk)",
      width: 2.5,
    };
    set((state) => ({ strokes: [...state.strokes, stroke] }));
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
  undo: () => {
    set((state) => {
      if (state.strokes.length === 0) return state;
      return {
        strokes: state.strokes.slice(0, -1),
        timeline: [...state.timeline, { type: "undo", at: Date.now() }],
      };
    });
  },
  clearBoard: () =>
    set({
      strokes: [],
      chips: [],
      widgets: [],
      timeline: [],
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
    const titles: Record<string, string> = {
      graph: "Function graph",
      scene: "Inclined plane",
      molecule: "Molecule view",
      quadratic: "Quadratic lab",
      balancer: "Equation balancer",
      linear: "Linear system lab",
      polynomial: "Polynomial lab",
      ap: "Arithmetic progression",
    };
    const widgetKind = (kind in titles
      ? kind
      : "graph") as BoardWidgetInstance["kind"];
    const widget: BoardWidgetInstance = {
      id: uid("widget"),
      kind: widgetKind,
      title: titles[widgetKind] ?? "Widget",
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
