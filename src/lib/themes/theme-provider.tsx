"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { DesignTokens } from "./tokens";
import { ThemeId, baseThemes } from "./base-themes";
import { ThemeManager } from "./theme-manager";

// Contexto para compartilhar estado e funções do tema
interface ThemeContextType {
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  themeTokens: DesignTokens;
  isDark: boolean;
  isSystem: boolean;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  themeId: "system",
  setThemeId: () => {},
  themeTokens: baseThemes.light,
  isDark: false,
  isSystem: true,
  isLoading: true,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  defaultTheme?: ThemeId;
  children: React.ReactNode;
}

export default function ThemeProvider({
  defaultTheme = "system",
  children,
}: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<ThemeId>(defaultTheme);
  const [resolvedThemeId, setResolvedThemeId] = useState<ThemeId>("light");
  const [isLoading, setIsLoading] = useState(true);

  // Determinar o tema real com base no tema do sistema se necessário
  useEffect(() => {
    if (themeId === "system") {
      // Verificar preferência do sistema
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setResolvedThemeId(prefersDark ? "dark" : "light");

      // Adicionar listener para mudanças na preferência do sistema
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setResolvedThemeId(e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      setResolvedThemeId(themeId);
    }
  }, [themeId]);

  // Recuperar o tema do usuário ao carregar
  useEffect(() => {
    const loadUserTheme = async () => {
      try {
        // Primeiro verificar se há parâmetro de tema na URL (para preview)
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const themeParam = params.get("theme") as ThemeId | null;

          if (themeParam && Object.keys(baseThemes).includes(themeParam)) {
            setThemeId(themeParam);
            setIsLoading(false);
            return;
          }
        }

        // Verificar tema no localStorage para evitar flash
        const storedTheme = localStorage.getItem("userTheme") as ThemeId | null;

        if (storedTheme && Object.keys(baseThemes).includes(storedTheme)) {
          setThemeId(storedTheme);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar tema do usuário:", error);
        setIsLoading(false);
      }
    };

    loadUserTheme();
  }, []);

  // Aplicar variáveis CSS quando o tema mudar
  useEffect(() => {
    if (isLoading) return;

    const theme = ThemeManager.getThemeTokens(resolvedThemeId);

    // Aplicar variáveis de cor
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });

    // Atualizar classe do documento para temas dark/light
    const isDark = [
      "dark",
      "midnight",
      "nord",
      "neon",
      "sunset",
      "glass",
    ].includes(resolvedThemeId);

    if (isDark) {
      document.documentElement.classList.add("dark-theme");
      document.documentElement.classList.remove("light-theme");
    } else {
      document.documentElement.classList.add("light-theme");
      document.documentElement.classList.remove("dark-theme");
    }

    // Salvar no localStorage
    if (themeId !== "system") {
      localStorage.setItem("userTheme", themeId);
    }
  }, [resolvedThemeId, isLoading, themeId]);

  // Salvar tema no banco de dados quando alterado
  const handleThemeChange = (id: ThemeId) => {
    setThemeId(id);

    // Salvar alteração no banco de dados (assíncrono)
    ThemeManager.saveUserTheme(id).catch((error) => {
      console.error("Erro ao salvar tema:", error);
    });
  };

  const isDark = [
    "dark",
    "midnight",
    "nord",
    "neon",
    "sunset",
    "glass",
  ].includes(resolvedThemeId);
  const currentTokens = ThemeManager.getThemeTokens(resolvedThemeId);

  const contextValue: ThemeContextType = {
    themeId,
    setThemeId: handleThemeChange,
    themeTokens: currentTokens,
    isDark,
    isSystem: themeId === "system",
    isLoading,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
