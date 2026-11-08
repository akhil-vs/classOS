import type { TopicModule } from "../types";

export const class9MathsTopics: TopicModule[] = [
  {
    id: "math.9.polynomials.value",
    subject: "mathematics",
    classLevel: 9,
    chapter: "Polynomials",
    topic: "Value of a polynomial",
    syllabusYear: "2025-26",
    status: "in_progress",
    studentInput: {
      touch: ["slider for x", "tap coefficients"],
      pointerKeyboard: ["type coeffs and x"],
      boardTriggers: ["p(2)=", "evaluate polynomial"],
    },
    boardResponse: "Horner evaluation with live graph marker",
    understandingGoal: "Substitution is mechanical and exact — no invented arithmetic",
    modes: ["see", "predict", "build", "derive", "solve", "check"],
    misconceptions: [
      {
        error: "Only expand fully before substituting",
        demo: "Horner path vs expanded path, same verified value",
      },
    ],
    engines: ["cas", "graph"],
    goldenTests: ["ncert.poly9.eval.q1"],
    languages: ["en", "hi"],
    widget: "polynomial",
  },
  {
    id: "math.9.linear-equations.graph",
    subject: "mathematics",
    classLevel: 9,
    chapter: "Linear Equations in Two Variables",
    topic: "Graph of ax + by + c = 0",
    syllabusYear: "2025-26",
    status: "in_progress",
    studentInput: {
      touch: ["drag intercepts"],
      pointerKeyboard: ["type a, b, c"],
      boardTriggers: ["plot linear equation"],
    },
    boardResponse: "Single line with intercept readouts",
    understandingGoal: "Infinitely many solutions sit on one straight line",
    modes: ["see", "predict", "build", "derive", "solve", "check"],
    misconceptions: [
      {
        error: "A linear equation in two variables has a unique solution",
        demo: "Highlight many points satisfying the same equation",
      },
    ],
    engines: ["graph"],
    goldenTests: ["ncert.linear9.q1"],
    languages: ["en", "hi"],
    widget: "linear",
  },
];
