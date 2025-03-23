"use client";

import { useState } from "react";
import { createClient } from "../../../../../supabase/client";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X, Trash2, AlertTriangle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { updateUserAction, deleteUserAction } from "../actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UserEdit({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    has_free_plan: true,
    has_custom_domain: false,
  });
  const supabase = createClient();
  const { toast } = useToast();

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        full_name: data.full_name || "",
        username: data.username || "",
        has_free_plan: data.has_free_plan ?? true,
        has_custom_domain: data.has_custom_domain ?? false,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar usuário",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value === "true",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("user_id", userId);
      formDataToSend.append("full_name", formData.full_name);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("has_free_plan", formData.has_free_plan.toString());
      formDataToSend.append(
        "has_custom_domain",
        formData.has_custom_domain.toString()
      );

      const result = await updateUserAction(formDataToSend);

      if (result.success) {
        toast({
          title: "Usuário atualizado",
          description: result.message,
        });
        setIsOpen(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar usuário",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("user_id", userId);

      const result = await deleteUserAction(formDataToSend);

      if (result.success) {
        toast({
          title: "Usuário excluído",
          description: result.message,
        });
        setIsDeleteDialogOpen(false);
        // Recarregar a página após exclusão bem-sucedida
        window.location.reload();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir usuário",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (open) fetchUser();
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-1" /> Editar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Faça alterações nas informações do usuário aqui.
            </DialogDescription>
          </DialogHeader>
          {isLoading && !profile ? (
            <div className="py-4 text-center">Carregando...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="full_name" className="text-right">
                    Nome Completo
                  </Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="has_free_plan" className="text-right">
                    Plano
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={formData.has_free_plan.toString()}
                      onValueChange={(value) =>
                        handleSelectChange("has_free_plan", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o plano" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Gratuito</SelectItem>
                        <SelectItem value="false">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="has_custom_domain" className="text-right">
                    Domínio Personalizado
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={formData.has_custom_domain.toString()}
                      onValueChange={(value) =>
                        handleSelectChange("has_custom_domain", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Domínio Personalizado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Permitido</SelectItem>
                        <SelectItem value="false">Não Permitido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-1" /> Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>Salvando...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" /> Salvar Alterações
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-1" /> Excluir
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a
              conta do usuário e todos os dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              <div className="flex items-center space-x-2">
                {isLoading ? (
                  <>Excluindo...</>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    <span>Excluir</span>
                  </>
                )}
              </div>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
