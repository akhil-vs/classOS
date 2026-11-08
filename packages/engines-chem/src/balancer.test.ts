import { describe, expect, it } from "vitest";
import { balanceEquation, totalAtoms } from "./balancer";
import { parseFormula } from "./formula";

describe("parseFormula", () => {
  it("parses nested groups", () => {
    expect(parseFormula("Ca(OH)2")).toEqual({ Ca: 1, O: 2, H: 2 });
    expect(parseFormula("Fe2(SO4)3")).toEqual({ Fe: 2, S: 3, O: 12 });
  });
});

describe("balanceEquation", () => {
  it("balances H2 + O2 → H2O", () => {
    const result = balanceEquation({
      reactants: ["H2", "O2"],
      products: ["H2O"],
    });
    expect(result.ok).toBe(true);
    expect(result.equation).toBe("2H2 + O2 → 2H2O");
    expect(totalAtoms(result.reactants)).toEqual(totalAtoms(result.products));
  });

  it("balances Fe + H2O → Fe3O4 + H2", () => {
    const result = balanceEquation({
      reactants: ["Fe", "H2O"],
      products: ["Fe3O4", "H2"],
    });
    expect(result.ok).toBe(true);
    expect(result.equation).toBe("3Fe + 4H2O → Fe3O4 + 4H2");
  });
});
