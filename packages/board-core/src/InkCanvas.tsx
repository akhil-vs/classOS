"use client";

import { useEffect, useRef } from "react";
import { useBoardStore } from "./store";

export function InkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeId = useRef<string | null>(null);
  const tool = useBoardStore((s) => s.tool);
  const strokes = useBoardStore((s) => s.strokes);
  const beginStroke = useBoardStore((s) => s.beginStroke);
  const extendStroke = useBoardStore((s) => s.extendStroke);
  const endStroke = useBoardStore((s) => s.endStroke);

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
      draw();
    };
    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      for (const stroke of useBoardStore.getState().strokes) {
        if (stroke.points.length < 2) continue;
        ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue("--co-chalk") || "#d7e6d4";
        ctx.lineWidth = stroke.width;
        ctx.beginPath();
        ctx.moveTo(stroke.points[0]!.x, stroke.points[0]!.y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i]!.x, stroke.points[i]!.y);
        }
        ctx.stroke();
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    for (const stroke of strokes) {
      if (stroke.points.length < 2) continue;
      ctx.strokeStyle =
        getComputedStyle(document.documentElement).getPropertyValue("--co-chalk") ||
        "#d7e6d4";
      ctx.lineWidth = stroke.width;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0]!.x, stroke.points[0]!.y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i]!.x, stroke.points[i]!.y);
      }
      ctx.stroke();
    }
  }, [strokes]);

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
        cursor: tool === "pen" ? "crosshair" : "default",
        display: "block",
      }}
      onPointerDown={(event) => {
        if (tool !== "pen") return;
        event.currentTarget.setPointerCapture(event.pointerId);
        activeId.current = beginStroke(pointFromEvent(event));
      }}
      onPointerMove={(event) => {
        if (!activeId.current) return;
        extendStroke(activeId.current, pointFromEvent(event));
      }}
      onPointerUp={() => {
        if (!activeId.current) return;
        endStroke(activeId.current);
        activeId.current = null;
      }}
      onPointerCancel={() => {
        if (!activeId.current) return;
        endStroke(activeId.current);
        activeId.current = null;
      }}
    />
  );
}
