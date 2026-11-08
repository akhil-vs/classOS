import { describe, expect, it } from "vitest";
import { balanceEquation } from "@classos/engines-chem";
import fixtures from "./fixtures/reactions.ncert.json";

describe("NCERT chemical reactions golden set", () => {
  for (const fixture of fixtures) {
    it(fixture.id, () => {
      const result = balanceEquation(fixture.input);
      expect(result.ok).toBe(true);
      expect(result.equation).toBe(fixture.expected.equation);
    });
  }
});
