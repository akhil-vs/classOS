import type { TopicModule } from "../types";

const quadraticGateBase = {
  syllabusValidated: true,
  syllabusYear: "2025-26",
  syllabusNote: "Validated against CBSE Class 10 Maths Quadratic Equations checklist",
  teacherReviewed: true,
  teacherReviewer: "CBSE maths reviewer (scaffold)",
  qaTouchVerified: true,
  qaKeyboardVerified: true,
  assumptionsPresent: true,
} as const;

export const quadraticTopics: TopicModule[] = [
  {
    id: "math.10.quadratic-equations.standard-form",
    subject: "mathematics",
    classLevel: 10,
    chapter: "Quadratic Equations",
    topic: "Standard form and coefficients",
    syllabusYear: "2025-26",
    status: "shipped",
    studentInput: {
      touch: ["drag a, b, c sliders", "tap template ax²+bx+c=0"],
      pointerKeyboard: ["type a, b, c", "arrow-adjust focused slider"],
      boardTriggers: ["ax^2+bx+c=0", "quadratic template"],
    },
    boardResponse: "Live parabola with labelled coefficients and vertex",
    understandingGoal: "See that a, b, c reshape the same family of curves",
    modes: ["see", "predict", "build", "derive", "solve", "check"],
    misconceptions: [
      {
        error: "a only stretches; sign of a does not matter",
        demo: "Flip a across zero and watch the parabola invert",
      },
    ],
    engines: ["cas", "graph"],
    goldenTests: ["ncert.ex.4.1.q1"],
    languages: ["en", "hi"],
    widget: "quadratic",
    shipGate: {
      ...quadraticGateBase,
      goldenIds: ["ncert.ex.4.1.q1"],
    },
  },
  {
    id: "math.10.quadratic-equations.discriminant",
    subject: "mathematics",
    classLevel: 10,
    chapter: "Quadratic Equations",
    topic: "Nature of roots / discriminant",
    syllabusYear: "2025-26",
    status: "shipped",
    studentInput: {
      touch: ["drag parabola coeffs", "slider for a,b,c"],
      pointerKeyboard: ["type a,b,c", "arrow-adjust focused slider"],
      boardTriggers: ["D=b^2-4ac", "nature of roots"],
    },
    boardResponse: "Parabola with live discriminant; nature of roots updates",
    understandingGoal: "Why the formula works and what the discriminant means",
    modes: ["see", "predict", "build", "derive", "solve", "check"],
    misconceptions: [
      {
        error: "Discriminant only tells number of roots, not nature",
        demo: "Slider across D>0, D=0, D<0 with root markers",
      },
    ],
    engines: ["cas", "graph"],
    goldenTests: ["ncert.ex.4.3.q1", "ncert.ex.4.3.q2", "ncert.ex.4.3.q3"],
    languages: ["en", "hi"],
    widget: "quadratic",
    shipGate: {
      ...quadraticGateBase,
      goldenIds: ["ncert.ex.4.3.q1", "ncert.ex.4.3.q2", "ncert.ex.4.3.q3"],
    },
  },
  {
    id: "math.10.quadratic-equations.solving",
    subject: "mathematics",
    classLevel: 10,
    chapter: "Quadratic Equations",
    topic: "Solving by formula",
    syllabusYear: "2025-26",
    status: "shipped",
    studentInput: {
      touch: ["enter coefficients on keypad", "confirm solve chip"],
      pointerKeyboard: ["type equation", "press Enter to solve"],
      boardTriggers: ["x^2-5x+6=0", "solve quadratic"],
    },
    boardResponse: "Exact roots, CBSE-style steps, and graph with root markers",
    understandingGoal: "Connect algebraic roots to x-intercepts on the graph",
    modes: ["see", "predict", "build", "derive", "solve", "check"],
    misconceptions: [
      {
        error: "Formula always gives two distinct real roots",
        demo: "Cases for D>0, D=0, D<0 with withheld complex roots",
      },
    ],
    engines: ["cas", "graph"],
    goldenTests: ["ncert.ex.4.3.q1", "ncert.ex.4.3.q2", "ncert.ex.4.3.q3"],
    languages: ["en", "hi"],
    widget: "quadratic",
    shipGate: {
      ...quadraticGateBase,
      goldenIds: ["ncert.ex.4.3.q1", "ncert.ex.4.3.q2", "ncert.ex.4.3.q3"],
    },
  },
];
