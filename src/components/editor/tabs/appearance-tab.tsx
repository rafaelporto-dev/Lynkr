"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, Lock } from "lucide-react";

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

type AppearanceTabProps = {
  profile: Profile | null;
  onProfileChange: (updatedFields: Partial<Profile>) => void;
};

// Opções de aparência atualizadas
const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
  { value: "midnight", label: "Midnight" },
  { value: "nord", label: "Nord" },
  { value: "sunset", label: "Sunset" },
];

const buttonStyles = [
  { value: "default", label: "Default" },
  { value: "rounded", label: "Rounded" },
  { value: "soft", label: "Soft" },
  { value: "outline", label: "Outline" },
  { value: "pillShaped", label: "Pill" },
  { value: "minimal", label: "Minimal" },
  { value: "shadow", label: "Shadow" },
];

const fontFamilies = [
  { value: "inter", label: "Inter" },
  { value: "roboto", label: "Roboto" },
  { value: "poppins", label: "Poppins" },
  { value: "opensans", label: "Open Sans" },
  { value: "montserrat", label: "Montserrat" },
  { value: "lato", label: "Lato" },
  { value: "raleway", label: "Raleway" },
  { value: "playfair", label: "Playfair Display" },
];

const layouts = [
  { value: "default", label: "Default" },
  { value: "centered", label: "Centered" },
  { value: "grid", label: "Grid" },
  { value: "masonry", label: "Masonry" },
  { value: "minimalist", label: "Minimalist" },
  { value: "sidebar", label: "Sidebar" },
];

const backgroundTypes = [
  { value: "color", label: "Solid Color" },
  { value: "gradient", label: "Gradient" },
  { value: "image", label: "Image" },
];

