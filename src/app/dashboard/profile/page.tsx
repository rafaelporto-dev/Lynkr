"use client";

import { SubscriptionCheckClient } from "@/components/subscription-check-client";
import DashboardNavbar from "@/components/dashboard-navbar";
import ProfileEditor from "@/components/profile-editor";
import PreviewToggle from "@/components/preview-toggle";
import ProfilePreview from "@/components/profile-preview";
import { Button } from "@/components/ui/button";
import { InfoIcon, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "../../../../supabase/client";

export default function ProfilePage() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);

        // Get username from profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", data.user.id)
          .single();

        if (profileData) {
          setUsername(profileData.username);
        }
      }
    }

    getUser();
  }, []);

  if (isPreviewMode) {
    return (
      <ProfilePreview
        onClose={() => setIsPreviewMode(false)}
        username={username}
      />
    );
  }

  return (
    <SubscriptionCheckClient>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <UserCircle className="h-7 w-7" />
                Profile
              </h1>
              <PreviewToggle
                isPreviewMode={isPreviewMode}
                onToggle={setIsPreviewMode}
              />
            </div>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>Customize your public profile</span>
            </div>
          </header>

          {/* User Profile Section */}
          <section>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <UserCircle size={48} className="text-primary" />
                <div>
                  <h2 className="font-semibold text-xl">User Profile</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(true)}
              >
                Preview Profile
              </Button>
            </div>
            <ProfileEditor />
          </section>
        </div>
      </main>
    </SubscriptionCheckClient>
  );
}
