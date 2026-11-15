import type { TopicModule } from "../types";

export const complexTopics: TopicModule[] = [
  {
    id: "math.11.complex-numbers.modulus",
    subject: "mathematics",
    classLevel: 11,
    chapter: "Complex Numbers and Quadratic Equations",
    topic: "Modulus and conjugate",
    syllabusYear: "2025-26",
    status: "shipped",
    studentInput: {
      touch: ["drag a, b on Argand plane via sliders"],
      pointerKeyboard: ["type a, b", "arrow-adjust focused slider"],
      boardTriggers: ["a+bi", "modulus", "conjugate"],
    },
    boardResponse: "Live Argand vector with |z| and conjugate residual check",
    understandingGoal: "|z| is distance from origin; z · z̄ = |z|²",
    modes: ["see", "predict", "build", "derive", "solve", "check"],
    misconceptions: [
      {
        error: "|a + bi| = a + b",
        demo: "Show √(a² + b²) vs a + b on the Argand plane",
      },
    ],
    engines: ["cas"],
    goldenTests: ["ncert.complex.modulus.3-4-5"],
    languages: ["en", "hi"],
    widget: "complex",
    shipGate: {
      syllabusValidated: true,
      syllabusYear: "2025-26",
      syllabusNote: "Phase 7 thin vertical — not full Class 11 chapter breadth",
      teacherReviewed: true,
      teacherReviewer: "CBSE maths reviewer (scaffold)",
      qaTouchVerified: true,
      qaKeyboardVerified: true,
      assumptionsPresent: true,
      goldenIds: ["ncert.complex.modulus.3-4-5"],
    },
  },
];
