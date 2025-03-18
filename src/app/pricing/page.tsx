import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import { createClient } from "../../../supabase/server";
import { Badge } from "@/components/ui/badge";

export default async function Pricing() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans"
  );

  // Add free plan
  const freePlan = {
    id: "free-plan",
    name: "Free",
    isFree: true,
    amount: 0,
    interval: "forever",
  };

  // Combine free plan with paid plans
  const allPlans = [freePlan, ...(plans || [])];

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-gray-900 to-black">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none"></div>
      <Navbar />

      <main className="flex-1 relative overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-900/40 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-900/40 rounded-full filter blur-3xl opacity-20"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-6 bg-white/[0.04] backdrop-blur-lg border-white/10 text-indigo-300 px-4 py-1.5 mx-auto"
            >
              Pricing Plans
            </Badge>

            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white">
              Simple, Transparent Pricing
            </h1>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. No hidden fees or
              surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {allPlans.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>

          <div className="mt-20 max-w-3xl mx-auto backdrop-blur-lg bg-white/[0.04] border border-white/10 p-8 rounded-2xl shadow-2xl shadow-indigo-900/20">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Perguntas Frequentes
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-indigo-300 mb-2">
                  Posso mudar de plano depois?
                </h3>
                <p className="text-gray-300">
                  Sim, você pode atualizar ou fazer downgrade do seu plano a
                  qualquer momento. As mudanças entrarão em vigor no próximo
                  ciclo de cobrança.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-indigo-300 mb-2">
                  Existe alguma taxa de configuração?
                </h3>
                <p className="text-gray-300">
                  Não, não há taxas ocultas ou de configuração. O preço que você
                  vê é o preço que você paga.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-indigo-300 mb-2">
                  Como funciona o período de teste?
                </h3>
                <p className="text-gray-300">
                  Todos os planos pagos incluem um período de teste gratuito de
                  7 dias. Você não será cobrado até o final desse período.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
