"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "../../supabase/client";
import { Database } from "@/types/database.types";
import { Avatar } from "./ui/avatar";
import { AvatarImage, AvatarFallback } from "./ui/avatar";
import { ExternalLink, User, QrCode } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import ProfileQRCode from "./profile-qr-code";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Link = Database["public"]["Tables"]["links"]["Row"] & {
  thumbnail_url?: string | null;
};

// Define theme configurations matching those in profile-editor.tsx
const themes = [
  {
    id: "default",
    gradient: "from-gray-900 via-purple-950 to-black",
    cardBg: "bg-gray-900/80",
    borderColor: "border-purple-900/30",
    buttonGradient: "from-purple-600 to-blue-600",
    buttonHoverGradient: "from-purple-700 to-blue-700",
    badgeGradient: "from-purple-500 to-blue-500",
  },
  {
    id: "purple",
    gradient: "from-purple-950 via-purple-900 to-black",
    cardBg: "bg-purple-950/80",
    borderColor: "border-purple-500/30",
    buttonGradient: "from-purple-600 to-fuchsia-600",
    buttonHoverGradient: "from-purple-700 to-fuchsia-700",
    badgeGradient: "from-purple-500 to-fuchsia-500",
  },
  {
    id: "blue",
    gradient: "from-blue-950 via-blue-900 to-black",
    cardBg: "bg-blue-950/80",
    borderColor: "border-blue-500/30",
    buttonGradient: "from-blue-600 to-cyan-600",
    buttonHoverGradient: "from-blue-700 to-cyan-700",
    badgeGradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "cyberpunk",
    gradient: "from-purple-900 via-pink-800 to-yellow-900",
    cardBg: "bg-gray-900/90",
    borderColor: "border-yellow-500/30",
    buttonGradient: "from-yellow-500 to-pink-600",
    buttonHoverGradient: "from-yellow-600 to-pink-700",
    badgeGradient: "from-yellow-500 to-pink-500",
  },
  {
    id: "synthwave",
    gradient: "from-indigo-900 via-purple-800 to-pink-800",
    cardBg: "bg-indigo-950/80",
    borderColor: "border-pink-500/30",
    buttonGradient: "from-indigo-600 to-pink-600",
    buttonHoverGradient: "from-indigo-700 to-pink-700",
    badgeGradient: "from-indigo-500 to-pink-500",
  },
  {
    id: "matrix",
    gradient: "from-green-950 via-green-900 to-black",
    cardBg: "bg-black/90",
    borderColor: "border-green-500/30",
    buttonGradient: "from-green-600 to-emerald-600",
    buttonHoverGradient: "from-green-700 to-emerald-700",
    badgeGradient: "from-green-500 to-emerald-500",
  },
];

export default function UserProfilePage({ username }: { username: string }) {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  const themeConfig = useMemo(() => {
    const themeId = profile?.theme || "default";
    return themes.find((theme) => theme.id === themeId) || themes[0];
  }, [profile?.theme]);

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
    <div
      className={`min-h-screen bg-gradient-to-br ${themeConfig.gradient} py-12 px-4 sm:px-6 lg:px-8`}
    >
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

          <div className="flex items-center gap-2 justify-center">
            <div
              className={`inline-block bg-gradient-to-r ${themeConfig.badgeGradient} rounded-full px-4 py-1 text-sm text-white`}
            >
              @{profile.username}
            </div>
            <ProfileQRCode username={profile.username} />
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
                <Card
                  className={`w-full ${themeConfig.cardBg} hover:bg-gradient-to-r hover:${themeConfig.buttonGradient} ${themeConfig.borderColor} shadow-lg shadow-${themeConfig.borderColor.replace("border-", "")} hover:shadow-${themeConfig.borderColor.replace("border-", "")} transition-all duration-300 overflow-hidden`}
                >
                  {link.thumbnail_url && (
                    <div className="w-full h-32 overflow-hidden">
                      <img
                        src={link.thumbnail_url}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          // Hide the image container if it fails to load
                          (
                            e.target as HTMLImageElement
                          ).parentElement!.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      {link.icon && !link.thumbnail_url ? (
                        <div className="mr-3 text-purple-400">
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
