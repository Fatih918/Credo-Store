import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import {
  hasAdminPermission,
  isAdminRole,
  type AdminPermission,
  type AdminRole,
} from "./permissions";

export interface AdminSession {
  userId: string;
  email: string | null;
  displayName: string | null;
  role: AdminRole;
}

export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const userId =
    !claimsError && typeof claims?.sub === "string" ? claims.sub : null;

  if (!userId) {
    redirect("/admin/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("role, is_active, display_name")
    .eq("user_id", userId)
    .maybeSingle();

  if (
    profileError ||
    !profile ||
    profile.is_active !== true ||
    !isAdminRole(profile.role)
  ) {
    redirect("/admin/forbidden");
  }

  return {
    userId,
    email: typeof claims.email === "string" ? claims.email : null,
    displayName: profile.display_name,
    role: profile.role,
  };
}

export async function requirePermission(
  permission: AdminPermission,
): Promise<AdminSession> {
  const admin = await requireAdmin();

  if (!hasAdminPermission(admin.role, permission)) {
    redirect("/admin/forbidden");
  }

  return admin;
}
