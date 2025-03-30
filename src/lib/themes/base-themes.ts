/**
 * Temas base do sistema
 *
 * Este arquivo define os temas básicos que servem como ponto de partida para as
 * personalizações. Cada tema implementa a interface DesignTokens definida em tokens.ts
 */

import {
  DesignTokens,
  defaultSpacingTokens,
  defaultBorderTokens,
  defaultTypographyTokens,
  defaultShadowTokens,
  defaultEffectTokens,
} from "./tokens";

/**
 * Tema Light - Um tema claro e moderno
 */
export const lightTheme: DesignTokens = {
  colors: {
    // Brand colors
    primary: "#4f46e5", // indigo-600
    primaryLight: "#6366f1", // indigo-500
    primaryDark: "#4338ca", // indigo-700
    secondary: "#ec4899", // pink-500
    secondaryLight: "#f472b6", // pink-400
    secondaryDark: "#db2777", // pink-600

    // Background colors
    background: "#ffffff",
    backgroundAccent: "#f9fafb", // gray-50
    backgroundMuted: "#f3f4f6", // gray-100
    cardBackground: "#ffffff",
    cardBackgroundHover: "#f9fafb", // gray-50

    // Text colors
    text: "#111827", // gray-900
    textMuted: "#6b7280", // gray-500
    textInverted: "#ffffff",

    // Button colors
    buttonBackground: "#4f46e5", // primary
    buttonBackgroundHover: "#4338ca", // primaryDark
    buttonText: "#ffffff",

    // Border colors
    border: "#e5e7eb", // gray-200
    borderHover: "#d1d5db", // gray-300
    borderActive: "#4f46e5", // primary

    // Accent colors
    accent: "#8b5cf6", // violet-500
    success: "#10b981", // emerald-500
    warning: "#f59e0b", // amber-500
    error: "#ef4444", // red-500
    info: "#3b82f6", // blue-500
  },
  typography: defaultTypographyTokens,
  spacing: defaultSpacingTokens,
  borders: defaultBorderTokens,
  shadows: defaultShadowTokens,
  effects: defaultEffectTokens,
  components: {
    buttons: {
      borderRadius: defaultBorderTokens.radius.md,
      fontWeight: defaultTypographyTokens.fontWeight.medium,
      padding: {
        sm: `${defaultSpacingTokens[1.5]} ${defaultSpacingTokens[3]}`,
        md: `${defaultSpacingTokens[2]} ${defaultSpacingTokens[4]}`,
        lg: `${defaultSpacingTokens[2.5]} ${defaultSpacingTokens[5]}`,
      },
      shadow: defaultShadowTokens.sm,
    },
    inputs: {
      borderRadius: defaultBorderTokens.radius.md,
      borderColor: "#e5e7eb", // gray-200
      focusBorderColor: "#4f46e5", // primary
      errorBorderColor: "#ef4444", // error
      background: "#ffffff",
      placeholderColor: "#9ca3af", // gray-400
    },
    cards: {
      borderRadius: defaultBorderTokens.radius.lg,
      padding: defaultSpacingTokens[4],
      shadow: defaultShadowTokens.md,
      background: "#ffffff",
      border: `${defaultBorderTokens.width.thin} ${defaultBorderTokens.style.solid} #e5e7eb`,
    },
  },
};

/**
 * Tema Dark - Um tema escuro e elegante
 */
