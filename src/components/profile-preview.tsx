"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "../../supabase/client";
import { Database } from "@/types/database.types";
import { Avatar } from "./ui/avatar";
import { AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  ExternalLink,
  User,
  X,
  ArrowLeft,
  ExternalLinkIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Link = Database["public"]["Tables"]["links"]["Row"];

interface ProfilePreviewProps {
  onClose?: () => void;
  username?: string | null;
}

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
    id: "dark",
    gradient: "from-gray-950 to-gray-900",
    cardBg: "bg-gray-800/90",
    borderColor: "border-gray-700/50",
    buttonGradient: "from-gray-700 to-gray-800",
    buttonHoverGradient: "from-gray-600 to-gray-700",
    badgeGradient: "from-gray-600 to-gray-700",
  },
  {
    id: "minimal",
    gradient: "from-gray-50 to-gray-100",
    cardBg: "bg-white",
    borderColor: "border-gray-200",
    buttonGradient: "from-gray-200 to-gray-300",
    buttonHoverGradient: "from-gray-300 to-gray-400",
    badgeGradient: "from-gray-400 to-gray-500",
    textColor: "text-gray-900",
  },
  {
    id: "cyberpunk",
    gradient: "from-purple-900 via-pink-800 to-yellow-900",
    cardBg: "bg-gray-900/90",
    borderColor: "border-yellow-500/30",
    buttonGradient: "from-yellow-500 to-pink-600",
    buttonHoverGradient: "from-yellow-600 to-pink-700",
    badgeGradient: "from-yellow-500 to-pink-500",
    animation: "animate-pulse",
  },
  {
    id: "synthwave",
    gradient: "from-indigo-900 via-purple-800 to-pink-800",
    cardBg: "bg-indigo-950/80",
    borderColor: "border-pink-500/30",
    buttonGradient: "from-indigo-600 to-pink-600",
    buttonHoverGradient: "from-indigo-700 to-pink-700",
    badgeGradient: "from-indigo-500 to-pink-500",
    animation: "animate-pulse",
  },
  {
    id: "matrix",
    gradient: "from-green-950 via-green-900 to-black",
    cardBg: "bg-black/90",
    borderColor: "border-green-500/30",
    buttonGradient: "from-green-600 to-emerald-600",
    buttonHoverGradient: "from-green-700 to-emerald-700",
    badgeGradient: "from-green-500 to-emerald-500",
    animation: "animate-pulse",
  },
  {
    id: "glassmorphism",
    gradient: "from-blue-500/30 to-purple-500/30",
    cardBg: "bg-white/10 backdrop-blur-lg",
    borderColor: "border-white/20",
    buttonGradient: "from-white/20 to-white/10",
    buttonHoverGradient: "from-white/30 to-white/20",
    badgeGradient: "from-white/20 to-white/10",
    animation: "animate-pulse",
  },
  {
    id: "neon",
    gradient: "from-black to-gray-950",
    cardBg: "bg-black/80",
    borderColor: "border-purple-500/50",
    buttonGradient: "from-purple-600 to-blue-600",
    buttonHoverGradient: "from-purple-700 to-blue-700",
    badgeGradient: "from-purple-600 to-blue-600",
    animation: "animate-pulse shadow-lg shadow-purple-500/20",
  },
];

export default function ProfilePreview({
  onClose,
  username = null,
}: ProfilePreviewProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const themeConfig = useMemo(() => {
    const themeId = profile?.theme || "default";
    return themes.find((theme) => theme.id === themeId) || themes[0];
  }, [profile?.theme]);

  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true);

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("User not authenticated");
          return;
        }

        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        setProfile(profileData);

        // Get links data
        const { data: linksData, error: linksError } = await supabase
          .from("links")
          .select("*")
          .eq("user_id", user.id)
          .eq("active", true)
          .order("display_order", { ascending: true });

        if (linksError) {
          throw linksError;
        }

        setLinks(linksData || []);
      } catch (err: any) {
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }

    loadProfileData();

    // Set up realtime subscription for links
    const linksChannel = supabase
      .channel("preview-links-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "links" },
        () => loadProfileData(),
      )
      .subscribe();

    // Set up realtime subscription for profile
    const profileChannel = supabase
      .channel("preview-profile-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => loadProfileData(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(linksChannel);
      supabase.removeChannel(profileChannel);
    };
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push("/dashboard");
    }
  };

  const handleOpenInNewTab = () => {
    if (username) {
      window.open(`/${username}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="animate-pulse text-purple-500">Loading preview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
        <div className="text-white mb-4">Error loading preview: {error}</div>
        <Button onClick={handleClose} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen bg-gradient-to-br ${themeConfig.gradient} py-12 px-4 sm:px-6 lg:px-8`}
    >
      {/* Preview header */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-10 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-purple-900/50 text-white border-purple-500"
          >
            Preview Mode
          </Badge>
          <span className="text-sm text-gray-300">
            This is how your profile will appear to visitors
          </span>
        </div>
        <div className="flex items-center gap-2">
          {username && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInNewTab}
              className="text-xs"
            >
              <ExternalLinkIcon className="mr-1 h-3 w-3" /> Open in New Tab
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Profile content with extra top padding to account for the header */}
      <div className="max-w-md mx-auto pt-16">
        {/* Profile Header */}
        <div className="text-center mb-10">
          <Avatar className="h-24 w-24 mx-auto mb-4 ring-2 ring-purple-500 ring-offset-2 ring-offset-black">
            {profile?.avatar_url ? (
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
            {profile?.full_name || profile?.username || "Your Name"}
          </h1>

          {profile?.bio ? (
            <p className="text-gray-300 mb-4">{profile.bio}</p>
          ) : (
            <p className="text-gray-400 mb-4 italic">
              Add a bio in your profile settings
            </p>
          )}

          <div
            className={`inline-block bg-gradient-to-r ${themeConfig.badgeGradient} rounded-full px-4 py-1 text-sm text-white`}
          >
            @{profile?.username || "username"}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.length === 0 ? (
            <div className="text-center py-8 text-gray-400 bg-gray-800/30 rounded-lg border border-gray-700/50 p-6">
              <p>You haven't added any links yet</p>
              <p className="text-sm mt-2">
                Your links will appear here once you add them
              </p>
            </div>
          ) : (
            links.map((link) => (
              <div key={link.id} className="block w-full cursor-pointer">
                <Card
                  className={`w-full ${themeConfig.cardBg} hover:bg-gradient-to-r hover:${themeConfig.buttonGradient} ${themeConfig.borderColor} shadow-lg shadow-${themeConfig.borderColor.replace("border-", "")} hover:shadow-${themeConfig.borderColor.replace("border-", "")} transition-all duration-300`}
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex-1 min-w-0 mr-4">
                      <h3 className="font-medium truncate">{link.title}</h3>
                      <div className="text-sm text-muted-foreground truncate flex items-center">
                        <ExternalLink size={12} className="mr-1 inline" />
                        <span className="truncate">{link.url}</span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-purple-400" />
                  </div>
                </Card>
              </div>
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
