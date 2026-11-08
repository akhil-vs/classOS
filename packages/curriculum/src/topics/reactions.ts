import type { TopicModule } from "../types";

export const reactionTopics: TopicModule[] = [
  {
    id: "chem.10.chemical-reactions.balancing",
    subject: "chemistry",
    classLevel: 10,
    chapter: "Chemical Reactions and Equations",
    topic: "Balancing chemical equations",
    syllabusYear: "2025-26",
    status: "in_progress",
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
  },
  {
    id: "chem.10.chemical-reactions.types",
    subject: "chemistry",
    classLevel: 10,
    chapter: "Chemical Reactions and Equations",
    topic: "Types of chemical reactions",
    syllabusYear: "2025-26",
    status: "in_progress",
    studentInput: {
      touch: ["pick reaction template", "scrub particle animation"],
      pointerKeyboard: ["select type from list", "space to play/pause"],
      boardTriggers: ["combination", "decomposition", "displacement"],
    },
    boardResponse: "Beaker observation linked to particle view and balanced equation",
    understandingGoal: "Classify by what happens to reactants, not by colour alone",
    modes: ["see", "predict", "build", "derive", "solve", "check"],
    misconceptions: [
      {
        error: "Any colour change is a chemical reaction",
        demo: "Contrast dissolving copper sulphate with burning magnesium",
      },
    ],
    engines: ["balancer", "molecule"],
    goldenTests: ["ncert.chem10.reactions.balance.water"],
    languages: ["en", "hi"],
    widget: "balancer",
  },
];
