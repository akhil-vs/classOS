export type Subject = "mathematics" | "physics" | "chemistry";

export type TopicMode =
  | "see"
  | "predict"
  | "build"
  | "derive"
  | "solve"
  | "check";

export type TopicStatus = "planned" | "in_progress" | "shipped";

export interface Misconception {
  error: string;
  demo: string;
}

export interface StudentInput {
  touch: string[];
  pointerKeyboard: string[];
  boardTriggers?: string[];
}

/** Per-chapter ship gate evidence (topic-schema.md). */
export interface ShipGate {
  syllabusValidated: boolean;
  syllabusYear: string;
  syllabusNote?: string;
  teacherReviewed: boolean;
  teacherReviewer?: string;
  qaTouchVerified: boolean;
  qaKeyboardVerified: boolean;
  assumptionsPresent: boolean;
  goldenIds: string[];
}

export interface TopicModule {
  id: string;
  subject: Subject;
  classLevel: number;
  chapter: string;
  topic: string;
  syllabusYear: string;
  status: TopicStatus;
  studentInput: StudentInput;
  boardResponse: string;
  understandingGoal: string;
  modes: TopicMode[];
  misconceptions: Misconception[];
  engines: string[];
  goldenTests: string[];
  languages: Array<"en" | "hi">;
  widget?:
    | "graph"
    | "scene"
    | "molecule"
    | "quadratic"
    | "balancer"
    | "linear"
    | "geometry";
  shipGate?: ShipGate;
}

export interface ChapterSummary {
  id: string;
  subject: Subject;
  classLevel: number;
  title: string;
  phase: number;
  topicIds: string[];
}

export interface BrowseIndex {
  classes: number[];
  subjects: Subject[];
  chapters: ChapterSummary[];
  topics: TopicModule[];
}

export interface ShipGateEvaluation {
  topicId: string;
  canShip: boolean;
  missing: string[];
  status: TopicStatus;
}
