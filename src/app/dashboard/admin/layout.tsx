import { createClient } from "../../../../supabase/server";
import { checkAdminRole } from "@/utils/admin";
import { redirect } from "next/navigation";
import {
  Users,
  LinkIcon,
  Home,
  CreditCard,
  BarChart4,
  Globe,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const isAdmin = await checkAdminRole(supabase);

  // Verifica se o usuário é administrador
  if (!isAdmin) {
    // Se não for admin, redireciona para o dashboard
    redirect("/dashboard");
  }

  // Obter estatísticas para o dashboard
  const { count: usersCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  const { count: linksCount } = await supabase
    .from("links")
    .select("*", { count: "exact", head: true });

  const { count: activeSubscriptions } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .in("status", ["active", "trialing"]);

  const { count: customDomains } = await supabase
    .from("custom_domains")
    .select("*", { count: "exact", head: true })
    .eq("verified", true);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Usuários
                </p>
                <p className="text-2xl font-bold">{usersCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Links
                </p>
                <p className="text-2xl font-bold">{linksCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Assinaturas Ativas
                </p>
                <p className="text-2xl font-bold">{activeSubscriptions || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Domínios Personalizados
                </p>
                <p className="text-2xl font-bold">{customDomains || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="md:col-span-1">
          <div className="sticky top-20 space-y-4 bg-background p-4 rounded-lg border">
            <h2 className="font-semibold text-lg">Painel Admin</h2>
            <nav className="space-y-2">
              <a
                href="/dashboard"
                className="flex items-center gap-2 text-sm hover:text-primary transition p-2 rounded-md hover:bg-muted"
              >
                <Home className="h-4 w-4" /> Dashboard
              </a>
              <a
                href="/dashboard/admin"
                className="flex items-center gap-2 text-sm text-primary font-medium p-2 rounded-md bg-primary/10"
              >
                <Users className="h-4 w-4" /> Usuários
              </a>
              <a
                href="/dashboard/analytics"
                className="flex items-center gap-2 text-sm hover:text-primary transition p-2 rounded-md hover:bg-muted"
              >
                <BarChart4 className="h-4 w-4" /> Analytics
              </a>
            </nav>
          </div>
        </div>
        <div className="md:col-span-5">{children}</div>
      </div>
    </div>
  );
}
