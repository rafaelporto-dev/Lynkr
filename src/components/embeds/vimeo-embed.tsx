"use client";

import { VimeoEmbedData } from "@/types/embed.types";

interface VimeoEmbedProps {
  data: VimeoEmbedData;
  className?: string;
}

export default function VimeoEmbed({ data, className = "" }: VimeoEmbedProps) {
  const {
    videoId,
    autoplay = false,
    loop = false,
    title = true,
    byline = true,
    portrait = true,
    color,
  } = data;

  // Construir parâmetros de URL para o iframe
  const params = new URLSearchParams({
    title: title ? "1" : "0",
    byline: byline ? "1" : "0",
    portrait: portrait ? "1" : "0",
    autopause: "0",
    dnt: "1", // Do Not Track
  });

  if (autoplay) params.append("autoplay", "1");
  if (loop) params.append("loop", "1");
  if (color) params.append("color", color.replace("#", ""));

  const embedUrl = `https://player.vimeo.com/video/${videoId}?${params.toString()}`;

  return (
    <div
      className={`w-full aspect-video rounded-md overflow-hidden ${className}`}
    >
      <iframe
        src={embedUrl}
        className="w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Vimeo Video Embed"
      />
    </div>
  );
}
