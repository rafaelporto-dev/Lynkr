"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import { Database } from "@/types/database.types";
import { Avatar } from "./ui/avatar";
import { AvatarImage, AvatarFallback } from "./ui/avatar";
import { ExternalLink, User } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Link = Database["public"]["Tables"]["links"]["Row"];

export default function UserProfilePage({ username }: { username: string }) {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (profileError) {
        console.error("Error loading profile:", profileError);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Fetch links data
      const { data: linksData, error: linksError } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", profileData.id)
        .order("display_order", { ascending: true })
        .filter("active", "eq", true);

      if (linksError) {
        console.error("Error loading links:", linksError);
      } else {
        setLinks(linksData || []);
      }

      setLoading(false);
    }

    if (username) {
      loadProfile();
    }
  }, [username, supabase]);

  // Track link clicks
  const handleLinkClick = async (linkId: string) => {
    // Update click count in the database
    await supabase.rpc("increment_link_click", { link_id: linkId });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="animate-pulse text-purple-500">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-white">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-10">
          <Avatar className="h-24 w-24 mx-auto mb-4 ring-2 ring-purple-500 ring-offset-2 ring-offset-black">
            {profile.avatar_url ? (
              <AvatarImage
                src={profile.avatar_url}
                alt={profile.username || "User"}
              />
            ) : (
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-500">
                <User className="h-12 w-12 text-white" />
              </AvatarFallback>
            )}
          </Avatar>

          <h1 className="text-2xl font-bold text-white mb-2">
            {profile.full_name || profile.username || "User"}
          </h1>

          {profile.bio && <p className="text-gray-300 mb-4">{profile.bio}</p>}

          <div className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 rounded-full px-4 py-1 text-sm text-white">
            @{profile.username}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.length === 0 ? (
            <div className="text-center text-gray-400">No links added yet</div>
          ) : (
            links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.id)}
                className="block w-full"
              >
                <Card className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-purple-900 hover:to-blue-900 border-purple-500/30 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      {link.icon ? (
                        <div className="mr-3 text-purple-400">
                          {/* We would render the icon here if we had an icon system */}
                          <div className="w-6 h-6 flex items-center justify-center bg-purple-500/20 rounded-full">
                            {link.icon}
                          </div>
                        </div>
                      ) : null}
                      <div className="text-white font-medium">{link.title}</div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-purple-400" />
                  </div>
                </Card>
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-500">
          <p>Powered by Lynkr</p>
        </div>
      </div>
    </div>
  );
}
