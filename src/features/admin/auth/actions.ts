"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isAdminRole } from "./permissions";

export async function loginAction(formData: FormData): Promise<void> {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  const email =
    typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
  const password =
    typeof passwordValue === "string" ? passwordValue : "";

  if (
    email.length < 3 ||
    email.length > 254 ||
    !email.includes("@") ||
    password.length < 1 ||
    password.length > 1024
  ) {
    redirect("/admin/login?error=credentials");
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    redirect("/admin/login?error=credentials");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=credentials");
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (
    profileError ||
    !profile ||
    profile.is_active !== true ||
    !isAdminRole(profile.role)
  ) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=forbidden");
  }

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
