import { describe, expect, it } from "vitest";
import { classifyReaction } from "./classify";

describe("classifyReaction", () => {
  it("labels water formation as combination", () => {
    const result = classifyReaction({
      reactants: ["H2", "O2"],
      products: ["H2O"],
    });
    expect(result.type).toBe("combination");
    expect(result.balanced.ok).toBe(true);
  });

  it("labels limestone heating as decomposition", () => {
    const result = classifyReaction({
      reactants: ["CaCO3"],
      products: ["CaO", "CO2"],
    });
    expect(result.type).toBe("decomposition");
  });

  it("labels Zn + CuSO4 as displacement", () => {
    const result = classifyReaction({
      reactants: ["Zn", "CuSO4"],
      products: ["ZnSO4", "Cu"],
    });
    expect(result.type).toBe("displacement");
  });

  it("labels Na2SO4 + BaCl2 as double displacement", () => {
    const result = classifyReaction({
      reactants: ["Na2SO4", "BaCl2"],
      products: ["BaSO4", "NaCl"],
    });
    expect(result.type).toBe("double_displacement");
  });

  it("refuses colour-change-only as a chemical type", () => {
    const result = classifyReaction({
      reactants: ["CuSO4"],
      products: ["CuSO4"],
    });
    expect(result.colourChangeAlone).toBe(true);
    expect(result.type).toBe("unknown");
  });
});
