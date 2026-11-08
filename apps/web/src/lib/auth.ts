import { cookies } from "next/headers";

export const AUTH_COOKIE = "classos_learner";

/** Auth stub: anonymous learner cookie; later school SSO / magic link. */
export async function getLearnerId() {
  const jar = await cookies();
  const existing = jar.get(AUTH_COOKIE)?.value;
  if (existing) return existing;
  return "learner_demo";
}

export function learnerDisplayName(id: string) {
  if (id === "learner_demo") return "Demo learner";
  return id.replace(/^learner_/, "Learner ");
}
