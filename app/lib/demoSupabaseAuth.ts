import { beginDemoAuth, beginSupabaseAuth } from "./authSession";
import { getDemoAccount } from "./demoAccounts";
import { setDemoEmployerSession } from "./employerDemoAuth";
import { setDemoWorkerSession } from "./workerDemoAuth";
import { createSupabaseBrowserClient } from "./supabase/client";
import { isSupabaseConfigured } from "./supabase/env";
import { seedDemoUserData } from "./supabase/seedDemo";
import { formatAuthError } from "./authErrors";
import type { UserRole } from "./supabase/database.types";

export async function signInDemoAccount(role: UserRole): Promise<void> {
  if (!isSupabaseConfigured()) {
    await useLocalDemo(role);
    return;
  }

  beginSupabaseAuth();

  try {
    await fetch("/api/demo/ensure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
  } catch {
    // Client signup below still creates the account when the admin API is unset.
  }

  try {
    const account = getDemoAccount(role);
    const supabase = createSupabaseBrowserClient();

    let { data, error } = await supabase.auth.signInWithPassword({
      email: account.email,
      password: account.password,
    });

    if (error || !data.session) {
      const signedUp = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: { data: account.metadata },
      });

      if (signedUp.error && !isAlreadyRegistered(signedUp.error.message)) {
        throw new Error(formatAuthError(signedUp.error));
      }

      const signedIn = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password,
      });

      if (signedIn.error || !signedIn.data.session) {
        throw new Error(
          formatAuthError(signedIn.error ?? new Error("Demo sign-in failed.")),
        );
      }

      data = signedIn.data;
    }

    const userId = data.user?.id;
    if (!userId) {
      throw new Error("Demo sign-in failed. No user returned.");
    }

    await seedDemoUserData(supabase, role, userId);
  } catch {
    await useLocalDemo(role);
  }
}

async function useLocalDemo(role: UserRole): Promise<void> {
  await beginDemoAuth();
  if (role === "employer") setDemoEmployerSession();
  else setDemoWorkerSession();
}

function isAlreadyRegistered(message: string): boolean {
  return (
    message.includes("already registered") ||
    message.includes("already been registered") ||
    message.includes("User already registered")
  );
}
