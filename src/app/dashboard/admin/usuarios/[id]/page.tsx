import { createClient } from "../../../../../../supabase/server";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserEdit } from "../../components/user-edit";
import { formatDate } from "@/utils/utils";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Medal, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChangePlanButton } from "./components/change-plan-button";

export default async function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Buscar detalhes do perfil
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !profile) {
    notFound();
  }

  // Buscar links do usuário
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", params.id)
    .order("created_at", { ascending: false });

  // Buscar dados de assinatura
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", profile.id)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Detalhes do Usuário</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Dados principais do usuário.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={profile.avatar_url}
                  alt={profile.full_name || ""}
                />
                <AvatarFallback className="text-xl">
                  {profile.full_name
                    ? profile.full_name.charAt(0).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID</p>
                <p className="text-sm break-all">{profile.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nome
                </p>
                <p className="text-sm">
                  {profile.full_name || "Não informado"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Username
                </p>
                <p className="text-sm">{profile.username || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Criado em
                </p>
                <p className="text-sm">{formatDate(profile.created_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Última atualização
                </p>
                <p className="text-sm">
                  {profile.updated_at
                    ? formatDate(profile.updated_at)
                    : "Nunca"}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-2 flex-wrap">
            <UserEdit userId={profile.id} />
            <ChangePlanButton
              userId={profile.id}
              currentPlan={profile.has_free_plan ? "free" : "premium"}
            />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>Dados do perfil público.</CardDescription>
              </div>
              <div>
                {profile.has_free_plan ? (
                  <div className="rounded-full bg-muted px-3 py-1 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>Plano Gratuito</span>
                  </div>
                ) : (
                  <div className="rounded-full bg-primary/20 text-primary px-3 py-1 text-xs flex items-center gap-1">
                    <Medal className="h-3 w-3" />
                    <span>Plano Premium</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bio</p>
                <p className="text-sm">{profile.bio || "Não informada"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tema
                </p>
                <p className="text-sm">{profile.theme || "Padrão"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Estilo de botão
                </p>
                <p className="text-sm">{profile.button_style || "Padrão"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Família de fonte
                </p>
                <p className="text-sm">{profile.font_family || "Padrão"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Layout
                </p>
                <p className="text-sm">{profile.layout || "Padrão"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Domínio personalizado
                </p>
                <p className="text-sm flex items-center gap-1">
                  {profile.has_custom_domain ? (
                    <>
                      <BadgeCheck className="h-4 w-4 text-green-500" />{" "}
                      Permitido
                    </>
                  ) : (
                    "Não permitido"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tipo de fundo
                </p>
                <p className="text-sm">{profile.background_type || "Padrão"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Links e Assinatura</CardTitle>
            <CardDescription>
              Informações de links e assinatura do usuário.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Links</h3>
                {links && links.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm">Total de links: {links.length}</p>
                    <p className="text-sm">
                      Último link adicionado: {formatDate(links[0].created_at)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhum link encontrado.
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Assinatura</h3>
                {subscription ? (
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Status
                      </p>
                      <p className="text-sm">
                        {subscription.status || "Desconhecido"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Plano
                      </p>
                      <p className="text-sm">
                        {subscription.price_id || "Desconhecido"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Início do período atual
                      </p>
                      <p className="text-sm">
                        {subscription.current_period_start
                          ? formatDate(
                              new Date(
                                subscription.current_period_start * 1000
                              ).toISOString()
                            )
                          : "Desconhecido"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Fim do período atual
                      </p>
                      <p className="text-sm">
                        {subscription.current_period_end
                          ? formatDate(
                              new Date(
                                subscription.current_period_end * 1000
                              ).toISOString()
                            )
                          : "Desconhecido"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma assinatura encontrada.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
