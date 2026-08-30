export type AuthRole = "worker" | "employer";

const LAST_ROLE_KEY = "myhiredito_last_auth_role";

export function setLastAuthRole(role: AuthRole): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LAST_ROLE_KEY, role);
}

export function getLastAuthRole(): AuthRole | null {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem(LAST_ROLE_KEY);
  return value === "worker" || value === "employer" ? value : null;
}

export function guestRoleFromPath(pathname: string | null): AuthRole {
  if (pathname?.startsWith("/worker")) return "worker";
  if (pathname?.startsWith("/employer")) return "employer";
  return getLastAuthRole() ?? "employer";
}
