import { redirect } from "next/navigation";

// Esta página simplesmente redireciona para a página principal do admin
export default function UsuariosPage() {
  redirect("/dashboard/admin");
}
