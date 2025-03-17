"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import {
  ExternalLink,
  Trash2,
  BarChart2,
  Loader2,
  GripVertical,
  Eye,
  EyeOff,
  Copy,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useToast } from "./ui/use-toast";

type Link = {
  id: string;
  title: string;
  url: string;
  click_count: number;
  active: boolean;
  display_order: number;
};

function SortableLink({
  link,
  onDelete,
  deletingId,
  onToggleActive,
  togglingId,
}: {
  link: Link;
  onDelete: (id: string) => void;
  deletingId: string | null;
  onToggleActive: (id: string, active: boolean) => void;
  togglingId: string | null;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 bg-card border rounded-lg transition-colors ${isDragging ? "shadow-lg opacity-90 border-primary" : link.active ? "hover:bg-accent/5" : "hover:bg-accent/5 bg-muted/20 border-dashed"}`}
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-primary"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0 mr-4">
          <h3 className="font-medium truncate">{link.title}</h3>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground truncate flex items-center hover:text-primary"
          >
            <ExternalLink className="h-3 w-3 mr-1 inline" />
            <span className="truncate">{link.url}</span>
          </a>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
          <BarChart2 className="h-3 w-3" />
          <span>{link.click_count}</span>
        </div>
        <div className="flex items-center gap-1 px-2">
          {togglingId === link.id ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <div
              className="flex items-center gap-1.5"
              title={link.active ? "Active" : "Inactive"}
            >
              {link.active ? (
                <Eye className="h-4 w-4 text-primary" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
              <Switch
                checked={link.active}
                onCheckedChange={(checked) => onToggleActive(link.id, checked)}
                disabled={togglingId === link.id}
                aria-label={`Toggle visibility for ${link.title}`}
              />
            </div>
          )}
        </div>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(link.id)}
          disabled={deletingId === link.id}
        >
          {deletingId === link.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default function LinksList() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      toast({
        title: "Error",
        description: "Failed to load links. Please try again.",
        variant: "destructive",
      });
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
        () => fetchLinks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      setTogglingId(id);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to update links");
      }

      const { error: updateError } = await supabase
        .from("links")
        .update({ active })
        .eq("id", id)
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      toast({
        title: "Link updated",
        description: `Link ${active ? "activated" : "deactivated"} successfully.`,
      });
    } catch (err: any) {
      setError(err.message || "Failed to update link status");
      toast({
        title: "Error",
        description: "Failed to update link status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const { error: deleteError } = await supabase
        .from("links")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      toast({
        title: "Link deleted",
        description: "Link has been deleted successfully.",
      });
    } catch (err: any) {
      setError(err.message || "Failed to delete link");
      toast({
        title: "Error",
        description: "Failed to delete link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyLink = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast({
        title: "Link copied",
        description: "Link has been copied to clipboard.",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setIsReordering(true);

    try {
      // Calculate the new order but don't update state yet
      const oldIndex = links.findIndex((link) => link.id === active.id);
      const newIndex = links.findIndex((link) => link.id === over.id);

      // Create the reordered array
      const reorderedLinks = arrayMove([...links], oldIndex, newIndex);

      // Get the user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to reorder links");
      }

      // Update the display_order in the database using the reordered array
      const updatedLinks = reorderedLinks.map((link, index) => ({
        id: link.id,
        display_order: index,
      }));

      // Use a transaction to update all links at once
      for (const link of updatedLinks) {
        const { error: updateError } = await supabase
          .from("links")
          .update({ display_order: link.display_order })
          .eq("id", link.id)
          .eq("user_id", user.id);

        if (updateError) throw updateError;
      }

      // Now update the local state after database update is successful
      setLinks(reorderedLinks);

      toast({
        title: "Links reordered",
        description: "Your links have been reordered successfully.",
      });
    } catch (err: any) {
      setError(err.message || "Failed to reorder links");
      toast({
        title: "Error",
        description: "Failed to reorder links. Please try again.",
        variant: "destructive",
      });
      // Revert to original order by refetching
      fetchLinks();
    } finally {
      setIsReordering(false);
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
          <div className="flex items-center gap-2">
            {isReordering && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            <span className="text-sm font-normal text-muted-foreground">
              {links.length} {links.length === 1 ? "link" : "links"}
            </span>
          </div>
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={links.map((link) => link.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {links.map((link) => (
                  <SortableLink
                    key={link.id}
                    link={link}
                    onDelete={handleDelete}
                    deletingId={deletingId}
                    onToggleActive={handleToggleActive}
                    togglingId={togglingId}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
}
