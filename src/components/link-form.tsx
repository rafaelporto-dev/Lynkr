"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LinkIcon, Plus, Loader2, Link2, Image } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { Skeleton } from "./ui/skeleton";
import { extractEmbedData } from "@/lib/embed-utils";
import { EmbedContentType, EmbedData } from "@/types/embed.types";
import EmbedContent from "./embeds/embed-content";

export default function LinkForm() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [contentType, setContentType] = useState<EmbedContentType>("link");
  const [embedData, setEmbedData] = useState<EmbedData | null>(null);
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchLinkPreview = async () => {
      if (!url || !isValidUrl(url)) return;

      // Check if URL can be embedded
      const embedInfo = extractEmbedData(url);
      setContentType(embedInfo.contentType);
      setEmbedData(embedInfo.embedData);

      // If not embeddable, fetch a normal preview
      if (embedInfo.contentType === "link") {
        setIsFetchingPreview(true);
        try {
          const response = await supabase.functions.invoke(
            "supabase-functions-fetch-link-preview",
            {
              body: { url },
            }
          );

          if (response.error) throw new Error(response.error.message);

          if (response.data) {
            setThumbnailUrl(response.data.thumbnailUrl || null);
            // If user hasn't entered a title yet, suggest the one from preview
            if (!title && response.data.title) {
              setPreviewTitle(response.data.title);
            }
          }
        } catch (error) {
          console.error("Error fetching link preview:", error);
        } finally {
          setIsFetchingPreview(false);
        }
      } else {
        // If embeddable, no need to fetch thumbnails
        setIsFetchingPreview(false);
        setThumbnailUrl(null);

        // Suggest title based on content type if none exists
        if (!title) {
          const suggestionTitles: Record<EmbedContentType, string> = {
            youtube: "YouTube Video",
            spotify: "Spotify Music",
            soundcloud: "SoundCloud Track",
            vimeo: "Vimeo Video",
            tiktok: "TikTok Video",
            instagram: "Instagram Post",
            twitter: "Tweet",
            link: "Link",
          };
          setPreviewTitle(
            suggestionTitles[embedInfo.contentType] || "Embedded Content"
          );
        }
      }
    };

    // Debounce the preview fetch to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchLinkPreview();
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [url, title]);

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleUsePreviewTitle = () => {
    if (previewTitle) {
      setTitle(previewTitle);
      setPreviewTitle("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!title.trim()) {
      setError("Title is required");
      setIsLoading(false);
      return;
    }

    // URL validation
    try {
      new URL(url);
    } catch (e) {
      setError("Please enter a valid URL (include https://)");
      setIsLoading(false);
      return;
    }

    try {
      // Get user data
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to create links");
        setIsLoading(false);
        return;
      }

      // Get the highest display order for this user
      const { data: links } = await supabase
        .from("links")
        .select("display_order")
        .eq("user_id", user.id)
        .order("display_order", { ascending: false })
        .limit(1);

      const nextOrder =
        links && links.length > 0 ? links[0].display_order + 1 : 0;

      // Prepare link data with content type and embed data for embedded content
      const linkData = {
        user_id: user.id,
        title: title.trim(),
        url: url.trim(),
        display_order: nextOrder,
        active: true,
        click_count: 0,
        thumbnail_url: contentType === "link" ? thumbnailUrl : null,
        content_type: contentType,
        embed_data: embedData,
      };

      // Insert the new link
      const { error: insertError } = await supabase
        .from("links")
        .insert(linkData);

      if (insertError) {
        throw insertError;
      }

      // Reset form and refresh
      setTitle("");
      setUrl("");
      setThumbnailUrl(null);
      setPreviewTitle("");
      setContentType("link");
      setEmbedData(null);
      router.refresh();

      toast({
        title: "Link created",
        description:
          contentType === "link"
            ? "Your link has been added successfully."
            : "Your embedded content has been added successfully.",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create link");
      toast({
        title: "Error",
        description: "Failed to create link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Link title</Label>
        <div className="relative">
          <Input
            id="title"
            placeholder="My Website"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className="h-9"
          />
          {previewTitle && (
            <div className="mt-1 text-xs flex items-center gap-1">
              <span className="text-muted-foreground">Suggestion:</span>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs text-primary"
                onClick={handleUsePreviewTitle}
              >
                {previewTitle.length > 40
                  ? `${previewTitle.substring(0, 40)}...`
                  : previewTitle}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <div className="relative">
          <Input
            id="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            className="h-9"
          />
          {isFetchingPreview && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {contentType !== "link" && url && isValidUrl(url) && (
        <div className="border rounded-md p-2 bg-muted/30">
          <div className="text-xs text-muted-foreground pb-2">
            Preview of embedded content:
          </div>
          <div className="w-full h-24 bg-muted/30 rounded-md overflow-hidden flex items-center justify-center text-muted-foreground text-xs">
            {contentType} will be embedded
          </div>
        </div>
      )}

      {contentType === "link" && thumbnailUrl && (
        <div className="flex gap-2 items-center">
          <div className="h-12 w-12 rounded-md overflow-hidden border bg-muted/30">
            <img
              src={thumbnailUrl}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Available thumbnail
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || isFetchingPreview}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" /> Add Link
          </>
        )}
      </Button>
    </form>
  );
}
