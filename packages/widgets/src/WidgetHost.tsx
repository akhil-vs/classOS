"use client";

import type { BoardWidgetInstance } from "@classos/board-core";
import { BalancerLab } from "./BalancerLab";
import { FunctionGraph } from "./FunctionGraph";
import { InclinedPlane } from "./InclinedPlane";
import { MoleculeView } from "./MoleculeView";
import { QuadraticLab } from "./QuadraticLab";

export function WidgetHost({
  kind,
  onExplain,
}: {
  kind: BoardWidgetInstance["kind"] | string;
  onExplain?: (payload: unknown) => void;
}) {
  switch (kind) {
    case "graph":
      return <FunctionGraph />;
    case "scene":
      return <InclinedPlane />;
    case "molecule":
      return <MoleculeView />;
    case "quadratic":
      return <QuadraticLab onExplain={onExplain} />;
    case "balancer":
      return <BalancerLab onExplain={onExplain} />;
    default:
      return <div>Unknown widget: {kind}</div>;
  }
}
