"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor, Tablet, RefreshCw } from "lucide-react";
import InMemoryPreview from "./in-memory-preview";

// Tipos compartilhados
type Profile = {
  id: string;
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  theme?: string;
  button_style?: string;
  font_family?: string;
  layout?: string;
  background_type?: string;
  background_url?: string | null;
  custom_css?: string | null;
  has_free_plan: boolean;
  has_custom_domain?: boolean;
};

type Link = {
  id: string;
  title: string;
  url: string;
  icon?: string;
  display_order: number;
  active: boolean;
  thumbnail_url?: string | null;
  content_type?: string;
  embed_data?: any;
  is_adult_content?: boolean;
  is_interactive?: boolean;
  interactive_type?: string;
  interactive_content?: any;
  has_custom_thumbnail?: boolean;
};

type InteractiveGroup = {
  id: string;
  title: string;
  type: string;
  display_order: number;
  active: boolean;
};

type DeviceType = "mobile" | "tablet" | "desktop";

type PreviewPanelProps = {
  profile: Profile | null;
  links: Link[];
  interactiveGroups: InteractiveGroup[];
  deviceType: DeviceType;
  onDeviceTypeChange: (type: DeviceType) => void;
  theme: "light" | "dark" | "system" | "midnight" | "nord" | "sunset";
};

export default function PreviewPanel({
  profile,
  links,
  interactiveGroups,
  deviceType,
  onDeviceTypeChange,
  theme,
}: PreviewPanelProps) {
  // Estado para controlar o refresh manual (apenas visual)
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Função para simular atualização manual (apenas visual)
  const refreshPreview = () => {
    setIsRefreshing(true);
    // Simular um breve tempo de carregamento para feedback visual
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Determina as dimensões e classes do dispositivo
  const getDeviceClass = () => {
    switch (deviceType) {
      case "mobile":
        return "max-w-[375px] h-[667px] mx-auto shadow-lg";
      case "tablet":
        return "max-w-[768px] h-[1024px] mx-auto shadow-lg";
      case "desktop":
        return "w-full h-full";
      default:
        return "w-full h-full";
    }
  };

  // Renderiza ícones para selecionar o tipo de dispositivo
  const DeviceSelector = () => (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onDeviceTypeChange("mobile")}
        className={`p-2 rounded-md ${
          deviceType === "mobile"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
        title="Visualize as mobile"
      >
        <Smartphone className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onDeviceTypeChange("tablet")}
        className={`p-2 rounded-md ${
          deviceType === "tablet"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
        title="Visualize as tablet"
      >
        <Tablet className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onDeviceTypeChange("desktop")}
        className={`p-2 rounded-md ${
          deviceType === "desktop"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
        title="Visualize as desktop"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );

  // Theme selector moved to editor panel

  return (
    <div className="h-full flex flex-col bg-secondary/20 p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Preview</h2>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={refreshPreview}
            disabled={isRefreshing || !profile?.username}
            title="Refresh preview"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
          {/* Theme selector moved to editor panel */}
          <DeviceSelector />
        </div>
      </div>

      <div className="flex-1 bg-background rounded-lg overflow-hidden flex items-center justify-center p-4 relative">
        {!profile?.username ? (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <h3 className="text-xl font-semibold mb-2">No profile selected</h3>
            <p className="text-muted-foreground">
              Set your username in the Profile tab to view your page
            </p>
          </div>
        ) : (
          <div
            className={`bg-background overflow-hidden rounded-lg ${getDeviceClass()} relative`}
          >
            {isRefreshing && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <RefreshCw className="h-8 w-8 text-primary animate-spin" />
              </div>
            )}

            {/* In-memory preview component that updates instantly */}
            <div className="w-full h-full overflow-hidden">
              <InMemoryPreview
                profile={profile}
                links={links}
                interactiveGroups={interactiveGroups}
                theme={theme}
                deviceType={deviceType}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