export const darkTheme: DesignTokens = {
  colors: {
    // Brand colors
    primary: "#6366f1", // indigo-500
    primaryLight: "#818cf8", // indigo-400
    primaryDark: "#4f46e5", // indigo-600
    secondary: "#f472b6", // pink-400
    secondaryLight: "#f9a8d4", // pink-300
    secondaryDark: "#ec4899", // pink-500

    // Background colors
    background: "#111827", // gray-900
    backgroundAccent: "#1f2937", // gray-800
    backgroundMuted: "#374151", // gray-700
    cardBackground: "#1f2937", // gray-800
    cardBackgroundHover: "#374151", // gray-700

    // Text colors
    text: "#f9fafb", // gray-50
    textMuted: "#9ca3af", // gray-400
    textInverted: "#111827", // gray-900

    // Button colors
    buttonBackground: "#6366f1", // primary
    buttonBackgroundHover: "#4f46e5", // primaryDark
    buttonText: "#ffffff",

    // Border colors
    border: "#374151", // gray-700
    borderHover: "#4b5563", // gray-600
    borderActive: "#6366f1", // primary

    // Accent colors
    accent: "#a78bfa", // violet-400
    success: "#34d399", // emerald-400
    warning: "#fbbf24", // amber-400
    error: "#f87171", // red-400
    info: "#60a5fa", // blue-400
  },
  typography: defaultTypographyTokens,
  spacing: defaultSpacingTokens,
  borders: defaultBorderTokens,
  shadows: {
    ...defaultShadowTokens,
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.4)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.3)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
  },
  effects: {
    ...defaultEffectTokens,
    gradient: {
      subtle: "linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0))",
      primary:
        "linear-gradient(to right, var(--color-primary), var(--color-primary-light))",
      secondary:
        "linear-gradient(to right, var(--color-secondary), var(--color-secondary-light))",
      background:
        "linear-gradient(to bottom, var(--color-background), var(--color-background-accent))",
    },
  },
  components: {
    buttons: {
      borderRadius: defaultBorderTokens.radius.md,
      fontWeight: defaultTypographyTokens.fontWeight.medium,
      padding: {
        sm: `${defaultSpacingTokens[1.5]} ${defaultSpacingTokens[3]}`,
        md: `${defaultSpacingTokens[2]} ${defaultSpacingTokens[4]}`,
        lg: `${defaultSpacingTokens[2.5]} ${defaultSpacingTokens[5]}`,
      },
      shadow: defaultShadowTokens.sm,
    },
    inputs: {
      borderRadius: defaultBorderTokens.radius.md,
      borderColor: "#374151", // gray-700
      focusBorderColor: "#6366f1", // primary
      errorBorderColor: "#f87171", // error
      background: "#1f2937", // gray-800
      placeholderColor: "#6b7280", // gray-500
    },
    cards: {
      borderRadius: defaultBorderTokens.radius.lg,
      padding: defaultSpacingTokens[4],
      shadow: defaultShadowTokens.md,
      background: "#1f2937", // gray-800
      border: `${defaultBorderTokens.width.thin} ${defaultBorderTokens.style.solid} #374151`,
    },
  },
};

/**
 * Tema System - Segue a preferência do sistema
 * No servidor, renderiza como light, e no cliente será substituído pelo tema de acordo com a preferência do sistema
 */
export const systemTheme: DesignTokens = lightTheme;

/**
 * Tema Midnight - Um tema escuro com tons azulados
 */
export const midnightTheme: DesignTokens = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    // Ajustar cores específicas para o tema midnight
    background: "#0f172a", // slate-900
    backgroundAccent: "#1e293b", // slate-800
    backgroundMuted: "#334155", // slate-700
    cardBackground: "#1e293b", // slate-800
    cardBackgroundHover: "#334155", // slate-700
    primary: "#38bdf8", // sky-400
    primaryLight: "#7dd3fc", // sky-300
    primaryDark: "#0284c7", // sky-600
    secondary: "#c084fc", // purple-400
    secondaryLight: "#d8b4fe", // purple-300
    secondaryDark: "#a855f7", // purple-500
    border: "#334155", // slate-700
    borderHover: "#475569", // slate-600
    borderActive: "#38bdf8", // primary
  },
  effects: {
    ...darkTheme.effects,
    gradient: {
      ...darkTheme.effects.gradient,
      background: "linear-gradient(to bottom, #0f172a, #1e293b)", // slate-900 to slate-800
      primary: "linear-gradient(to right, #38bdf8, #7dd3fc)", // sky-400 to sky-300
    },
  },
  components: {
    ...darkTheme.components,
    cards: {
      ...darkTheme.components.cards,
      background: "#1e293b", // slate-800
      border: `${defaultBorderTokens.width.thin} ${defaultBorderTokens.style.solid} #334155`, // slate-700
    },
    inputs: {
      ...darkTheme.components.inputs,
      borderColor: "#334155", // slate-700
      focusBorderColor: "#38bdf8", // primary
      background: "#1e293b", // slate-800
    },
  },
};

