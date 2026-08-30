export type ResumeTrackerRecord = {
  lastPostedAt: string | null;
  postCount: number;
  lastPostType: string | null;
  lastPostPreview: string | null;
};

const STORAGE_PREFIX = "myhiredito_resume_tracker_";

function storageKey(userKey: string): string {
  return `${STORAGE_PREFIX}${userKey}`;
}

function dispatchChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("myhiredito-resume-tracker"));
}

export function getResumeTracker(userKey: string): ResumeTrackerRecord {
  if (typeof window === "undefined" || !userKey) {
    return {
      lastPostedAt: null,
      postCount: 0,
      lastPostType: null,
      lastPostPreview: null,
    };
  }
  const raw = localStorage.getItem(storageKey(userKey));
  if (!raw) {
    return {
      lastPostedAt: null,
      postCount: 0,
      lastPostType: null,
      lastPostPreview: null,
    };
  }
  try {
    return JSON.parse(raw) as ResumeTrackerRecord;
  } catch {
    return {
      lastPostedAt: null,
      postCount: 0,
      lastPostType: null,
      lastPostPreview: null,
    };
  }
}

export function recordResumePost(
  userKey: string,
  type: string,
  body: string,
): ResumeTrackerRecord {
  const current = getResumeTracker(userKey);
  const next: ResumeTrackerRecord = {
    lastPostedAt: new Date().toISOString(),
    postCount: current.postCount + 1,
    lastPostType: type,
    lastPostPreview: body.trim().slice(0, 140),
  };
  if (typeof window !== "undefined" && userKey) {
    localStorage.setItem(storageKey(userKey), JSON.stringify(next));
    dispatchChange();
  }
  return next;
}
