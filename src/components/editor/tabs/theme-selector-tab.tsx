"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleHelp, Palette, Crown, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ThemePreview from "@/components/editor/theme-preview";
import { ThemeManager, themeVariations } from "@/lib/themes/theme-manager";
import { ThemeId } from "@/lib/themes/base-themes";

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

interface ThemeSelectorTabProps {
  profile: Profile | null;
  onProfileChange: (updatedFields: Partial<Profile>) => void;
  onSaveProfile: () => Promise<void>;
}

export default function ThemeSelectorTab({
  profile,
  onProfileChange,
  onSaveProfile,
}: ThemeSelectorTabProps) {
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(
    (profile?.theme as ThemeId) || "dark"
  );
  const [selectedVariation, setSelectedVariation] = useState<string>("default");
  const [saveIndicator, setSaveIndicator] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const { toast } = useToast();

  // Atualizar tema atual quando o perfil mudar
  useEffect(() => {
    if (profile?.theme) {
      const validThemeId = ThemeManager.validateThemeId(profile.theme);
      setCurrentThemeId(validThemeId);
    }
  }, [profile?.theme]);

  // Aplicar variáveis CSS quando o tema mudar
  useEffect(() => {
    // Obter as cores do tema atual
    const tokens = ThemeManager.getThemeTokens(currentThemeId);

    // Aplicar variáveis CSS diretamente para visualização imediata
    Object.entries(tokens.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });

    // Atualizar classe do documento para tema escuro/claro
    const isDarkTheme = [
      "dark",
      "midnight",
      "nord",
      "neon",
      "sunset",
      "glass",
    ].includes(currentThemeId);
    if (isDarkTheme) {
      document.documentElement.classList.add("dark-theme");
      document.documentElement.classList.remove("light-theme");
    } else {
      document.documentElement.classList.add("light-theme");
      document.documentElement.classList.remove("dark-theme");
    }

    // Atualizar classe de tema
    document.documentElement.classList.forEach((className) => {
      if (className.startsWith("theme-")) {
        document.documentElement.classList.remove(className);
      }
    });
    document.documentElement.classList.add(`theme-${currentThemeId}`);
  }, [currentThemeId]);

  // Função para salvar o tema selecionado
  const handleThemeChange = async (themeId: string) => {
    const validThemeId = ThemeManager.validateThemeId(themeId);
    setCurrentThemeId(validThemeId);

    // Atualizar o estado do perfil
    onProfileChange({ theme: validThemeId });

    // Atualizar o localStorage para compatibilidade com ThemeProvider
    localStorage.setItem("userTheme", validThemeId);

    // Tentar salvar o tema diretamente também
    try {
      const result = await ThemeManager.saveUserTheme(validThemeId);
      if (!result.success) {
        console.error("Erro ao salvar tema:", result.error);
      }
    } catch (error) {
      console.error("Falha ao salvar tema:", error);
    }

    // Atualizar a URL de preview para mostrar o tema selecionado
    if (window.location.search.includes("preview=true")) {
      const url = new URL(window.location.href);
      url.searchParams.set("theme", validThemeId);
      window.history.replaceState({}, "", url.toString());
    }

    // Indicador visual de alterações não salvas
    setSaveIndicator("idle");
  };

  // Função para aplicar uma variação ao tema
  const handleVariationChange = (variationId: string) => {
    setSelectedVariation(variationId);
    // Em uma implementação completa, você pode querer salvar a variação no perfil também
    // onProfileChange({ theme_variation: variationId });
  };

  // Função para salvar as alterações de tema
  const handleSaveTheme = async () => {
    setSaveIndicator("saving");

    try {
      await onSaveProfile();

      // Atualizar o tema no localStorage após salvar
      localStorage.setItem("userTheme", currentThemeId);

      // Atualizar a visualização do tema
      document.documentElement.classList.forEach((className) => {
        if (className.startsWith("theme-")) {
          document.documentElement.classList.remove(className);
        }
      });
      document.documentElement.classList.add(`theme-${currentThemeId}`);

      // Forçar atualização da URL de preview se estiver nesse modo
      if (window.location.search.includes("preview=true")) {
        const url = new URL(window.location.href);
        url.searchParams.set("theme", currentThemeId);
        window.history.replaceState({}, "", url.toString());
      }

      setSaveIndicator("saved");

      toast({
        title: "Tema salvo",
        description: "As alterações no tema foram salvas com sucesso.",
      });

      // Resetar o indicador após alguns segundos
      setTimeout(() => {
        setSaveIndicator("idle");
      }, 3000);
    } catch (error) {
      console.error("Erro ao salvar tema:", error);
      setSaveIndicator("idle");

      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações no tema.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-1">Personalização do Tema</h2>
          <p className="text-muted-foreground">
            Escolha um tema visual para personalizar a aparência do seu perfil
          </p>
        </div>

        <Button
          onClick={handleSaveTheme}
          disabled={saveIndicator === "saving" || saveIndicator === "saved"}
          className="flex items-center gap-2"
        >
          {saveIndicator === "saving" ? (
            <>Salvando...</>
          ) : saveIndicator === "saved" ? (
            <>
              <Check className="h-4 w-4" /> Salvo
            </>
          ) : (
            <>Salvar Alterações</>
          )}
        </Button>
      </div>

      <Tabs defaultValue="select-theme" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="select-theme">
            <Palette className="h-4 w-4 mr-2" />
            Seleção de Tema
          </TabsTrigger>
          <TabsTrigger value="advanced-settings">
            <Palette className="h-4 w-4 mr-2" />
            Configurações Avançadas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="select-theme">
          <Card>
            <CardHeader>
              <CardTitle>Escolha o tema do seu perfil</CardTitle>
              <CardDescription>
                Selecione um tema que combine com sua marca pessoal e estilo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemePreview
                currentTheme={currentThemeId}
                onThemeChange={handleThemeChange}
                userProfile={profile}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced-settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
              <CardDescription>
                Personalize ainda mais seu tema com ajustes avançados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Seletor de variação de tema */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme-variation" className="text-base">
                    Variação do Tema
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CircleHelp className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[220px]">
                          Aplica ajustes sutis ao tema base, como saturação e
                          contraste
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={selectedVariation}
                  onValueChange={handleVariationChange}
                >
                  <SelectTrigger id="theme-variation">
                    <SelectValue placeholder="Selecione uma variação" />
                  </SelectTrigger>
                  <SelectContent>
                    {themeVariations.map((variation) => (
                      <SelectItem key={variation.id} value={variation.id}>
                        {variation.name}
                        {variation.id !== "default" && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({variation.description})
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Opções de personalização premium */}
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                <div className="flex items-start gap-3">
                  <Crown className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h3 className="text-base font-medium mb-1">
                      Funcionalidades Premium
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Desbloqueie recursos avançados de personalização com nosso
                      plano premium
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-amber-500" />
                        <span>CSS personalizado</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-amber-500" />
                        <span>Temas exclusivos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-amber-500" />
                        <span>Imagens de fundo</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-amber-500" />
                        <span>Gradientes personalizados</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-600"
                    >
                      Fazer Upgrade
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
