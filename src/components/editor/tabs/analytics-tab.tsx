"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import {
  Lock,
  BarChart2,
  Users,
  MousePointerClick,
  Eye,
  ArrowUpRight,
} from "lucide-react";

// Criando cliente do Supabase no lado do cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipo para o perfil
type Profile = {
  id: string;
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  theme?: string;
  button_style?: string;
  font_family?: string;
  layout?: string;
  background_type?: string;
  background_url?: string | null;
  custom_css?: string | null;
  has_free_plan: boolean;
  has_custom_domain?: boolean;
};

type AnalyticsTabProps = {
  profile: Profile | null;
};

// Dados mockados para a visualização
// Na implementação real, esses dados viriam do Supabase
const mockData = {
  views: {
    total: 1423,
    today: 78,
    weekly: 523,
    monthly: 1250,
  },
  clicks: {
    total: 521,
    today: 23,
    weekly: 178,
    monthly: 452,
  },
  topLinks: [
    { title: "Instagram", clicks: 127, clickRate: 12.7 },
    { title: "Twitter", clicks: 94, clickRate: 9.4 },
    { title: "Portfólio", clicks: 83, clickRate: 8.3 },
    { title: "Contato", clicks: 76, clickRate: 7.6 },
    { title: "YouTube", clicks: 54, clickRate: 5.4 },
  ],
  demographics: {
    countries: [
      { name: "Brasil", percentage: 65 },
      { name: "Estados Unidos", percentage: 12 },
      { name: "Portugal", percentage: 8 },
      { name: "Outros", percentage: 15 },
    ],
    devices: [
      { name: "Mobile", percentage: 72 },
      { name: "Desktop", percentage: 24 },
      { name: "Tablet", percentage: 4 },
    ],
    referrers: [
      { name: "Direct", percentage: 45 },
      { name: "Instagram", percentage: 25 },
      { name: "Google", percentage: 15 },
      { name: "Twitter", percentage: 10 },
      { name: "Outros", percentage: 5 },
    ],
  },
};

export default function AnalyticsTab({ profile }: AnalyticsTabProps) {
  const userId = profile?.id;
  const [timeRange, setTimeRange] = useState<
    "today" | "weekly" | "monthly" | "total"
  >("weekly");
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  // Verificar se o usuário é premium
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("has_free_plan")
          .eq("id", userId)
          .single();

        if (error) throw error;

        setIsPremium(!data.has_free_plan);
      } catch (error) {
        console.error("Erro ao verificar status premium:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, [userId]);

  // Função para buscar dados de analytics do Supabase
  // Esta função seria implementada na versão real do componente
  const fetchAnalyticsData = async () => {
    // Simulação de fetch
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData);
      }, 500);
    });
  };

  // Função para formatar números
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    } else {
      return num.toString();
    }
  };

  // Renderizar estatísticas básicas
  const BasicStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Visualizações
              </p>
              <h3 className="text-3xl font-bold mt-1">
                {formatNumber(mockData.views[timeRange])}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Eye className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Cliques
              </p>
              <h3 className="text-3xl font-bold mt-1">
                {formatNumber(mockData.clicks[timeRange])}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MousePointerClick className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar top links
  const TopLinks = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Top Links</CardTitle>
        <CardDescription>Os links mais clicados do seu perfil</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {mockData.topLinks.map((link, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-3">
                  {index + 1}
                </div>
                <span className="font-medium">{link.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {link.clicks} cliques
                </span>
                <div className="text-sm px-2 py-1 rounded-md bg-green-500/10 text-green-700 dark:text-green-400 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {link.clickRate}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Renderizar dados demográficos
  const Demographics = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Países</CardTitle>
          <CardDescription>De onde seus visitantes acessam</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockData.demographics.countries.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <span>{country.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm">{country.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dispositivos</CardTitle>
          <CardDescription>
            Como seus visitantes acessam seu perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockData.demographics.devices.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <span>{device.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm">{device.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar o conteúdo principal ou um bloqueio de recurso premium
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="py-12 text-center">
          <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
          <p className="mt-4 text-muted-foreground">
            Carregando estatísticas...
          </p>
        </div>
      );
    }

    if (!isPremium) {
      return (
        <div className="py-12 px-6 text-center">
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Recurso Premium</h3>
          </div>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Analytics e estatísticas estão disponíveis apenas para contas
            premium. Faça upgrade para acessar informações detalhadas sobre o
            desempenho do seu perfil.
          </p>
          <Button
            onClick={() => (window.location.href = "/dashboard/pricing")}
            className="px-6"
          >
            Fazer Upgrade para Premium
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">
              Estatísticas de Desempenho
            </h3>
            <p className="text-sm text-muted-foreground">
              Acompanhe o desempenho do seu perfil
            </p>
          </div>
          <Select
            value={timeRange}
            onValueChange={(value: "today" | "weekly" | "monthly" | "total") =>
              setTimeRange(value)
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="weekly">Últimos 7 dias</SelectItem>
              <SelectItem value="monthly">Últimos 30 dias</SelectItem>
              <SelectItem value="total">Todo o período</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <BasicStats />
        <TopLinks />
        <Demographics />

        <div className="text-right">
          <Button variant="outline" size="sm">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Ver relatório completo
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">{renderContent()}</CardContent>
      </Card>
    </div>
  );
}
