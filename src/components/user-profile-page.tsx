"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "../../supabase/client";
import { Database } from "@/types/database.types";
import { Avatar } from "./ui/avatar";
import { AvatarImage, AvatarFallback } from "./ui/avatar";
import { ExternalLink, User, QrCode, ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import ProfileQRCode from "./profile-qr-code";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Head from "next/head";
import EmbedContent from "./embeds/embed-content";
import { EmbedContentType, EmbedData } from "@/types/embed.types";
import { AdultContentWarningDialog } from "./adult-content-warning-dialog";
import { ThemeId } from "@/lib/themes/base-themes";
import { ThemeManager } from "@/lib/themes/theme-manager";
import { DesignTokens } from "@/lib/themes/tokens";

type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  button_style?: string;
  font_family?: string;
  layout?: string;
  background_type?: string;
  background_url?: string | null;
  custom_css?: string | null;
};

type Link = Database["public"]["Tables"]["links"]["Row"] & {
  thumbnail_url?: string | null;
  content_type?: string | null;
  embed_data?: EmbedData | null;
  is_adult_content?: boolean;
};

// Button styles definitions
const buttonStyles = {
  rounded: "rounded-md",
  pill: "rounded-full",
  square: "rounded-none",
  "3d": "rounded-md shadow-lg transform hover:-translate-y-1",
  neon: "rounded-md shadow-lg shadow-primary/50",
  glass: "rounded-md bg-white/10 backdrop-blur-lg border border-white/20",
};

// Font families
const fontFamilies = {
  inter: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
  poppins: "font-poppins",
  roboto: "font-roboto",
  playfair: "font-playfair",
};

// Layout options
const layoutOptions = {
  list: "space-y-4",
  grid: "grid grid-cols-2 gap-4",
  cards: "grid grid-cols-1 sm:grid-cols-2 gap-4",
};

