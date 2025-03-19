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
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Head from "next/head";
import EmbedContent from "./embeds/embed-content";
import { EmbedContentType, EmbedData } from "@/types/embed.types";

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
};

interface Theme {
  id: string;
  gradient: string;
  cardBg: string;
  borderColor: string;
  buttonGradient: string;
  buttonHoverGradient: string;
  badgeGradient: string;
  textColor?: string;
}

const themes: Theme[] = [
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
  {
    id: "glassmorphism",
    gradient: "from-blue-500/30 to-purple-500/30",
    cardBg: "bg-white/10 backdrop-blur-lg",
    borderColor: "border-white/20",
    buttonGradient: "from-white/20 to-white/10",
    buttonHoverGradient: "from-white/30 to-white/20",
    badgeGradient: "from-white/20 to-white/10",
  },
  {
    id: "neon",
    gradient: "from-black to-gray-950",
    cardBg: "bg-black/80",
    borderColor: "border-purple-500/50",
    buttonGradient: "from-purple-600 to-blue-600",
    buttonHoverGradient: "from-purple-700 to-blue-700",
    badgeGradient: "from-purple-600 to-blue-600",
  },
];

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

  const themeConfig = useMemo(() => {
    const themeId = profile?.theme || "default";
    return themes.find((theme) => theme.id === themeId) || themes[0];
  }, [profile?.theme]);

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
        // Use a solid color that matches the theme
        return {};
      case "gradient":
      default:
        // Use the gradient from the theme
        return {};
    }
  }, [profile]);

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
  async function handleLinkClick(linkId: string) {
    try {
      // Capturar informações de origem
      const referrer = document.referrer || "direct";
      const utmSource = new URLSearchParams(window.location.search).get(
        "utm_source"
      );
      const utmMedium = new URLSearchParams(window.location.search).get(
        "utm_medium"
      );
      const utmCampaign = new URLSearchParams(window.location.search).get(
        "utm_campaign"
      );

      // Determinar a origem com base nos parâmetros UTM ou referenciador
      let source = "direct";
      if (utmSource) {
        source = utmSource;
      } else if (referrer) {
        try {
          // Extrair o domínio do referenciador
          const referrerUrl = new URL(referrer);
          source = referrerUrl.hostname;

          // Identificar origens comuns de redes sociais
          if (source.includes("facebook.com")) source = "facebook";
          if (source.includes("instagram.com")) source = "instagram";
          if (source.includes("twitter.com") || source.includes("x.com"))
            source = "twitter";
          if (source.includes("linkedin.com")) source = "linkedin";
          if (source.includes("youtube.com")) source = "youtube";
          if (source.includes("google.com")) source = "google";
          if (source.includes("bing.com")) source = "bing";
        } catch (e) {
          // URL inválido, manter como referrer bruto
          source = referrer;
        }
      }

      // Enviar dados para o banco usando a tabela clicks existente
      const { error } = await supabase.from("clicks").insert([
        {
          link_id: linkId,
          referrer,
          source,
          utm_source: utmSource || null,
          utm_medium: utmMedium || null,
          utm_campaign: utmCampaign || null,
        },
      ]);

      if (error) {
        console.error("Error recording click", error);
      }
    } catch (err) {
      console.error("Failed to record click", err);
    }
  }

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

  // Generate text color class
  const textColor = themeConfig.textColor || "text-white";
  const textMutedColor =
    themeConfig.id === "minimal" ? "text-gray-600" : "text-gray-300";

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

      <div
        className={cn(
          `min-h-screen bg-gradient-to-br ${themeConfig.gradient} py-8 px-4 sm:py-12 sm:px-6 lg:px-8`,
          fontFamily
        )}
        style={backgroundStyle}
      >
        {/* Custom CSS if available */}
        {profile.custom_css && (
          <style dangerouslySetInnerHTML={{ __html: profile.custom_css }} />
        )}

        <div className="max-w-md mx-auto">
          {/* Profile Header */}
          <header className="text-center mb-8 sm:mb-10">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mx-auto mb-3 sm:mb-4 ring-2 ring-purple-500 ring-offset-2 ring-offset-black">
              {profile.avatar_url ? (
                <AvatarImage
                  src={profile.avatar_url}
                  alt={`${profile.full_name || profile.username || "User"}'s profile picture`}
                />
              ) : (
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-500">
                  <User className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                </AvatarFallback>
              )}
            </Avatar>

            <h1 className={`text-xl sm:text-2xl font-bold ${textColor} mb-2`}>
              {profile.full_name || profile.username || "User"}
            </h1>

            {profile.bio && (
              <p
                className={`${textMutedColor} text-sm sm:text-base mb-3 sm:mb-4 max-w-xs mx-auto`}
              >
                {profile.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 justify-center">
              <div
                className={`inline-block bg-gradient-to-r ${themeConfig.badgeGradient} rounded-full px-3 py-1 text-xs sm:text-sm text-white`}
              >
                @{profile.username || "user"}
              </div>
              <ProfileQRCode
                username={profile.username || ""}
                {...(customDomain ? { customDomain } : {})}
                profileTheme={profile.theme || undefined}
              />
            </div>
          </header>

          {/* Links */}
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
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link.id)}
                  className="block w-full"
                  aria-label={`Open ${link.title} link`}
                >
                  <Card
                    className={cn(
                      `w-full ${themeConfig.cardBg} ${themeConfig.borderColor} overflow-hidden`,
                      `hover:bg-gradient-to-r hover:${themeConfig.buttonGradient}`,
                      `shadow-lg shadow-${themeConfig.borderColor.replace("border-", "")}`,
                      `hover:shadow-${themeConfig.borderColor.replace("border-", "")}`,
                      `transition-all duration-300`,
                      buttonStyle
                    )}
                  >
                    {/* Renderiza conteúdo incorporado se disponível */}
                    {link.content_type &&
                      link.content_type !== "link" &&
                      link.embed_data && (
                        <div
                          className="embed-container py-2 px-2"
                          onClick={(e) => {
                            // Impede que o clique no embed também navegue para o link
                            e.preventDefault();
                            e.stopPropagation();

                            // Ainda registra o clique para análises
                            handleLinkClick(link.id);
                          }}
                        >
                          <EmbedContent
                            contentType={link.content_type as EmbedContentType}
                            embedData={link.embed_data as EmbedData}
                            className="mb-2"
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
                    <div className="flex items-center justify-between p-3 sm:p-4">
                      <div className="flex items-center">
                        {link.icon && !link.thumbnail_url ? (
                          <div className="mr-2 sm:mr-3 text-purple-400">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-purple-500/20 rounded-full">
                              {link.icon}
                            </div>
                          </div>
                        ) : null}
                        <div
                          className={`font-medium ${textColor} text-sm sm:text-base line-clamp-1`}
                        >
                          {link.title}
                        </div>
                      </div>
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400 flex-shrink-0 ml-2" />
                    </div>
                  </Card>
                </a>
              ))
            )}
          </main>

          {/* Footer */}
          <footer className="mt-8 sm:mt-12 text-center text-xs text-gray-500">
            <p>Powered by Lynkr</p>
          </footer>
        </div>
      </div>
    </>
  );
}
