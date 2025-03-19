import { EmbedContentType, EmbedData } from "@/types/embed.types";

// Detecta o tipo de conteúdo incorporável a partir da URL
export function detectContentType(url: string): EmbedContentType {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Funções auxiliares para verificar se o hostname pertence a um serviço específico
    const isYouTube = () =>
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "youtu.be" ||
      hostname.endsWith(".youtube.com");

    const isSpotify = () =>
      hostname === "spotify.com" ||
      hostname === "www.spotify.com" ||
      hostname === "open.spotify.com" ||
      hostname.endsWith(".spotify.com");

    const isSoundCloud = () =>
      hostname === "soundcloud.com" ||
      hostname === "www.soundcloud.com" ||
      hostname.endsWith(".soundcloud.com");

    const isVimeo = () =>
      hostname === "vimeo.com" ||
      hostname === "www.vimeo.com" ||
      hostname === "player.vimeo.com" ||
      hostname.endsWith(".vimeo.com");

    const isTikTok = () =>
      hostname === "tiktok.com" ||
      hostname === "www.tiktok.com" ||
      hostname === "vm.tiktok.com" ||
      hostname.endsWith(".tiktok.com");

    const isInstagram = () =>
      hostname === "instagram.com" ||
      hostname === "www.instagram.com" ||
      hostname.endsWith(".instagram.com");

    const isTwitter = () =>
      hostname === "twitter.com" ||
      hostname === "www.twitter.com" ||
      hostname === "x.com" ||
      hostname === "www.x.com" ||
      hostname.endsWith(".twitter.com") ||
      hostname.endsWith(".x.com");

    // Verifique cada serviço
    if (isYouTube()) {
      return "youtube";
    } else if (isSpotify()) {
      return "spotify";
    } else if (isSoundCloud()) {
      return "soundcloud";
    } else if (isVimeo()) {
      return "vimeo";
    } else if (isTikTok()) {
      return "tiktok";
    } else if (isInstagram()) {
      return "instagram";
    } else if (isTwitter()) {
      return "twitter";
    }

    return "link";
  } catch (error) {
    return "link";
  }
}

// Extrai o ID do vídeo do YouTube de uma URL
export function extractYouTubeID(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname;

    let videoId = null;

    // youtube.com/watch?v=VIDEO_ID
    if (hostname.includes("youtube.com")) {
      videoId = urlObj.searchParams.get("v");
    }
    // youtu.be/VIDEO_ID
    else if (hostname.includes("youtu.be")) {
      videoId = pathname.slice(1);
    }
    // youtube.com/embed/VIDEO_ID
    else if (
      hostname.includes("youtube.com") &&
      pathname.startsWith("/embed/")
    ) {
      videoId = pathname.split("/embed/")[1];
    }
    // youtube.com/v/VIDEO_ID
    else if (hostname.includes("youtube.com") && pathname.startsWith("/v/")) {
      videoId = pathname.split("/v/")[1];
    }

    // Limpa qualquer parâmetro adicional que possa estar no final do ID
    if (videoId && videoId.includes("&")) {
      videoId = videoId.split("&")[0];
    }
    if (videoId && videoId.includes("?")) {
      videoId = videoId.split("?")[0];
    }

    return videoId;
  } catch (error) {
    return null;
  }
}

// Extrai parâmetros de tempo de início do YouTube
export function extractYouTubeStartTime(url: string): number | undefined {
  try {
    const urlObj = new URL(url);
    const tParam = urlObj.searchParams.get("t");

    if (tParam) {
      // Verifica se o parâmetro contém 's', 'm', ou 'h' (ex: 1h30m15s)
      if (/\d+[hms]/.test(tParam)) {
        const hours = /(\d+)h/.exec(tParam)?.[1]
          ? parseInt(/(\d+)h/.exec(tParam)?.[1] || "0")
          : 0;
        const minutes = /(\d+)m/.exec(tParam)?.[1]
          ? parseInt(/(\d+)m/.exec(tParam)?.[1] || "0")
          : 0;
        const seconds = /(\d+)s/.exec(tParam)?.[1]
          ? parseInt(/(\d+)s/.exec(tParam)?.[1] || "0")
          : 0;

        return hours * 3600 + minutes * 60 + seconds;
      }

      // Se for apenas um número, assume que são segundos
      return parseInt(tParam);
    }

    return undefined;
  } catch (error) {
    return undefined;
  }
}

