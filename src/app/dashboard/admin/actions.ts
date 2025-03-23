"use server";

import { createClient } from "../../../../supabase/server";
import { revalidatePath } from "next/cache";

export const updateUserAction = async (formData: FormData) => {
  const supabase = await createClient();

  const userId = formData.get("user_id") as string;
  const fullName = formData.get("full_name") as string;
  const username = formData.get("username") as string;
  const hasFreePlan = formData.get("has_free_plan") === "true";
  const hasCustomDomain = formData.get("has_custom_domain") === "true";

  if (!userId) {
    return { success: false, message: "ID do usuário é obrigatório" };
  }

  try {
    // Atualizar na tabela profiles
    const { error: profilesError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        username: username,
        has_free_plan: hasFreePlan,
        has_custom_domain: hasCustomDomain,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (profilesError) throw profilesError;

    revalidatePath("/dashboard/admin");
    return { success: true, message: "Usuário atualizado com sucesso" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const deleteUserAction = async (formData: FormData) => {
  const supabase = await createClient();

  const userId = formData.get("user_id") as string;

  if (!userId) {
    return { success: false, message: "ID do usuário é obrigatório" };
  }

  try {
    // Excluir o usuário no auth
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) throw error;

    // As tabelas relacionadas serão excluídas automaticamente através de ON DELETE CASCADE

    revalidatePath("/dashboard/admin");
    return { success: true, message: "Usuário excluído com sucesso" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
