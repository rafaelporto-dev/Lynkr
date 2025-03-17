"use server";

import { createClient } from "../../supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const username = formData.get("username")?.toString();
  const supabase = await createClient();

  if (!email || !password || !username) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email, password, and username are required"
    );
  }

  // Validate username format
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Username can only contain letters, numbers, underscores and hyphens"
    );
  }

  // Check if username is already taken
  const { data: existingUser, error: usernameCheckError } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single();

  if (existingUser) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "This username is already taken. Please choose another one."
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        email: email,
        username: username,
      },
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      // Update the profile with the username
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        username: username,
        full_name: fullName,
        updated_at: new Date().toISOString(),
      });

      // Also update users table if it exists
      const { error: updateError } = await supabase.from("users").insert({
        id: user.id,
        user_id: user.id,
        name: fullName,
        email: email,
        username: username,
        token_identifier: user.id,
        created_at: new Date().toISOString(),
      });

      if (updateError) {
        // Error handling without console.error
      }
    } catch (err) {
      // Error handling without console.error
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link."
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {});

  if (error) {
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const checkUserSubscription = async (userId: string) => {
  const supabase = await createClient();

  // First check if the user has the free plan enabled
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("has_free_plan")
    .eq("id", userId)
    .single();

  if (!profileError && profile?.has_free_plan) {
    return true;
  }

  // Check for subscriptions with valid statuses (active, trialing, etc.)
  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["active", "trialing", "paid"])
    .single();

  if (error) {
    // Also check if there's any subscription at all as a fallback
    const { data: anySubscription, error: anyError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (anyError) {
      return false;
    }

    return !!anySubscription;
  }

  return !!subscription;
};

export const enableFreePlan = async (userId: string) => {
  const supabase = await createClient();

  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    has_free_plan: true,
    updated_at: new Date().toISOString(),
  });

  return !error;
};

export const deleteAccountAction = async () => {
  const supabase = await createClient();

  try {
    // First, delete all user data from tables
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return encodedRedirect("error", "/dashboard", "User not found");
    }

    // Delete links
    await supabase.from("links").delete().eq("user_id", user.id);

    // Delete profile
    await supabase.from("profiles").delete().eq("id", user.id);

    // Delete user data
    await supabase.from("users").delete().eq("user_id", user.id);

    // Call Edge Function to delete auth account
    const { error: functionError } = await supabase.functions.invoke(
      "delete-account",
      {
        body: { userId: user.id },
      }
    );

    if (functionError) throw functionError;

    // Sign out after deleting account
    await supabase.auth.signOut();

    return encodedRedirect("success", "/", "Account deleted successfully");
  } catch (error: any) {
    return encodedRedirect(
      "error",
      "/dashboard",
      error.message || "Error deleting account"
    );
  }
};
