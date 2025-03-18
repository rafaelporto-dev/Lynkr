"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  UserCircle,
  Upload,
  Save,
  Loader2,
  Camera,
  Palette,
  Type,
  Layout,
  Image as ImageIcon,
  Sparkles,
  Lock,
  Crown,
  Info,
  ArrowRight,
} from "lucide-react";
import { FormMessage } from "@/components/form-message";
import AvatarCropModal from "./avatar-crop-modal";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Free themes
const freeThemes = [
  {
    id: "default",
    name: "Default",
    color: "bg-primary",
    gradient: "from-gray-900 via-purple-950 to-black",
    cardBg: "bg-gray-900/80",
    borderColor: "border-purple-900/30",
    buttonGradient: "from-purple-600 to-blue-600",
    buttonHoverGradient: "from-purple-700 to-blue-700",
    badgeGradient: "from-purple-500 to-blue-500",
    isPremium: false,
  },
  {
    id: "purple",
    name: "Purple Neon",
    color: "bg-purple-600",
    gradient: "from-purple-950 via-purple-900 to-black",
    cardBg: "bg-purple-950/80",
    borderColor: "border-purple-500/30",
    buttonGradient: "from-purple-600 to-fuchsia-600",
    buttonHoverGradient: "from-purple-700 to-fuchsia-700",
    badgeGradient: "from-purple-500 to-fuchsia-500",
    isPremium: false,
  },
  {
    id: "blue",
    name: "Blue Neon",
    color: "bg-blue-600",
    gradient: "from-blue-950 via-blue-900 to-black",
    cardBg: "bg-blue-950/80",
    borderColor: "border-blue-500/30",
    buttonGradient: "from-blue-600 to-cyan-600",
    buttonHoverGradient: "from-blue-700 to-cyan-700",
    badgeGradient: "from-blue-500 to-cyan-500",
    isPremium: false,
  },
  {
    id: "dark",
    name: "Dark Mode",
    color: "bg-gray-800",
    gradient: "from-gray-950 to-gray-900",
    cardBg: "bg-gray-800/90",
    borderColor: "border-gray-700/50",
    buttonGradient: "from-gray-700 to-gray-800",
    buttonHoverGradient: "from-gray-600 to-gray-700",
    badgeGradient: "from-gray-600 to-gray-700",
    isPremium: false,
  },
  {
    id: "minimal",
    name: "Minimalist",
    color: "bg-white",
    gradient: "from-gray-50 to-gray-100",
    cardBg: "bg-white",
    borderColor: "border-gray-200",
    buttonGradient: "from-gray-200 to-gray-300",
    buttonHoverGradient: "from-gray-300 to-gray-400",
    badgeGradient: "from-gray-400 to-gray-500",
    textColor: "text-gray-900",
    isPremium: false,
  },
];

// Premium themes
const premiumThemes = [
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    color: "bg-yellow-500",
    gradient: "from-purple-900 via-pink-800 to-yellow-900",
    cardBg: "bg-gray-900/90",
    borderColor: "border-yellow-500/30",
    buttonGradient: "from-yellow-500 to-pink-600",
    buttonHoverGradient: "from-yellow-600 to-pink-700",
    badgeGradient: "from-yellow-500 to-pink-500",
    isPremium: true,
    animation: "animate-pulse",
  },
  {
    id: "synthwave",
    name: "Synthwave",
    color: "bg-pink-600",
    gradient: "from-indigo-900 via-purple-800 to-pink-800",
    cardBg: "bg-indigo-950/80",
    borderColor: "border-pink-500/30",
    buttonGradient: "from-indigo-600 to-pink-600",
    buttonHoverGradient: "from-indigo-700 to-pink-700",
    badgeGradient: "from-indigo-500 to-pink-500",
    isPremium: true,
    animation: "animate-pulse",
  },
  {
    id: "matrix",
    name: "Matrix",
    color: "bg-green-600",
    gradient: "from-green-950 via-green-900 to-black",
    cardBg: "bg-black/90",
    borderColor: "border-green-500/30",
    buttonGradient: "from-green-600 to-emerald-600",
    buttonHoverGradient: "from-green-700 to-emerald-700",
    badgeGradient: "from-green-500 to-emerald-500",
    isPremium: true,
    animation: "animate-pulse",
  },
  {
    id: "glassmorphism",
    name: "Glass Morphism",
    color: "bg-white/20",
    gradient: "from-blue-500/30 to-purple-500/30",
    cardBg: "bg-white/10 backdrop-blur-lg",
    borderColor: "border-white/20",
    buttonGradient: "from-white/20 to-white/10",
    buttonHoverGradient: "from-white/30 to-white/20",
    badgeGradient: "from-white/20 to-white/10",
    isPremium: true,
    animation: "animate-pulse",
  },
  {
    id: "neon",
    name: "Neon Glow",
    color: "bg-purple-600",
    gradient: "from-black to-gray-950",
    cardBg: "bg-black/80",
    borderColor: "border-purple-500/50",
    buttonGradient: "from-purple-600 to-blue-600",
    buttonHoverGradient: "from-purple-700 to-blue-700",
    badgeGradient: "from-purple-600 to-blue-600",
    isPremium: true,
    animation: "animate-pulse shadow-lg shadow-purple-500/20",
  },
];

