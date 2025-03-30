// This is a patch to update the user-profile-page.tsx to use the shared theme configuration
// Import the shared theme configuration
import { ThemeType, validateTheme, getThemeConfig } from "@/lib/theme-config";

// Update the useEffect to handle theme changes
useEffect(() => {
  // Verificar parâmetros de URL para preview e tema
  const params = new URLSearchParams(window.location.search);
  const preview = params.get("preview") === "true";
  const themeParam = params.get("theme");

  setIsPreview(preview);
  if (themeParam) {
    // Validate the theme from URL
    const validTheme = validateTheme(themeParam);
    setOverrideTheme(validTheme);
  }
}, []);

// Update the themeConfig useMemo
const themeConfig = useMemo(() => {
  // Usar tema sobrescrito pela URL se estiver em modo preview
  const themeId =
    isPreview && overrideTheme ? overrideTheme : validateTheme(profile?.theme);
  return getThemeConfig(themeId);
}, [profile?.theme, isPreview, overrideTheme]);
