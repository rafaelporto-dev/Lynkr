import { createClient } from "../../../supabase/server";
import UserProfilePage from "@/components/user-profile-page";
import { notFound } from "next/navigation";

export default async function UserPage({
  params,
}: {
  params: { username: string };
}) {
  const supabase = await createClient();

  // Check if the username exists
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", params.username)
    .single();

  // If no profile is found, return 404
  if (!profile) {
    notFound();
  }

  return <UserProfilePage username={params.username} />;
}
