"use client";

import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeId } from "@/lib/themes/base-themes";
import { ThemeManager } from "@/lib/themes/theme-manager";
import { DesignTokens } from "@/lib/themes/tokens";

// Types
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

interface InMemoryPreviewProps {
  profile: Profile | null;
  links: Link[];
  interactiveGroups: InteractiveGroup[];
  themeId: ThemeId;
  deviceType?: "mobile" | "tablet" | "desktop";
}

export default function InMemoryPreview({
  profile,
  links,
  interactiveGroups,
  themeId,
  deviceType = "desktop",
}: InMemoryPreviewProps) {
  // Get theme configuration using ThemeManager
  const themeTokens = useMemo(() => {
    return ThemeManager.getThemeTokens(themeId);
  }, [themeId]);

  // Get layout style based on profile settings and device type
  const layoutStyle = useMemo(() => {
    const layout = profile?.layout || "list";

    // For mobile, always use list layout regardless of setting
    if (deviceType === "mobile") {
      return "flex flex-col gap-2";
    }

    switch (layout) {
      case "grid":
        return deviceType === "tablet"
          ? "grid grid-cols-2 gap-2"
          : "grid grid-cols-2 gap-3";
      case "compact":
        return "flex flex-col gap-2";
      default: // "list"
        return "flex flex-col gap-3";
    }
  }, [profile?.layout, deviceType]);

  // Get button style based on profile settings
  const buttonStyle = useMemo(() => {
    const style = profile?.button_style || "rounded";
    switch (style) {
      case "pill":
        return "rounded-full";
      case "square":
        return "rounded-none";
      default: // "rounded"
        return "rounded-lg";
    }
  }, [profile?.button_style]);

  // Get text colors from theme tokens
  const textColor = `text-theme-text`;
  const textMutedColor = `text-theme-muted`;

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">No profile data available</p>
      </div>
    );
  }

  // Filter active links
  const activeLinks = links.filter((link) => link.active);

  // Adjust padding and spacing based on device type
  const containerPadding = useMemo(() => {
    switch (deviceType) {
      case "mobile":
        return "py-6 px-3";
      case "tablet":
        return "py-7 px-4";
      default: // desktop
        return "py-8 px-4";
    }
  }, [deviceType]);

  // Usar os tokens para definir gradientes e cores
  const gradientStyle = {
    background: themeTokens.effects.gradient.background,
  };

  const buttonStyles = {
    background: themeTokens.colors.buttonBackground,
    color: themeTokens.colors.buttonText,
  };

  return (
    <div
      className={`theme-transition ${containerPadding} overflow-y-auto h-full bg-theme-background`}
      style={gradientStyle}
    >
      <div className="max-w-md mx-auto min-h-[150%]">
        {/* Profile Header */}
        <header
          className={`text-center ${deviceType === "mobile" ? "mb-6" : deviceType === "tablet" ? "mb-7" : "mb-8"}`}
        >
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mx-auto mb-3 sm:mb-4 ring-2 ring-primary/50 ring-offset-2 ring-offset-background">
            {profile.avatar_url ? (
              <AvatarImage
                src={profile.avatar_url}
                alt={`${profile.full_name || profile.username || "User"}'s profile picture`}
              />
            ) : (
              <AvatarFallback className="bg-primary">
                <User className="h-10 w-10 sm:h-12 sm:w-12 text-primary-foreground" />
              </AvatarFallback>
            )}
          </Avatar>

          <h1 className={`text-xl sm:text-2xl font-bold ${textColor} mb-2`}>
            {profile.full_name || profile.username || "Your Name"}
          </h1>

          {profile.bio && (
            <p
              className={`${textMutedColor} text-sm sm:text-base mb-3 sm:mb-4 max-w-xs mx-auto`}
            >
              {profile.bio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 justify-center">
            <div className="inline-block px-3 py-1 text-xs sm:text-sm text-primary-foreground bg-primary rounded-full">
              @{profile.username || "user"}
            </div>
          </div>
        </header>

        {/* Links */}
        <main className={cn(layoutStyle, "px-0 sm:px-2")}>
          {activeLinks.length > 0 ? (
            activeLinks.map((link) => (
              <div
                key={link.id}
                className={`w-full overflow-hidden ${buttonStyle} transition-all duration-300 transform hover:scale-[1.01] hover:shadow-md`}
              >
                <button
                  className="w-full p-3 sm:p-4 flex items-center justify-between button-theme transition-colors duration-200"
                  style={buttonStyles}
                >
                  <span className="font-medium truncate">{link.title}</span>
                  <ExternalLink className="h-4 w-4 flex-shrink-0 ml-2" />
                </button>
              </div>
            ))
          ) : (
            <div className={`text-center ${textMutedColor} py-8`}>
              No links added yet
            </div>
          )}
        </main>

        {/* Interactive Groups (simplified) */}
        {interactiveGroups.filter((group) => group.active).length > 0 && (
          <div className="mt-8">
            {interactiveGroups
              .filter((group) => group.active)
              .map((group) => (
                <div
                  key={group.id}
                  className={`mb-4 p-4 ${buttonStyle} card-theme`}
                >
                  <h3 className={`font-medium ${textColor}`}>{group.title}</h3>
                  <p className={`text-sm ${textMutedColor}`}>
                    {group.type === "accordion"
                      ? "Accordion content"
                      : "Tab content"}
                  </p>
                </div>
              ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-10 text-center pb-20">
          <p className={`text-xs ${textMutedColor}`}>Made with Lynkr</p>
        </footer>
      </div>
    </div>
  );
}
