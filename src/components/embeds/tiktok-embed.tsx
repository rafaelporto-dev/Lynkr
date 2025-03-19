"use client";

import { TikTokEmbedData } from "@/types/embed.types";
import { useEffect, useRef } from "react";

interface TikTokEmbedProps {
  data: TikTokEmbedData;
  className?: string;
}

export default function TikTokEmbed({
  data,
  className = "",
}: TikTokEmbedProps) {
  const { videoId } = data;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carrega o script do TikTok apenas se ainda não estiver carregado
    if (!document.getElementById("tiktok-embed-script")) {
      const script = document.createElement("script");
      script.id = "tiktok-embed-script";
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);

      // Função para limpar o script no unmount
      return () => {
        if (document.getElementById("tiktok-embed-script")) {
          document.body.removeChild(script);
        }
      };
    }

    // Quando o script for carregado, o TikTok renderizará automaticamente os embeds
    // com a classe 'tiktok-embed'
  }, []);

  const embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <blockquote
        className="tiktok-embed"
        cite={`https://www.tiktok.com/video/${videoId}`}
        data-video-id={videoId}
        style={{ maxWidth: "605px", minWidth: "325px" }}
      >
        <section></section>
      </blockquote>
    </div>
  );
}
