export type LanguagePref = "en" | "hi";
export type InputPref = "auto" | "touch" | "keyboard";
export type TextSizePref = "sm" | "md" | "lg";

export interface Preferences {
  language: LanguagePref;
  input: InputPref;
  textSize: TextSizePref;
}

export const PREFERENCES_STORAGE_KEY = "classos.preferences.v1";

export const DEFAULT_PREFERENCES: Preferences = {
  language: "en",
  input: "auto",
  textSize: "md",
};

export function readPreferences(): Preferences {
  if (typeof window === "undefined") return { ...DEFAULT_PREFERENCES };
  try {
    const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFERENCES };
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return {
      language:
        parsed.language === "hi" || parsed.language === "en"
          ? parsed.language
          : DEFAULT_PREFERENCES.language,
      input:
        parsed.input === "touch" ||
        parsed.input === "keyboard" ||
        parsed.input === "auto"
          ? parsed.input
          : DEFAULT_PREFERENCES.input,
      textSize:
        parsed.textSize === "sm" ||
        parsed.textSize === "md" ||
        parsed.textSize === "lg"
          ? parsed.textSize
          : DEFAULT_PREFERENCES.textSize,
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function writePreferences(prefs: Preferences) {
  window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
  applyPreferences(prefs);
}

export function applyPreferences(prefs: Preferences) {
  const root = document.documentElement;
  root.lang = prefs.language;
  root.dataset.inputPref = prefs.input;
  root.dataset.textSize = prefs.textSize;
  const px = prefs.textSize === "sm" ? "15px" : prefs.textSize === "lg" ? "18px" : "16px";
  root.style.setProperty("--co-body-size", px);
  document.body.style.fontSize = px;
}
