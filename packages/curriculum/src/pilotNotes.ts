export type PilotNoteCategory =
  | "chip_noise"
  | "unused_template"
  | "units_assumptions"
  | "offline"
  | "classroom"
  | "other";

export interface PilotNote {
  id: string;
  at: number;
  category: PilotNoteCategory;
  body: string;
  topicId?: string;
  phase: 4 | 5 | 6;
}

export const PILOT_NOTE_CATEGORIES: Array<{
  id: PilotNoteCategory;
  label: string;
}> = [
  { id: "chip_noise", label: "Recognition chip noise" },
  { id: "unused_template", label: "Unused templates" },
  { id: "units_assumptions", label: "Units vs assumptions" },
  { id: "offline", label: "Offline banner" },
  { id: "classroom", label: "Classroom /join" },
  { id: "other", label: "Other" },
];

export const PILOT_NOTES_STORAGE_KEY = "classos.pilotNotes.v1";

export function createPilotNote(input: {
  category: PilotNoteCategory;
  body: string;
  topicId?: string;
  phase?: 4 | 5 | 6;
}): PilotNote {
  return {
    id: `note_${Math.random().toString(36).slice(2, 10)}`,
    at: Date.now(),
    category: input.category,
    body: input.body.trim(),
    topicId: input.topicId,
    phase: input.phase ?? 4,
  };
}
