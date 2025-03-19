"use client";

import { EmbedContentType, EmbedData } from "@/types/embed.types";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Carregamento dinâmico dos componentes de incorporação
const YouTubeEmbed = dynamic(() => import("./youtube-embed"), {
  loading: () => <EmbedLoading type="youtube" />,
});

const SpotifyEmbed = dynamic(() => import("./spotify-embed"), {
  loading: () => <EmbedLoading type="spotify" />,
});

const VimeoEmbed = dynamic(() => import("./vimeo-embed"), {
  loading: () => <EmbedLoading type="vimeo" />,
});

const TikTokEmbed = dynamic(() => import("./tiktok-embed"), {
  loading: () => <EmbedLoading type="tiktok" />,
});

const InstagramEmbed = dynamic(() => import("./instagram-embed"), {
  loading: () => <EmbedLoading type="instagram" />,
});

const TwitterEmbed = dynamic(() => import("./twitter-embed"), {
  loading: () => <EmbedLoading type="twitter" />,
});

const SoundCloudEmbed = dynamic(() => import("./soundcloud-embed"), {
  loading: () => <EmbedLoading type="soundcloud" />,
});

// Componente de carregamento para cada tipo de incorporação
function EmbedLoading({ type }: { type: EmbedContentType }) {
  const getLoadingText = () => {
    switch (type) {
      case "youtube":
        return "Carregando vídeo do YouTube...";
      case "spotify":
        return "Carregando música do Spotify...";
      case "soundcloud":
        return "Carregando faixa do SoundCloud...";
      case "vimeo":
        return "Carregando vídeo do Vimeo...";
      case "tiktok":
        return "Carregando vídeo do TikTok...";
      case "instagram":
        return "Carregando post do Instagram...";
      case "twitter":
        return "Carregando tweet...";
      default:
        return "Carregando conteúdo...";
    }
  };

  return (
    <div className="w-full p-6 flex flex-col items-center justify-center border rounded-md border-muted bg-muted/30 min-h-[200px]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
      <p className="text-sm text-muted-foreground">{getLoadingText()}</p>
    </div>
  );
}

interface EmbedContentProps {
  contentType: EmbedContentType;
  embedData: EmbedData;
  className?: string;
}

export default function EmbedContent({
  contentType,
  embedData,
  className = "",
}: EmbedContentProps) {
  // Se não for um tipo válido de incorporação, não renderizar nada
  if (contentType === "link" || !embedData) {
    return null;
  }

  // Renderizar o componente apropriado com base no tipo de conteúdo
  switch (contentType) {
    case "youtube":
      return <YouTubeEmbed data={embedData} className={className} />;

    case "spotify":
      return <SpotifyEmbed data={embedData} className={className} />;

    case "soundcloud":
      return <SoundCloudEmbed data={embedData} className={className} />;

    case "vimeo":
      return <VimeoEmbed data={embedData} className={className} />;

    case "tiktok":
      return <TikTokEmbed data={embedData} className={className} />;

    case "instagram":
      return <InstagramEmbed data={embedData} className={className} />;

    case "twitter":
      return <TwitterEmbed data={embedData} className={className} />;

    default:
      return null;
  }
}