// Combine all themes
const allThemes = [...freeThemes, ...premiumThemes];

// Button styles
const buttonStyles = [
  { id: "rounded", name: "Rounded", class: "rounded-md", isPremium: false },
  { id: "pill", name: "Pill", class: "rounded-full", isPremium: false },
  { id: "square", name: "Square", class: "rounded-none", isPremium: false },
  {
    id: "3d",
    name: "3D",
    class: "rounded-md shadow-lg transform hover:-translate-y-1",
    isPremium: true,
  },
  {
    id: "neon",
    name: "Neon",
    class: "rounded-md shadow-lg shadow-primary/50",
    isPremium: true,
  },
  {
    id: "glass",
    name: "Glass",
    class: "rounded-md bg-white/10 backdrop-blur-lg border border-white/20",
    isPremium: true,
  },
];

// Font families
const fontFamilies = [
  { id: "inter", name: "Inter", class: "font-sans", isPremium: false },
  { id: "serif", name: "Serif", class: "font-serif", isPremium: false },
  { id: "mono", name: "Monospace", class: "font-mono", isPremium: false },
  { id: "poppins", name: "Poppins", class: "font-poppins", isPremium: true },
  { id: "roboto", name: "Roboto", class: "font-roboto", isPremium: true },
  { id: "playfair", name: "Playfair", class: "font-playfair", isPremium: true },
];

// Layout options
const layoutOptions = [
  { id: "list", name: "List", icon: "list", isPremium: false },
  { id: "grid", name: "Grid", icon: "grid", isPremium: true },
  { id: "cards", name: "Cards", icon: "cards", isPremium: true },
];

// Background options
const backgroundOptions = [
  { id: "solid", name: "Solid Color", isPremium: false },
  { id: "gradient", name: "Gradient", isPremium: false },
  { id: "image", name: "Image", isPremium: true },
  { id: "video", name: "Video", isPremium: true },
];

