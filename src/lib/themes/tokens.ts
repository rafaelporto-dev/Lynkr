/**
 * Design Tokens para o sistema de temas
 *
 * Este arquivo define os tokens de design usados para construir os temas
 * Esses tokens são a base para criar temas consistentes e facilmente extensíveis
 */

// Tipos para tokens de cores
export type ColorTokens = {
  // Brand colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // Background colors
  background: string;
  backgroundAccent: string;
  backgroundMuted: string;
  cardBackground: string;
  cardBackgroundHover: string;

  // Text colors
  text: string;
  textMuted: string;
  textInverted: string;

  // Button colors
  buttonBackground: string;
  buttonBackgroundHover: string;
  buttonText: string;

  // Border colors
  border: string;
  borderHover: string;
  borderActive: string;

  // Accent colors
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
};

// Tokens para tipografia
export type TypographyTokens = {
  fontFamily: {
    base: string;
    heading: string;
    mono: string;
  };
  fontWeight: {
    regular: number;
    medium: number;
    bold: number;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
  };
};

// Tokens para espaçamento
export type SpacingTokens = {
  px: string;
  0: string;
  0.5: string;
  1: string;
  1.5: string;
  2: string;
  2.5: string;
  3: string;
  3.5: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
  32: string;
  40: string;
  48: string;
  56: string;
  64: string;
};

// Tokens para bordas e arredondamentos
export type BorderTokens = {
  radius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    full: string;
  };
  width: {
    none: string;
    thin: string;
    base: string;
    thick: string;
  };
  style: {
    solid: string;
    dashed: string;
    dotted: string;
  };
};

// Tokens para sombras
export type ShadowTokens = {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  inner: string;
};

// Tokens para efeitos visuais
export type EffectTokens = {
  transition: {
    default: string;
    fast: string;
    slow: string;
  };
  opacity: {
    0: string;
    5: string;
    10: string;
    20: string;
    30: string;
    40: string;
    50: string;
    60: string;
    70: string;
    80: string;
    90: string;
    100: string;
  };
  blur: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  gradient: {
    subtle: string;
    primary: string;
    secondary: string;
    background: string;
  };
};

// Tokens para elementos específicos da UI
export type ComponentTokens = {
  buttons: {
    borderRadius: string;
    fontWeight: number;
    padding: {
      sm: string;
      md: string;
      lg: string;
    };
    shadow: string;
  };
  inputs: {
    borderRadius: string;
    borderColor: string;
    focusBorderColor: string;
    errorBorderColor: string;
    background: string;
    placeholderColor: string;
  };
  cards: {
    borderRadius: string;
    padding: string;
    shadow: string;
    background: string;
    border: string;
  };
};

// Todos os tokens combinados formam um conjunto completo de design tokens
export type DesignTokens = {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borders: BorderTokens;
  shadows: ShadowTokens;
  effects: EffectTokens;
  components: ComponentTokens;
};

// Valores padrão para espaçamento que podem ser compartilhados entre temas
export const defaultSpacingTokens: SpacingTokens = {
  px: "1px",
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
  40: "10rem",
  48: "12rem",
  56: "14rem",
  64: "16rem",
};

// Valores padrão para bordas que podem ser compartilhados entre temas
export const defaultBorderTokens: BorderTokens = {
  radius: {
    none: "0",
    sm: "0.125rem",
    md: "0.25rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    full: "9999px",
  },
  width: {
    none: "0",
    thin: "1px",
    base: "2px",
    thick: "4px",
  },
  style: {
    solid: "solid",
    dashed: "dashed",
    dotted: "dotted",
  },
};

// Valores padrão para tipografia que podem ser compartilhados entre temas
export const defaultTypographyTokens: TypographyTokens = {
  fontFamily: {
    base: "var(--font-sans)",
    heading: "var(--font-sans)",
    mono: "var(--font-mono)",
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },
  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
    loose: "2",
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
  },
};

// Valores padrão para sombras que podem ser compartilhados entre temas
export const defaultShadowTokens: ShadowTokens = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
};

// Valores padrão para efeitos que podem ser compartilhados entre temas
export const defaultEffectTokens: EffectTokens = {
  transition: {
    default: "all 0.3s ease",
    fast: "all 0.15s ease",
    slow: "all 0.5s ease",
  },
  opacity: {
    0: "0",
    5: "0.05",
    10: "0.1",
    20: "0.2",
    30: "0.3",
    40: "0.4",
    50: "0.5",
    60: "0.6",
    70: "0.7",
    80: "0.8",
    90: "0.9",
    100: "1",
  },
  blur: {
    none: "0",
    sm: "4px",
    md: "8px",
    lg: "16px",
    xl: "24px",
  },
  gradient: {
    subtle:
      "linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0))",
    primary:
      "linear-gradient(to right, var(--color-primary), var(--color-primary-light))",
    secondary:
      "linear-gradient(to right, var(--color-secondary), var(--color-secondary-light))",
    background:
      "linear-gradient(to bottom, var(--color-background), var(--color-background-accent))",
  },
};
