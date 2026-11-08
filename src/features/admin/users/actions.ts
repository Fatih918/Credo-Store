"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requirePermission } from "@/features/admin/auth/authorization";
import { isAdminRole } from "@/features/admin/auth/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validEmail(value: string): boolean {
  return (
    value.length >= 3 &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

function finish(result: "success" | "invalid" | "failed"): never {
  revalidatePath("/admin/users");
  redirect(`/admin/users?result=${result}`);
}

export async function inviteAdminAction(formData: FormData): Promise<void> {
  const actor = await requirePermission("admins:manage");
  const email = readText(formData, "email").toLowerCase();
  const displayName = readText(formData, "displayName");
  const roleValue = readText(formData, "role");

  if (
    !validEmail(email) ||
    displayName.length > 100 ||
    !isAdminRole(roleValue)
  ) {
    finish("invalid");
  }

  const supabase = createAdminClient();
  const { data: invitation, error: inviteError } =
    await supabase.auth.admin.inviteUserByEmail(email, {
      data: { display_name: displayName || null },
    });

  if (inviteError || !invitation.user) {
    finish("failed");
  }

  const { error: profileError } = await supabase.from("admin_profiles").insert({
    user_id: invitation.user.id,
    role: roleValue,
    display_name: displayName || null,
    is_active: true,
  });

  if (profileError) {
    await supabase.auth.admin.deleteUser(invitation.user.id);
    finish("failed");
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    actor_user_id: actor.userId,
    action: "create",
    entity_type: "admin_profile",
    entity_id: invitation.user.id,
    after_data: {
      email,
      role: roleValue,
      display_name: displayName || null,
      is_active: true,
    },
  });

  if (auditError) {
    await supabase.from("admin_profiles").delete().eq("user_id", invitation.user.id);
    await supabase.auth.admin.deleteUser(invitation.user.id);
    finish("failed");
  }

  finish("success");
}

export async function updateAdminRoleAction(
  formData: FormData,
): Promise<void> {
  const actor = await requirePermission("admins:manage");
  const targetUserId = readText(formData, "userId");
  const roleValue = readText(formData, "role");

  if (!targetUserId || !isAdminRole(roleValue) || targetUserId === actor.userId) {
    finish("invalid");
  }

  const supabase = createAdminClient();
  const { data: current, error: readError } = await supabase
    .from("admin_profiles")
    .select("user_id, role, display_name, is_active")
    .eq("user_id", targetUserId)
    .maybeSingle();

  if (readError || !current) {
    finish("failed");
  }

  const { error: updateError } = await supabase
    .from("admin_profiles")
    .update({ role: roleValue })
    .eq("user_id", targetUserId);

  if (updateError) {
    finish("failed");
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    actor_user_id: actor.userId,
    action: "update",
    entity_type: "admin_profile",
    entity_id: targetUserId,
    before_data: { role: current.role },
    after_data: { role: roleValue },
  });

  if (auditError) {
    await supabase
      .from("admin_profiles")
      .update({ role: current.role })
      .eq("user_id", targetUserId);
    finish("failed");
  }

  finish("success");
}

export async function toggleAdminActiveAction(
  formData: FormData,
): Promise<void> {
  const actor = await requirePermission("admins:manage");
  const targetUserId = readText(formData, "userId");
  const activeValue = readText(formData, "isActive");

  if (
    !targetUserId ||
    targetUserId === actor.userId ||
    (activeValue !== "true" && activeValue !== "false")
  ) {
    finish("invalid");
  }

  const isActive = activeValue === "true";
  const supabase = createAdminClient();
  const { data: current, error: readError } = await supabase
    .from("admin_profiles")
    .select("user_id, role, display_name, is_active")
    .eq("user_id", targetUserId)
    .maybeSingle();

  if (readError || !current) {
    finish("failed");
  }

  const { error: updateError } = await supabase
    .from("admin_profiles")
    .update({ is_active: isActive })
    .eq("user_id", targetUserId);

  if (updateError) {
    finish("failed");
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    actor_user_id: actor.userId,
    action: isActive ? "activate" : "deactivate",
    entity_type: "admin_profile",
    entity_id: targetUserId,
    before_data: { is_active: current.is_active },
    after_data: { is_active: isActive },
  });

  if (auditError) {
    await supabase
      .from("admin_profiles")
      .update({ is_active: current.is_active })
      .eq("user_id", targetUserId);
    finish("failed");
  }

  finish("success");
}
