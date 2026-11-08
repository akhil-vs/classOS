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
  m: { L: 1 },
  kg: { M: 1 },
  s: { T: 1 },
  K: { Θ: 1 },
  mol: { N: 1 },
  A: { I: 1 },
  N: { M: 1, L: 1, T: -2 },
  J: { M: 1, L: 2, T: -2 },
  "m/s": { L: 1, T: -1 },
  "m/s^2": { L: 1, T: -2 },
};

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