export default function UserProfilePage({ username }: { username: string }) {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [customDomain, setCustomDomain] = useState<string | null>(null);
  const [showAdultContentWarning, setShowAdultContentWarning] = useState(false);
  const [pendingLink, setPendingLink] = useState<{
    id: string;
    url: string;
    title: string;
  } | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [overrideTheme, setOverrideTheme] = useState<ThemeId | undefined>(
    undefined
  );

  // Verificar se estamos em modo de preview (para o editor)
  useEffect(() => {
    // Verificar parâmetros de URL para preview e tema
    const params = new URLSearchParams(window.location.search);
    const preview = params.get("preview") === "true";
    const themeParam = params.get("theme");

    setIsPreview(preview);
    if (themeParam) {
      setOverrideTheme(ThemeManager.validateThemeId(themeParam));
    }
  }, []);

  // Escutar por mudanças na URL (para atualizar tema em tempo real)
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const themeParam = params.get("theme");
      if (themeParam) {
        setOverrideTheme(ThemeManager.validateThemeId(themeParam));
      }
    };

    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  const themeTokens = useMemo(() => {
    // Usar tema sobrescrito pela URL se estiver em modo preview
    let themeId: string | undefined;

    if (isPreview && overrideTheme) {
      themeId = overrideTheme;
    } else {
      // O método validateThemeId espera string | undefined, não aceita null
      // Portanto, precisamos garantir que o theme seja undefined se for null
      themeId = profile?.theme || undefined;
    }

    return ThemeManager.getThemeTokens(ThemeManager.validateThemeId(themeId));
  }, [profile?.theme, isPreview, overrideTheme]);

  // Definindo classes e estilos customizados para componentes da UI
  const customTheme = useMemo(
    () => ({
      // Gradientes e backgrounds usando variáveis CSS
      badgeGradient: "from-primary to-primary/80",
      buttonGradient: "bg-primary hover:bg-primary/90",

      // Configurações do card
      cardBg: "bg-card",
      borderColor: "border-border",
      shadowColor: "primary/20",
      shadowHoverColor: "primary/30",
    }),
    [themeTokens]
  );

  // Get button style
  const buttonStyle = useMemo(() => {
    const styleId = profile?.button_style || "rounded";
    return (
      buttonStyles[styleId as keyof typeof buttonStyles] || buttonStyles.rounded
    );
  }, [profile?.button_style]);

  // Get font family
  const fontFamily = useMemo(() => {
    const fontId = profile?.font_family || "inter";
    return (
      fontFamilies[fontId as keyof typeof fontFamilies] || fontFamilies.inter
    );
  }, [profile?.font_family]);

  // Get layout style
  const layoutStyle = useMemo(() => {
    const layoutId = profile?.layout || "list";
    return (
      layoutOptions[layoutId as keyof typeof layoutOptions] ||
      layoutOptions.list
    );
  }, [profile?.layout]);

  // Determine background style
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

      // Fetch custom domain if available
      if (profileData.has_custom_domain) {
        const { data: domainData, error: domainError } = await supabase
          .from("custom_domains")
          .select("domain")
          .eq("user_id", profileData.id)
          .eq("verified", true)
          .single();

        if (!domainError && domainData) {
          setCustomDomain(domainData.domain);
        }
      }

      setLoading(false);
    }

    if (username) {
      loadProfile();
    }
  }, [username, supabase]);

  // Track link clicks
  async function handleLinkClick(
    linkId: string,
    isAdultContent: boolean,
    url: string,
    title: string
  ) {
    // Em modo preview, não mostrar avisos de conteúdo adulto
    if (isPreview) {
      trackLinkClick(linkId, url);
      return;
    }

    if (isAdultContent) {
      setShowAdultContentWarning(true);
      setPendingLink({ id: linkId, url, title });
    } else {
      trackLinkClick(linkId, url);
    }
  }

  // Função para processar a confirmação
  const handleConfirmAdultContent = () => {
    if (pendingLink) {
      trackLinkClick(pendingLink.id, pendingLink.url);
    }
    setShowAdultContentWarning(false);
    setPendingLink(null);
  };

  // Função para processar o cancelamento
  const handleCancelAdultContent = () => {
    setShowAdultContentWarning(false);
    setPendingLink(null);
  };

  // Função para registrar o clique do link e abrir o URL
  const trackLinkClick = async (linkId: string, url: string) => {
    // Não rastrear cliques em modo de preview
    if (isPreview) {
      window.open(url, "_blank");
      return;
    }

    try {
      const { error } = await supabase
        .from("link_clicks")
        .insert([{ link_id: linkId }]);

      if (error) throw error;

      // Abrir o link em uma nova aba
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error tracking link click:", error);
      // Ainda abrir o link mesmo se o rastreamento falhar
      window.open(url, "_blank");
    }
  };

  if (loading) {
    // If in preview mode, don't show loading screen
    if (isPreview) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-theme-background">
          <div className="text-theme-text text-lg">
            Waiting for profile data...
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-background">
        <div className="text-theme-text">Profile not found</div>
      </div>
    );
  }

  // Generate text color class
  const textColor = "text-theme-text";
  const textMutedColor = "text-theme-muted";

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>
          {profile.full_name || profile.username || "Profile"} | Lynkr
        </title>
        <meta
          name="title"
          content={`${profile.full_name || profile.username || "Profile"} | Lynkr`}
        />
        <meta
          name="description"
          content={
            profile.bio || `Check out ${profile.username}'s links on Lynkr.`
          }
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="profile" />
        <meta
          property="og:url"
          content={
            customDomain
              ? `https://${customDomain}`
              : `https://lynkr.me/${username}`
          }
        />
        <meta
          property="og:title"
          content={`${profile.full_name || profile.username || "Profile"} | Lynkr`}
        />
        <meta
          property="og:description"
          content={
            profile.bio || `Check out ${profile.username}'s links on Lynkr.`
          }
        />
        {profile.avatar_url && (
          <meta property="og:image" content={profile.avatar_url} />
        )}

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content={
            customDomain
              ? `https://${customDomain}`
              : `https://lynkr.me/${username}`
          }
        />
        <meta
          property="twitter:title"
          content={`${profile.full_name || profile.username || "Profile"} | Lynkr`}
        />
        <meta
          property="twitter:description"
          content={
            profile.bio || `Check out ${profile.username}'s links on Lynkr.`
          }
        />
        {profile.avatar_url && (
          <meta property="twitter:image" content={profile.avatar_url} />
        )}

        {/* Canonical URL */}
        <link
          rel="canonical"
          href={
            customDomain
              ? `https://${customDomain}`
              : `https://lynkr.me/${username}`
          }
        />

        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfilePage",
              mainEntity: {
                "@type": "Person",
                name: profile.full_name || profile.username || "User",
                url: customDomain
                  ? `https://${customDomain}`
                  : `https://lynkr.me/${username}`,
                ...(profile.avatar_url && { image: profile.avatar_url }),
                ...(profile.bio && { description: profile.bio }),
              },
            }),
          }}
        />
      </Head>

      {/* Aplicar CSS personalizado se disponível */}
      {profile.custom_css && !isPreview && (
        <style jsx global>{`
          ${profile.custom_css}
        `}</style>
      )}

      <div
        className={cn(
          `profile-page theme-${ThemeManager.validateThemeId(
            isPreview && overrideTheme
              ? overrideTheme
              : profile?.theme || "light"
          )}`,
          fontFamily
        )}
        style={backgroundStyle}
        data-theme-id={ThemeManager.validateThemeId(
          isPreview && overrideTheme ? overrideTheme : profile?.theme || "light"
        )}
      >
        {/* Debug info em modo de preview */}
        {isPreview && (
          <div className="fixed top-0 left-0 bg-black/80 text-white p-2 text-xs z-50 rounded-br-md">
            Theme:{" "}
            {ThemeManager.validateThemeId(
              overrideTheme || profile?.theme || "light"
            )}
          </div>
        )}

        {/* Conteúdo do perfil aqui usando as classes temáticas */}
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
              <ProfileQRCode
                username={profile.username || ""}
                {...(customDomain ? { customDomain } : {})}
                profileTheme={profile.theme || undefined}
              />
            </div>
          </header>

          {/* Links - Atualizar para usar a classe profile-link-button */}
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
              links.map((link) => (
                <a
                  key={link.id}
                  href="javascript:void(0)"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(
                      link.id,
                      !!link.is_adult_content,
                      link.url,
                      link.title
                    );
                  }}
                  className="block w-full"
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
                        <div
                          className="video-embed-container w-full"
                          onClick={(e) => {
                            // Impede que o clique no embed também navegue para o link
                            e.preventDefault();
                            e.stopPropagation();

                            // Ainda registra o clique para análises
                            handleLinkClick(
                              link.id,
                              !!link.is_adult_content,
                              link.url,
                              link.title
                            );
                          }}
                        >
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
                            onError={(e) => {
                              // Hide the image container if it fails to load
                              (
                                e.target as HTMLImageElement
                              ).parentElement!.style.display = "none";
                            }}
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

      {/* Dialog for adult content warning */}
      <AdultContentWarningDialog
        open={showAdultContentWarning}
        linkTitle={pendingLink?.title || ""}
        onConfirm={handleConfirmAdultContent}
        onCancel={handleCancelAdultContent}
      />
    </>
  );
}
