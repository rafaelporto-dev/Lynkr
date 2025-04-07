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
    primary: "#8b5cf6", // violet-500 - mais moderno
    primaryLight: "#a78bfa", // violet-400
    primaryDark: "#7c3aed", // violet-600
    secondary: "#f43f5e", // rose-500 - mais vibrante
    secondaryLight: "#fb7185", // rose-400
    secondaryDark: "#e11d48", // rose-600

    // Background colors
    background: "#f8fafc", // slate-50 - mais suave
    backgroundAccent: "#f1f5f9", // slate-100
    backgroundMuted: "#e2e8f0", // slate-200
    cardBackground: "#ffffff",
    cardBackgroundHover: "#f1f5f9", // slate-100

    // Text colors
    text: "#0f172a", // slate-900 - mais profundo
    textMuted: "#64748b", // slate-500
    textInverted: "#ffffff",

    // Button colors
    buttonBackground: "#8b5cf6", // primary
    buttonBackgroundHover: "#7c3aed", // primaryDark
    buttonText: "#ffffff",

    // Border colors
    border: "#e2e8f0", // slate-200
    borderHover: "#cbd5e1", // slate-300
    borderActive: "#8b5cf6", // primary

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
  shadows: {
    ...defaultShadowTokens,
    sm: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
  },
  effects: {
    ...defaultEffectTokens,
    gradient: {
      subtle:
        "linear-gradient(to right, rgba(248,250,252,0.8), rgba(248,250,252,0))",
      primary: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
      secondary: "linear-gradient(135deg, #f43f5e, #fb7185)",
      background: "linear-gradient(135deg, #f8fafc, #ffffff)",
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
      shadow: "0 2px 10px rgba(139, 92, 246, 0.2)", // Sombra com cor do primary
    },
    inputs: {
      borderRadius: defaultBorderTokens.radius.md,
      borderColor: "#e2e8f0", // slate-200
      focusBorderColor: "#8b5cf6", // primary
      errorBorderColor: "#ef4444", // error
      background: "#ffffff",
      placeholderColor: "#94a3b8", // slate-400
    },
    cards: {
      borderRadius: defaultBorderTokens.radius.lg,
      padding: defaultSpacingTokens[4],
      shadow: "0 4px 15px rgba(0, 0, 0, 0.05)", // Sombra mais suave
      background: "#ffffff",
      border: `${defaultBorderTokens.width.thin} ${defaultBorderTokens.style.solid} #e2e8f0`,
    },
  },
};

/**
 * Tema Dark - Um tema escuro e elegante
 */
