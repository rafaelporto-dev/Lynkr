"use client";

import { SoundCloudEmbedData } from "@/types/embed.types";

interface SoundCloudEmbedProps {
  data: SoundCloudEmbedData;
  className?: string;
}

export default function SoundCloudEmbed({
  data,
  className = "",
}: SoundCloudEmbedProps) {
  const { trackUrl, visual = false, autoplay = false, color } = data;

  // Construir parâmetros de URL para o iframe
  const params = new URLSearchParams({
    url: trackUrl,
    auto_play: autoplay ? "true" : "false",
    hide_related: "false",
    show_comments: "true",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "true",
    visual: visual ? "true" : "false",
  });

  if (color) params.append("color", color.replace("#", ""));

  const embedUrl = `https://w.soundcloud.com/player/?${params.toString()}`;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <iframe
        width="100%"
        height={visual ? "300" : "166"}
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={embedUrl}
        title="SoundCloud Embed"
      />
    </div>
  );
}
