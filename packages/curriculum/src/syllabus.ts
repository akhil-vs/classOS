/** Ship-gate syllabus validation records (manual review checklist). */
export interface SyllabusValidation {
  chapterId: string;
  syllabusYear: string;
  validatedAgainst: string;
  status: "pending" | "recorded";
  notes?: string;
}

export const syllabusValidations: SyllabusValidation[] = [
  {
    chapterId: "math.10.quadratic-equations",
    syllabusYear: "2025-26",
    validatedAgainst: "CBSE Class 10 Maths — Quadratic Equations (checklist)",
    status: "recorded",
    notes: "Validate again before shipping; inventory is not a locked syllabus.",
  },
  {
    chapterId: "math.10.pair-of-linear-equations-in-two-variables",
    syllabusYear: "2025-26",
    validatedAgainst: "CBSE Class 10 Maths — Pair of Linear Equations",
    status: "recorded",
  },
  {
    chapterId: "math.10.polynomials",
    syllabusYear: "2025-26",
    validatedAgainst: "CBSE Class 10 Maths — Polynomials",
    status: "recorded",
  },
  {
    chapterId: "math.10.arithmetic-progressions",
    syllabusYear: "2025-26",
    validatedAgainst: "CBSE Class 10 Maths — Arithmetic Progressions",
    status: "recorded",
  },
  {
    chapterId: "chem.10.chemical-reactions-and-equations",
    syllabusYear: "2025-26",
    validatedAgainst: "CBSE Class 10 Science — Chemical Reactions and Equations",
    status: "recorded",
  },
];
