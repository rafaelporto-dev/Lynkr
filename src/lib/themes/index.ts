/**
 * Sistema de Temas - Ponto de entrada centralizado
 *
 * Este arquivo exporta todos os componentes, tipos e funções do sistema de temas
 * para facilitar importações e manter o código organizado.
 */

// Exportar tokens de design
export * from "./tokens";

// Exportar temas base
export * from "./base-themes";

// Exportar gerenciador de temas
export * from "./theme-manager";

// Exportar provider de tema
export { default as ThemeProvider, useTheme } from "./theme-provider";

/**
 * Guia de Uso Rápido
 *
 * 1. Importar o ThemeProvider e envolver a aplicação:
 *    ```tsx
 *    import { ThemeProvider } from '@/lib/themes';
 *
 *    function App({ children }) {
 *      return (
 *        <ThemeProvider defaultTheme="system">
 *          {children}
 *        </ThemeProvider>
 *      );
 *    }
 *    ```
 *
 * 2. Usar o hook useTheme para acessar e manipular o tema:
 *    ```tsx
 *    import { useTheme } from '@/lib/themes';
 *
 *    function MyComponent() {
 *      const { themeId, setThemeId, isDark } = useTheme();
 *
 *      return (
 *        <div>
 *          <p>Tema atual: {themeId}</p>
 *          <button onClick={() => setThemeId('dark')}>
 *            Mudar para tema escuro
 *          </button>
 *        </div>
 *      );
 *    }
 *    ```
 *
 * 3. Usar o ThemeManager para operações mais avançadas:
 *    ```tsx
 *    import { ThemeManager } from '@/lib/themes';
 *
 *    // Validar um ID de tema
 *    const validThemeId = ThemeManager.validateThemeId(someThemeId);
 *
 *    // Obter presets disponíveis
 *    const lightThemes = ThemeManager.getAvailablePresets({ category: 'light' });
 *
 *    // Obter tokens para um tema específico
 *    const themeTokens = ThemeManager.getThemeTokens('neon');
 *    ```
 */
