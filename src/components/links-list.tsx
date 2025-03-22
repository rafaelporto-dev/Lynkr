"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
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
  LinkIcon,
  PlusCircle,
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
  thumbnail_url?: string | null;
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
      className={`flex items-center justify-between p-3 bg-card border rounded-lg mb-3 transition-colors ${isDragging ? "shadow-lg opacity-90 border-primary" : link.active ? "hover:bg-accent/5" : "hover:bg-accent/5 bg-muted/20 border-dashed"}`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-primary"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        {link.thumbnail_url && (
          <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0 border bg-muted/30">
            <img
              src={link.thumbnail_url}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                // Hide the image if it fails to load
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0 mr-4">
          <h3 className="font-medium truncate">{link.title}</h3>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground truncate flex items-center hover:text-primary"
          >
            <ExternalLink className="h-3 w-3 mr-1 inline flex-shrink-0" />
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
              title={link.active ? "Ativo" : "Inativo"}
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
  const [noLinks, setNoLinks] = useState(false);
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
      setNoLinks(data?.length === 0);
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

      // Atualize o estado local
      setLinks(
        links.map((link) => (link.id === id ? { ...link, active } : link))
      );

      toast({
        title: active ? "Link activated" : "Link deactivated",
        description: active
          ? "Your link is now visible in your profile"
          : "Your link is now hidden from your profile",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to update link status",
        variant: "destructive",
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      setDeletingId(id);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to delete links");
      }

      const { error: deleteError } = await supabase
        .from("links")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      // Atualizar o estado local
      setLinks(links.filter((link) => link.id !== id));
      setNoLinks(links.length <= 1);

      toast({
        title: "Link deleted",
        description: "The link has been removed from your profile",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setIsReordering(true);
      const oldIndex = links.findIndex((link) => link.id === active.id);
      const newIndex = links.findIndex((link) => link.id === over.id);

      try {
        // Reordenar localmente primeiro para uma resposta imediata da UI
        const newLinksOrder = arrayMove(links, oldIndex, newIndex);
        setLinks(newLinksOrder);

        // Atualize todos os links com novos valores de ordem
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("You must be logged in to reorder links");
        }

        // Atualizar o banco de dados
        for (let i = 0; i < newLinksOrder.length; i++) {
          const { error: updateError } = await supabase
            .from("links")
            .update({ display_order: i })
            .eq("id", newLinksOrder[i].id)
            .eq("user_id", user.id);

          if (updateError) throw updateError;
        }

        toast({
          title: "Links reordered",
          description: "The order of your links has been updated successfully",
        });
      } catch (err: any) {
        toast({
          title: "Error",
          description: "Failed to reorder links",
          variant: "destructive",
        });
        // Recarregar a lista para garantir a sincronização com o servidor
        fetchLinks();
      } finally {
        setIsReordering(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-md text-destructive">
        {error}
      </div>
    );
  }

  if (noLinks) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4 text-center">
        <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center">
          <LinkIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-medium">No links yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Add your first link to start customizing your profile
          </p>
        </div>
        <Button
          className="mt-2"
          onClick={() => router.push("/dashboard?add=true")}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add your first link
        </Button>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={links.map((link) => link.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-1">
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
      {isReordering && (
        <div className="mt-4 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
          <span className="text-sm text-muted-foreground">
            Saving new order...
          </span>
        </div>
      )}
    </DndContext>
  );
}
