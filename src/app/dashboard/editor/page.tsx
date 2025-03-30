import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { checkAdminRole } from "@/utils/admin";
import EditorPageClient from "@/components/editor/editor-page-client";

// Página do editor em tempo real
export default async function EditorPage() {
  const supabase = await createClient();

  // Verifica se o usuário está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Verifica se o usuário é admin (opcional, dependendo dos requisitos)
  const isAdmin = await checkAdminRole(supabase);

  // Busca o perfil do usuário para configurar o editor
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Busca os links do usuário
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("display_order", { ascending: true });

  // Busca os grupos interativos do usuário
  const { data: interactiveGroups } = await supabase
    .from("interactive_groups")
    .select("*")
    .eq("user_id", user.id)
    .order("display_order", { ascending: true });

  return (
    <div className="h-full overflow-hidden">
      <EditorPageClient
        profile={profile || null}
        links={links || []}
        interactiveGroups={interactiveGroups || []}
        isAdmin={isAdmin}
      />
    </div>
  );
}
