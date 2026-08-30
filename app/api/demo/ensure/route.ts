import { NextResponse } from "next/server";
import { getDemoAccount } from "@/app/lib/demoAccounts";
import { createSupabaseAdminClient } from "@/app/lib/supabase/admin";
import { seedDemoUserData } from "@/app/lib/supabase/seedDemo";
import type { UserRole } from "@/app/lib/supabase/database.types";

function isRole(value: unknown): value is UserRole {
  return value === "worker" || value === "employer";
}

export async function POST(request: Request) {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ configured: false });
  }

  try {
    const body = (await request.json()) as { role?: unknown };
    const role: UserRole = isRole(body.role) ? body.role : "worker";
    const account = getDemoAccount(role);

    const { data: existingUsers } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    const existing = existingUsers?.users.find(
      (user) => user.email?.toLowerCase() === account.email,
    );
    let userId = existing?.id;

    if (userId) {
      await admin.auth.admin.updateUserById(userId, {
        password: account.password,
        email_confirm: true,
        user_metadata: account.metadata,
      });
    } else {
      const created = await admin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: account.metadata,
      });
      if (created.error || !created.data.user?.id) {
        throw created.error ?? new Error("Could not create demo user.");
      }
      userId = created.data.user.id;
    }

    await seedDemoUserData(admin, role, userId);

    return NextResponse.json({ configured: true, userId, role });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save demo account.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
