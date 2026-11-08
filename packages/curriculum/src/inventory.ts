import inventoryJson from "../data/inventory.json";
import type { Subject } from "./types";

export interface InventoryFile {
  source: string;
  scopeNote: string;
  subjects: Record<
    Subject,
    Record<
      string,
      {
        phase: number;
        chapters?: string[];
        topics?: string[];
      }
    >
  >;
  counts: {
    mathChapters_9_to_12: number;
    physicsChapters_9_to_12: number;
    chemistryChapters_9_to_12: number;
    foundationTopicBundles: number;
    totalTrackedUnits: number;
  };
}

export const inventory = inventoryJson as InventoryFile;

export function listInventoryChapters(subject: Subject, classLevel: number) {
  const key = `class_${classLevel}` as const;
  const band = inventory.subjects[subject][key];
  if (!band?.chapters) return [];
  return band.chapters.map((title) => ({
    title,
    phase: band.phase,
    subject,
    classLevel,
  }));
}

export function inventoryCounts() {
  return inventory.counts;
}
