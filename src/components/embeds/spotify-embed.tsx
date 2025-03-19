"use client";

import { SpotifyEmbedData } from "@/types/embed.types";

interface SpotifyEmbedProps {
  data: SpotifyEmbedData;
  className?: string;
}

export default function SpotifyEmbed({
  data,
  className = "",
}: SpotifyEmbedProps) {
  const { spotifyId, type, theme = "dark", compact = false } = data;

  // Determinar a URL e altura com base no tipo
  let embedUrl = "";
  let height = compact ? 80 : 380;

  switch (type) {
    case "track":
      embedUrl = `https://open.spotify.com/embed/track/${spotifyId}`;
      height = compact ? 80 : 152;
      break;
    case "album":
      embedUrl = `https://open.spotify.com/embed/album/${spotifyId}`;
      break;
    case "playlist":
      embedUrl = `https://open.spotify.com/embed/playlist/${spotifyId}`;
      break;
    case "artist":
      embedUrl = `https://open.spotify.com/embed/artist/${spotifyId}`;
      break;
  }

  return (
    <div className={`w-full rounded-md overflow-hidden ${className}`}>
      <iframe
        src={`${embedUrl}?utm_source=lynkr&theme=${theme}`}
        className="w-full"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify Embed"
      />
    </div>
  );
}
