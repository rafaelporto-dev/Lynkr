"use client";

import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, ExternalLink, ShieldAlert, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeId } from "@/lib/themes/base-themes";
import { ThemeManager } from "@/lib/themes/theme-manager";
import { DesignTokens } from "@/lib/themes/tokens";
import EmbedContent from "@/components/embeds/embed-content";
import { EmbedContentType, EmbedData } from "@/types/embed.types";

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

// Button styles definitions - mesmos do UserProfilePage
const buttonStyles = {
  rounded: "rounded-md",
  pill: "rounded-full",
  square: "rounded-none",
  "3d": "rounded-md shadow-lg transform hover:-translate-y-1",
  neon: "rounded-md shadow-lg shadow-primary/50",
  glass: "rounded-md bg-white/10 backdrop-blur-lg border border-white/20",
  button: "rounded-md", // Estilo para botões com aparência de botão
};

// Font families - mesmos do UserProfilePage
const fontFamilies = {
  inter: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
  poppins: "font-poppins",
  roboto: "font-roboto",
  playfair: "font-playfair",
};

// Layout options - mesmos do UserProfilePage
const layoutOptions = {
  list: "space-y-4",
  grid: "grid grid-cols-2 gap-4",
  cards: "grid grid-cols-1 sm:grid-cols-2 gap-4",
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
  // Usar os tokens do tema diretamente do ThemeManager
  const themeTokens = useMemo(() => {
    return ThemeManager.getThemeTokens(themeId);
  }, [themeId]);

  // Get button style - exatamente como em UserProfilePage
  const buttonStyle = useMemo(() => {
    const styleId = profile?.button_style || "rounded";
    return (
      buttonStyles[styleId as keyof typeof buttonStyles] || buttonStyles.rounded
    );
  }, [profile?.button_style]);

  // Get font family - exatamente como em UserProfilePage
  const fontFamily = useMemo(() => {
    const fontId = profile?.font_family || "inter";
    return (
      fontFamilies[fontId as keyof typeof fontFamilies] || fontFamilies.inter
    );
  }, [profile?.font_family]);

  // Get layout style - exatamente como em UserProfilePage
  const layoutStyle = useMemo(() => {
    const layoutId = profile?.layout || "list";
    return (
      layoutOptions[layoutId as keyof typeof layoutOptions] ||
      layoutOptions.list
    );
  }, [profile?.layout]);

  // Determine background style - exatamente como em UserProfilePage
  const backgroundStyle = useMemo(() => {
    if (!profile) return {};

    const backgroundType = profile.background_type || "gradient";

    switch (backgroundType) {
      case "image":
        return profile.background_url
          ? {
              backgroundImage: `url(${profile.background_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {};
      case "solid":
        return {
          backgroundColor: themeTokens.colors.background,
        };
      case "gradient":
      default:
        return {
          background: themeTokens.effects.gradient.background,
        };
    }
  }, [profile, themeTokens]);

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">No profile data available</p>
      </div>
    );
  }

  // Generate text color class - como em UserProfilePage
  const textColor = "text-theme-text";
  const textMutedColor = "text-theme-muted";

  return (
    <div
      className={cn(
        `profile-page theme-${ThemeManager.validateThemeId(themeId)}`,
        fontFamily,
        "overflow-auto" // Adicionando overflow-auto para permitir scroll
      )}
      style={backgroundStyle}
      data-theme-id={themeId}
    >
      {/* Conteúdo do perfil aqui usando as classes temáticas - EXATAMENTE como no UserProfilePage */}
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <header className="text-center mb-8 sm:mb-10">
          <Avatar className="profile-avatar h-20 w-20 sm:h-24 sm:w-24 mx-auto mb-3 sm:mb-4">
            {profile.avatar_url ? (
              <AvatarImage
                src={profile.avatar_url}
                alt={`${profile.full_name || profile.username || "User"}'s profile picture`}
              />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-10 w-10 sm:h-12 sm:w-12" />
              </AvatarFallback>
            )}
          </Avatar>

          <h1 className="profile-title">
            {profile.full_name || profile.username || "User"}
          </h1>

          {profile.bio && <p className="profile-bio">{profile.bio}</p>}

          <div className="flex flex-wrap items-center gap-2 justify-center">
            <div className="profile-badge">@{profile.username || "user"}</div>
            <div className="profile-badge bg-background/20 text-white p-2 rounded-full cursor-pointer">
              <QrCode className="h-4 w-4" />
            </div>
          </div>
        </header>

        {/* Links - usando EXATAMENTE as mesmas classes que o UserProfilePage */}
        <main
          className={cn(
            layoutStyle,
            "px-0 sm:px-2" // Adiciona padding apenas em telas maiores
          )}
        >
          {links.length === 0 ? (
            <div className={`text-center ${textMutedColor}`}>
              No links added yet
            </div>
          ) : (
            links
              .filter((link) => link.active)
              .map((link) => (
                <a
                  key={link.id}
                  href="javascript:void(0)"
                  className={cn(
                    "profile-button-link",
                    // Adicionar a classe button-style para links que devem ter aparência de botão
                    profile?.button_style === "button" ? "button-style" : ""
                  )}
                  aria-label={`Open ${link.title} link`}
                >
                  <div
                    className={cn(
                      "profile-link-button",
                      buttonStyle, // Aplica o estilo de botão escolhido
                      // Condicional para evitar que o estilo "pill" afete os vídeos
                      link.content_type &&
                        ["youtube", "vimeo", "tiktok"].includes(
                          link.content_type
                        )
                        ? "video-card" // Classe personalizada para vídeos
                        : "" // Sem classe extra para outros tipos
                    )}
                  >
                    {/* Renderiza conteúdo incorporado se disponível */}
                    {link.content_type &&
                      link.content_type !== "link" &&
                      link.embed_data && (
                        <div className="video-embed-container w-full">
                          <EmbedContent
                            contentType={link.content_type as EmbedContentType}
                            embedData={link.embed_data as EmbedData}
                            className="video-embed"
                          />
                        </div>
                      )}

                    {/* Exibe thumbnail se não houver conteúdo incorporado */}
                    {(!link.content_type || link.content_type === "link") &&
                      link.thumbnail_url && (
                        <div className="w-full h-24 sm:h-32 overflow-hidden">
                          <img
                            src={link.thumbnail_url}
                            alt={`Thumbnail for ${link.title}`}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            loading="lazy"
                            width="400"
                            height="225"
                          />
                        </div>
                      )}

                    {/* Informações do link (título, ícone, etc.) */}
                    <div className="link-content">
                      <div className="flex items-center flex-1 min-w-0">
                        {link.icon && !link.thumbnail_url ? (
                          <div className="mr-2 sm:mr-3 text-primary/70 flex-shrink-0">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-primary/20 rounded-full">
                              {link.icon}
                            </div>
                          </div>
                        ) : null}
                        <div className="link-title" title={link.title}>
                          {link.title}
                          {link.is_adult_content && (
                            <div className="inline-flex items-center ml-2 bg-warning/20 text-warning text-xs px-1.5 py-0.5 rounded-full gap-0.5 font-medium">
                              <ShieldAlert className="h-3 w-3" />
                              <span>18+</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 ml-2 link-icon" />
                    </div>
                  </div>
                </a>
              ))
          )}
        </main>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 text-center text-xs text-muted-foreground">
          <p>Powered by Lynkr</p>
        </footer>
      </div>
    </div>
  );
}
