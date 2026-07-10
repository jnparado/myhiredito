const STORAGE_PREFIX = "myhiredito_employer_profile_views_";

export function getProfileViews(userKey: string): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(`${STORAGE_PREFIX}${userKey}`);
  return raw ? Number(raw) || 0 : 0;
}

export function incrementProfileViews(userKey: string): number {
  if (typeof window === "undefined") return 0;
  const next = getProfileViews(userKey) + 1;
  localStorage.setItem(`${STORAGE_PREFIX}${userKey}`, String(next));
  return next;
}
