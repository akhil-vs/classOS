export type Dimension = {
  L?: number;
  M?: number;
  T?: number;
  Θ?: number;
  N?: number;
  I?: number;
};

export interface Quantity {
  value: number;
  unit: string;
  dimension: Dimension;
}

const UNIT_DIMENSIONS: Record<string, Dimension> = {
  "1": {},
  deg: {},
  rad: {},
  m: { L: 1 },
  cm: { L: 1 },
  mm: { L: 1 },
  km: { L: 1 },
  kg: { M: 1 },
  g: { M: 1 },
  s: { T: 1 },
  K: { Θ: 1 },
  mol: { N: 1 },
  A: { I: 1 },
  N: { M: 1, L: 1, T: -2 },
  J: { M: 1, L: 2, T: -2 },
  "m/s": { L: 1, T: -1 },
  "m/s^2": { L: 1, T: -2 },
  "kg·m/s^2": { M: 1, L: 1, T: -2 },
};

/** SI scale relative to the base unit of each dimension family (length → m, mass → kg). */
const UNIT_SCALE: Record<string, number> = {
  "1": 1,
  deg: 1,
  rad: 1,
  m: 1,
  cm: 0.01,
  mm: 0.001,
  km: 1000,
  kg: 1,
  g: 0.001,
  s: 1,
  K: 1,
  mol: 1,
  A: 1,
  N: 1,
  J: 1,
  "m/s": 1,
  "m/s^2": 1,
  "kg·m/s^2": 1,
};

export type UnitSystem = "si" | "classroom";

export function dimensionOf(unit: string): Dimension | null {
  return UNIT_DIMENSIONS[unit] ?? null;
}

export function sameDimension(a: Dimension, b: Dimension): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]) as Set<
    keyof Dimension
  >;
  for (const key of keys) {
    if ((a[key] ?? 0) !== (b[key] ?? 0)) return false;
  }
  return true;
}

export function multiplyDimensions(a: Dimension, b: Dimension): Dimension {
  const out: Dimension = { ...a };
  for (const key of Object.keys(b) as Array<keyof Dimension>) {
    const next = (out[key] ?? 0) + (b[key] ?? 0);
    if (next === 0) delete out[key];
    else out[key] = next;
  }
  return out;
}

export function divideDimensions(a: Dimension, b: Dimension): Dimension {
  const negated: Dimension = {};
  for (const key of Object.keys(b) as Array<keyof Dimension>) {
    const value = b[key];
    if (value) negated[key] = -value;
  }
  return multiplyDimensions(a, negated);
}

export function assertCompatible(a: Quantity, b: Quantity): boolean {
  return sameDimension(a.dimension, b.dimension);
}

export function quantity(value: number, unit: string): Quantity {
  const dimension = dimensionOf(unit);
  if (!dimension) {
    throw new Error(`Unknown unit: ${unit}`);
  }
  return { value, unit, dimension };
}

export function formatQuantity(q: Quantity, digits = 3): string {
  const value = Number.isInteger(q.value)
    ? String(q.value)
    : q.value.toFixed(digits).replace(/\.?0+$/, "");
  if (q.unit === "1" || q.unit === "deg") {
    return q.unit === "deg" ? `${value}°` : value;
  }
  return `${value} ${q.unit}`;
}

/** Convert within the same dimension using the scale table (e.g. cm → m). */
export function convertQuantity(q: Quantity, toUnit: string): Quantity {
  const target = dimensionOf(toUnit);
  if (!target || !sameDimension(q.dimension, target)) {
    throw new Error(`Cannot convert ${q.unit} → ${toUnit}`);
  }
  const fromScale = UNIT_SCALE[q.unit];
  const toScale = UNIT_SCALE[toUnit];
  if (fromScale === undefined || toScale === undefined) {
    throw new Error(`Missing scale for ${q.unit} or ${toUnit}`);
  }
  return quantity((q.value * fromScale) / toScale, toUnit);
}

export function multiplyQuantities(a: Quantity, b: Quantity, unit: string): Quantity {
  const dimension = multiplyDimensions(a.dimension, b.dimension);
  const expected = dimensionOf(unit);
  if (!expected || !sameDimension(dimension, expected)) {
    throw new Error(`Result unit ${unit} does not match product dimensions`);
  }
  return quantity(a.value * b.value, unit);
}