// Extrai ID e tipo do Spotify
export function extractSpotifyData(url: string): {
  spotifyId: string;
  type: "track" | "album" | "playlist" | "artist";
} | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Formatos:
    // - /track/id
    // - /album/id
    // - /playlist/id
    // - /artist/id
    // - /embed/track|album|playlist|artist/id

    let match;

    // Formato normal: /track|album|playlist|artist/id
    match = pathname.match(/^\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);

    // Formato embed: /embed/track|album|playlist|artist/id
    if (!match) {
      match = pathname.match(
        /^\/embed\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/
      );
    }

    if (match && match.length === 3) {
      const type = match[1] as "track" | "album" | "playlist" | "artist";
      const spotifyId = match[2];
      return { type, spotifyId };
    }

    return null;
  } catch (error) {
    return null;
  }
}

// Extrai ID do Vimeo
export function extractVimeoID(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Formato típico: /123456789
    const match = pathname.match(/^\/(\d+)/);

    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
}

// Extrai ID do TikTok
export function extractTikTokID(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Formato: /@username/video/1234567890
    const match = pathname.match(/\/video\/(\d+)/);

    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
}

// Extrai ID do Instagram
export function extractInstagramID(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Formato: /p/shortcode ou /reel/shortcode
    const match = pathname.match(/\/(?:p|reel)\/([A-Za-z0-9_-]+)/);

    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
}

// Extrai ID do Twitter
export function extractTwitterID(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Formato: /username/status/1234567890
    const match = pathname.match(/\/[^\/]+\/status\/(\d+)/);

    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
}

// Função principal para extrair dados de incorporação
export function extractEmbedData(url: string): {
  contentType: EmbedContentType;
  embedData: EmbedData | null;
} {
  const contentType = detectContentType(url);

  switch (contentType) {
    case "youtube": {
      const videoId = extractYouTubeID(url);
      const startTime = extractYouTubeStartTime(url);

      if (!videoId) return { contentType: "link", embedData: null };

      return {
        contentType,
        embedData: {
          videoId,
          startTime,
          autoplay: false,
          loop: false,
        },
      };
    }

    case "spotify": {
      const data = extractSpotifyData(url);

      if (!data) return { contentType: "link", embedData: null };

      return {
        contentType,
        embedData: {
          ...data,
          theme: "dark",
          compact: false,
        },
      };
    }

    case "vimeo": {
      const videoId = extractVimeoID(url);

      if (!videoId) return { contentType: "link", embedData: null };

      return {
        contentType,
        embedData: {
          videoId,
          autoplay: false,
          loop: false,
          title: true,
          byline: true,
          portrait: true,
        },
      };
    }

    case "tiktok": {
      const videoId = extractTikTokID(url);

      if (!videoId) return { contentType: "link", embedData: null };

      return {
        contentType,
        embedData: { videoId },
      };
    }

    case "instagram": {
      const postId = extractInstagramID(url);

      if (!postId) return { contentType: "link", embedData: null };

      return {
        contentType,
        embedData: {
          postId,
          captioned: true,
        },
      };
    }

    case "twitter": {
      const tweetId = extractTwitterID(url);

      if (!tweetId) return { contentType: "link", embedData: null };

      return {
        contentType,
        embedData: {
          tweetId,
          theme: "dark",
          cards: "visible",
          conversation: "none",
        },
      };
    }

    default:
      return { contentType: "link", embedData: null };
  }
}
