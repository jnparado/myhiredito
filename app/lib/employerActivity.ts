export type ActivityType = "shift" | "update";

export type EmployerActivity = {
  id: string;
  type: ActivityType;
  title: string;
  body: string;
  location?: string;
  pay?: string;
  shiftDate?: string;
  postedAt: string;
};

const STORAGE_PREFIX = "myhiredito_employer_activity_";

function storageKey(userKey: string): string {
  return `${STORAGE_PREFIX}${userKey}`;
}

function dispatchChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("myhiredito-employer-activity"));
}

export function getEmployerActivity(userKey: string): EmployerActivity[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(storageKey(userKey));
  if (!raw) return [];
  try {
    return (JSON.parse(raw) as EmployerActivity[]).sort(
      (a, b) =>
        new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
    );
  } catch {
    return [];
  }
}

function saveActivity(userKey: string, items: EmployerActivity[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userKey), JSON.stringify(items));
  dispatchChange();
}

export function createShiftFromForm(
  userKey: string,
  formData: FormData,
): EmployerActivity {
  const item: EmployerActivity = {
    id: `shift-${Date.now()}`,
    type: "shift",
    title: String(formData.get("title") ?? "Open shift"),
    body: String(formData.get("notes") ?? ""),
    location: String(formData.get("location") ?? ""),
    pay: String(formData.get("pay") ?? ""),
    shiftDate: String(formData.get("shiftDate") ?? ""),
    postedAt: new Date().toISOString(),
  };
  saveActivity(userKey, [item, ...getEmployerActivity(userKey)]);
  return item;
}

export function createHiringUpdate(
  userKey: string,
  body: string,
): EmployerActivity {
  const item: EmployerActivity = {
    id: `update-${Date.now()}`,
    type: "update",
    title: "Hiring update",
    body: body.trim(),
    postedAt: new Date().toISOString(),
  };
  saveActivity(userKey, [item, ...getEmployerActivity(userKey)]);
  return item;
}
