import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { isSupabaseConfigured } from "@/app/lib/supabase/env";
import { ensureProfileForUser } from "@/app/lib/supabase/profiles";
import { ensureWorkerOnboardingInDb } from "@/app/lib/supabase/workerOnboardingDb";
import type { UserRole } from "@/app/lib/supabase/database.types";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const email = data.user.email ?? "";
      const role = (data.user.user_metadata?.role as UserRole | undefined) ?? "worker";

      await ensureProfileForUser({
        userId: data.user.id,
        email,
        role,
      });

      if (role === "worker") {
        await ensureWorkerOnboardingInDb(data.user.id);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/?auth=error`);
}
