/**
 * ThemeManager - API centralizada para gerenciar temas
 *
 * Este módulo fornece uma interface unificada para interagir com o sistema de temas,
 * incluindo funções para obter, validar e modificar temas.
 */

import { DesignTokens, ColorTokens } from "./tokens";
import { baseThemes, ThemeId } from "./base-themes";
import { createClient } from "../../../supabase/client";

// Interface para presets de tema adicionais
export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  category: "light" | "dark" | "special";
  isPremium: boolean;
  themeId: ThemeId;
  colorOverrides?: Partial<ColorTokens>;
  preview?: {
    backgroundColor: string;
    primaryColor: string;
    textColor: string;
  };
}

// Mapeamento de presets de temas
export const themePresets: ThemePreset[] = [
  // Temas light
  {
    id: "light",
    name: "Light",
    description: "Standard light theme with soft and modern colors",
    category: "light",
    isPremium: false,
    themeId: "light",
    preview: {
      backgroundColor: "#f8fafc",
      primaryColor: "#8b5cf6",
      textColor: "#0f172a",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Minimalist design with emphasis on white spaces",
    category: "light",
    isPremium: false,
    themeId: "minimal",
    preview: {
      backgroundColor: "#ffffff",
      primaryColor: "#000000",
      textColor: "#000000",
    },
  },

  // Temas dark
  {
    id: "dark",
    name: "Dark",
    description: "Dark elegant theme to reduce visual fatigue",
    category: "dark",
    isPremium: false,
    themeId: "dark",
    preview: {
      backgroundColor: "#0f172a",
      primaryColor: "#7c3aed",
      textColor: "#f8fafc",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep blue tones with vibrant accents",
    category: "dark",
    isPremium: false,
    themeId: "midnight",
    preview: {
      backgroundColor: "#0f172a",
      primaryColor: "#38bdf8",
      textColor: "#f9fafb",
    },
  },
  {
    id: "nord",
    name: "Nord",
    description: "Soft color scheme inspired by the Arctic",
    category: "dark",
    isPremium: false,
    themeId: "nord",
    preview: {
      backgroundColor: "#2e3440",
      primaryColor: "#88c0d0",
      textColor: "#eceff4",
    },
  },

  // Temas premium
  {
    id: "neon",
    name: "Neon",
    description: "Futuristic visual with vibrant neon colors",
    category: "special",
    isPremium: true,
    themeId: "neon",
    preview: {
      backgroundColor: "#050505",
      primaryColor: "#00f5d4",
      textColor: "#ffffff",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Gradients inspired by the sunset with warm tones",
    category: "special",
    isPremium: true,
    themeId: "sunset",
    preview: {
      backgroundColor: "#1e1b4b",
      primaryColor: "#f97316",
      textColor: "#ffffff",
    },
  },
  {
    id: "glass",
    name: "Glass",
    description: "Translucent glass effect with soft edges",
    category: "special",
    isPremium: true,
    themeId: "glass",
    preview: {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      primaryColor: "#6366f1",
      textColor: "#ffffff",
    },
  },
  // Novos temas modernos
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Futuristic theme with vibrant neon colors",
    category: "special",
    isPremium: true,
    themeId: "cyberpunk",
    preview: {
      backgroundColor: "#0d0221",
      primaryColor: "#f706cf",
      textColor: "#ffffff",
    },
  },
  {
    id: "pastel",
    name: "Pastel",
    description: "Soft pastel colors with rounded elements",
    category: "light",
    isPremium: true,
    themeId: "pastel",
    preview: {
      backgroundColor: "#f8f9fc",
      primaryColor: "#94c2f3",
      textColor: "#4a5568",
    },
  },
];

// Variações de temas (ex: mais vibrante, mais sóbrio, mais contrastante)
export interface ThemeVariation {
  id: string;
  name: string;
  description: string;
  colorAdjustments: {
    saturation?: number; // multiplicador (1 = normal, >1 = mais saturado, <1 = menos saturado)
    lightness?: number; // multiplicador para cores claras
    darkness?: number; // multiplicador para cores escuras
    contrast?: number; // multiplicador para contraste
  };
}

export const themeVariations: ThemeVariation[] = [
  {
    id: "default",
    name: "Default",
    description: "Default theme configuration without adjustments",
    colorAdjustments: {
      saturation: 1,
      lightness: 1,
      darkness: 1,
      contrast: 1,
    },
  },
  {
    id: "vibrant",
    name: "Vibrant",
    description: "More saturated and vibrant colors",
    colorAdjustments: {
      saturation: 1.2,
      lightness: 1.05,
      darkness: 0.95,
      contrast: 1.1,
    },
  },
  {
    id: "muted",
    name: "Muted",
    description: "More subtle and discreet colors",
    colorAdjustments: {
      saturation: 0.8,
      lightness: 1.05,
      darkness: 0.95,
      contrast: 0.9,
    },
  },
  {
    id: "high-contrast",
    name: "High Contrast",
    description: "Maximizes readability with high contrast",
    colorAdjustments: {
      saturation: 0.9,
      lightness: 1.1,
      darkness: 0.9,
      contrast: 1.3,
    },
  },
  {
    id: "modern",
    name: "Modern",
    description: "Enhanced with modern design principles",
    colorAdjustments: {
      saturation: 1.05,
      lightness: 1.02,
      darkness: 0.98,
      contrast: 1.1,
    },
  },
];

// Classe ThemeManager para gerenciar temas
export class ThemeManager {
  /**
   * Valida o ID do tema e retorna um ID válido
   * @param themeId ID do tema a ser validado
   * @returns ID de tema válido
   */
  static validateThemeId(themeId?: string): ThemeId {
    // Limpar e normalizar o themeId caso seja uma string
    const normalizedThemeId = themeId?.trim().toLowerCase();

    // Verificar se o ID está entre os temas disponíveis
    if (
      normalizedThemeId &&
      Object.keys(baseThemes).includes(normalizedThemeId as ThemeId)
    ) {
      return normalizedThemeId as ThemeId;
    }

    // Verificar o tema do sistema se disponível
    if (typeof window !== "undefined") {
      // Verificar localStorage primeiro para persistência entre páginas
      const storedTheme = localStorage.getItem("userTheme");
      if (
        storedTheme &&
        Object.keys(baseThemes).includes(storedTheme as ThemeId)
      ) {
        return storedTheme as ThemeId;
      }

      // Se 'system' é o tema armazenado, verificar preferência do sistema
      if (storedTheme === "system") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        return prefersDark ? "dark" : "light";
      }
    }

    // Valor padrão - dark para manter consistência com o tema na página de perfil mostrada
    return "dark";
  }

  /**
   * Obter tokens de design para um tema específico
   * @param themeId ID do tema
   * @param customTokens Tokens personalizados para sobrescrever o tema base
   * @returns Tokens de design para o tema especificado
   */
  static getThemeTokens(
    themeId?: string,
    customTokens?: Partial<DesignTokens>
  ): DesignTokens {
    const validThemeId = this.validateThemeId(themeId);
    const baseTokens = baseThemes[validThemeId];

    // Se não houver tokens personalizados, retornar os tokens base
    if (!customTokens) return baseTokens;

    // Mesclar tokens personalizados com os tokens base
    return this.mergeTokens(baseTokens, customTokens);
  }

  /**
   * Obter preset de tema por ID
   * @param presetId ID do preset
   * @returns Preset de tema ou undefined se não encontrado
   */
  static getThemePreset(presetId?: string): ThemePreset | undefined {
    if (!presetId) return themePresets[0]; // retorna o primeiro preset como padrão
    return themePresets.find((preset) => preset.id === presetId);
  }

  /**
   * Obter tokens de design para um preset específico
   * @param presetId ID do preset
   * @returns Tokens de design do preset
   */
  static getPresetTokens(presetId?: string): DesignTokens {
    const preset = this.getThemePreset(presetId);
    if (!preset) return this.getThemeTokens("light");

    const baseTokens = this.getThemeTokens(preset.themeId);

    // Se não houver sobreposições de cor, retornar tokens base
    if (!preset.colorOverrides) return baseTokens;

    // Aplicar sobreposições de cor
    return {
      ...baseTokens,
      colors: {
        ...baseTokens.colors,
        ...preset.colorOverrides,
      },
    };
  }

  /**
   * Obter todos os presets disponíveis, opcionalmente filtrados por categoria ou status premium
   * @param options Opções de filtragem
   * @returns Array de presets
   */
  static getAvailablePresets(options?: {
    category?: "light" | "dark" | "special";
    isPremium?: boolean;
  }): ThemePreset[] {
    let filteredPresets = [...themePresets];

    if (options?.category) {
      filteredPresets = filteredPresets.filter(
        (preset) => preset.category === options.category
      );
    }

    if (options?.isPremium !== undefined) {
      filteredPresets = filteredPresets.filter(
        (preset) => preset.isPremium === options.isPremium
      );
    }

    return filteredPresets;
  }

  /**
   * Obter presets disponíveis para o usuário atual (considera plano gratuito vs premium)
   * @returns Promise com array de presets disponíveis
   */
  static async getUserAvailablePresets(): Promise<ThemePreset[]> {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Usuário não autenticado, retornar apenas temas gratuitos
        return this.getAvailablePresets({ isPremium: false });
      }

      // Verificar se o usuário tem plano premium
      const { data: profile } = await supabase
        .from("profiles")
        .select("has_free_plan")
        .eq("id", user.id)
        .single();

      const isPremium = profile && !profile.has_free_plan;

      if (isPremium) {
        // Usuário premium tem acesso a todos os temas
        return themePresets;
      } else {
        // Usuário gratuito tem acesso apenas aos temas gratuitos
        return this.getAvailablePresets({ isPremium: false });
      }
    } catch (error) {
      console.error("Erro ao obter presets disponíveis:", error);
      // Em caso de erro, retornar presets gratuitos por segurança
      return this.getAvailablePresets({ isPremium: false });
    }
  }

  /**
   * Aplica uma variação a um tema
   * @param baseTokens Tokens base do tema
   * @param variationId ID da variação a ser aplicada
   * @returns Tokens com a variação aplicada
   */
  static applyVariation(
    baseTokens: DesignTokens,
    variationId?: string
  ): DesignTokens {
    // Se não houver variação, retornar tokens sem modificação
    if (!variationId || variationId === "default") return baseTokens;

    const variation = themeVariations.find((v) => v.id === variationId);
    if (!variation) return baseTokens;

    // Função para ajustar cor com base nos ajustes da variação
    const adjustColor = (color: string): string => {
      // Implementação simplificada - em uma versão real, seria necessário:
      // 1. Converter a cor para HSL
      // 2. Aplicar os ajustes de saturação, luminosidade e contraste
      // 3. Converter de volta para hex/rgb

      // Por simplicidade, retornamos a cor original neste exemplo
      return color;
    };

    // Aplicar ajustes a cada cor no tema
    const adjustedColors: ColorTokens = Object.entries(
      baseTokens.colors
    ).reduce(
      (adjusted, [key, value]) => ({
        ...adjusted,
        [key]: adjustColor(value),
      }),
      {} as ColorTokens
    );

    return {
      ...baseTokens,
      colors: adjustedColors,
    };
  }

  /**
   * Mescla tokens de design base com tokens personalizados
   * @param baseTokens Tokens base
   * @param customTokens Tokens personalizados
   * @returns Tokens mesclados
   */
  static mergeTokens(
    baseTokens: DesignTokens,
    customTokens: Partial<DesignTokens>
  ): DesignTokens {
    // Função auxiliar para mesclar objetos profundamente
    const deepMerge = (target: any, source: any): any => {
      if (!source) return target;

      const output = { ...target };

      Object.keys(source).forEach((key) => {
        if (
          source[key] &&
          typeof source[key] === "object" &&
          !Array.isArray(source[key])
        ) {
          if (target[key]) {
            output[key] = deepMerge(target[key], source[key]);
          } else {
            output[key] = source[key];
          }
        } else {
          output[key] = source[key];
        }
      });

      return output;
    };

    return deepMerge(baseTokens, customTokens);
  }

  /**
   * Salva o tema do usuário no banco de dados
   * @param themeId ID do tema a ser salvo
   * @param customTokens Tokens personalizados (opcional)
   * @returns Promise com resultado da operação
   */
  static async saveUserTheme(
    themeId: string,
    customTokens?: Partial<DesignTokens>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const validThemeId = this.validateThemeId(themeId);
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: "Usuário não autenticado" };
      }

      // Converter tokens personalizados para JSON se existirem
      const customTokensJson = customTokens
        ? JSON.stringify(customTokens)
        : null;

      const { error } = await supabase
        .from("profiles")
        .update({
          theme: validThemeId,
          custom_theme: customTokensJson,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error("Erro ao salvar tema do usuário:", error);
      return {
        success: false,
        error: error.message || "Ocorreu um erro ao salvar o tema",
      };
    }
  }
}

// Export presets e variações diretamente para facilitar o acesso
export const availableThemePresets = themePresets;
export const availableThemeVariations = themeVariations;
