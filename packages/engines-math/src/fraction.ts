export interface Fraction {
  n: number;
  d: number;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function frac(n: number, d = 1): Fraction {
  if (d === 0) throw new Error("Division by zero");
  if (n === 0) return { n: 0, d: 1 };
  const sign = n * d < 0 ? -1 : 1;
  const g = gcd(n, d);
  return { n: (sign * Math.abs(n)) / g, d: Math.abs(d) / g };
}

export function add(a: Fraction, b: Fraction): Fraction {
  return frac(a.n * b.d + b.n * a.d, a.d * b.d);
}

export function sub(a: Fraction, b: Fraction): Fraction {
  return frac(a.n * b.d - b.n * a.d, a.d * b.d);
}

export function mul(a: Fraction, b: Fraction): Fraction {
  return frac(a.n * b.n, a.d * b.d);
}

export function div(a: Fraction, b: Fraction): Fraction {
  return frac(a.n * b.d, a.d * b.n);
}

export function neg(a: Fraction): Fraction {
  return frac(-a.n, a.d);
}

export function cmp(a: Fraction, b: Fraction): number {
  return a.n * b.d - b.n * a.d;
}

export function toNumber(a: Fraction): number {
  return a.n / a.d;
}

export function formatFraction(a: Fraction): string {
  if (a.d === 1) return String(a.n);
  return `${a.n}/${a.d}`;
}

export function isPerfectSquare(n: number): boolean {
  if (n < 0) return false;
  const root = Math.round(Math.sqrt(n));
  return root * root === n;
}

export function sqrtInt(n: number): number {
  return Math.round(Math.sqrt(n));
}