/**
 * Tema Neon - Um tema escuro com acentos neon vívidos
 */
export const neonTheme: DesignTokens = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    // Ajustar cores específicas para o tema neon
    background: "#050505", // quase preto
    backgroundAccent: "#121212",
    backgroundMuted: "#1a1a1a",
    cardBackground: "#0f0f0f",
    cardBackgroundHover: "#1a1a1a",
    primary: "#00f5d4", // aqua neon
    primaryLight: "#00fff5",
    primaryDark: "#00cca9",
    secondary: "#fe53bb", // pink neon
    secondaryLight: "#ff77cb",
    secondaryDark: "#e31b88",
    border: "#333333",
    borderHover: "#444444",
    borderActive: "#00f5d4", // primary
    accent: "#7928ca", // purple neon
    success: "#03fca5", // green neon
    warning: "#fffc47", // yellow neon
    error: "#fe2047", // red neon
    info: "#32c5ff", // blue neon
  },
  effects: {
    ...darkTheme.effects,
    gradient: {
      ...darkTheme.effects.gradient,
      background: "linear-gradient(to bottom, #050505, #121212)",
      primary: "linear-gradient(to right, #00f5d4, #00fff5)",
      secondary: "linear-gradient(to right, #fe53bb, #ff77cb)",
      subtle:
        "linear-gradient(to right, rgba(0, 245, 212, 0.2), rgba(0, 245, 212, 0))",
    },
  },
  shadows: {
    ...darkTheme.shadows,
    md: "0 4px 16px rgba(0, 245, 212, 0.3)", // primary shadow glow
    xl: "0 12px 24px rgba(0, 245, 212, 0.4)", // stronger glow
  },
  components: {
    ...darkTheme.components,
    buttons: {
      ...darkTheme.components.buttons,
      shadow: "0 0 10px rgba(0, 245, 212, 0.5)", // neon glow
    },
    cards: {
      ...darkTheme.components.cards,
      background: "#0f0f0f",
      border: `${defaultBorderTokens.width.thin} ${defaultBorderTokens.style.solid} #333333`,
      shadow: "0 8px 20px rgba(0, 0, 0, 0.8), 0 0 6px rgba(0, 245, 212, 0.3)", // subtle neon glow
    },
  },
};

/**
 * Tema Nord - Um tema baseado na paleta de cores Nord
 */
