"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  ExternalLink,
  Trash2,
  BarChart2,
  Loader2,
  GripVertical,
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
}: {
  link: Link;
  onDelete: (id: string) => void;
  deletingId: string | null;
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
      className={`flex items-center justify-between p-3 bg-card border rounded-lg transition-colors ${isDragging ? "shadow-lg opacity-90 border-primary" : "hover:bg-accent/5"}`}
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-primary"
        >
          <GripVertical size={16} />
        </div>
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
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
          <BarChart2 size={12} />
          <span>{link.click_count}</span>
        </div>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(link.id)}
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
  );
}

export default function LinksList() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
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

      // We'll let the realtime subscription handle any further updates
    } catch (err: any) {
      setError(err.message || "Failed to reorder links");
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
              <Loader2
                size={16}
                className="animate-spin text-muted-foreground"
              />
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
