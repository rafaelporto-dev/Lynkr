"use client";

import { useState, useEffect } from "react";
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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black py-12 px-4 sm:px-6 lg:px-8">
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

          <div className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 rounded-full px-4 py-1 text-sm text-white">
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
                <Card className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-purple-900 hover:to-blue-900 border-purple-500/30 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
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
