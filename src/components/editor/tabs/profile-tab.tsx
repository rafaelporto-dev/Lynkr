"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload } from "lucide-react";

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

type ProfileTabProps = {
  profile: Profile | null;
  onProfileChange: (updatedFields: Partial<Profile>) => void;
};

export default function ProfileTab({
  profile,
  onProfileChange,
}: ProfileTabProps) {
  const [username, setUsername] = useState(profile?.username || "");
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [usernameError, setUsernameError] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { toast } = useToast();

  // Atualizar estados locais quando o perfil mudar
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  // Validar nome de usuário
  useEffect(() => {
    const checkUsername = async () => {
      if (!username || username === profile?.username) {
        setUsernameError("");
        setIsUsernameAvailable(true);
        return;
      }

      // Verificar formato (letras minúsculas, números e underscores)
      if (!/^[a-z0-9_]+$/.test(username)) {
        setUsernameError("Use apenas letras minúsculas, números e underscores");
        setIsUsernameAvailable(false);
        return;
      }

      // Verificar disponibilidade
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .neq("id", profile?.id || "")
        .maybeSingle();

      if (error) {
        console.error("Erro ao verificar nome de usuário:", error);
        return;
      }

      setIsUsernameAvailable(!data);
      setUsernameError(data ? "Este nome de usuário já está em uso" : "");
    };

    // Debounce para não fazer muitas requisições
    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [username, profile?.id, profile?.username]);

  // Atualizar campos do perfil localmente e notificar o componente pai
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setUsername(value);
    if (value !== profile?.username) {
      onProfileChange({ username: value });
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
    if (value !== profile?.full_name) {
      onProfileChange({ full_name: value });
    }
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setBio(value);
    if (value !== profile?.bio) {
      onProfileChange({ bio: value });
    }
  };

  // Upload de avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;

    try {
      setUploadingAvatar(true);

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
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

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
        setAvatarUrl(publicUrl.publicUrl);
        onProfileChange({ avatar_url: publicUrl.publicUrl });
      }

      toast({
        title: "Avatar atualizado",
        description: "Seu novo avatar foi salvo com sucesso",
      });
    } catch (error) {
      console.error("Erro ao fazer upload do avatar:", error);
      toast({
        title: "Erro ao salvar imagem",
        description: "Ocorreu um erro ao enviar o avatar",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Gerar iniciais para o avatar (fallback)
  const generateInitials = () => {
    if (fullName) {
      return fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    return "LP"; // Lynkr Profile
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Perfil</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e como você aparece para
            visitantes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl} alt={fullName || username} />
              <AvatarFallback>{generateInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">Foto de Perfil</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Uma imagem JPG, PNG ou GIF. Tamanho máximo de 2MB.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative"
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Escolher imagem
                    </>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    disabled={uploadingAvatar}
                  />
                </Button>
                {avatarUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAvatarUrl("");
                      onProfileChange({ avatar_url: "" });
                    }}
                    disabled={uploadingAvatar}
                  >
                    Remover
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Informações de perfil */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nome de usuário</Label>
              <Input
                id="username"
                placeholder="seu-nome-usuario"
                value={username}
                onChange={handleUsernameChange}
                className={!isUsernameAvailable ? "border-destructive" : ""}
              />
              {usernameError && (
                <p className="text-sm text-destructive">{usernameError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Seu URL único:{" "}
                {username
                  ? `${window.location.origin}/${username}`
                  : "Defina um nome de usuário"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input
                id="fullName"
                placeholder="Seu nome completo"
                value={fullName}
                onChange={handleFullNameChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                placeholder="Conte um pouco sobre você..."
                value={bio}
                onChange={handleBioChange}
                className="resize-none"
                rows={4}
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length}/160 caracteres
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <p className="text-xs text-muted-foreground">
            Estas informações serão exibidas publicamente, então tenha cuidado
            com o que você compartilha.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
