import type { Quantity } from "@classos/engines-math";

/**
 * Shared scene description (Phase 1b thin).
 * Full simulator pipeline comes later — this type is the contract.
 */
export type SceneKind = "inclined_plane" | "free_body" | "projectile";

export interface SceneAssumption {
  id: string;
  label: string;
  enabled: boolean;
}

export interface SceneBody {
  id: string;
  label: string;
  mass: Quantity;
}

export interface SceneDescription {
  kind: SceneKind;
  assumptions: SceneAssumption[];
  bodies: SceneBody[];
  /** Degrees for incline; unused for other kinds in 1b */
  angleDeg?: number;
  g: Quantity;
}
