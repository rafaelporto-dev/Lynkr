"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../supabase/client";

interface SubscriptionCheckProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function SubscriptionCheckClient({
  children,
  redirectTo = "/pricing",
}: SubscriptionCheckProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkSubscription() {
      try {
        // Verificar se o usuário está logado
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          router.push("/sign-in");
          return;
        }

        // Verificar parâmetros de URL para checkout bem-sucedido
        let sessionId = null;
        try {
          const url = new URL(window.location.href);
          sessionId = url.searchParams.get("session_id");
        } catch (error) {
          // Se a análise de URL falhar, continue sem o ID da sessão
        }

        // Se houver session_id na URL, assumimos que o checkout foi bem-sucedido
        // e permitimos o acesso ao dashboard temporariamente
        if (sessionId) {
          setIsAllowed(true);
          setIsLoading(false);
          return;
        }

        // Verificar perfil do usuário para determinar se tem acesso
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single();

        if (profileError) {
          console.error("Erro ao obter perfil:", profileError);
          router.push(redirectTo);
          return;
        }

        // Permitir acesso se o perfil existe
        // Todos os usuários com perfil válido têm acesso ao dashboard básico
        // Recursos premium serão controlados em outros componentes
        if (profileData) {
          setIsAllowed(true);
        } else {
          router.push(redirectTo);
        }
      } catch (error) {
        console.error("Erro ao verificar assinatura:", error);
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    }

    checkSubscription();
  }, [redirectTo, router, supabase]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Carregando...
      </div>
    );
  }

  if (!isAllowed) {
    return null; // Irá redirecionar no useEffect
  }

  return <>{children}</>;
}
