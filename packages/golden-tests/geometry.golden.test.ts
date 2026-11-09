import { describe, expect, it } from "vitest";
import { segmentDistance } from "@classos/engines-math";
import fixtures from "./fixtures/geometry.ncert.json";

describe("geometry golden set", () => {
  for (const fixture of fixtures) {
    it(fixture.id, () => {
      const result = segmentDistance(fixture.input);
      expect(result.distance.value).toBe(fixture.expected.distance);
      expect(result.numericCheck.ok).toBe(true);
    });
  }
});
