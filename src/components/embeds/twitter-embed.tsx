"use client";

import { TwitterEmbedData } from "@/types/embed.types";
import { useEffect, useRef } from "react";

interface TwitterEmbedProps {
  data: TwitterEmbedData;
  className?: string;
}

export default function TwitterEmbed({
  data,
  className = "",
}: TwitterEmbedProps) {
  const {
    tweetId,
    theme = "dark",
    cards = "visible",
    conversation = "none",
  } = data;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carrega o script do Twitter dinamicamente
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);

    // Limpa quando o componente for desmontado
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Renderiza o tweet quando o componente montar e quando o ID mudar
    if (containerRef.current && window.twttr) {
      containerRef.current.innerHTML = "";
      window.twttr.widgets.createTweet(tweetId, containerRef.current, {
        theme,
        cards,
        conversation,
        width: "100%",
        dnt: true, // Do Not Track
      });
    }
  }, [tweetId, theme, cards, conversation]);

  return (
    <div
      ref={containerRef}
      className={`w-full min-h-[200px] flex items-center justify-center ${className}`}
    >
      <p className="text-sm text-muted-foreground">Carregando tweet...</p>
    </div>
  );
}
