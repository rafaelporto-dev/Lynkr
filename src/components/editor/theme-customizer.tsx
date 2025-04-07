"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorTokens, DesignTokens } from "@/lib/themes/tokens";
import { ThemeManager } from "@/lib/themes/theme-manager";
import { ThemeId } from "@/lib/themes/base-themes";
import { defaultTypographyTokens } from "@/lib/themes/tokens";
import { Paintbrush, RefreshCw, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ThemeCustomizerProps {
  currentTheme: string;
  onThemeChange: (themeId: string, customTokens?: Partial<DesignTokens>) => void;
  userProfile: any;
}

export default function ThemeCustomizer({
  currentTheme,
  onThemeChange,
  userProfile,
}: ThemeCustomizerProps) {
  const { toast } = useToast();
  const [baseTheme, setBaseTheme] = useState<DesignTokens>(
    ThemeManager.getThemeTokens(currentTheme)
  );
  const [customColors, setCustomColors] = useState<Partial<ColorTokens>>({});
  const [fontFamily, setFontFamily] = useState<string>(
    baseTheme.typography.fontFamily.base
  );
  const [borderRadius, setBorderRadius] = useState<number>(
    parseInt(baseTheme.components.buttons.borderRadius.replace("px", "").replace("rem", ""))
  );
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Atualizar o tema base quando o tema atual mudar
  useEffect(() => {
    setBaseTheme(ThemeManager.getThemeTokens(currentTheme));
    // Resetar customizações quando o tema base mudar
    setCustomColors({});
    setFontFamily(ThemeManager.getThemeTokens(currentTheme).typography.fontFamily.base);
    setBorderRadius(
      parseInt(
        ThemeManager.getThemeTokens(currentTheme).components.buttons.borderRadius
          .replace("px", "")
          .replace("rem", "")
      )
    );
    setIsDirty(false);
  }, [currentTheme]);

  // Função para atualizar uma cor personalizada
  const handleColorChange = (colorKey: keyof ColorTokens, value: string) => {
    setCustomColors((prev) => ({
      ...prev,
      [colorKey]: value,
    }));
    setIsDirty(true);
  };

  // Função para aplicar as customizações
  const applyCustomizations = () => {
    // Criar um objeto de tokens personalizado
    const customTokens: Partial<DesignTokens> = {
      colors: customColors,
      typography: {
        ...baseTheme.typography,
        fontFamily: {
          ...baseTheme.typography.fontFamily,
          base: fontFamily,
          heading: fontFamily,
        },
      },
      components: {
        ...baseTheme.components,
        buttons: {
          ...baseTheme.components.buttons,
          borderRadius: `${borderRadius}px`,
        },
        cards: {
          ...baseTheme.components.cards,
          borderRadius: `${borderRadius * 1.5}px`,
        },
        inputs: {
          ...baseTheme.components.inputs,
          borderRadius: `${borderRadius}px`,
        },
      },
    };

    // Aplicar as customizações
    onThemeChange(currentTheme, customTokens);
    
    toast({
      title: "Theme customized",
      description: "Your custom theme has been applied successfully.",
    });
    
    setIsDirty(false);
  };

  // Função para resetar as customizações
  const resetCustomizations = () => {
    setCustomColors({});
    setFontFamily(baseTheme.typography.fontFamily.base);
    setBorderRadius(
      parseInt(
        baseTheme.components.buttons.borderRadius
          .replace("px", "")
          .replace("rem", "")
      )
    );
    setIsDirty(false);
    
    toast({
      title: "Customizations reset",
      description: "All customizations have been reset to the base theme.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Manual Customization</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetCustomizations}
            disabled={!isDirty}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={applyCustomizations}
            disabled={!isDirty}
          >
            <Save className="h-4 w-4 mr-2" />
            Apply Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="colors">
        <TabsList className="mb-4">
          <TabsTrigger value="colors">
            <Paintbrush className="h-4 w-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography">
            Typography
          </TabsTrigger>
          <TabsTrigger value="components">
            Components
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Colors */}
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-md border"
                  style={{ backgroundColor: customColors.primary || baseTheme.colors.primary }}
                />
                <Input
                  id="primary-color"
                  type="color"
                  value={customColors.primary || baseTheme.colors.primary}
                  onChange={(e) => handleColorChange("primary", e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>

            {/* Secondary Colors */}
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-md border"
                  style={{ backgroundColor: customColors.secondary || baseTheme.colors.secondary }}
                />
                <Input
                  id="secondary-color"
                  type="color"
                  value={customColors.secondary || baseTheme.colors.secondary}
                  onChange={(e) => handleColorChange("secondary", e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <Label htmlFor="background-color">Background Color</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-md border"
                  style={{ backgroundColor: customColors.background || baseTheme.colors.background }}
                />
                <Input
                  id="background-color"
                  type="color"
                  value={customColors.background || baseTheme.colors.background}
                  onChange={(e) => handleColorChange("background", e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>

            {/* Text Color */}
            <div className="space-y-2">
              <Label htmlFor="text-color">Text Color</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-md border"
                  style={{ backgroundColor: customColors.text || baseTheme.colors.text }}
                />
                <Input
                  id="text-color"
                  type="color"
                  value={customColors.text || baseTheme.colors.text}
                  onChange={(e) => handleColorChange("text", e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="font-family">Font Family</Label>
              <Select
                value={fontFamily}
                onValueChange={(value) => {
                  setFontFamily(value);
                  setIsDirty(true);
                }}
              >
                <SelectTrigger id="font-family">
                  <SelectValue placeholder="Select a font family" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="var(--font-sans)">System UI (Default)</SelectItem>
                  <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                  <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
                  <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
                  <SelectItem value="'Poppins', sans-serif">Poppins</SelectItem>
                  <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 border rounded-md">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              <h3 
                className="text-xl font-bold mb-2"
                style={{ fontFamily }}
              >
                This is a heading
              </h3>
              <p
                className="text-base"
                style={{ fontFamily }}
              >
                This is a paragraph of text that demonstrates how your selected font will look on your profile.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="components" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="border-radius">Border Radius</Label>
                <span className="text-sm text-muted-foreground">{borderRadius}px</span>
              </div>
              <Slider
                id="border-radius"
                min={0}
                max={24}
                step={1}
                value={[borderRadius]}
                onValueChange={(value) => {
                  setBorderRadius(value[0]);
                  setIsDirty(true);
                }}
              />
            </div>

            <div className="p-4 border rounded-md space-y-4">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              <div className="flex items-center gap-4">
                <Button
                  style={{ 
                    borderRadius: `${borderRadius}px`,
                    backgroundColor: customColors.primary || baseTheme.colors.primary,
                    color: customColors.text || baseTheme.colors.textInverted
                  }}
                >
                  Button
                </Button>
                <div 
                  className="p-4 border inline-block"
                  style={{ 
                    borderRadius: `${borderRadius * 1.5}px`,
                    backgroundColor: customColors.cardBackground || baseTheme.colors.cardBackground,
                    borderColor: customColors.border || baseTheme.colors.border
                  }}
                >
                  Card Example
                </div>
                <Input 
                  placeholder="Input example"
                  className="w-40"
                  style={{ 
                    borderRadius: `${borderRadius}px`,
                    borderColor: customColors.border || baseTheme.colors.border
                  }}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
