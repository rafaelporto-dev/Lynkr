"use client";

import { useRef, useCallback, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeId } from "@/lib/themes/base-themes";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProfileTab from "./tabs/profile-tab";
import LinksTab from "./tabs/links-tab";
import InteractiveTab from "./tabs/interactive-tab";
import AnalyticsTab from "./tabs/analytics-tab";
import ThemeSelectorTab from "./tabs/theme-selector-tab";
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
  onProfileUpdate: (updatedProfile: Partial<Profile>) => void;
  onSaveProfile: () => Promise<void>;
  onLinksUpdate: () => Promise<void>;
  onInteractiveGroupsUpdate: () => Promise<void>;
  saveStatus: "saved" | "saving" | "error" | "unsaved";
  themeId: ThemeId;
  onThemeChange: (themeId: ThemeId) => void;
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
  onSaveProfile,
  onLinksUpdate,
  onInteractiveGroupsUpdate,
  saveStatus,
  themeId,
  onThemeChange,
}: EditorPanelProps) {
  // No need for activeTab state as it's handled by the Tabs component

  // Função debounced para atualizar o perfil
  const debouncedProfileUpdate = useDebounce(onProfileUpdate, 300);

  // Handlers para cada tipo de atualização
  const handleProfileChange = (updatedFields: Partial<Profile>) => {
    debouncedProfileUpdate(updatedFields);

    // Se o tema for alterado, atualizar também o onThemeChange para sincronizar com o preview
    if (updatedFields.theme) {
      onThemeChange(updatedFields.theme as ThemeId);
    }
  };

  // Adicionar atalho de teclado para salvar (Ctrl+S ou Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault(); // Prevenir o comportamento padrão do navegador
        if (saveStatus === "unsaved") {
          onSaveProfile();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSaveProfile, saveStatus]);

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-2xl font-bold">Editor</h2>
        <div className="flex items-center gap-3">
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
            {saveStatus === "unsaved" && (
              <span className="text-amber-500 text-sm flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Unsaved changes
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-destructive text-sm flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Error saving
              </span>
            )}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  onClick={onSaveProfile}
                  disabled={saveStatus === "saving" || saveStatus === "saved"}
                  className="flex items-center gap-1"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save changes (Ctrl+S)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
          <TabsTrigger value="theme" className="data-[state=active]:bg-muted">
            <Palette className="h-4 w-4 mr-2" />
            Tema
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
            value="theme"
            className="m-0 h-full overflow-y-auto p-4 pb-20"
          >
            <ThemeSelectorTab
              profile={profile}
              onProfileChange={handleProfileChange}
              onSaveProfile={onSaveProfile}
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