export default function AppearanceTab({
  profile,
  onProfileChange,
}: AppearanceTabProps) {
  // Estado para opções básicas
  const [theme, setTheme] = useState(profile?.theme || "system");
  const [buttonStyle, setButtonStyle] = useState(
    profile?.button_style || "default"
  );
  const [fontFamily, setFontFamily] = useState(profile?.font_family || "inter");
  const [layout, setLayout] = useState(profile?.layout || "default");

  // Estado para background
  const [backgroundType, setBackgroundType] = useState(
    profile?.background_type || "color"
  );
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [backgroundGradient, setBackgroundGradient] = useState(
    "linear-gradient(to right, #4f46e5, #9333ea)"
  );
  const [backgroundUrl, setBackgroundUrl] = useState(
    profile?.background_url || ""
  );
  const [uploadingBackground, setUploadingBackground] = useState(false);

  // Estado para CSS personalizado
  const [customCss, setCustomCss] = useState(profile?.custom_css || "");
  const [isPremium, setIsPremium] = useState(!profile?.has_free_plan);

  const { toast } = useToast();

  // Atualizar estados locais quando o perfil mudar
  useEffect(() => {
    if (profile) {
      setTheme(profile.theme || "system");
      setButtonStyle(profile.button_style || "default");
      setFontFamily(profile.font_family || "inter");
      setLayout(profile.layout || "default");
      setBackgroundType(profile.background_type || "color");
      setBackgroundUrl(profile.background_url || "");
      setCustomCss(profile.custom_css || "");
      setIsPremium(!profile.has_free_plan);
    }
  }, [profile]);

  // Upload de imagem de fundo
  const handleBackgroundUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;

    // Verificar se o usuário é premium
    if (!isPremium) {
      toast({
        title: "Recurso Premium",
        description:
          "Faça upgrade para o plano premium para usar imagens de fundo personalizadas.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingBackground(true);

      // Validação do arquivo
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O tamanho máximo permitido é 5MB",
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
      const fileName = `${profile.id}-bg-${Date.now()}.${fileExt}`;
      const filePath = `backgrounds/${fileName}`;

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
        setBackgroundUrl(publicUrl.publicUrl);
        onProfileChange({
          background_type: "image",
          background_url: publicUrl.publicUrl,
        });
      }

      toast({
        title: "Imagem de fundo atualizada",
        description: "Sua nova imagem de fundo foi salva com sucesso",
      });
    } catch (error) {
      console.error("Erro ao fazer upload da imagem de fundo:", error);
      toast({
        title: "Erro ao salvar imagem",
        description: "Ocorreu um erro ao enviar a imagem de fundo",
        variant: "destructive",
      });
    } finally {
      setUploadingBackground(false);
    }
  };

  // Manipuladores de mudança para cada opção
  const handleThemeChange = (value: string) => {
    setTheme(value);
    onProfileChange({ theme: value });
  };

  const handleButtonStyleChange = (value: string) => {
    setButtonStyle(value);
    onProfileChange({ button_style: value });
  };

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
    onProfileChange({ font_family: value });
  };

  const handleLayoutChange = (value: string) => {
    setLayout(value);
    onProfileChange({ layout: value });
  };

  const handleBackgroundTypeChange = (value: string) => {
    if (value === "image" && !isPremium) {
      toast({
        title: "Recurso Premium",
        description:
          "Faça upgrade para o plano premium para usar imagens de fundo personalizadas.",
        variant: "destructive",
      });
      return;
    }

    setBackgroundType(value);
    onProfileChange({ background_type: value });
  };

  const handleBackgroundColorChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setBackgroundColor(value);
    onProfileChange({ background_url: value });
  };

  const handleBackgroundGradientChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setBackgroundGradient(value);
    onProfileChange({ background_url: value });
  };

  const handleCustomCssChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCustomCss(value);

    // Somente atualizar se o usuário for premium
    if (isPremium) {
      onProfileChange({ custom_css: value });
    }
  };

  // Renderizar um botão premium ou mostrar conteúdo
  const PremiumFeature = ({
    children,
    title,
    description,
  }: {
    children: React.ReactNode;
    title: string;
    description: string;
  }) => {
    if (!isPremium) {
      return (
        <div className="border border-dashed rounded-lg p-4 bg-muted/30">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Lock className="h-4 w-4" />
            <h3 className="font-medium">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              // Navegue para a página de preços
              window.location.href = "/dashboard/pricing";
            }}
          >
            Fazer Upgrade para Premium
          </Button>
        </div>
      );
    }

    return <>{children}</>;
  };

  return (
    <div className="space-y-6">
      {/* Opções básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Theme & Style</CardTitle>
          <CardDescription>
            Customize the appearance of your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme Selection */}
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={theme}
              onValueChange={(value) => {
                setTheme(value);
                onProfileChange({ theme: value });
              }}
            >
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Button Style */}
          <div className="space-y-2">
            <Label>Button Style</Label>
            <Select
              value={buttonStyle}
              onValueChange={(value) => {
                setButtonStyle(value);
                onProfileChange({ button_style: value });
              }}
            >
              <SelectTrigger id="buttonStyle">
                <SelectValue placeholder="Select a button style" />
              </SelectTrigger>
              <SelectContent>
                {buttonStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Family */}
          <div className="space-y-2">
            <Label>Font</Label>
            <Select
              value={fontFamily}
              onValueChange={(value) => {
                setFontFamily(value);
                onProfileChange({ font_family: value });
              }}
            >
              <SelectTrigger id="fontFamily">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Layout */}
          <div className="space-y-2">
            <Label>Layout</Label>
            <Select
              value={layout}
              onValueChange={(value) => {
                setLayout(value);
                onProfileChange({ layout: value });
              }}
            >
              <SelectTrigger id="layout">
                <SelectValue placeholder="Select a layout" />
              </SelectTrigger>
              <SelectContent>
                {layouts.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Plano de fundo */}
      <Card>
        <CardHeader>
          <CardTitle>Background</CardTitle>
          <CardDescription>
            Choose a background for your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Background Type */}
          <div className="space-y-2">
            <Label>Background Type</Label>
            <Select
              value={backgroundType}
              onValueChange={(value) => {
                setBackgroundType(value);
                onProfileChange({ background_type: value });
              }}
            >
              <SelectTrigger id="backgroundType">
                <SelectValue placeholder="Select background type" />
              </SelectTrigger>
              <SelectContent>
                {backgroundTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Background Settings based on type */}
          {backgroundType === "color" && (
            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <Input
                id="bgColor"
                type="color"
                value={backgroundColor}
                onChange={handleBackgroundColorChange}
              />
            </div>
          )}

          {backgroundType === "gradient" && (
            <div className="space-y-2">
              <Label htmlFor="bgGradient">Gradient CSS</Label>
              <Textarea
                id="bgGradient"
                placeholder="linear-gradient(to right, #6366f1, #ec4899)"
                value={backgroundGradient}
                onChange={handleBackgroundGradientChange}
              />
            </div>
          )}

          {backgroundType === "image" && (
            <div className="space-y-2">
              <Label>Background Image</Label>
              {isPremium ? (
                <div className="grid gap-2">
                  {backgroundUrl && (
                    <div className="relative w-full h-32 rounded-md overflow-hidden border">
                      <img
                        src={backgroundUrl}
                        alt="Background"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <Input
                    id="backgroundImage"
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundUpload}
                    disabled={uploadingBackground}
                  />
                  {uploadingBackground && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-md border p-3 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>
                    Upgrade to Premium to upload custom background images
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CSS personalizado (recurso premium) */}
      <Card>
        <CardHeader>
          <CardTitle>Custom CSS</CardTitle>
          <CardDescription>
            Add custom CSS to your profile (Premium feature)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPremium ? (
            <Textarea
              placeholder="Add your custom CSS here"
              value={customCss || ""}
              onChange={handleCustomCssChange}
              className="font-mono h-32"
            />
          ) : (
            <div className="flex items-center gap-2 rounded-md border p-3 text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Upgrade to Premium to add custom CSS</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
