import { describe, expect, it } from "vitest";
import { classifyReaction } from "@classos/engines-chem";
import fixtures from "./fixtures/reaction-types.ncert.json";

describe("NCERT reaction types golden set", () => {
  for (const fixture of fixtures) {
    it(fixture.id, () => {
      const result = classifyReaction(fixture.input);
      expect(result.type).toBe(fixture.expected.type);
      expect(result.colourChangeAlone).toBe(false);
    });
  }
});
