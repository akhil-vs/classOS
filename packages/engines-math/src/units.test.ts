import { describe, expect, it } from "vitest";
import {
  assertCompatible,
  convertQuantity,
  divideDimensions,
  formatQuantity,
  multiplyDimensions,
  multiplyQuantities,
  quantity,
} from "./units";

describe("units", () => {
  it("checks dimension compatibility", () => {
    const force = quantity(10, "N");
    const other = quantity(2, "kg·m/s^2");
    expect(assertCompatible(force, other)).toBe(true);
    expect(assertCompatible(force, quantity(1, "m"))).toBe(false);
  });

  it("formats and converts length", () => {
    const cm = quantity(150, "cm");
    expect(formatQuantity(cm)).toBe("150 cm");
    expect(convertQuantity(cm, "m")).toEqual(quantity(1.5, "m"));
  });

  it("multiplies and divides dimensions", () => {
    const accel = divideDimensions({ L: 1 }, { T: 2 });
    expect(accel).toEqual({ L: 1, T: -2 });
    const forceDim = multiplyDimensions({ M: 1 }, accel);
    expect(forceDim).toEqual({ M: 1, L: 1, T: -2 });
  });

  it("multiplies quantities into newtons", () => {
    const mass = quantity(2, "kg");
    const accel = quantity(3, "m/s^2");
    expect(multiplyQuantities(mass, accel, "N")).toEqual(quantity(6, "N"));
  });
});
