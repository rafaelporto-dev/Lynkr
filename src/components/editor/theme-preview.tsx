"use client";

import { useState, useEffect } from "react";
import {
  ThemePreset,
  availableThemePresets,
  ThemeManager,
} from "@/lib/themes/theme-manager";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, ExternalLink, Crown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface ThemePreviewProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  userProfile: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
    has_free_plan: boolean;
  } | null;
}

export default function ThemePreview({
  currentTheme,
  onThemeChange,
  userProfile,
}: ThemePreviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    "light" | "dark" | "special"
  >("dark");
  const [availablePresets, setAvailablePresets] = useState<ThemePreset[]>(
    availableThemePresets.filter(
      (preset) => preset.category === selectedCategory
    )
  );
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(
    userProfile ? !userProfile.has_free_plan : false
  );
  const { toast } = useToast();

  useEffect(() => {
    setAvailablePresets(
      availableThemePresets.filter(
        (preset) => preset.category === selectedCategory
      )
    );
  }, [selectedCategory]);

  useEffect(() => {
    if (userProfile) {
      setIsPremiumUser(!userProfile.has_free_plan);
    }
  }, [userProfile]);

  // Função para verificar se um tema está disponível para o usuário
  const isThemeAvailable = (preset: ThemePreset): boolean => {
    return !preset.isPremium || isPremiumUser;
  };

  // Manipulador para seleção de tema
  const handleThemeSelect = (preset: ThemePreset) => {
    if (!isThemeAvailable(preset)) {
      toast({
        title: "Tema Premium",
        description: "Faça upgrade para o plano premium para usar este tema.",
        variant: "destructive",
      });
      return;
    }

    // Chamar a função para mudar o tema
    onThemeChange(preset.themeId);

    // Aplicar as mudanças de tema imediatamente para visualização
    document.documentElement.classList.forEach((className) => {
      if (className.startsWith("theme-")) {
        document.documentElement.classList.remove(className);
      }
    });

    document.documentElement.classList.add(`theme-${preset.themeId}`);

    // Verificar se é tema escuro e ajustar o esquema de cores
    const isDarkTheme = [
      "dark",
      "midnight",
      "nord",
      "neon",
      "sunset",
      "glass",
    ].includes(preset.themeId);
    if (isDarkTheme) {
      document.documentElement.classList.add("dark-theme");
      document.documentElement.classList.remove("light-theme");
    } else {
      document.documentElement.classList.add("light-theme");
      document.documentElement.classList.remove("dark-theme");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-medium">Escolha um tema</h3>

        {/* Filtro por categorias */}
        <Tabs
          defaultValue={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="light">Claros</TabsTrigger>
            <TabsTrigger value="dark">Escuros</TabsTrigger>
            <TabsTrigger value="special">Especiais</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Grid de temas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availablePresets.map((preset) => (
          <Card
            key={preset.id}
            className={cn(
              "relative overflow-hidden cursor-pointer transition-all border-2",
              currentTheme === preset.themeId
                ? "border-primary ring-2 ring-primary/20"
                : "border-transparent hover:border-primary/20"
            )}
            onClick={() => handleThemeSelect(preset)}
            style={{
              backgroundColor: preset.preview?.backgroundColor || "#111827",
            }}
          >
            {/* Indicador de seleção */}
            {currentTheme === preset.themeId && (
              <div className="absolute top-2 right-2 z-10">
                <Badge className="bg-primary">
                  <Check className="h-3 w-3 mr-1" /> Ativo
                </Badge>
              </div>
            )}

            {/* Badge de premium */}
            {preset.isPremium && (
              <div className="absolute top-2 left-2 z-10">
                <Badge
                  className={
                    isPremiumUser
                      ? "bg-amber-500/80 text-white"
                      : "bg-gray-500/80 text-white"
                  }
                >
                  <Crown className="h-3 w-3 mr-1" /> Premium
                </Badge>
              </div>
            )}

            {/* Preview em miniatura do tema */}
            <div
              className={cn(
                "p-6 h-[200px] flex flex-col space-y-3",
                preset.isPremium && !isPremiumUser
                  ? "opacity-70 filter grayscale"
                  : ""
              )}
            >
              {/* Header do perfil em miniatura */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage
                    src={userProfile?.avatar_url || ""}
                    alt={userProfile?.full_name || "Usuário"}
                  />
                  <AvatarFallback style={{ color: preset.preview?.textColor }}>
                    <UserCircle />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4
                    className="font-medium"
                    style={{ color: preset.preview?.textColor }}
                  >
                    {userProfile?.full_name || "Nome do usuário"}
                  </h4>
                  <p
                    className="text-xs opacity-80"
                    style={{ color: preset.preview?.textColor }}
                  >
                    @{userProfile?.username || "username"}
                  </p>
                </div>
              </div>

              {/* Botão de exemplo */}
              <button
                className="py-2 px-4 rounded-md w-full flex items-center justify-center space-x-2 transition-all"
                style={{
                  backgroundColor: preset.preview?.primaryColor,
                  color: "#ffffff",
                }}
              >
                <ExternalLink className="h-4 w-4" />
                <span>Link de exemplo</span>
              </button>

              {/* Nome do tema */}
              <p
                className="mt-auto text-center font-medium"
                style={{ color: preset.preview?.textColor }}
              >
                {preset.name}
              </p>
              <p
                className="text-xs text-center opacity-80"
                style={{ color: preset.preview?.textColor }}
              >
                {preset.description}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Informação sobre temas premium */}
      {!isPremiumUser && (
        <div className="mt-4 p-4 bg-primary/10 rounded-lg flex items-center space-x-3">
          <Crown className="h-5 w-5 text-amber-500" />
          <p className="text-sm">
            Faça upgrade para o plano premium para desbloquear todos os temas
            especiais.
          </p>
          <Button variant="outline" size="sm" className="ml-auto">
            Upgrade
          </Button>
        </div>
      )}
    </div>
  );
}
