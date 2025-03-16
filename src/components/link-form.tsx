"use client";

import { useState } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { LinkIcon, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LinkForm() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();
  const router = useRouter();

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

      // Insert the new link
      const { error: insertError } = await supabase.from("links").insert({
        user_id: user.id,
        title: title.trim(),
        url: url.trim(),
        display_order: nextOrder,
        active: true,
        click_count: 0,
      });

      if (insertError) {
        throw insertError;
      }

      // Reset form and refresh
      setTitle("");
      setUrl("");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Plus size={18} />
          Add New Link
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="title">Link Title</Label>
            <Input
              id="title"
              placeholder="My Website"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <div className="flex items-center space-x-2">
              <LinkIcon size={16} className="text-muted-foreground" />
              <Input
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Link"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
