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
  Lock,
  MousePointerClick,
  MessageSquare,
  PieChart,
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

type InteractiveGroup = {
  id: string;
  title: string;
  type: string;
  display_order: number;
  active: boolean;
  content?: any;
};

type InteractiveTabProps = {
  interactiveGroups: InteractiveGroup[];
  profile: Profile | null;
  onInteractiveGroupsUpdate: () => Promise<void>;
};

// Tipos de elementos interativos disponíveis
const interactiveTypes = [
  { value: "poll", label: "Enquete", icon: PieChart },
  { value: "comments", label: "Comentários", icon: MessageSquare },
  { value: "gallery", label: "Galeria", icon: Image },
  { value: "qna", label: "Perguntas e Respostas", icon: MousePointerClick },
];

export default function InteractiveTab({
  interactiveGroups,
  profile,
  onInteractiveGroupsUpdate,
}: InteractiveTabProps) {
  const [localGroups, setLocalGroups] = useState<InteractiveGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState<{
    isEditing: boolean;
    groupId: string | null;
  }>({
    isEditing: false,
    groupId: null,
  });
  const [formData, setFormData] = useState<Partial<InteractiveGroup>>({
    title: "",
    type: "poll",
    active: true,
    content: {},
  });

  const { toast } = useToast();
  const isPremium = !profile?.has_free_plan;

  // Carregar grupos quando o componente for montado ou atualizado
  useEffect(() => {
    setLocalGroups(
      [...interactiveGroups].sort((a, b) => a.display_order - b.display_order)
    );
  }, [interactiveGroups]);

  // Atualizar ordens dos grupos no supabase
  const updateGroupOrders = async (reorderedGroups: InteractiveGroup[]) => {
    setIsLoading(true);

    try {
      const updates = reorderedGroups.map((group, index) => ({
        id: group.id,
        display_order: index,
      }));

      const { error } = await supabase
        .from("interactive_groups")
        .upsert(updates, { onConflict: "id" });

      if (error) throw error;

      await onInteractiveGroupsUpdate();

      toast({
        title: "Elements reordered",
        description: "The order of interactive elements has been updated",
      });
    } catch (error) {
      console.error("Error updating the order of elements:", error);
      toast({
        title: "Error",
        description: "It was not possible to update the order of elements",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gerenciar reordenamento dos grupos
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(localGroups);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalGroups(items);
    updateGroupOrders(items);
  };

  // Alternar status de ativo do grupo
  const toggleGroupActive = async (id: string, currentStatus: boolean) => {
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("interactive_groups")
        .update({ active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      // Atualizar grupo local
      setLocalGroups((prev) =>
        prev.map((group) =>
          group.id === id ? { ...group, active: !currentStatus } : group
        )
      );

      await onInteractiveGroupsUpdate();

      toast({
        title: !currentStatus ? "Element activated" : "Element deactivated",
        description: !currentStatus
          ? "The element is now visible in your profile"
          : "The element is now hidden from your profile",
      });
    } catch (error) {
      console.error("Error updating the status of the element:", error);
      toast({
        title: "Error",
        description: "It was not possible to update the status of the element",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir grupo
  const deleteGroup = async (id: string) => {
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("interactive_groups")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Remover grupo local
      setLocalGroups((prev) => prev.filter((group) => group.id !== id));

      await onInteractiveGroupsUpdate();

      toast({
        title: "Element deleted",
        description: "The interactive element has been removed successfully",
      });
    } catch (error) {
      console.error("Error deleting the element:", error);
      toast({
        title: "Error",
        description: "It was not possible to delete the element",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Editar grupo
  const editGroup = (group: InteractiveGroup) => {
    setFormData({
      title: group.title,
      type: group.type,
      active: group.active,
      content: group.content || {},
    });

    setEditMode({
      isEditing: true,
      groupId: group.id,
    });
  };

  // Adicionar ou atualizar grupo
  const saveGroup = async () => {
    if (!formData.title || !formData.type) {
      toast({
        title: "Required fields",
        description: "Please fill in the title and type of the element",
        variant: "destructive",
      });
      return;
    }

    // Verificar se é um usuário premium
    if (!isPremium) {
      toast({
        title: "Premium feature",
        description: "Interactive elements are exclusive to premium accounts",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const groupData = {
        ...formData,
        owner_id: profile?.id,
      };

      if (editMode.isEditing && editMode.groupId) {
        // Atualizar grupo existente
        const { error } = await supabase
          .from("interactive_groups")
          .update(groupData)
          .eq("id", editMode.groupId);

        if (error) throw error;

        toast({
          title: "Element updated",
          description: "The interactive element has been updated successfully",
        });
      } else {
        // Adicionar novo grupo
        // Determinar a ordem de exibição (última posição + 1)
        const nextOrder =
          localGroups.length > 0
            ? Math.max(...localGroups.map((g) => g.display_order)) + 1
            : 0;

        const { error } = await supabase.from("interactive_groups").insert({
          ...groupData,
          display_order: nextOrder,
          owner_id: profile?.id,
        });

        if (error) throw error;

        toast({
          title: "Element added",
          description: "The new interactive element has been added successfully",
        });
      }

      // Resetar formulário e buscar grupos atualizados
      setFormData({
        title: "",
        type: "poll",
        active: true,
        content: {},
      });

      setEditMode({ isEditing: false, groupId: null });
      await onInteractiveGroupsUpdate();
    } catch (error) {
      console.error("Error saving the element:", error);
      toast({
        title: "Error",
        description: "It was not possible to save the interactive element",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Limpar formulário
  const resetForm = () => {
    setFormData({
      title: "",
      type: "poll",
      active: true,
      content: {},
    });
    setEditMode({ isEditing: false, groupId: null });
  };

  // Renderizar um ícone com base no tipo
  const renderTypeIcon = (type: string) => {
    const TypeIcon =
      interactiveTypes.find((t) => t.value === type)?.icon || PieChart;
    return <TypeIcon className="h-5 w-5" />;
  };

  // Verificar se atingiu o limite de grupos interativos (3 para plano premium)
  const hasReachedGroupLimit = !isPremium || localGroups.length >= 3;

  // Renderizar o conteúdo ou um bloqueio de recurso premium
  const renderContent = () => {
    if (!isPremium) {
      return (
        <div className="py-10 px-6 text-center">
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Recurso Premium</h3>
          </div>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Elementos interativos estão disponíveis apenas para contas premium.
            Faça upgrade para adicionar enquetes, comentários, galerias e mais
            ao seu perfil.
          </p>
          <Button
            onClick={() => (window.location.href = "/dashboard/pricing")}
            className="px-6"
          >
            Fazer Upgrade para Premium
          </Button>
        </div>
      );
    }

    return (
      <>
        {/* Lista de grupos interativos */}
        <div className="mb-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="interactive-groups">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {localGroups.length === 0 ? (
                    <div className="text-center p-6 border border-dashed rounded-lg">
                      <p className="text-muted-foreground">
                        You have not added any interactive elements yet. Add
                        your first element using the button below.
                      </p>
                    </div>
                  ) : (
                    localGroups.map((group, index) => (
                      <Draggable
                        key={group.id}
                        draggableId={group.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center border rounded-lg p-3 ${
                              !group.active ? "bg-muted/40" : ""
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
                                <div className="mr-2 text-primary">
                                  {renderTypeIcon(group.type)}
                                </div>
                                <h4
                                  className={`font-medium ${!group.active ? "text-muted-foreground" : ""}`}
                                >
                                  {group.title}
                                </h4>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {interactiveTypes.find(
                                  (t) => t.value === group.type
                                )?.label || "Interactive element"}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editGroup(group)}
                                aria-label="Editar elemento"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>

                              <Switch
                                checked={group.active}
                                onCheckedChange={() =>
                                  toggleGroupActive(group.id, group.active)
                                }
                                disabled={isLoading}
                                aria-label={
                                  group.active
                                    ? "Deactivate element"
                                    : "Activate element"
                                }
                              />

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                    aria-label="Excluir elemento"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete element
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete the
                                      element "{group.title}"? This action cannot
                                      be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteGroup(group.id)}
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

        {/* Limite de elementos interativos */}
        <div className="text-sm text-muted-foreground mb-4">
          Elementos utilizados: {localGroups.length}/3
          {hasReachedGroupLimit && (
            <p className="text-amber-500 mt-1">
              You have reached the limit of interactive elements.
            </p>
          )}
        </div>

        {/* Botão para adicionar novo elemento */}
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
              disabled={hasReachedGroupLimit || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add new element
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editMode.groupId
                  ? "Edit element"
                  : "Add new element"}
              </DialogTitle>
              <DialogDescription>
                Fill in the details of the interactive element you want to add
                to your profile.
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
                  placeholder="Element title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Element type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select the type" />
                  </SelectTrigger>
                  <SelectContent>
                    {interactiveTypes.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <option.icon className="h-4 w-4 mr-2" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, active: checked })
                  }
                />
                <Label htmlFor="active">Active element</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" onClick={saveGroup} disabled={isLoading}>
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
      </>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interactive elements</CardTitle>
          <CardDescription>
            Add polls, comments, galleries and other interactive elements to
            your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
        {isPremium && (
          <CardFooter className="border-t px-6 py-4">
            <p className="text-xs text-muted-foreground">
              Drag and drop to rearrange your interactive elements. Elements
              can be customized by visitors to your profile.
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
