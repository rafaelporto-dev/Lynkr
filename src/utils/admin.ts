// Função para verificar se um usuário é administrador
// Por enquanto, usamos uma lista estática de emails de administradores
// Em produção, isto poderia ser configurado através de variáveis de ambiente ou banco de dados

const ADMIN_EMAILS = ["silvarafinha952@gmail.com"];

export function isAdmin(email: string): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

// Função para verificação no servidor
export async function checkAdminRole(supabase: any): Promise<boolean> {
  try {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return false;

    return isAdmin(data.user.email);
  } catch (error) {
    return false;
  }
}