export const nordTheme: DesignTokens = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    // Paleta Nord
    background: "#2e3440", // nord0
    backgroundAccent: "#3b4252", // nord1
    backgroundMuted: "#434c5e", // nord2
    cardBackground: "#3b4252", // nord1
    cardBackgroundHover: "#434c5e", // nord2
    primary: "#88c0d0", // nord8
    primaryLight: "#8fbcbb", // nord7
    primaryDark: "#81a1c1", // nord9
    secondary: "#b48ead", // nord15
    secondaryLight: "#d8dee9", // nord4
    secondaryDark: "#a5abb6", // nord5-ish
    text: "#eceff4", // nord6
    textMuted: "#d8dee9", // nord4
    border: "#434c5e", // nord2
    borderHover: "#4c566a", // nord3
    borderActive: "#88c0d0", // primary
    accent: "#5e81ac", // nord10
    success: "#a3be8c", // nord14
    warning: "#ebcb8b", // nord13
    error: "#bf616a", // nord11
    info: "#81a1c1", // nord9
  },
  effects: {
    ...darkTheme.effects,
    gradient: {
      ...darkTheme.effects.gradient,
      background: "linear-gradient(to bottom, #2e3440, #3b4252)", // nord0 to nord1
      primary: "linear-gradient(to right, #88c0d0, #8fbcbb)", // nord8 to nord7
      secondary: "linear-gradient(to right, #b48ead, #d8dee9)", // nord15 to nord4
    },
  },
  components: {
    ...darkTheme.components,
    cards: {
      ...darkTheme.components.cards,
      background: "#3b4252", // nord1
      border: `${defaultBorderTokens.width.thin} ${defaultBorderTokens.style.solid} #434c5e`, // nord2
    },
    inputs: {
      ...darkTheme.components.inputs,
      borderColor: "#434c5e", // nord2
      focusBorderColor: "#88c0d0", // primary
      background: "#3b4252", // nord1
    },
  },
};

/**
 * Tema Glass - Um tema com efeito de vidro
 */
export const glassTheme: DesignTokens = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    // Ajustar as cores para o tema glass
    background: "rgba(255, 255, 255, 0.05)",
    backgroundAccent: "rgba(255, 255, 255, 0.1)",
    backgroundMuted: "rgba(255, 255, 255, 0.2)",
    cardBackground: "rgba(255, 255, 255, 0.2)",
    cardBackgroundHover: "rgba(255, 255, 255, 0.25)",
    primary: "#6366f1", // indigo-500
    primaryLight: "#818cf8", // indigo-400
    primaryDark: "#4f46e5", // indigo-600
    border: "rgba(255, 255, 255, 0.2)",
    borderHover: "rgba(255, 255, 255, 0.3)",
    borderActive: "rgba(255, 255, 255, 0.4)",
    text: "#ffffff",
    textMuted: "rgba(255, 255, 255, 0.7)",
  },
  effects: {
    ...lightTheme.effects,
    blur: {
      none: "0",
      sm: "4px",
      md: "8px",
      lg: "16px",
      xl: "24px",
    },
    gradient: {
      ...lightTheme.effects.gradient,
      background:
        "linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
      primary:
        "linear-gradient(to right, rgba(99, 102, 241, 0.8), rgba(129, 140, 248, 0.8))", // indigo-500 to indigo-400
    },
  },
  components: {
    ...lightTheme.components,
    buttons: {
      ...lightTheme.components.buttons,
      borderRadius: defaultBorderTokens.radius.md,
      shadow: "none",
    },
    cards: {
      ...lightTheme.components.cards,
      background: "rgba(255, 255, 255, 0.15)",
      border: `${defaultBorderTokens.width.thin} ${defaultBorderTokens.style.solid} rgba(255, 255, 255, 0.2)`,
      shadow: "none",
    },
    inputs: {
      ...lightTheme.components.inputs,
      background: "rgba(255, 255, 255, 0.1)",
      borderColor: "rgba(255, 255, 255, 0.2)",
      focusBorderColor: "rgba(255, 255, 255, 0.4)",
    },
  },
};

/**
 * Tema Sunset - Um tema com gradientes inspirados no pôr do sol
 */
