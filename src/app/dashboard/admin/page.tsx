import { createClient } from "../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserEdit } from "./components/user-edit";
import { formatDate } from "@/utils/utils";
import Link from "next/link";
import { Eye, RefreshCw, Search } from "lucide-react";

export const revalidate = 0;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient();

  // Obtém os parâmetros de busca
  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";
  const sort =
    typeof searchParams.sort === "string" ? searchParams.sort : "created_at";
  const order =
    typeof searchParams.order === "string" ? searchParams.order : "desc";
  const filter =
    typeof searchParams.filter === "string" ? searchParams.filter : "all";

  // Busca os perfis com filtro
  let query = supabase.from("profiles").select("*");

  // Aplicar filtros
  if (filter === "premium") {
    query = query.eq("has_free_plan", false);
  } else if (filter === "free") {
    query = query.eq("has_free_plan", true);
  }

  // Se tiver termo de busca, filtra por username ou nome completo
  if (search) {
    query = query.or(`username.ilike.%${search}%,full_name.ilike.%${search}%`);
  }

  // Aplicar ordenação
  query = query.order(sort, { ascending: order === "asc" });

  const { data: profiles, error } = await query;

  if (error) {
    return <div>Erro ao carregar usuários: {error.message}</div>;
  }

  // Obter contagem de usuários premium vs gratuitos
  const { count: premiumCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("has_free_plan", false);

  const { count: freeCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("has_free_plan", true);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>
                Visualize e gerencie todos os usuários registrados na
                plataforma.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="py-1">
                Usuários Premium: {premiumCount || 0}
              </Badge>
              <Badge variant="outline" className="py-1">
                Usuários Gratuitos: {freeCount || 0}
              </Badge>
              <Badge variant="outline" className="py-1">
                Total: {profiles?.length || 0}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <form className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="search"
                    placeholder="Buscar por nome ou username"
                    defaultValue={search}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select name="filter" defaultValue={filter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os usuários</SelectItem>
                  <SelectItem value="premium">Usuários Premium</SelectItem>
                  <SelectItem value="free">Usuários Gratuitos</SelectItem>
                </SelectContent>
              </Select>
              <Select name="sort" defaultValue={sort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Data de criação</SelectItem>
                  <SelectItem value="full_name">Nome</SelectItem>
                  <SelectItem value="username">Username</SelectItem>
                </SelectContent>
              </Select>
              <Select name="order" defaultValue={order}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Decrescente</SelectItem>
                  <SelectItem value="asc">Crescente</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="shrink-0">
                <RefreshCw className="h-4 w-4 mr-1" /> Atualizar
              </Button>
            </form>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Data de criação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles && profiles.length > 0 ? (
                  profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>{profile.username || "-"} </TableCell>
                      <TableCell>{profile.full_name || "-"} </TableCell>
                      <TableCell>
                        {profile.has_free_plan ? (
                          <Badge variant="secondary">Gratuito</Badge>
                        ) : (
                          <Badge variant="default">Premium</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {profile.created_at
                          ? formatDate(profile.created_at)
                          : "-"}{" "}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/dashboard/admin/usuarios/${profile.id}`}
                            >
                              <Eye className="h-4 w-4 mr-1" /> Ver
                            </Link>
                          </Button>
                          <UserEdit userId={profile.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Mostrando {profiles?.length || 0} usuários.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
