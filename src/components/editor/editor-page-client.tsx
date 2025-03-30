"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import EditorPanel from "./editor-panel";
import { ThemeId } from "@/lib/themes/base-themes";
import { ThemeManager } from "@/lib/themes/theme-manager";
import PreviewPanel from "./preview-panel";

// Tipos para propriedades do perfil e links
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

type EditorPageClientProps = {
  profile: Profile | null;
  links: Link[];
  interactiveGroups: InteractiveGroup[];
  isAdmin: boolean;
};

export default function EditorPageClient({
  profile: initialProfile,
  links: initialLinks,
  interactiveGroups: initialInteractiveGroups,
  isAdmin,
}: EditorPageClientProps) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [interactiveGroups, setInteractiveGroups] = useState<
    InteractiveGroup[]
  >(initialInteractiveGroups);
  const [saveStatus, setSaveStatus] = useState<
    "saved" | "saving" | "error" | "unsaved"
  >("saved");
  const [deviceType, setDeviceType] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  // Initialize theme from profile data using the ThemeManager
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    return ThemeManager.validateThemeId(profile?.theme);
  });

  const supabase = createClient();
  const { toast } = useToast();

  // Configurar listeners em tempo real
  useEffect(() => {
    // Listener para mudanças no perfil
    const profileChannel = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${profile?.id}`,
        },
        (payload) => {
          console.log("Perfil atualizado:", payload);
          const updatedProfile = payload.new as Profile;
          setProfile(updatedProfile);

          // Update theme if it changed
          if (updatedProfile.theme) {
            setThemeId(ThemeManager.validateThemeId(updatedProfile.theme));
          }
        }
      )
      .subscribe();

    // Listener para mudanças nos links
    const linksChannel = supabase
      .channel("links-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "links",
          filter: `user_id=eq.${profile?.id}`,
        },
        () => {
          // Recarregar links ao detectar mudanças
          fetchLinks();
        }
      )
      .subscribe();

    // Listener para mudanças nos grupos interativos
    const interactiveChannel = supabase
      .channel("interactive-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "interactive_groups",
          filter: `user_id=eq.${profile?.id}`,
        },
        () => {
          // Recarregar grupos interativos ao detectar mudanças
          fetchInteractiveGroups();
        }
      )
      .subscribe();

    // Limpeza ao desmontar componente
    return () => {
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(linksChannel);
      supabase.removeChannel(interactiveChannel);
    };
  }, [profile?.id, supabase]);

  // Função para buscar links atualizados
  const fetchLinks = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", profile.id)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setLinks(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar links:", error.message);
    }
  };

  // Função para buscar grupos interativos atualizados
  const fetchInteractiveGroups = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from("interactive_groups")
        .select("*")
        .eq("user_id", profile.id)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setInteractiveGroups(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar grupos interativos:", error.message);
    }
  };

  // Função para atualizar o estado local do perfil (sem salvar no banco)
  const updateProfileState = (updatedProfile: Partial<Profile>) => {
    if (!profile?.id) return;

    // If theme is being updated, also update the global theme state
    if (updatedProfile.theme) {
      setThemeId(ThemeManager.validateThemeId(updatedProfile.theme));
    }

    // Atualizar o estado local imediatamente para refletir na visualização
    setProfile((prev) => (prev ? { ...prev, ...updatedProfile } : null));

    // Marcar que há alterações não salvas
    setSaveStatus("unsaved");
  };

  // Função para salvar o perfil no banco de dados
  const saveProfile = async () => {
    if (!profile?.id) return;

    setSaveStatus("saving");
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;
      setSaveStatus("saved");
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error.message);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações no perfil.",
        variant: "destructive",
      });
      setSaveStatus("error");
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={50} minSize={30}>
          <EditorPanel
            profile={profile}
            links={links}
            interactiveGroups={interactiveGroups}
            onProfileUpdate={updateProfileState}
            onSaveProfile={saveProfile}
            onLinksUpdate={fetchLinks}
            onInteractiveGroupsUpdate={fetchInteractiveGroups}
            saveStatus={saveStatus}
            themeId={themeId}
            onThemeChange={setThemeId}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} minSize={30}>
          <PreviewPanel
            profile={profile}
            links={links}
            interactiveGroups={interactiveGroups}
            deviceType={deviceType}
            onDeviceTypeChange={setDeviceType}
            themeId={themeId}
            onThemeChange={setThemeId}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