export const sunsetTheme: DesignTokens = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    // Ajustar cores específicas para o tema sunset
    background: "#1e1b4b", // indigo-950
    backgroundAccent: "#312e81", // indigo-900
    backgroundMuted: "#4338ca", // indigo-700
    cardBackground: "#312e81", // indigo-900
    cardBackgroundHover: "#4338ca", // indigo-700
    primary: "#f97316", // orange-500
    primaryLight: "#fb923c", // orange-400
    primaryDark: "#ea580c", // orange-600
    secondary: "#ec4899", // pink-500
    secondaryLight: "#f472b6", // pink-400
    secondaryDark: "#db2777", // pink-600
    border: "#312e81", // indigo-900
    borderHover: "#4338ca", // indigo-700
    borderActive: "#f97316", // primary
    accent: "#c026d3", // fuchsia-600
  },
  effects: {
    ...darkTheme.effects,
    gradient: {
      ...darkTheme.effects.gradient,
      background: "linear-gradient(to bottom, #1e1b4b, #312e81)", // indigo-950 to indigo-900
      primary: "linear-gradient(to right, #f97316, #fb923c)", // orange-500 to orange-400
      secondary: "linear-gradient(135deg, #7e22ce, #ec4899, #f97316)", // purple-700, pink-500, orange-500
      subtle:
        "linear-gradient(to right, rgba(249, 115, 22, 0.3), rgba(249, 115, 22, 0))", // laranja com transparência
    },
  },
  components: {
    ...darkTheme.components,
    cards: {
      ...darkTheme.components.cards,
      background: "#312e81", // indigo-900
      border: `${defaultBorderTokens.width.thin} ${defaultBorderTokens.style.solid} #4338ca`, // indigo-700
    },
    inputs: {
      ...darkTheme.components.inputs,
      borderColor: "#4338ca", // indigo-700
      focusBorderColor: "#f97316", // primary
      background: "#312e81", // indigo-900
    },
  },
};

/**
 * Tema Minimal - Um tema clean e minimalista
 */
export const minimalTheme: DesignTokens = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    // Ajustar cores específicas para o tema minimal
    background: "#ffffff",
    backgroundAccent: "#f9fafb", // gray-50
    backgroundMuted: "#f3f4f6", // gray-100
    cardBackground: "#ffffff",
    cardBackgroundHover: "#f9fafb", // gray-50
    primary: "#000000",
    primaryLight: "#333333",
    primaryDark: "#000000",
    secondary: "#666666",
    secondaryLight: "#999999",
    secondaryDark: "#333333",
    text: "#000000",
    textMuted: "#666666",
    border: "#e5e7eb", // gray-200
    borderHover: "#d1d5db", // gray-300
    borderActive: "#000000", // preto
    accent: "#000000",
    buttonBackground: "#000000",
    buttonBackgroundHover: "#333333",
    buttonText: "#ffffff",
  },
  effects: {
    ...lightTheme.effects,
    gradient: {
      ...lightTheme.effects.gradient,
      background: "none",
      primary: "none",
      secondary: "none",
      subtle: "none",
    },
  },
  shadows: {
    ...lightTheme.shadows,
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0 2px 4px rgba(0, 0, 0, 0.05)",
    lg: "0 4px 6px rgba(0, 0, 0, 0.05)",
    xl: "0 8px 8px rgba(0, 0, 0, 0.05)",
    "2xl": "0 10px 10px rgba(0, 0, 0, 0.05)",
  },
  components: {
    ...lightTheme.components,
    buttons: {
      ...lightTheme.components.buttons,
      borderRadius: defaultBorderTokens.radius.sm,
      shadow: "none",
    },
    cards: {
      ...lightTheme.components.cards,
      borderRadius: defaultBorderTokens.radius.sm,
      shadow: "none",
      border: `${defaultBorderTokens.width.thin} ${defaultBorderTokens.style.solid} #e5e7eb`,
    },
    inputs: {
      ...lightTheme.components.inputs,
      borderRadius: defaultBorderTokens.radius.sm,
    },
  },
};

// Mapeamento de todos os temas disponíveis
export const baseThemes: Record<string, DesignTokens> = {
  light: lightTheme,
  dark: darkTheme,
  system: systemTheme,
  midnight: midnightTheme,
  neon: neonTheme,
  nord: nordTheme,
  glass: glassTheme,
  sunset: sunsetTheme,
  minimal: minimalTheme,
};

// Tipo para identificadores de temas
export type ThemeId = keyof typeof baseThemes;
