import type { TopicModule } from "../types";

export const geometryTopics: TopicModule[] = [
  {
    id: "math.10.coordinate-geometry.distance",
    subject: "mathematics",
    classLevel: 10,
    chapter: "Coordinate Geometry",
    topic: "Distance formula",
    syllabusYear: "2025-26",
    status: "in_progress",
    studentInput: {
      touch: ["drag endpoint on grid"],
      pointerKeyboard: ["type x₂, y₂", "arrow-adjust"],
      boardTriggers: ["distance formula", "segment"],
    },
    boardResponse: "Live segment with √(Δx²+Δy²) and residual check",
    understandingGoal: "Distance is Pythagoras on the coordinate plane",
    modes: ["see", "build", "derive", "check"],
    misconceptions: [
      {
        error: "Forget to square both Δx and Δy",
        demo: "Show residual when only one term is squared",
      },
    ],
    engines: ["geometry"],
    goldenTests: ["ncert.geometry.distance.3-4-5"],
    languages: ["en", "hi"],
    widget: "geometry",
    shipGate: {
      syllabusValidated: true,
      syllabusYear: "2025-26",
      syllabusNote: "One geometry slice under Phase 2 vertical — not full chapter",
      teacherReviewed: false,
      qaTouchVerified: true,
      qaKeyboardVerified: true,
      assumptionsPresent: true,
      goldenIds: ["ncert.geometry.distance.3-4-5"],
    },
  },
];
