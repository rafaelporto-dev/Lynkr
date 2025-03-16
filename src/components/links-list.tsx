"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink, Trash2, BarChart2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Link = {
  id: string;
  title: string;
  url: string;
  click_count: number;
  active: boolean;
  display_order: number;
};

export default function LinksList() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to view links");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", user.id)
        .order("display_order", { ascending: true });

      if (fetchError) throw fetchError;
      setLinks(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load links");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();

    // Set up realtime subscription
    const channel = supabase
      .channel("links-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "links" },
        () => fetchLinks(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const { error: deleteError } = await supabase
        .from("links")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      // The list will update via the realtime subscription
    } catch (err: any) {
      setError(err.message || "Failed to delete link");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading && links.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Links</span>
          <span className="text-sm font-normal text-muted-foreground">
            {links.length} {links.length === 1 ? "link" : "links"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {links.length === 0 && !isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>You haven't created any links yet.</p>
            <p className="text-sm mt-1">
              Add your first link using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3 bg-card border rounded-lg hover:bg-accent/5 transition-colors"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className="font-medium truncate">{link.title}</h3>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground truncate flex items-center hover:text-primary"
                  >
                    <ExternalLink size={12} className="mr-1 inline" />
                    <span className="truncate">{link.url}</span>
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    <BarChart2 size={12} />
                    <span>{link.click_count}</span>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(link.id)}
                    disabled={deletingId === link.id}
                  >
                    {deletingId === link.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
