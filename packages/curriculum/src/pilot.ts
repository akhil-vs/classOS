import { getAllTopics } from "./loader";
import type { TopicModule } from "./types";

/** Phase 4 learner pilot focuses on shipped Quadratic + Reactions only. */
export function getPilotTopics(): TopicModule[] {
  return getAllTopics().filter(
    (topic) =>
      topic.status === "shipped" &&
      (topic.chapter === "Quadratic Equations" ||
        topic.chapter === "Chemical Reactions and Equations"),
  );
}

export function isPilotTopic(topic: TopicModule): boolean {
  return getPilotTopics().some((item) => item.id === topic.id);
}

/**
 * Pedagogical assumptions for the assumption banner.
 * Keep this separate from unit-system chrome and from "engines calculate" copy.
 */
export function topicAssumptions(topic?: TopicModule): string {
  if (!topic) {
    return "Templates preferred over freehand · confirm chips before widgets open";
  }
  switch (topic.widget) {
    case "quadratic":
      return "Real coefficients · complex roots withheld when D < 0 · a, b, c are dimensionless";
    case "balancer":
      return "Closed system · atoms conserved · subscripts fixed (coefficients only)";
    case "linear":
      return "Simultaneous linear equations over the reals · unique / none / infinite shown honestly";
    case "geometry":
      return "Euclidean plane figures · lengths in the same unit family";
    case "scene":
      return "Textbook idealisations — see live scene flags (friction, point mass, g)";
    case "molecule":
      return "Ball-and-stick schematic · not a free-hand organic structure";
    default:
      return `${topic.chapter} · assumptions stay visible while you work`;
  }
}

/** Dimensioned physics widgets need the units toggle; algebra / stoichiometry do not. */
export function topicUsesUnits(topic?: TopicModule): boolean {
  if (!topic?.widget) return false;
  return topic.widget === "scene" || topic.widget === "graph";
}

export function predictOptionsForTopic(topic: TopicModule): string[] {
  if (topic.widget === "quadratic") {
    return ["D > 0", "D = 0", "D < 0", "Not sure"];
  }
  if (topic.widget === "balancer") {
    return ["Already balanced", "Needs coefficients", "Impossible / refuse", "Not sure"];
  }
  if (topic.widget === "linear") {
    return ["Unique solution", "No solution", "Infinite solutions", "Not sure"];
  }
  return ["Likely", "Unlikely", "Not sure"];
}
