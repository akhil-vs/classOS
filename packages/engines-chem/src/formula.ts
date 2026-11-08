export type AtomCounts = Record<string, number>;

const TOKEN =
  /([A-Z][a-z]?)(\d*)|(\()|(\))(\d*)/g;

/** Parse a simple formula like H2O, Fe2(SO4)3, Ca(OH)2 into atom counts. */
export function parseFormula(formula: string): AtomCounts {
  const cleaned = formula.replace(/\s+/g, "");
  if (!/^[A-Za-z0-9()]+$/.test(cleaned)) {
    throw new Error(`Unsupported formula: ${formula}`);
  }

  const stack: AtomCounts[] = [{}];
  let matched = false;
  cleaned.replace(TOKEN, (_, elem, elemCount, open, close, closeCount) => {
    matched = true;
    if (elem) {
      const n = elemCount ? Number(elemCount) : 1;
      const top = stack[stack.length - 1]!;
      top[elem] = (top[elem] ?? 0) + n;
    } else if (open) {
      stack.push({});
    } else if (close) {
      const group = stack.pop();
      if (!group || stack.length === 0) {
        throw new Error(`Unbalanced parentheses in ${formula}`);
      }
      const mult = closeCount ? Number(closeCount) : 1;
      const top = stack[stack.length - 1]!;
      for (const [atom, count] of Object.entries(group)) {
        top[atom] = (top[atom] ?? 0) + count * mult;
      }
    }
    return "";
  });

  if (!matched || stack.length !== 1) {
    throw new Error(`Could not parse formula: ${formula}`);
  }
  return stack[0]!;
}

export function multiplyCounts(counts: AtomCounts, k: number): AtomCounts {
  const out: AtomCounts = {};
  for (const [atom, n] of Object.entries(counts)) {
    out[atom] = n * k;
  }
  return out;
}

export function addCounts(a: AtomCounts, b: AtomCounts): AtomCounts {
  const out: AtomCounts = { ...a };
  for (const [atom, n] of Object.entries(b)) {
    out[atom] = (out[atom] ?? 0) + n;
  }
  return out;
}

export function formatFormula(formula: string, coefficient: number): string {
  if (coefficient === 1) return formula;
  return `${coefficient}${formula}`;
}
