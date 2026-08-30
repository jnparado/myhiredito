import { clearDemoEmployerSession } from "./employerDemoAuth";
import { signOutSupabase } from "./supabase/auth";
import { clearDemoWorkerSession } from "./workerDemoAuth";

export function clearAllDemoSessions(): void {
  clearDemoWorkerSession();
  clearDemoEmployerSession();
}

/** Call before Supabase sign-in or sign-up so demo localStorage does not override the session. */
export function beginSupabaseAuth(): void {
  clearAllDemoSessions();
}

/** Call before demo login so an existing Supabase cookie does not conflict. */
export async function beginDemoAuth(): Promise<void> {
  await signOutSupabase();
  clearAllDemoSessions();
}
