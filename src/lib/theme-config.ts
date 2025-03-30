// Define theme types
export type ThemeType = 
  | "light" 
  | "dark" 
  | "system" 
  | "midnight" 
  | "nord" 
  | "sunset" 
  | "default" 
  | "purple" 
  | "minimal" 
  | "neon" 
  | "glassmorphism";

// Preview theme configurations
export const previewThemes = [
  {
    id: "light",
    gradient: "from-gray-100 to-white",
    textColor: "text-gray-900",
    textMutedColor: "text-gray-600",
    buttonStyle: "bg-gray-200 hover:bg-gray-300 text-gray-900",
    badgeGradient: "from-indigo-500 to-purple-500",
  },
  {
    id: "dark",
    gradient: "from-gray-900 to-black",
    textColor: "text-white",
    textMutedColor: "text-gray-300",
    buttonStyle: "bg-gray-800 hover:bg-gray-700 text-white",
    badgeGradient: "from-indigo-500 to-purple-500",
  },
  {
    id: "system",
    gradient: "from-gray-900 to-black",
    textColor: "text-white",
    textMutedColor: "text-gray-300",
    buttonStyle: "bg-gray-800 hover:bg-gray-700 text-white",
    badgeGradient: "from-indigo-500 to-purple-500",
  },
  {
    id: "midnight",
    gradient: "from-blue-900 via-indigo-900 to-purple-900",
    textColor: "text-white",
    textMutedColor: "text-blue-200",
    buttonStyle: "bg-indigo-800 hover:bg-indigo-700 text-white",
    badgeGradient: "from-blue-500 to-purple-500",
  },
  {
    id: "nord",
    gradient: "from-slate-800 to-slate-900",
    textColor: "text-slate-100",
    textMutedColor: "text-slate-300",
    buttonStyle: "bg-slate-700 hover:bg-slate-600 text-slate-100",
    badgeGradient: "from-cyan-500 to-blue-500",
  },
  {
    id: "sunset",
    gradient: "from-orange-900 via-red-800 to-pink-900",
    textColor: "text-orange-50",
    textMutedColor: "text-orange-200",
    buttonStyle: "bg-red-800 hover:bg-red-700 text-white",
    badgeGradient: "from-yellow-500 to-red-500",
  },
  {
    id: "default",
    gradient: "from-gray-900 via-purple-950 to-black",
    textColor: "text-white",
    textMutedColor: "text-gray-300",
    buttonStyle: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white",
    badgeGradient: "from-purple-500 to-blue-500",
  },
  {
    id: "purple",
    gradient: "from-purple-950 via-purple-900 to-black",
    textColor: "text-white",
    textMutedColor: "text-purple-200",
    buttonStyle: "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white",
    badgeGradient: "from-purple-500 to-fuchsia-500",
  },
  {
    id: "minimal",
    gradient: "from-white to-gray-50",
    textColor: "text-gray-900",
    textMutedColor: "text-gray-600",
    buttonStyle: "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200",
    badgeGradient: "from-gray-200 to-gray-300",
  },
  {
    id: "glassmorphism",
    gradient: "from-blue-500/30 to-purple-500/30",
    textColor: "text-white",
    textMutedColor: "text-gray-200",
    buttonStyle: "bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20",
    badgeGradient: "from-white/20 to-white/10",
  },
  {
    id: "neon",
    gradient: "from-black to-gray-950",
    textColor: "text-white",
    textMutedColor: "text-gray-300",
    buttonStyle: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border border-purple-500/50",
    badgeGradient: "from-purple-600 to-blue-600",
  },
];

// Theme options for the editor
export const themeOptions = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
  { value: "midnight", label: "Midnight" },
  { value: "nord", label: "Nord" },
  { value: "sunset", label: "Sunset" },
  { value: "default", label: "Default" },
  { value: "purple", label: "Purple" },
  { value: "minimal", label: "Minimal" },
  { value: "glassmorphism", label: "Glass" },
  { value: "neon", label: "Neon" },
];

// Validate and get a valid theme
export const validateTheme = (themeValue: string | undefined): ThemeType => {
  const validThemes: ThemeType[] = [
    "light", "dark", "system", "midnight", "nord", "sunset",
    "default", "purple", "minimal", "glassmorphism", "neon"
  ];
  
  const defaultTheme: ThemeType = "default";
  if (!themeValue) return defaultTheme;
  
  return validThemes.includes(themeValue as ThemeType) 
    ? (themeValue as ThemeType) 
    : defaultTheme;
};

// Get theme configuration by ID
export const getThemeConfig = (themeId: string) => {
  return previewThemes.find(theme => theme.id === themeId) || previewThemes.find(theme => theme.id === "default")!;
};
