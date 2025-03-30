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
  { value: "default", label: "Padrão" },
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
  { value: "custom", label: "Personalizado" },
];

// Tipos de conteúdo
const contentTypes = [
  { value: "link", label: "Link padrão" },
  { value: "video", label: "Vídeo incorporado" },
  { value: "image", label: "Imagem" },
  { value: "audio", label: "Áudio" },
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
        title: "Links reordenados",
        description: "A ordem dos links foi atualizada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar a ordem dos links:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a ordem dos links",
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
        title: !currentStatus ? "Link ativado" : "Link desativado",
        description: !currentStatus
          ? "O link agora está visível no seu perfil"
          : "O link agora está oculto do seu perfil",
      });
    } catch (error) {
      console.error("Erro ao atualizar status do link:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do link",
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
        title: "Link excluído",
        description: "O link foi removido com sucesso",
      });
    } catch (error) {
      console.error("Erro ao excluir link:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o link",
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
        title: "Campos obrigatórios",
        description: "Por favor, preencha o título e a URL do link",
        variant: "destructive",
      });
      return;
    }

    // Validar URL
    try {
      new URL(formData.url);
    } catch (e) {
      toast({
        title: "URL inválida",
        description:
          "Por favor, insira uma URL válida incluindo http:// ou https://",
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
          title: "Link atualizado",
          description: "O link foi atualizado com sucesso",
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
          title: "Link adicionado",
          description: "O novo link foi adicionado com sucesso",
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
      console.error("Erro ao salvar link:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o link",
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
        title: "Recurso Premium",
        description: "Thumbnails personalizadas são um recurso premium",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingThumbnail(true);

      // Validação do arquivo
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O tamanho máximo permitido é 2MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Formato inválido",
          description: "Por favor, envie apenas arquivos de imagem",
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
        title: "Thumbnail atualizada",
        description: "Sua nova thumbnail foi salva",
      });
    } catch (error) {
      console.error("Erro ao fazer upload da thumbnail:", error);
      toast({
        title: "Erro ao salvar imagem",
        description: "Ocorreu um erro ao enviar a thumbnail",
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
          <CardTitle>Gerenciar Links</CardTitle>
          <CardDescription>
            Adicione, edite e organize os links que aparecerão no seu perfil.
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
                          Você ainda não adicionou nenhum link. Adicione seu
                          primeiro link utilizando o botão abaixo.
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
                                        Excluir link
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza de que deseja excluir o link
                                        "{link.title}"? Esta ação não pode ser
                                        desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancelar
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteLink(link.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Excluir
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
                  Você atingiu o limite de links do plano gratuito. Faça upgrade
                  para adicionar mais links.
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
                  {editMode.linkId ? "Editar Link" : "Adicionar Novo Link"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os detalhes do link que você deseja adicionar ao seu
                  perfil.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Nome do link"
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
                    placeholder="https://exemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Ícone</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) =>
                      setFormData({ ...formData, icon: value })
                    }
                  >
                    <SelectTrigger id="icon">
                      <SelectValue placeholder="Selecione um ícone" />
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
                  <Label htmlFor="contentType">Tipo de conteúdo</Label>
                  <Select
                    value={formData.content_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, content_type: value })
                    }
                  >
                    <SelectTrigger id="contentType">
                      <SelectValue placeholder="Selecione o tipo" />
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
                      <Label htmlFor="thumbnail">Thumbnail personalizada</Label>
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
                          Remover
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
                      Recomendamos imagens de pelo menos 400x225 pixels.
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
                  <Label htmlFor="active">Link ativo</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="adultContent"
                    checked={formData.is_adult_content}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_adult_content: checked })
                    }
                  />
                  <Label htmlFor="adultContent">Conteúdo adulto (18+)</Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit" onClick={saveLink} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>Salvar</>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-between">
          <p className="text-xs text-muted-foreground">
            Arraste e solte os links para reordenar.
          </p>
          {profile?.has_free_plan && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/dashboard/pricing")}
            >
              Fazer Upgrade para Premium
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
