export type EmbedContentType =
  | "link"
  | "youtube"
  | "spotify"
  | "soundcloud"
  | "vimeo"
  | "tiktok"
  | "instagram"
  | "twitter";

export interface YouTubeEmbedData {
  videoId: string;
  startTime?: number;
  autoplay?: boolean;
  loop?: boolean;
}

export interface SpotifyEmbedData {
  spotifyId: string;
  type: "track" | "album" | "playlist" | "artist";
  theme?: "light" | "dark";
  compact?: boolean;
}

export interface SoundCloudEmbedData {
  trackUrl: string;
  visual?: boolean;
  autoplay?: boolean;
  color?: string;
}

export interface VimeoEmbedData {
  videoId: string;
  autoplay?: boolean;
  loop?: boolean;
  title?: boolean;
  byline?: boolean;
  portrait?: boolean;
  color?: string;
}

export interface TikTokEmbedData {
  videoId: string;
}

export interface InstagramEmbedData {
  postId: string;
  captioned?: boolean;
}

export interface TwitterEmbedData {
  tweetId: string;
  theme?: "light" | "dark";
  cards?: "hidden" | "visible";
  conversation?: "none" | "all";
}

export type EmbedData =
  | YouTubeEmbedData
  | SpotifyEmbedData
  | SoundCloudEmbedData
  | VimeoEmbedData
  | TikTokEmbedData
  | InstagramEmbedData
  | TwitterEmbedData;
