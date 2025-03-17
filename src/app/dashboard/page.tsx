"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
import {
  InfoIcon,
  UserCircle,
  Link as LinkIcon,
  ExternalLink,
  BarChart2,
} from "lucide-react";
import { SubscriptionCheckClient } from "@/components/subscription-check-client";
import LinkForm from "@/components/link-form";
import LinksList from "@/components/links-list";
import { useEffect, useState } from "react";
import PreviewToggle from "@/components/preview-toggle";
import ProfilePreview from "@/components/profile-preview";
import ProfileEditor from "@/components/profile-editor";
import UserStatistics from "@/components/user-statistics";
import { Button } from "@/components/ui/button";
import { createClient } from "../../../supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
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
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <PreviewToggle
                isPreviewMode={isPreviewMode}
                onToggle={setIsPreviewMode}
              />
            </div>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>Manage your links and profile from this dashboard</span>
            </div>
            {username && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  Your public profile:
                </span>
                <a
                  href={`/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  lynkr.me/{username}
                  <ExternalLink size={14} />
                </a>
              </div>
            )}
          </header>

          {/* Dashboard Tabs */}
          <Tabs defaultValue="links" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="links" className="flex items-center gap-2">
                <LinkIcon size={16} />
                Links Management
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <BarChart2 size={16} />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="links" className="space-y-6">
              {/* Links Management Section */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <LinkForm />
                </div>
                <div className="md:col-span-2">
                  <LinksList />
                </div>
              </section>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Analytics Section */}
              <UserStatistics />
            </TabsContent>
          </Tabs>

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
