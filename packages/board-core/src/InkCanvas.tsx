"use client";

import { useEffect, useRef } from "react";
import { createRafCoalescer } from "./inkLatency";
import { useBoardStore } from "./store";

export function InkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeId = useRef<string | null>(null);
  const lastSelectPoint = useRef<{ x: number; y: number } | null>(null);
  const coalescer = useRef<ReturnType<typeof createRafCoalescer> | null>(null);
  const tool = useBoardStore((s) => s.tool);
  const strokes = useBoardStore((s) => s.strokes);
  const selectedStrokeIds = useBoardStore((s) => s.selectedStrokeIds);
  const beginStroke = useBoardStore((s) => s.beginStroke);
  const extendStrokeBatch = useBoardStore((s) => s.extendStrokeBatch);
  const endStroke = useBoardStore((s) => s.endStroke);
  const selectAt = useBoardStore((s) => s.selectAt);
  const moveSelectedStrokes = useBoardStore((s) => s.moveSelectedStrokes);

  const paintCommitted = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    const selected = new Set(useBoardStore.getState().selectedStrokeIds);
    const chalk =
      getComputedStyle(document.documentElement).getPropertyValue("--co-chalk") ||
      "#d7e6d4";
    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--co-accent") ||
      "#c6f26d";
    for (const stroke of useBoardStore.getState().strokes) {
      if (stroke.points.length < 2) continue;
      ctx.strokeStyle = selected.has(stroke.id) ? accent : chalk;
      ctx.lineWidth = selected.has(stroke.id) ? stroke.width + 1 : stroke.width;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0]!.x, stroke.points[0]!.y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i]!.x, stroke.points[i]!.y);
      }
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      paintCommitted();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    paintCommitted();
  }, [strokes, selectedStrokeIds]);

  useEffect(() => {
    return () => coalescer.current?.cancel();
  }, []);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  return (
    <canvas
      ref={canvasRef}
      aria-label="Blackboard ink surface"
      style={{
        width: "100%",
        height: "100%",
        touchAction: "none",
        cursor: tool === "pen" ? "crosshair" : tool === "select" ? "default" : "crosshair",
        display: "block",
      }}
      onPointerDown={(event) => {
        const point = pointFromEvent(event);
        event.currentTarget.setPointerCapture(event.pointerId);
        if (tool === "select") {
          selectAt(point);
          lastSelectPoint.current = point;
          return;
        }
        if (tool !== "pen") return;
        activeId.current = beginStroke(point);
        coalescer.current?.cancel();
        coalescer.current = createRafCoalescer((batch) => {
          if (!activeId.current) return;
          extendStrokeBatch(activeId.current, batch);
        });
      }}
      onPointerMove={(event) => {
        const point = pointFromEvent(event);
        if (tool === "select" && lastSelectPoint.current && event.buttons === 1) {
          const dx = point.x - lastSelectPoint.current.x;
          const dy = point.y - lastSelectPoint.current.y;
          lastSelectPoint.current = point;
          if (dx || dy) moveSelectedStrokes(dx, dy);
          return;
        }
        if (!activeId.current || !coalescer.current) return;
        coalescer.current.push(point);
      }}
      onPointerUp={() => {
        if (tool === "select") {
          lastSelectPoint.current = null;
          return;
        }
        if (!activeId.current) return;
        coalescer.current?.flushNow();
        endStroke(activeId.current);
        activeId.current = null;
      }}
      onPointerCancel={() => {
        lastSelectPoint.current = null;
        if (!activeId.current) return;
        coalescer.current?.flushNow();
        endStroke(activeId.current);
        activeId.current = null;
      }}
    />
  );
}