export const darkTheme: DesignTokens = {
  colors: {
    // Brand colors
    primary: "#7c3aed", // violet-600 - mais vibrante que o indigo anterior
    primaryLight: "#a78bfa", // violet-400
    primaryDark: "#6d28d9", // violet-700
    secondary: "#ec4899", // pink-500 - mais vibrante
    secondaryLight: "#f9a8d4", // pink-300
    secondaryDark: "#db2777", // pink-600

    // Background colors
    background: "#0f172a", // slate-900 - mais profundo e elegante
    backgroundAccent: "#1e293b", // slate-800
    backgroundMuted: "#334155", // slate-700
    cardBackground: "#1e293b", // slate-800
    cardBackgroundHover: "#334155", // slate-700

    // Text colors
    text: "#f8fafc", // slate-50 - mais brilhante para melhor contraste
    textMuted: "#94a3b8", // slate-400
    textInverted: "#0f172a", // slate-900

    // Button colors
    buttonBackground: "#7c3aed", // primary
    buttonBackgroundHover: "#6d28d9", // primaryDark
    buttonText: "#ffffff",

    // Border colors
    border: "#334155", // slate-700
    borderHover: "#475569", // slate-600
    borderActive: "#7c3aed", // primary

    // Accent colors
    accent: "#8b5cf6", // violet-500
    success: "#10b981", // emerald-500 - mais vibrante
    warning: "#f59e0b", // amber-500
    error: "#ef4444", // red-500 - mais vibrante
    info: "#3b82f6", // blue-500
  },
  typography: defaultTypographyTokens,
  spacing: defaultSpacingTokens,
  borders: defaultBorderTokens,
  shadows: {
    ...defaultShadowTokens,
    sm: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
    md: "0 4px 8px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -1px rgba(0, 0, 0, 0.4)",
    lg: "0 12px 20px -3px rgba(0, 0, 0, 0.7), 0 4px 8px -2px rgba(0, 0, 0, 0.4)",
    xl: "0 20px 30px -5px rgba(0, 0, 0, 0.7), 0 10px 15px -5px rgba(0, 0, 0, 0.4)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
  },
  effects: {
    ...defaultEffectTokens,
    gradient: {
      subtle: "linear-gradient(to right, rgba(15,23,42,0.8), rgba(15,23,42,0))",
      primary: "linear-gradient(135deg, #7c3aed, #a78bfa)",
      secondary: "linear-gradient(135deg, #ec4899, #f9a8d4)",
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
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
      shadow: "0 2px 10px rgba(124, 58, 237, 0.3)", // Sombra com cor do primary
    },
    inputs: {
      borderRadius: defaultBorderTokens.radius.md,
      borderColor: "#334155", // slate-700
      focusBorderColor: "#7c3aed", // primary
      errorBorderColor: "#ef4444", // error
      background: "#1e293b", // slate-800
      placeholderColor: "#64748b", // slate-500
    },
    cards: {
      borderRadius: defaultBorderTokens.radius.lg,
      padding: defaultSpacingTokens[4],
      shadow: "0 4px 20px rgba(0, 0, 0, 0.3)", // Sombra mais pronunciada
      background: "#1e293b", // slate-800
      border: `${defaultBorderTokens.width.thin} ${defaultBorderTokens.style.solid} #334155`,
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
    background: "#030303", // quase preto - mais escuro
    backgroundAccent: "#0a0a0a", // mais escuro
    backgroundMuted: "#121212",
    cardBackground: "#0a0a0a",
    cardBackgroundHover: "#151515",
    primary: "#00f5d4", // aqua neon
    primaryLight: "#00fff5",
    primaryDark: "#00cca9",
    secondary: "#fe53bb", // pink neon
    secondaryLight: "#ff77cb",
    secondaryDark: "#e31b88",
    border: "#222222", // mais escuro
    borderHover: "#333333",
    borderActive: "#00f5d4", // primary
    accent: "#7928ca", // purple neon
    success: "#03fca5", // green neon
    warning: "#fffc47", // yellow neon
    error: "#fe2047", // red neon
    info: "#32c5ff", // blue neon
    text: "#ffffff", // branco puro para melhor contraste
    textMuted: "#aaaaaa",
  },
  effects: {
    ...darkTheme.effects,
    gradient: {
      ...darkTheme.effects.gradient,
      background: "linear-gradient(135deg, #030303, #0a0a0a)",
      primary: "linear-gradient(135deg, #00f5d4, #00fff5)",
      secondary: "linear-gradient(135deg, #fe53bb, #ff77cb)",
      subtle:
        "linear-gradient(to right, rgba(0, 245, 212, 0.3), rgba(0, 245, 212, 0))",
    },
    blur: {
      ...darkTheme.effects.blur,
      md: "8px", // Aumentar o blur para efeitos de glow
      lg: "20px",
    },
    transition: {
      ...darkTheme.effects.transition,
      default: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", // Transição mais suave
    },
  },
  shadows: {
    ...darkTheme.shadows,
    sm: "0 2px 8px rgba(0, 245, 212, 0.2)", // Glow suave
    md: "0 4px 16px rgba(0, 245, 212, 0.4)", // Glow médio
    lg: "0 8px 24px rgba(0, 245, 212, 0.5)", // Glow forte
    xl: "0 12px 30px rgba(0, 245, 212, 0.6)", // Glow muito forte
    "2xl": "0 20px 40px rgba(0, 245, 212, 0.7)", // Glow extremo
  },
  components: {
    ...darkTheme.components,
    buttons: {
      ...darkTheme.components.buttons,
      shadow: "0 0 15px rgba(0, 245, 212, 0.6)", // neon glow mais forte
      borderRadius: defaultBorderTokens.radius.md,
    },
    cards: {
      ...darkTheme.components.cards,
      background: "#0a0a0a", // mais escuro
      border: `${defaultBorderTokens.width.thin} ${defaultBorderTokens.style.solid} #222222`,
      borderRadius: defaultBorderTokens.radius.lg,
      shadow: "0 8px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 245, 212, 0.4)", // Sombra com glow mais forte
    },
    inputs: {
      ...darkTheme.components.inputs,
      borderColor: "#222222",
      focusBorderColor: "#00f5d4",
      background: "#0a0a0a",
      borderRadius: defaultBorderTokens.radius.md,
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

/**
 * Tema Cyberpunk - Um tema futurista com cores vibrantes e contrastantes
 */
export const cyberpunkTheme: DesignTokens = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    // Cores principais
    background: "#0d0221", // Roxo escuro quase preto
    backgroundAccent: "#1a0b36",
    backgroundMuted: "#240c4a",
    cardBackground: "#1a0b36",
    cardBackgroundHover: "#240c4a",

    // Cores neon vibrantes
    primary: "#f706cf", // Rosa neon
    primaryLight: "#ff46e5",
    primaryDark: "#c305a6",
    secondary: "#01ffc3", // Verde ciano neon
    secondaryLight: "#46ffcf",
    secondaryDark: "#00d6a3",

    // Cores de texto
    text: "#ffffff",
    textMuted: "#c2abff",
    textInverted: "#0d0221",

    // Cores de borda
    border: "#240c4a",
    borderHover: "#3b1277",
    borderActive: "#f706cf",

    // Cores de acento
    accent: "#fffc00", // Amarelo neon
    success: "#01ffc3", // Verde neon
    warning: "#fffc00", // Amarelo neon
    error: "#ff2a6d", // Vermelho neon
    info: "#01c5ff", // Azul neon
  },
  effects: {
    ...darkTheme.effects,
    gradient: {
      subtle: "linear-gradient(to right, rgba(13,2,33,0.8), rgba(13,2,33,0))",
      primary: "linear-gradient(135deg, #f706cf, #ff46e5)",
      secondary: "linear-gradient(135deg, #01ffc3, #46ffcf)",
      background: "linear-gradient(135deg, #0d0221, #1a0b36)",
    },
    blur: {
      ...darkTheme.effects.blur,
      md: "8px",
      lg: "20px",
    },
    transition: {
      ...darkTheme.effects.transition,
      default: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },
  shadows: {
    ...darkTheme.shadows,
    sm: "0 2px 8px rgba(247, 6, 207, 0.2)",
    md: "0 4px 16px rgba(247, 6, 207, 0.3)",
    lg: "0 8px 24px rgba(247, 6, 207, 0.4)",
    xl: "0 12px 30px rgba(247, 6, 207, 0.5)",
    "2xl": "0 20px 40px rgba(247, 6, 207, 0.6)",
  },
  components: {
    ...darkTheme.components,
    buttons: {
      ...darkTheme.components.buttons,
      shadow: "0 0 15px rgba(247, 6, 207, 0.5)",
      borderRadius: defaultBorderTokens.radius.md,
    },
    cards: {
      ...darkTheme.components.cards,
      background: "#1a0b36",
      border: `${defaultBorderTokens.width.thin} ${defaultBorderTokens.style.solid} #240c4a`,
      borderRadius: defaultBorderTokens.radius.lg,
      shadow: "0 8px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(247, 6, 207, 0.3)",
    },
    inputs: {
      ...darkTheme.components.inputs,
      borderColor: "#240c4a",
      focusBorderColor: "#f706cf",
      background: "#1a0b36",
      borderRadius: defaultBorderTokens.radius.md,
      placeholderColor: "#8b5cf6",
    },
  },
};

/**
 * Tema Pastel - Um tema suave com cores pastel harmoniosas
 */
export const pastelTheme: DesignTokens = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    // Cores principais
    background: "#f8f9fc", // Branco azulado muito suave
    backgroundAccent: "#f0f4f8",
    backgroundMuted: "#e6edf5",
    cardBackground: "#ffffff",
    cardBackgroundHover: "#f0f4f8",

    // Cores pastel
    primary: "#94c2f3", // Azul pastel
    primaryLight: "#b5d4f7",
    primaryDark: "#6a9ee6",
    secondary: "#f0a6ca", // Rosa pastel
    secondaryLight: "#f7c1da",
    secondaryDark: "#e686b2",

    // Cores de texto
    text: "#4a5568", // Cinza azulado
    textMuted: "#718096",
    textInverted: "#ffffff",

    // Cores de borda
    border: "#e6edf5",
    borderHover: "#d0deee",
    borderActive: "#94c2f3",

    // Cores de acento
    accent: "#a5b4fc", // Lavanda pastel
    success: "#9ae6b4", // Verde pastel
    warning: "#fbd38d", // Amarelo pastel
    error: "#feb2b2", // Vermelho pastel
    info: "#90cdf4", // Azul pastel
  },
  effects: {
    ...lightTheme.effects,
    gradient: {
      subtle:
        "linear-gradient(to right, rgba(248,249,252,0.8), rgba(248,249,252,0))",
      primary: "linear-gradient(135deg, #94c2f3, #b5d4f7)",
      secondary: "linear-gradient(135deg, #f0a6ca, #f7c1da)",
      background: "linear-gradient(135deg, #f8f9fc, #ffffff)",
    },
    blur: {
      ...lightTheme.effects.blur,
      md: "8px",
      lg: "16px",
    },
    transition: {
      ...lightTheme.effects.transition,
      default: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },
  shadows: {
    ...lightTheme.shadows,
    sm: "0 2px 8px rgba(148, 194, 243, 0.1)",
    md: "0 4px 16px rgba(148, 194, 243, 0.15)",
    lg: "0 8px 24px rgba(148, 194, 243, 0.2)",
    xl: "0 12px 30px rgba(148, 194, 243, 0.25)",
    "2xl": "0 20px 40px rgba(148, 194, 243, 0.3)",
  },
  components: {
    ...lightTheme.components,
    buttons: {
      ...lightTheme.components.buttons,
      shadow: "0 2px 10px rgba(148, 194, 243, 0.3)",
      borderRadius: "1rem", // Mais arredondado
    },
    cards: {
      ...lightTheme.components.cards,
      background: "#ffffff",
      border: `${defaultBorderTokens.width.thin} ${defaultBorderTokens.style.solid} #e6edf5`,
      borderRadius: "1.5rem", // Mais arredondado
      shadow: "0 8px 20px rgba(148, 194, 243, 0.15)",
    },
    inputs: {
      ...lightTheme.components.inputs,
      borderColor: "#e6edf5",
      focusBorderColor: "#94c2f3",
      background: "#ffffff",
      borderRadius: "0.75rem", // Mais arredondado
      placeholderColor: "#a0aec0",
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
  cyberpunk: cyberpunkTheme,
  pastel: pastelTheme,
};

// Tipo para identificadores de temas
export type ThemeId = keyof typeof baseThemes;
