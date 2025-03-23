import { createClient } from "../../../supabase/server";
import { checkAdminRole } from "@/utils/admin";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard-content";

export default async function Dashboard() {
  const supabase = await createClient();

  // Verifica se o usuário está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Verifica se o usuário é admin
  const isAdmin = await checkAdminRole(supabase);

  return (
    <div className="px-4 md:px-8 mx-auto max-w-6xl space-y-8 py-8">
      {isAdmin && (
        <div className="bg-muted p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Acesso de Administrador</h3>
              <p className="text-sm text-muted-foreground">
                Você tem acesso ao painel de administração.
              </p>
            </div>
            <a
              href="/dashboard/admin"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
            >
              Acessar Painel Admin
            </a>
          </div>
        </div>
      )}

      {/* DashboardContent é um componente client-side que contém o código original */}
      <DashboardContent />
    </div>
  );
}
