import type { BoardWidgetInstance } from "./types";

export type TemplateKind = BoardWidgetInstance["kind"];

export interface TemplateSpec {
  kind: TemplateKind;
  label: string;
  /** Shown in the Phase 4 learner-pilot rail by default. */
  pilotPrimary: boolean;
}

export const ALL_TEMPLATES: TemplateSpec[] = [
  { kind: "quadratic", label: "Quadratic", pilotPrimary: true },
  { kind: "balancer", label: "Balance", pilotPrimary: true },
  { kind: "linear", label: "Linear", pilotPrimary: false },
  { kind: "geometry", label: "Geometry", pilotPrimary: false },
  { kind: "graph", label: "Graph", pilotPrimary: false },
  { kind: "scene", label: "Scene", pilotPrimary: false },
  { kind: "molecule", label: "Molecule", pilotPrimary: false },
];

/** Primary templates for the learner pilot (shipped Quadratic + Reactions). */
export function pilotPrimaryTemplates(): TemplateSpec[] {
  return ALL_TEMPLATES.filter((item) => item.pilotPrimary);
}

/** Extra templates kept behind "More" so they do not clutter the pilot rail. */
export function secondaryTemplates(): TemplateSpec[] {
  return ALL_TEMPLATES.filter((item) => !item.pilotPrimary);
}

/**
 * When a Learn topic opens the board, prefer that topic's widget first,
 * then the other pilot primary — never dump unused demos into the rail.
 */
export function templatesForTopic(widget?: TemplateKind | string): {
  primary: TemplateSpec[];
  secondary: TemplateSpec[];
} {
  if (!widget) {
    return {
      primary: pilotPrimaryTemplates(),
      secondary: secondaryTemplates(),
    };
  }
  const match = ALL_TEMPLATES.find((item) => item.kind === widget);
  const primary = match
    ? [
        match,
        ...pilotPrimaryTemplates().filter((item) => item.kind !== match.kind),
      ]
    : pilotPrimaryTemplates();
  const primaryKinds = new Set(primary.map((item) => item.kind));
  return {
    primary,
    secondary: ALL_TEMPLATES.filter((item) => !primaryKinds.has(item.kind)),
  };
}
