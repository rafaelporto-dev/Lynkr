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
    description: "Tema claro padrão com cores suaves e modernas",
    category: "light",
    isPremium: false,
    themeId: "light",
    preview: {
      backgroundColor: "#ffffff",
      primaryColor: "#4f46e5",
      textColor: "#111827",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Design minimalista com ênfase em espaços em branco",
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
    description: "Tema escuro elegante para reduzir o cansaço visual",
    category: "dark",
    isPremium: false,
    themeId: "dark",
    preview: {
      backgroundColor: "#111827",
      primaryColor: "#6366f1",
      textColor: "#f9fafb",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Tons profundos de azul com acentos vibrantes",
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
    description: "Esquema de cores suaves inspirado no Ártico",
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
    description: "Visual futurista com cores neon vibrantes",
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
    description: "Gradientes inspirados no pôr do sol com tons quentes",
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
    description: "Efeito de vidro translúcido com bordas suaves",
    category: "special",
    isPremium: true,
    themeId: "glass",
    preview: {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      primaryColor: "#6366f1",
      textColor: "#ffffff",
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
    name: "Padrão",
    description: "Configuração padrão do tema sem ajustes",
    colorAdjustments: {
      saturation: 1,
      lightness: 1,
      darkness: 1,
      contrast: 1,
    },
  },
  {
    id: "vibrant",
    name: "Vibrante",
    description: "Cores mais saturadas e vibrantes",
    colorAdjustments: {
      saturation: 1.2,
      lightness: 1.05,
      darkness: 0.95,
      contrast: 1.1,
    },
  },
  {
    id: "muted",
    name: "Sóbrio",
    description: "Cores mais suaves e discretas",
    colorAdjustments: {
      saturation: 0.8,
      lightness: 1.05,
      darkness: 0.95,
      contrast: 0.9,
    },
  },
  {
    id: "high-contrast",
    name: "Alto Contraste",
    description: "Maximiza a legibilidade com alto contraste",
    colorAdjustments: {
      saturation: 0.9,
      lightness: 1.1,
      darkness: 0.9,
      contrast: 1.3,
    },
  },
];

// Classe ThemeManager para gerenciar temas
export class ThemeManager {
  /**
   * Valida um ID de tema e retorna um ID válido
   * @param themeId ID do tema a ser validado
   * @returns ID de tema válido (usa 'light' como fallback)
   */
  static validateThemeId(themeId?: string): ThemeId {
    if (!themeId || !Object.keys(baseThemes).includes(themeId)) {
      return "light";
    }
    return themeId as ThemeId;
  }

  /**
   * Obter tokens de design para um tema específico
   * @param themeId ID do tema
   * @returns Tokens de design para o tema especificado
   */
  static getThemeTokens(themeId?: string): DesignTokens {
    const validThemeId = this.validateThemeId(themeId);
    return baseThemes[validThemeId];
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
   * Salva o tema do usuário no banco de dados
   * @param themeId ID do tema a ser salvo
   * @returns Promise com resultado da operação
   */
  static async saveUserTheme(
    themeId: string
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

      const { error } = await supabase
        .from("profiles")
        .update({
          theme: validThemeId,
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
