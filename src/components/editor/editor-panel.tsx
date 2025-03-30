"use client";

import { useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "./tabs/profile-tab";
import AppearanceTab from "./tabs/appearance-tab";
import LinksTab from "./tabs/links-tab";
import InteractiveTab from "./tabs/interactive-tab";
import AnalyticsTab from "./tabs/analytics-tab";
import {
  Palette,
  BarChart2,
  Loader2,
  Check,
  AlertCircle,
  UserCircle,
  Link,
  MousePointerClick,
} from "lucide-react";

// Utilização dos mesmos tipos definidos em editor-page-client.tsx
type Profile = {
  id: string;
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  theme?: string;
  button_style?: string;
  font_family?: string;
  layout?: string;
  background_type?: string;
  background_url?: string | null;
  custom_css?: string | null;
  has_free_plan: boolean;
  has_custom_domain?: boolean;
};

type Link = {
  id: string;
  title: string;
  url: string;
  icon?: string;
  display_order: number;
  active: boolean;
  thumbnail_url?: string | null;
  content_type?: string;
  embed_data?: any;
  is_adult_content?: boolean;
  is_interactive?: boolean;
  interactive_type?: string;
  interactive_content?: any;
  has_custom_thumbnail?: boolean;
};

type InteractiveGroup = {
  id: string;
  title: string;
  type: string;
  display_order: number;
  active: boolean;
};

type EditorPanelProps = {
  profile: Profile | null;
  links: Link[];
  interactiveGroups: InteractiveGroup[];
  onProfileUpdate: (updatedProfile: Partial<Profile>) => Promise<void>;
  onLinksUpdate: () => Promise<void>;
  onInteractiveGroupsUpdate: () => Promise<void>;
  saveStatus: "saved" | "saving" | "error";
};

// Hook customizado para debounce
function useDebounce(callback: Function, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedFunction;
}

export default function EditorPanel({
  profile,
  links,
  interactiveGroups,
  onProfileUpdate,
  onLinksUpdate,
  onInteractiveGroupsUpdate,
  saveStatus,
}: EditorPanelProps) {
  // No need for activeTab state as it's handled by the Tabs component

  // Função debounced para atualizar o perfil
  const debouncedProfileUpdate = useDebounce(onProfileUpdate, 800);

  // Handlers para cada tipo de atualização
  const handleProfileChange = (updatedFields: Partial<Profile>) => {
    debouncedProfileUpdate(updatedFields);
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-2xl font-bold">Editor</h2>
        <div className="flex items-center gap-2">
          {saveStatus === "saving" && (
            <span className="text-muted-foreground text-sm flex items-center">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Saving...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-green-500 text-sm flex items-center">
              <Check className="h-3 w-3 mr-1" />
              Saved
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-destructive text-sm flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Error saving
            </span>
          )}
        </div>
      </div>

      <Tabs
        defaultValue="profile"
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="w-full justify-start px-4 border-b rounded-none h-auto py-2 flex-shrink-0">
          <TabsTrigger value="profile" className="data-[state=active]:bg-muted">
            <UserCircle className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="data-[state=active]:bg-muted"
          >
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="links" className="data-[state=active]:bg-muted">
            <Link className="h-4 w-4 mr-2" />
            Links
          </TabsTrigger>
          <TabsTrigger
            value="interactive"
            className="data-[state=active]:bg-muted"
          >
            <MousePointerClick className="h-4 w-4 mr-2" />
            Interactive
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-muted"
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 h-full overflow-hidden">
          <TabsContent
            value="profile"
            className="m-0 h-full overflow-y-auto p-4 pb-20"
          >
            <ProfileTab
              profile={profile}
              onProfileChange={handleProfileChange}
            />
          </TabsContent>
          <TabsContent
            value="appearance"
            className="m-0 h-full overflow-y-auto p-4 pb-20"
          >
            <AppearanceTab
              profile={profile}
              onProfileChange={handleProfileChange}
            />
          </TabsContent>
          <TabsContent
            value="links"
            className="m-0 h-full overflow-y-auto p-4 pb-20"
          >
            <LinksTab
              profile={profile}
              links={links}
              onLinksUpdate={onLinksUpdate}
            />
          </TabsContent>
          <TabsContent
            value="interactive"
            className="m-0 h-full overflow-y-auto p-4 pb-20"
          >
            <InteractiveTab
              profile={profile}
              interactiveGroups={interactiveGroups}
              onInteractiveGroupsUpdate={onInteractiveGroupsUpdate}
            />
          </TabsContent>
          <TabsContent
            value="analytics"
            className="m-0 h-full overflow-y-auto p-4 pb-20"
          >
            <AnalyticsTab profile={profile} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
