"use client";

import { useState } from "react";
import { createClient } from "../../../../../../../supabase/client";
import { Button } from "@/components/ui/button";
import { Medal, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type ChangePlanButtonProps = {
  userId: string;
  currentPlan: "free" | "premium";
};

export function ChangePlanButton({
  userId,
  currentPlan,
}: ChangePlanButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();

  const handleChangePlan = async () => {
    setIsLoading(true);

    try {
      // Alternar entre plano gratuito e premium
      const newPlanIsFree = currentPlan === "premium";

      const { error } = await supabase
        .from("profiles")
        .update({
          has_free_plan: newPlanIsFree,
          // Se estiver alterando para premium, também habilita domínio personalizado
          has_custom_domain: !newPlanIsFree,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Plano alterado com sucesso",
        description: `Usuário alterado para plano ${newPlanIsFree ? "gratuito" : "premium"}.`,
      });

      // Recarrega a página para mostrar as alterações
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao alterar plano",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={currentPlan === "premium" ? "outline" : "default"}
      className={
        currentPlan === "premium"
          ? "gap-1"
          : "gap-1 bg-gradient-to-r from-indigo-500 to-purple-500"
      }
      size="sm"
      onClick={handleChangePlan}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Alterando...
        </>
      ) : currentPlan === "premium" ? (
        <>
          <Medal className="h-4 w-4" /> Alterar para Gratuito
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" /> Alterar para Premium
        </>
      )}
    </Button>
  );
}