export default function ProfileEditor() {
  const supabase = createClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [profile, setProfile] = useState<{
    id: string;
    username: string | null;
    full_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    theme: string | null;
    has_free_plan: boolean | null;
    button_style?: string | null;
    font_family?: string | null;
    layout?: string | null;
    background_type?: string | null;
    background_url?: string | null;
    custom_css?: string | null;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("theme");
  const [isPremium, setIsPremium] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    null,
  );
  const [uploadingBackground, setUploadingBackground] = useState(false);

  useEffect(() => {
    async function getProfile() {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) throw error;
          setProfile(data);

          // Check if user has premium subscription
          setIsPremium(!data.has_free_plan);

          // Set background preview if exists
          if (data.background_url) {
            setBackgroundPreview(data.background_url);
          }
        }
      } catch (error: any) {
        setMessage({ type: "error", text: error.message });
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, []);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description:
          "Custom background images are available for premium users only.",
        variant: "destructive",
      });
      return;
    }

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setBackgroundImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload the background image immediately
      uploadBackground(file);
    }
  };

  const uploadBackground = async (file: File) => {
    if (!profile) return;

    setUploadingBackground(true);
    try {
      const fileExt = file.name.split(".").pop() || "jpeg";
      const fileName = `bg-${profile.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("backgrounds")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("backgrounds")
        .getPublicUrl(fileName);

      const background_url = data.publicUrl;

      // Update profile with new background URL
      const { error } = await supabase
        .from("profiles")
        .update({
          background_url,
          background_type: "image",
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      // Update profile state with new background URL
      setProfile((prev) =>
        prev ? { ...prev, background_url, background_type: "image" } : null,
      );

      toast({
        title: "Background updated",
        description: "Your profile background has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating background",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingBackground(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleThemeChange = (value: string) => {
    const selectedTheme = allThemes.find((theme) => theme.id === value);

    if (selectedTheme?.isPremium && !isPremium) {
      toast({
        title: "Premium Theme",
        description: "This theme is available for premium users only.",
        variant: "destructive",
      });
      return;
    }

    setProfile((prev) => (prev ? { ...prev, theme: value } : null));
  };

  const handleButtonStyleChange = (value: string) => {
    const selectedStyle = buttonStyles.find((style) => style.id === value);

    if (selectedStyle?.isPremium && !isPremium) {
      toast({
        title: "Premium Feature",
        description: "This button style is available for premium users only.",
        variant: "destructive",
      });
      return;
    }

    setProfile((prev) => (prev ? { ...prev, button_style: value } : null));
  };

  const handleFontFamilyChange = (value: string) => {
    const selectedFont = fontFamilies.find((font) => font.id === value);

    if (selectedFont?.isPremium && !isPremium) {
      toast({
        title: "Premium Feature",
        description: "This font is available for premium users only.",
        variant: "destructive",
      });
      return;
    }

    setProfile((prev) => (prev ? { ...prev, font_family: value } : null));
  };

  const handleLayoutChange = (value: string) => {
    const selectedLayout = layoutOptions.find((layout) => layout.id === value);

    if (selectedLayout?.isPremium && !isPremium) {
      toast({
        title: "Premium Feature",
        description: "This layout is available for premium users only.",
        variant: "destructive",
      });
      return;
    }

    setProfile((prev) => (prev ? { ...prev, layout: value } : null));
  };

  const handleBackgroundTypeChange = (value: string) => {
    const selectedBg = backgroundOptions.find((bg) => bg.id === value);

    if (selectedBg?.isPremium && !isPremium) {
      toast({
        title: "Premium Feature",
        description:
          "This background type is available for premium users only.",
        variant: "destructive",
      });
      return;
    }

    setProfile((prev) => (prev ? { ...prev, background_type: value } : null));
  };

  const getCurrentTheme = () => {
    const themeId = profile?.theme || "default";
    return allThemes.find((theme) => theme.id === themeId) || allThemes[0];
  };

  const getCurrentButtonStyle = () => {
    const styleId = profile?.button_style || "rounded";
    return (
      buttonStyles.find((style) => style.id === styleId) || buttonStyles[0]
    );
  };

  const getCurrentFontFamily = () => {
    const fontId = profile?.font_family || "inter";
    return fontFamilies.find((font) => font.id === fontId) || fontFamilies[0];
  };

  const getCurrentLayout = () => {
    const layoutId = profile?.layout || "list";
    return (
      layoutOptions.find((layout) => layout.id === layoutId) || layoutOptions[0]
    );
  };

  const getCurrentBackgroundType = () => {
    const bgId = profile?.background_type || "gradient";
    return (
      backgroundOptions.find((bg) => bg.id === bgId) || backgroundOptions[0]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!profile) throw new Error("No profile data");

      // Update apenas configurações de personalização
      const { error } = await supabase
        .from("profiles")
        .update({
          theme: profile.theme,
          button_style: profile.button_style || "rounded",
          font_family: profile.font_family || "inter",
          layout: profile.layout || "list",
          background_type: profile.background_type || "gradient",
          custom_css: profile.custom_css,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;
      setMessage({ type: "success", text: "Profile customization updated successfully!" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const renderPremiumBadge = () => (
    <Badge
      variant="outline"
      className="ml-2 bg-gradient-to-r from-amber-500 to-yellow-300 text-black border-amber-500 text-xs"
    >
      <Crown className="h-3 w-3 mr-1" /> PREMIUM
    </Badge>
  );

  if (!profile) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Customize Profile</CardTitle>
        <CardDescription>
          Personalize the appearance of your profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <FormMessage
              message={{
                [message.type]: message.text,
              }}
            />
          )}

          {!isPremium && (
            <Alert className="bg-amber-500/10 border-amber-500/30 mb-6">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-amber-500 mt-0.5" />
                <AlertDescription className="text-sm">
                  <span className="font-medium">
                    You're on the Free plan.
                  </span>{" "}
                  Upgrade to Premium to unlock advanced customization
                  options, including premium themes, custom backgrounds,
                  advanced button styles, and more.
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black border-amber-500 hover:from-amber-600 hover:to-yellow-400"
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade to Premium
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Customization Tabs */}
          <Tabs
            defaultValue="theme"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Theme</span>
              </TabsTrigger>
              <TabsTrigger
                value="typography"
                className="flex items-center gap-2"
              >
                <Type className="h-4 w-4" />
                <span>Typography</span>
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                <span>Layout</span>
              </TabsTrigger>
              <TabsTrigger
                value="background"
                className="flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                <span>Background</span>
              </TabsTrigger>
            </TabsList>

            {/* Theme Tab */}
            <TabsContent value="theme" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-medium">Theme Selection</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Free Themes */}
                    <div className="col-span-full mb-2">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Free Themes
                      </h4>
                    </div>
                    {freeThemes.map((theme) => (
                      <div
                        key={theme.id}
                        className={cn(
                          "border rounded-lg p-3 cursor-pointer transition-all",
                          profile.theme === theme.id
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-muted hover:border-primary/50",
                        )}
                        onClick={() => handleThemeChange(theme.id)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-4 h-4 rounded-full ${theme.color}`}
                          />
                          <span className="font-medium">{theme.name}</span>
                        </div>
                        <div
                          className={`w-full h-16 rounded-md bg-gradient-to-br ${theme.gradient}`}
                        ></div>
                      </div>
                    ))}

                    {/* Premium Themes */}
                    <div className="col-span-full mt-4 mb-2">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                        Premium Themes {renderPremiumBadge()}
                      </h4>
                    </div>
                    {premiumThemes.map((theme) => (
                      <div
                        key={theme.id}
                        className={cn(
                          "border rounded-lg p-3 cursor-pointer transition-all relative overflow-hidden",
                          profile.theme === theme.id
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-muted hover:border-primary/50",
                          !isPremium && "opacity-75",
                        )}
                        onClick={() => handleThemeChange(theme.id)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-4 h-4 rounded-full ${theme.color}`}
                          />
                          <span className="font-medium">{theme.name}</span>
                          <Sparkles className="h-3 w-3 text-amber-500 ml-auto" />
                        </div>
                        <div
                          className={`w-full h-16 rounded-md bg-gradient-to-br ${theme.gradient} ${theme.animation || ""}`}
                        ></div>

                        {!isPremium && (
                          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                            <div className="bg-black/80 text-white rounded-full p-1.5">
                              <Lock className="h-5 w-5" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="button-style" className="mb-2 block">
                      Button Style
                    </Label>
                    <RadioGroup
                      value={profile.button_style || "rounded"}
                      onValueChange={handleButtonStyleChange}
                      className="grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                      {buttonStyles.map((style) => (
                        <div key={style.id} className="relative">
                          <RadioGroupItem
                            value={style.id}
                            id={`button-style-${style.id}`}
                            className="sr-only"
                            disabled={style.isPremium && !isPremium}
                          />
                          <Label
                            htmlFor={`button-style-${style.id}`}
                            className={cn(
                              "flex flex-col items-center gap-2 rounded-lg border border-muted p-3 hover:border-primary/50 cursor-pointer",
                              profile.button_style === style.id &&
                                "border-primary ring-2 ring-primary/20",
                              style.isPremium && !isPremium && "opacity-50",
                            )}
                          >
                            <div
                              className={cn(
                                "w-full py-2 px-4 text-center text-sm",
                                style.class,
                                "bg-gradient-to-r from-purple-600 to-blue-600 text-white",
                              )}
                            >
                              {style.name}
                            </div>
                            <span className="text-xs">{style.name}</span>
                            {style.isPremium && (
                              <Sparkles className="h-3 w-3 text-amber-500" />
                            )}
                          </Label>

                          {style.isPremium && !isPremium && (
                            <div className="absolute top-2 right-2 bg-black/80 text-white rounded-full p-1">
                              <Lock className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden mt-6">
                  <div className="text-sm font-medium px-4 py-2 bg-muted">
                    Theme Preview
                  </div>
                  <div
                    className={`w-full h-48 bg-gradient-to-br ${getCurrentTheme().gradient} p-4 relative`}
                  >
                    <div
                      className={`absolute bottom-4 left-4 right-4 ${getCurrentTheme().cardBg} rounded-lg p-3 border ${getCurrentTheme().borderColor} shadow-lg`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center text-white font-bold">
                          {profile.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {profile.username || "Username"}
                          </div>
                          <div className="text-xs text-gray-300">
                            {profile.bio?.substring(0, 30) || "Bio description"}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <div
                          className={cn(
                            `px-3 py-1.5 text-white text-xs font-medium`,
                            `bg-gradient-to-r ${getCurrentTheme().buttonGradient}`,
                            getCurrentButtonStyle().class,
                          )}
                        >
                          Link 1
                        </div>
                        <div
                          className={cn(
                            `px-3 py-1.5 text-white text-xs font-medium`,
                            `bg-gradient-to-r ${getCurrentTheme().buttonGradient}`,
                            getCurrentButtonStyle().class,
                          )}
                        >
                          Link 2
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="font-family" className="mb-2 block">
                    Font Family
                  </Label>
                  <RadioGroup
                    value={profile.font_family || "inter"}
                    onValueChange={handleFontFamilyChange}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  >
                    {fontFamilies.map((font) => (
                      <div key={font.id} className="relative">
                        <RadioGroupItem
                          value={font.id}
                          id={`font-${font.id}`}
                          className="sr-only"
                          disabled={font.isPremium && !isPremium}
                        />
                        <Label
                          htmlFor={`font-${font.id}`}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-lg border border-muted p-3 hover:border-primary/50 cursor-pointer",
                            profile.font_family === font.id &&
                              "border-primary ring-2 ring-primary/20",
                            font.isPremium && !isPremium && "opacity-50",
                          )}
                        >
                          <div
                            className={cn(
                              "w-full py-2 px-4 text-center",
                              font.class,
                            )}
                          >
                            {font.name}
                          </div>
                          <span className="text-xs">{font.name}</span>
                          {font.isPremium && (
                            <Sparkles className="h-3 w-3 text-amber-500" />
                          )}
                        </Label>

                        {font.isPremium && !isPremium && (
                          <div className="absolute top-2 right-2 bg-black/80 text-white rounded-full p-1">
                            <Lock className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2 mt-6">
                  <Label htmlFor="font-size">Font Size</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-xs">Small</span>
                    <Slider
                      id="font-size"
                      defaultValue={[16]}
                      max={24}
                      min={12}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs">Large</span>
                  </div>
                </div>

                {isPremium && (
                  <div className="space-y-2 mt-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="custom-css">
                        Custom CSS {renderPremiumBadge()}
                      </Label>
                    </div>
                    <Textarea
                      id="custom-css"
                      name="custom_css"
                      value={profile.custom_css || ""}
                      onChange={handleInputChange}
                      placeholder="Add your custom CSS here"
                      rows={6}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Advanced: Add custom CSS to further customize your profile
                      appearance
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Layout Tab */}
            <TabsContent value="layout" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="layout" className="mb-2 block">
                    Layout Style
                  </Label>
                  <RadioGroup
                    value={profile.layout || "list"}
                    onValueChange={handleLayoutChange}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {layoutOptions.map((layout) => (
                      <div key={layout.id} className="relative">
                        <RadioGroupItem
                          value={layout.id}
                          id={`layout-${layout.id}`}
                          className="sr-only"
                          disabled={layout.isPremium && !isPremium}
                        />
                        <Label
                          htmlFor={`layout-${layout.id}`}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-lg border border-muted p-4 hover:border-primary/50 cursor-pointer",
                            profile.layout === layout.id &&
                              "border-primary ring-2 ring-primary/20",
                            layout.isPremium && !isPremium && "opacity-50",
                          )}
                        >
                          <div className="w-full h-24 bg-muted rounded-md flex items-center justify-center">
                            {layout.id === "list" && (
                              <div className="w-3/4 space-y-2">
                                <div className="h-4 bg-primary/20 rounded-md w-full"></div>
                                <div className="h-4 bg-primary/20 rounded-md w-full"></div>
                                <div className="h-4 bg-primary/20 rounded-md w-full"></div>
                              </div>
                            )}
                            {layout.id === "grid" && (
                              <div className="grid grid-cols-2 gap-2 w-3/4">
                                <div className="h-8 bg-primary/20 rounded-md"></div>
                                <div className="h-8 bg-primary/20 rounded-md"></div>
                                <div className="h-8 bg-primary/20 rounded-md"></div>
                                <div className="h-8 bg-primary/20 rounded-md"></div>
                              </div>
                            )}
                            {layout.id === "cards" && (
                              <div className="grid grid-cols-2 gap-2 w-3/4">
                                <div className="h-10 bg-primary/20 rounded-md flex items-center justify-center">
                                  <div className="w-3/4 h-4 bg-primary/40 rounded-sm"></div>
                                </div>
                                <div className="h-10 bg-primary/20 rounded-md flex items-center justify-center">
                                  <div className="w-3/4 h-4 bg-primary/40 rounded-sm"></div>
                                </div>
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-medium">
                            {layout.name}
                          </span>
                          {layout.isPremium && (
                            <Sparkles className="h-3 w-3 text-amber-500" />
                          )}
                        </Label>

                        {layout.isPremium && !isPremium && (
                          <div className="absolute top-2 right-2 bg-black/80 text-white rounded-full p-1">
                            <Lock className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {isPremium && (
                  <div className="space-y-2 mt-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sections">
                        Organize Links by Sections {renderPremiumBadge()}
                      </Label>
                      <Switch id="sections" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Group your links into different sections for better
                      organization
                    </p>
                  </div>
                )}

                {isPremium && (
                  <div className="space-y-2 mt-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-dark-mode">
                        Auto Dark/Light Mode {renderPremiumBadge()}
                      </Label>
                      <Switch id="auto-dark-mode" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Automatically switch between dark and light mode based on
                      visitor's preferences
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Background Tab */}
            <TabsContent value="background" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="background-type" className="mb-2 block">
                    Background Type
                  </Label>
                  <RadioGroup
                    value={profile.background_type || "gradient"}
                    onValueChange={handleBackgroundTypeChange}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    {backgroundOptions.map((bg) => (
                      <div key={bg.id} className="relative">
                        <RadioGroupItem
                          value={bg.id}
                          id={`bg-${bg.id}`}
                          className="sr-only"
                          disabled={bg.isPremium && !isPremium}
                        />
                        <Label
                          htmlFor={`bg-${bg.id}`}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-lg border border-muted p-3 hover:border-primary/50 cursor-pointer",
                            profile.background_type === bg.id &&
                              "border-primary ring-2 ring-primary/20",
                            bg.isPremium && !isPremium && "opacity-50",
                          )}
                        >
                          <div className="w-full h-16 rounded-md flex items-center justify-center">
                            {bg.id === "solid" && (
                              <div className="w-full h-full bg-primary rounded-md"></div>
                            )}
                            {bg.id === "gradient" && (
                              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 rounded-md"></div>
                            )}
                            {bg.id === "image" && (
                              <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            {bg.id === "video" && (
                              <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-muted-foreground"
                                >
                                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                              </div>
                            )}
                          </div>
                          <span className="text-sm">{bg.name}</span>
                          {bg.isPremium && (
                            <Sparkles className="h-3 w-3 text-amber-500" />
                          )}
                        </Label>

                        {bg.isPremium && !isPremium && (
                          <div className="absolute top-2 right-2 bg-black/80 text-white rounded-full p-1">
                            <Lock className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {profile.background_type === "solid" && (
                  <div className="space-y-2 mt-6">
                    <Label htmlFor="background-color">Background Color</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        "bg-purple-600",
                        "bg-blue-600",
                        "bg-pink-600",
                        "bg-green-600",
                        "bg-yellow-600",
                        "bg-gray-800",
                      ].map((color, index) => (
                        <div
                          key={index}
                          className={`h-8 ${color} rounded-md cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary/50`}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}

                {profile.background_type === "gradient" && (
                  <div className="space-y-2 mt-6">
                    <Label htmlFor="gradient-preset">Gradient Preset</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        "bg-gradient-to-br from-purple-600 to-blue-600",
                        "bg-gradient-to-br from-pink-500 to-orange-400",
                        "bg-gradient-to-br from-green-500 to-blue-500",
                        "bg-gradient-to-br from-yellow-400 to-red-500",
                        "bg-gradient-to-br from-indigo-500 to-purple-500",
                        "bg-gradient-to-br from-gray-700 to-gray-900",
                      ].map((gradient, index) => (
                        <div
                          key={index}
                          className={`h-16 ${gradient} rounded-md cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary/50`}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}

                {profile.background_type === "image" && (
                  <div className="space-y-4 mt-6">
                    <div className="border rounded-lg p-4">
                      {backgroundPreview ? (
                        <div className="relative w-full h-40 rounded-md overflow-hidden">
                          <img
                            src={backgroundPreview}
                            alt="Background preview"
                            className="w-full h-full object-cover"
                          />
                          {uploadingBackground && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="h-8 w-8 animate-spin text-white" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-muted rounded-md flex flex-col items-center justify-center">
                          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No background image selected
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex justify-center">
                        <Label
                          htmlFor="background-image"
                          className={cn(
                            "relative cursor-pointer px-4 py-2 rounded-md text-sm flex items-center gap-2",
                            isPremium
                              ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                              : "bg-muted text-muted-foreground cursor-not-allowed",
                          )}
                        >
                          <Upload size={16} />
                          <span>Upload Background Image</span>
                          <Input
                            id="background-image"
                            type="file"
                            accept="image/*"
                            onChange={handleBackgroundChange}
                            className="sr-only"
                            disabled={!isPremium || uploadingBackground}
                          />
                        </Label>
                      </div>

                      {!isPremium && (
                        <p className="text-xs text-muted-foreground text-center mt-2">
                          Custom background images are available for premium
                          users only
                        </p>
                      )}
                    </div>

                    {isPremium && (
                      <div className="space-y-2">
                        <Label htmlFor="image-overlay">
                          Image Overlay Opacity
                        </Label>
                        <div className="flex items-center gap-4">
                          <span className="text-xs">None</span>
                          <Slider
                            id="image-overlay"
                            defaultValue={[30]}
                            max={80}
                            min={0}
                            step={5}
                            className="flex-1"
                          />
                          <span className="text-xs">Dark</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {profile.background_type === "video" && isPremium && (
                  <div className="space-y-2 mt-6">
                    <Label htmlFor="video-url">
                      Video URL (YouTube or MP4)
                    </Label>
                    <Input
                      id="video-url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter a YouTube video URL or direct link to an MP4 file
                    </p>
                  </div>
                )}

                {profile.background_type === "video" && !isPremium && (
                  <div className="mt-6">
                    <Alert className="bg-muted">
                      <AlertDescription className="text-sm flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Video backgrounds are available for premium users only
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <CardFooter className="px-0 pt-4">
            <Button type="submit" disabled={loading} className="ml-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Customization
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
