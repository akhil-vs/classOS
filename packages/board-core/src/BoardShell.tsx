"use client";

import { useKeyboardMap } from "@classos/input-kit";
import { BrandMark } from "@classos/ui";
import type { ReactNode } from "react";
import { ChipLayer } from "./ChipLayer";
import { InkCanvas } from "./InkCanvas";
import { useBoardStore } from "./store";
import type { BoardWidgetInstance } from "./types";

export function BoardShell({
  renderWidget,
  assumption,
  liveBar,
  inkFrozen = false,
  mode = "personal",
}: {
  renderWidget?: (widget: BoardWidgetInstance) => ReactNode;
  assumption?: string;
  /** Classroom live strip (join count / Predict / end). */
  liveBar?: ReactNode;
  /** When Predict is open, freeze ink on the projected board. */
  inkFrozen?: boolean;
  mode?: "personal" | "classroom";
}) {
  const tool = useBoardStore((s) => s.tool);
  const aiEnabled = useBoardStore((s) => s.aiEnabled);
  const unitSystem = useBoardStore((s) => s.unitSystem);
  const widgets = useBoardStore((s) => s.widgets);
  const selectedWidgetIds = useBoardStore((s) => s.selectedWidgetIds);
  const assumptionBanner = useBoardStore((s) => s.assumptionBanner);
  const setTool = useBoardStore((s) => s.setTool);
  const setAiEnabled = useBoardStore((s) => s.setAiEnabled);
  const setUnitSystem = useBoardStore((s) => s.setUnitSystem);
  const undo = useBoardStore((s) => s.undo);
  const deleteSelection = useBoardStore((s) => s.deleteSelection);
  const insertTemplate = useBoardStore((s) => s.insertTemplate);
  const selectWidget = useBoardStore((s) => s.selectWidget);
  const removeWidget = useBoardStore((s) => s.removeWidget);
  const moveSelectedStrokes = useBoardStore((s) => s.moveSelectedStrokes);

  useKeyboardMap({
    z: (event) => {
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault();
        undo();
      }
    },
    Z: (event) => {
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault();
        undo();
      }
    },
    Delete: () => deleteSelection(),
    Backspace: (event) => {
      event.preventDefault();
      deleteSelection();
    },
    ArrowLeft: (event) => {
      if (tool !== "select") return;
      event.preventDefault();
      moveSelectedStrokes(event.shiftKey ? -10 : -2, 0);
    },
    ArrowRight: (event) => {
      if (tool !== "select") return;
      event.preventDefault();
      moveSelectedStrokes(event.shiftKey ? 10 : 2, 0);
    },
    ArrowUp: (event) => {
      if (tool !== "select") return;
      event.preventDefault();
      moveSelectedStrokes(0, event.shiftKey ? -10 : -2);
    },
    ArrowDown: (event) => {
      if (tool !== "select") return;
      event.preventDefault();
      moveSelectedStrokes(0, event.shiftKey ? 10 : 2);
    },
  });

  const banner = assumptionBanner ?? assumption;

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        background: "var(--co-bg)",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "12px 16px",
          borderBottom: "1px solid var(--co-border)",
          background: "rgba(15, 20, 25, 0.92)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 5,
          flexWrap: "wrap",
        }}
      >
        <BrandMark compact />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Toggle
            label={`Units ${unitSystem.toUpperCase()}`}
            pressed={unitSystem === "si"}
            onClick={() =>
              setUnitSystem(unitSystem === "si" ? "classroom" : "si")
            }
          />
          <Toggle
            label={`AI ${aiEnabled ? "on" : "off"}`}
            pressed={aiEnabled}
            onClick={() => setAiEnabled(!aiEnabled)}
          />
          <Toggle label="Undo" pressed={false} onClick={undo} />
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(72px, 96px) 1fr",
          minHeight: 0,
        }}
        className="board-layout"
      >
        <aside
          style={{
            borderRight: "1px solid var(--co-border)",
            padding: 10,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            background: "var(--co-bg-elevated)",
          }}
        >
          <RailButton
            label="Pen"
            active={tool === "pen"}
            onClick={() => setTool("pen")}
          />
          <RailButton
            label="Select"
            active={tool === "select"}
            onClick={() => setTool("select")}
          />
          <div
            style={{
              height: 1,
              background: "var(--co-border)",
              margin: "6px 0",
            }}
          />
          <RailButton
            label="Graph"
            active={false}
            onClick={() => insertTemplate("graph")}
          />
          <RailButton
            label="Scene"
            active={false}
            onClick={() => insertTemplate("scene")}
          />
          <RailButton
            label="Molecule"
            active={false}
            onClick={() => insertTemplate("molecule")}
          />
          <RailButton
            label="Quadratic"
            active={false}
            onClick={() => insertTemplate("quadratic")}
          />
          <RailButton
            label="Linear"
            active={false}
            onClick={() => insertTemplate("linear")}
          />
          <RailButton
            label="Geometry"
            active={false}
            onClick={() => insertTemplate("geometry")}
          />
          <RailButton
            label="Balance"
            active={false}
            onClick={() => insertTemplate("balancer")}
          />
        </aside>

        <section
          style={{
            position: "relative",
            minHeight: 420,
            background: `
              linear-gradient(var(--co-board-grid) 1px, transparent 1px),
              linear-gradient(90deg, var(--co-board-grid) 1px, transparent 1px),
              var(--co-board)
            `,
            backgroundSize: "28px 28px, 28px 28px, auto",
          }}
        >
          {inkFrozen ? (
            <div
              aria-live="polite"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 4,
                display: "grid",
                placeItems: "center",
                background: "rgba(15, 20, 25, 0.45)",
                color: "var(--co-accent)",
                fontFamily: "var(--co-font-brand)",
                fontSize: 22,
                letterSpacing: "-0.02em",
                pointerEvents: "all",
              }}
            >
              Predict open — board frozen for votes
            </div>
          ) : null}
          <InkCanvas />
          <ChipLayer />
          {banner && (
            <div
              role="status"
              style={{
                position: "absolute",
                left: 16,
                bottom: 16,
                padding: "8px 12px",
                borderRadius: 10,
                background: "rgba(240, 180, 41, 0.12)",
                border: "1px solid rgba(240, 180, 41, 0.35)",
                color: "var(--co-warn)",
                fontSize: 13,
                zIndex: 2,
                maxWidth: "min(420px, calc(100% - 32px))",
              }}
            >
              Assumptions: {banner}
            </div>
          )}
          <div
            style={{
              position: "absolute",
              right: 16,
              top: 16,
              display: "grid",
              gap: 12,
              width: "min(360px, calc(100% - 32px))",
              maxHeight: "calc(100% - 32px)",
              overflow: "auto",
              zIndex: 3,
            }}
          >
            {widgets.map((widget) => {
              const selected = selectedWidgetIds.includes(widget.id);
              return (
                <div
                  key={widget.id}
                  onClick={() => tool === "select" && selectWidget(widget.id)}
                  style={{
                    borderRadius: "var(--co-radius)",
                    border: selected
                      ? "1px solid var(--co-accent)"
                      : "1px solid var(--co-border)",
                    background: "rgba(28, 37, 48, 0.94)",
                    boxShadow: "var(--co-shadow)",
                    padding: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      marginBottom: 8,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--co-font-brand)",
                        fontSize: 15,
                      }}
                    >
                      {widget.title}
                    </div>
                    <button
                      type="button"
                      aria-label={`Dismiss ${widget.title}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        removeWidget(widget.id);
                      }}
                      style={{
                        border: "1px solid var(--co-border)",
                        background: "transparent",
                        color: "var(--co-ink-muted)",
                        borderRadius: 8,
                        minHeight: 36,
                        minWidth: 36,
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>
                  {renderWidget?.(widget)}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {liveBar}
      <footer
        style={{
          borderTop: "1px solid var(--co-border)",
          padding: "10px 16px",
          color: "var(--co-ink-muted)",
          fontSize: 13,
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span>
          {mode === "classroom" ? "Classroom board · " : ""}
          {aiEnabled
            ? "AI on — chips need confirm before anything opens"
            : "Blackboard only — ink and templates, no chips"}
          {" · "}
          Units {unitSystem.toUpperCase()} · quantities carry dimensions
        </span>
        <span>
          {widgets.length} widget(s) · Select + Delete · Ctrl/Cmd+Z undo
        </span>
      </footer>
      <style>{`
        @media (max-width: 720px) {
          .board-layout {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto 1fr;
          }
          .board-layout > aside {
            flex-direction: row !important;
            overflow-x: auto;
            border-right: none !important;
            border-bottom: 1px solid var(--co-border);
          }
        }
      `}</style>
    </div>
  );
}

function RailButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: "var(--co-hit)",
        borderRadius: 10,
        border: active
          ? "1px solid var(--co-accent)"
          : "1px solid var(--co-border)",
        background: active ? "rgba(198, 242, 109, 0.14)" : "transparent",
        color: "var(--co-ink)",
        cursor: "pointer",
        padding: "0 8px",
      }}
    >
      {label}
    </button>
  );
}

function Toggle({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      style={{
        minHeight: "var(--co-hit)",
        padding: "0 14px",
        borderRadius: 999,
        border: pressed
          ? "1px solid var(--co-accent)"
          : "1px solid var(--co-border)",
        background: pressed ? "rgba(198, 242, 109, 0.14)" : "transparent",
        color: pressed ? "var(--co-accent)" : "var(--co-ink)",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
