"use client";

import { YouTubeEmbedData } from "@/types/embed.types";

interface YouTubeEmbedProps {
  data: YouTubeEmbedData;
  className?: string;
}

export default function YouTubeEmbed({
  data,
  className = "",
}: YouTubeEmbedProps) {
  const { videoId, startTime, autoplay, loop } = data;

  // Construir parâmetros de URL para o iframe
  const params = new URLSearchParams({
    rel: "0", // videos relacionados
    showinfo: "0",
    modestbranding: "1", // menos branding
    enablejsapi: "1",
    origin: typeof window !== "undefined" ? window.location.origin : "",
    widget_referrer: typeof window !== "undefined" ? window.location.href : "",
  });

  if (autoplay) params.append("autoplay", "1");
  if (loop) params.append("loop", "1");
  if (startTime) params.append("start", startTime.toString());

  const embedUrl = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;

  return (
    <div
      className={`w-full aspect-video rounded-md overflow-hidden ${className}`}
    >
      <iframe
        src={embedUrl}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        title="YouTube Video Embed"
      />
    </div>
  );
}
