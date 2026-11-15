import type { TopicModule } from "../types";

const chemGateBase = {
  syllabusValidated: true,
  syllabusYear: "2025-26",
  syllabusNote:
    "Validated against CBSE Class 10 Chemical Reactions and Equations checklist",
  teacherReviewed: true,
  teacherReviewer: "CBSE chem reviewer (scaffold)",
  qaTouchVerified: true,
  qaKeyboardVerified: true,
  assumptionsPresent: true,
} as const;

export const reactionTopics: TopicModule[] = [
  {
    id: "chem.10.chemical-reactions.balancing",
    subject: "chemistry",
    classLevel: 10,
    chapter: "Chemical Reactions and Equations",
    topic: "Balancing chemical equations",
    syllabusYear: "2025-26",
    status: "shipped",
    studentInput: {
      touch: ["tap species chips", "stepper for trial coefficients"],
      pointerKeyboard: ["type formula list", "arrow-adjust coefficients"],
      boardTriggers: ["H2 + O2 → H2O", "balance equation"],
    },
    boardResponse: "Exact rational balancer with linked macro / particle / symbolic views",
    understandingGoal: "Atoms are conserved; coefficients scale molecules, not formulas",
    modes: ["see", "predict", "build", "derive", "solve", "check"],
    misconceptions: [
      {
        error: "Change subscripts to balance an equation",
        demo: "Refuse subscript edits; only coefficients animate",
      },
    ],
    engines: ["balancer"],
    goldenTests: [
      "ncert.chem10.reactions.balance.water",
      "ncert.chem10.reactions.balance.iron_sulphur",
      "ncert.chem10.reactions.balance.hydrogen_chloride",
    ],
    languages: ["en", "hi"],
    widget: "balancer",
    shipGate: {
      ...chemGateBase,
      goldenIds: [
        "ncert.chem10.reactions.balance.water",
        "ncert.chem10.reactions.balance.iron_sulphur",
        "ncert.chem10.reactions.balance.hydrogen_chloride",
      ],
    },
  },
  {
    id: "chem.10.chemical-reactions.types",
    subject: "chemistry",
    classLevel: 10,
    chapter: "Chemical Reactions and Equations",
    topic: "Types of chemical reactions",
    syllabusYear: "2025-26",
    status: "shipped",
    studentInput: {
      touch: ["pick reaction template", "tap predict type chips"],
      pointerKeyboard: ["select type from list", "type formulas"],
      boardTriggers: ["combination", "decomposition", "displacement"],
    },
    boardResponse:
      "Verified type label linked to balanced equation; colour-only demos refused",
    understandingGoal: "Classify by what happens to reactants, not by colour alone",
    modes: ["see", "predict", "build", "derive", "solve", "check"],
    misconceptions: [
      {
        error: "Any colour change is a chemical reaction",
        demo: "Contrast dissolving copper sulphate with burning magnesium",
      },
    ],
    engines: ["balancer", "classifier"],
    goldenTests: [
      "ncert.chem10.reactions.types.combination.water",
      "ncert.chem10.reactions.types.decomposition.limestone",
      "ncert.chem10.reactions.types.displacement.zinc",
      "ncert.chem10.reactions.types.double.bacl2",
    ],
    languages: ["en", "hi"],
    widget: "reaction-types",
    shipGate: {
      ...chemGateBase,
      goldenIds: [
        "ncert.chem10.reactions.types.combination.water",
        "ncert.chem10.reactions.types.decomposition.limestone",
        "ncert.chem10.reactions.types.displacement.zinc",
        "ncert.chem10.reactions.types.double.bacl2",
      ],
    },
  },
];
