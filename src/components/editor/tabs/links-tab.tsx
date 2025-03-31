"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { createClient } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Plus,
  Trash,
  GripVertical,
  ExternalLink,
  Link2,
  Image,
} from "lucide-react";

// Criando cliente do Supabase no lado do cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Profile = {
  id: string;
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  theme?: string;
  button_style?: string;
  font_family?: string;
  layout?: string;
  background_type?: string;
  background_url?: string | null;
  custom_css?: string | null;
  has_free_plan: boolean;
  has_custom_domain?: boolean;
};

type Link = {
  id: string;
  title: string;
  url: string;
  icon?: string;
  display_order: number;
  active: boolean;
  thumbnail_url?: string | null;
  content_type?: string;
  embed_data?: any;
  is_adult_content?: boolean;
  is_interactive?: boolean;
  interactive_type?: string;
  interactive_content?: any;
  has_custom_thumbnail?: boolean;
};

type LinksTabProps = {
  links: Link[];
  profile: Profile | null;
  onLinksUpdate: () => Promise<void>;
};

// Ícones disponíveis
const iconOptions = [
  { value: "default", label: "Default" },
  { value: "github", label: "GitHub" },
  { value: "twitter", label: "Twitter" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitch", label: "Twitch" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "spotify", label: "Spotify" },
  { value: "email", label: "Email" },
  { value: "website", label: "Website" },
  { value: "custom", label: "Custom" },
];

// Tipos de conteúdo
const contentTypes = [
  { value: "link", label: "Default link" },
  { value: "video", label: "Embedded video" },
  { value: "image", label: "Image" },
  { value: "audio", label: "Audio" },
];

export default function LinksTab({
  links,
  profile,
  onLinksUpdate,
}: LinksTabProps) {
  const [localLinks, setLocalLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState<{
    isEditing: boolean;
    linkId: string | null;
  }>({
    isEditing: false,
    linkId: null,
  });
  const [formData, setFormData] = useState<Partial<Link>>({
    title: "",
    url: "",
    icon: "default",
    content_type: "link",
    active: true,
    is_adult_content: false,
  });
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const { toast } = useToast();

  // Carregar links quando o componente for montado ou atualizado
  useEffect(() => {
    setLocalLinks([...links].sort((a, b) => a.display_order - b.display_order));
  }, [links]);

  // Atualizar ordens dos links no supabase
  const updateLinkOrders = async (reorderedLinks: Link[]) => {
    setIsLoading(true);

    try {
      const updates = reorderedLinks.map((link, index) => ({
        id: link.id,
        display_order: index,
      }));

      const { error } = await supabase
        .from("links")
        .upsert(updates, { onConflict: "id" });

      if (error) throw error;

      await onLinksUpdate();

      toast({
        title: "Links reordered",
        description: "The order of links has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating the order of links:", error);
      toast({
        title: "Error",
        description: "It was not possible to update the order of links",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gerenciar reordenamento dos links
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(localLinks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalLinks(items);
    updateLinkOrders(items);
  };

  // Alternar status de ativo do link
  const toggleLinkActive = async (id: string, currentStatus: boolean) => {
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("links")
        .update({ active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      // Atualizar link local
      setLocalLinks((prev) =>
        prev.map((link) =>
          link.id === id ? { ...link, active: !currentStatus } : link
        )
      );

      await onLinksUpdate();

      toast({
        title: !currentStatus ? "Link activated" : "Link deactivated",
        description: !currentStatus
          ? "The link is now visible in your profile"
          : "The link is now hidden from your profile",
      });
    } catch (error) {
      console.error("Error updating the status of the link:", error);
      toast({
        title: "Error",
        description: "It was not possible to update the status of the link",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir link
  const deleteLink = async (id: string) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.from("links").delete().eq("id", id);

      if (error) throw error;

      // Remover link local
      setLocalLinks((prev) => prev.filter((link) => link.id !== id));

      await onLinksUpdate();

      toast({
        title: "Link deleted",
        description: "The link has been removed successfully",
      });
    } catch (error) {
      console.error("Error deleting the link:", error);
      toast({
        title: "Error",
        description: "It was not possible to delete the link",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Editar link
  const editLink = (link: Link) => {
    setFormData({
      title: link.title,
      url: link.url,
      icon: link.icon || "default",
      content_type: link.content_type || "link",
      active: link.active,
      is_adult_content: link.is_adult_content || false,
      thumbnail_url: link.thumbnail_url || "",
      has_custom_thumbnail: link.has_custom_thumbnail || false,
    });

    setEditMode({
      isEditing: true,
      linkId: link.id,
    });
  };

  // Adicionar ou atualizar link
  const saveLink = async () => {
    if (!formData.title || !formData.url) {
      toast({
        title: "Required fields",
        description: "Please fill in the title and URL of the link",
        variant: "destructive",
      });
      return;
    }

    // Validar URL
    try {
      new URL(formData.url);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description:
          "Please enter a valid URL including http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const linkData = {
        ...formData,
        owner_id: profile?.id,
      };

      if (editMode.isEditing && editMode.linkId) {
        // Atualizar link existente
        const { error } = await supabase
          .from("links")
          .update(linkData)
          .eq("id", editMode.linkId);

        if (error) throw error;

        toast({
          title: "Link updated",
          description: "The link has been updated successfully",
        });
      } else {
        // Adicionar novo link
        // Determinar a ordem de exibição (última posição + 1)
        const nextOrder =
          localLinks.length > 0
            ? Math.max(...localLinks.map((l) => l.display_order)) + 1
            : 0;

        const { error } = await supabase.from("links").insert({
          ...linkData,
          display_order: nextOrder,
          owner_id: profile?.id,
        });

        if (error) throw error;

        toast({
          title: "Link added",
          description: "The new link has been added successfully",
        });
      }

      // Resetar formulário e buscar links atualizados
      setFormData({
        title: "",
        url: "",
        icon: "default",
        content_type: "link",
        active: true,
        is_adult_content: false,
      });

      setEditMode({ isEditing: false, linkId: null });
      await onLinksUpdate();
    } catch (error) {
      console.error("Error saving the link:", error);
      toast({
        title: "Error",
        description: "It was not possible to save the link",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Upload de thumbnail personalizada
  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;

    // Verificar se o usuário é premium para thumbnail personalizada
    if (profile.has_free_plan) {
      toast({
        title: "Premium feature",
        description: "Custom thumbnails are a premium feature",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingThumbnail(true);

      // Validação do arquivo
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "The maximum allowed size is 2MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid format",
          description: "Please send only image files",
          variant: "destructive",
        });
        return;
      }

      // Caminho do storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}-thumbnail-${Date.now()}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      // Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("public")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública do arquivo
      const { data: publicUrl } = supabase.storage
        .from("public")
        .getPublicUrl(filePath);

      if (publicUrl) {
        setFormData((prev) => ({
          ...prev,
          thumbnail_url: publicUrl.publicUrl,
          has_custom_thumbnail: true,
        }));
      }

      toast({
        title: "Thumbnail updated",
        description: "Your new thumbnail has been saved",
      });
    } catch (error) {
      console.error("Error uploading the thumbnail:", error);
      toast({
        title: "Error uploading the thumbnail",
        description: "An error occurred while sending the thumbnail",
        variant: "destructive",
      });
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // Limpar formulário
  const resetForm = () => {
    setFormData({
      title: "",
      url: "",
      icon: "default",
      content_type: "link",
      active: true,
      is_adult_content: false,
    });
    setEditMode({ isEditing: false, linkId: null });
  };

  // Verificar se atingiu o limite de links (10 para plano gratuito, ilimitado para premium)
  const hasReachedLinkLimit = profile?.has_free_plan && localLinks.length >= 10;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage links</CardTitle>
          <CardDescription>
            Add, edit and organize the links that will appear in your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Lista de links */}
          <div className="mb-6">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="links">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {localLinks.length === 0 ? (
                      <div className="text-center p-6 border border-dashed rounded-lg">
                        <p className="text-muted-foreground">
                          You have not added any links yet. Add your first
                          link using the button below.
                        </p>
                      </div>
                    ) : (
                      localLinks.map((link, index) => (
                        <Draggable
                          key={link.id}
                          draggableId={link.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center border rounded-lg p-3 ${
                                !link.active ? "bg-muted/40" : ""
                              }`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="mr-2 cursor-grab"
                              >
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center">
                                  <h4
                                    className={`font-medium ${!link.active ? "text-muted-foreground" : ""}`}
                                  >
                                    {link.title}
                                  </h4>
                                  {link.is_adult_content && (
                                    <span className="ml-2 px-2 py-0.5 text-xs bg-destructive text-destructive-foreground rounded-md">
                                      18+
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate max-w-lg">
                                  {link.url}
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    window.open(link.url, "_blank");
                                  }}
                                  aria-label="Abrir link"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => editLink(link)}
                                  aria-label="Editar link"
                                >
                                  <Link2 className="h-4 w-4" />
                                </Button>

                                <Switch
                                  checked={link.active}
                                  onCheckedChange={() =>
                                    toggleLinkActive(link.id, link.active)
                                  }
                                  disabled={isLoading}
                                  aria-label={
                                    link.active
                                      ? "Desativar link"
                                      : "Ativar link"
                                  }
                                />

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive"
                                      aria-label="Excluir link"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete link
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete the link
                                        "{link.title}"? This action cannot be
                                        undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteLink(link.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Limite de links para plano gratuito */}
          {profile?.has_free_plan && (
            <div className="text-sm text-muted-foreground mb-4">
              Links utilizados: {localLinks.length}/10
              {hasReachedLinkLimit && (
                <p className="text-destructive mt-1">
                  You have reached the limit of links for the free plan. Upgrade
                  to add more links.
                </p>
              )}
            </div>
          )}

          {/* Botão para adicionar novo link */}
          <Dialog
            open={editMode.isEditing}
            onOpenChange={(open) => {
              if (!open) resetForm();
              else setEditMode((prev) => ({ ...prev, isEditing: true }));
            }}
          >
            <DialogTrigger asChild>
              <Button
                className="w-full"
                disabled={hasReachedLinkLimit || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Novo Link
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editMode.linkId ? "Edit link" : "Add new link"}
                </DialogTitle>
                <DialogDescription>
                  Fill in the details of the link you want to add to your
                  profile.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Link title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) =>
                      setFormData({ ...formData, icon: value })
                    }
                  >
                    <SelectTrigger id="icon">
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentType">Content type</Label>
                  <Select
                    value={formData.content_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, content_type: value })
                    }
                  >
                    <SelectTrigger id="contentType">
                      <SelectValue placeholder="Select the type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Thumbnail personalizada (recurso premium) */}
                {!profile?.has_free_plan && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="thumbnail">Custom thumbnail</Label>
                      {formData.thumbnail_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              thumbnail_url: "",
                              has_custom_thumbnail: false,
                            })
                          }
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    {formData.thumbnail_url ? (
                      <div className="relative h-24 rounded-md overflow-hidden">
                        <img
                          src={formData.thumbnail_url}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full relative"
                        disabled={uploadingThumbnail}
                      >
                        {uploadingThumbnail ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Image className="h-4 w-4 mr-2" />
                            Escolher imagem
                          </>
                        )}
                        <input
                          type="file"
                          id="thumbnail"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleThumbnailUpload}
                          accept="image/*"
                          disabled={uploadingThumbnail}
                        />
                      </Button>
                    )}
                    <p className="text-xs text-muted-foreground">
                      We recommend images of at least 400x225 pixels.
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, active: checked })
                    }
                  />
                  <Label htmlFor="active">Active link</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="adultContent"
                    checked={formData.is_adult_content}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_adult_content: checked })
                    }
                  />
                  <Label htmlFor="adultContent">Adult content (18+)</Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" onClick={saveLink} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>Save</>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-between">
          <p className="text-xs text-muted-foreground">
            Drag and drop to rearrange the links.
          </p>
          {profile?.has_free_plan && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/dashboard/pricing")}
            >
              Upgrade to Premium
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
