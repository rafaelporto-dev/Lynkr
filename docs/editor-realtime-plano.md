# Plano para Editor em Tempo Real do Dashboard

## Visão Geral

Este documento apresenta o plano detalhado para a implementação de um editor avançado em tempo real para o dashboard, com preview ao vivo das alterações. O objetivo é criar uma experiência de edição mais fluida, intuitiva e visual para os usuários.

## Estrutura do Projeto

### 1. Layout Principal

- [ ] Dividir a tela em duas seções: Editor e Preview
- [ ] Implementar layout responsivo (coluna única em mobile, lado a lado em desktop)
- [ ] Criar sistema de navegação entre abas do editor

### 2. Componentes Principais

#### EditorPanel

- [ ] Criar estrutura base do componente
- [ ] Implementar sistema de abas
- [ ] Integrar indicador de status de salvamento em tempo real
- [ ] Implementar lógica de carregar dados do perfil e links

#### PreviewPanel

- [ ] Criar painel de visualização com iframe
- [ ] Adicionar controles para alternar entre dispositivos (desktop, tablet, mobile)
- [ ] Adicionar alternância entre temas claro/escuro
- [ ] Implementar botões para refresh, copiar URL e visitar perfil

### 3. Abas do Editor

#### ProfileTab

- [ ] Interface para upload e crop de avatar
- [ ] Campos para informações básicas (nome, username, bio)
- [ ] Validação em tempo real dos campos

#### AppearanceTab

- [ ] Grid visual de seleção de temas com preview
- [ ] Seletor de tipografia com previews
- [ ] Opções de layout com visualizações
- [ ] Configurações de plano de fundo (cor, gradiente, imagem, vídeo)
- [ ] Editor de CSS personalizado para usuários premium
- [ ] Indicadores visuais para recursos premium

#### LinksTab

- [ ] Interface de drag-and-drop para reorganizar links
- [ ] Formulário integrado para adicionar/editar links
- [ ] Preview em miniatura de cada link
- [ ] Suporte para links interativos e embeds
- [ ] Opções para ativar/desativar links
- [ ] Suporte para thumbnails personalizados

#### InteractiveTab

- [ ] Interface para criar e gerenciar elementos acordeão (premium)
- [ ] Interface para criar e gerenciar tabs (premium)
- [ ] Editor visual para conteúdo dos elementos interativos
- [ ] Opções de estilo para elementos interativos

#### AnalyticsTab

- [ ] Dashboard com estatísticas de cliques
- [ ] Gráficos de desempenho ao longo do tempo
- [ ] Filtros por período (dia, semana, mês)
- [ ] Lista de links mais clicados
- [ ] Exportação de dados

### 4. Funcionalidade de Preview em Tempo Real

- [ ] Criar rota dedicada para preview (`/preview/[username]`)
- [ ] Implementar lógica para renderizar perfil em modo preview
- [ ] Garantir que alterações no editor sejam refletidas instantaneamente no preview
- [ ] Suportar diferentes temas e tamanhos de dispositivo no preview

### 5. Salvamento em Tempo Real

- [ ] Implementar hook useDebounce para salvamento otimizado
- [ ] Criar sistema de salvamento automático com indicadores de status
- [ ] Implementar funcionalidades de desfazer/refazer
- [ ] Adicionar confirmações para alterações importantes

### 6. Integração com Supabase

- [ ] Configurar listeners para atualizações em tempo real
- [ ] Otimizar queries para minimizar uso de banco de dados
- [ ] Implementar lógica de cache para melhor performance
- [ ] Garantir que todas as alterações sejam persistidas corretamente

### 7. Elementos Interativos (Premium)

- [ ] Implementar sistema de acordeões
  - [ ] Interface de edição
  - [ ] Preview em tempo real
  - [ ] Persistência no banco de dados
- [ ] Implementar sistema de tabs
  - [ ] Interface de edição
  - [ ] Preview em tempo real
  - [ ] Persistência no banco de dados

### 8. Thumbnails Personalizados (Premium)

- [ ] Interface para upload e crop de thumbnails
- [ ] Preview de thumbnails nos links
- [ ] Suporte para armazenamento e otimização de imagens
- [ ] Garantir compatibilidade com diferentes dispositivos

## Implementação Técnica

### Componentes React

```tsx
// Exemplo da estrutura do EditorPanel
export default function EditorPanel() {
  const supabase = createClient();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("saved"); // "saved", "saving", "error"

  // Lógica de carregamento e salvamento

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Editor de Perfil</h1>
        <div className="flex items-center gap-2">
          {saveStatus === "saving" && (
            <span className="text-sm text-muted-foreground">Salvando...</span>
          )}
          {saveStatus === "saved" && (
            <span className="text-sm text-green-500">
              Todas as alterações salvas
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-sm text-red-500">Erro ao salvar</span>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="flex-1">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="interactive">Interativo</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Conteúdo das abas */}
      </Tabs>
    </div>
  );
}

// Exemplo da estrutura do PreviewPanel
export default function PreviewPanel({
  profile,
  links,
  previewMode,
  setPreviewMode,
}) {
  const [deviceType, setDeviceType] = useState("desktop");
  const [theme, setTheme] = useState("light");

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-background flex items-center justify-between">
        {/* Controles de preview */}
      </div>

      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        <div
          className={`overflow-hidden bg-white transition-all rounded-lg shadow-lg ${
            deviceType === "mobile"
              ? "w-[375px] h-[667px]"
              : deviceType === "tablet"
                ? "w-[768px] h-[1024px]"
                : "w-[1280px] h-[800px]"
          }`}
        >
          <iframe
            src={`/preview/${profile?.username}?preview=true&theme=${theme}`}
            className="w-full h-full border-0"
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
}
```

### Funções Auxiliares

```tsx
// Hook de debounce para salvamento otimizado
function useDebounce(callback, delay) {
  const debouncedFn = useRef(null);

  useEffect(() => {
    return () => {
      if (debouncedFn.current) {
        clearTimeout(debouncedFn.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args) => {
      if (debouncedFn.current) {
        clearTimeout(debouncedFn.current);
      }

      debouncedFn.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
}

// Função para salvar perfil
async function saveProfile(profile, supabase) {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        // campos do perfil
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error saving profile:", error);
    return { success: false, error };
  }
}
```

## Banco de Dados

### Tabelas Relevantes

- profiles: Dados do perfil do usuário
- links: Links do usuário
- interactive_groups: Grupos de elementos interativos (acordeões, tabs)
- interactive_items: Itens individuais dentro dos grupos interativos
- clicks: Dados de análise de cliques

## Métricas de Sucesso

- [ ] Tempo médio de edição reduzido em 30%
- [ ] Satisfação do usuário aumentada (medida via pesquisa)
- [ ] Redução de 50% em tickets de suporte relacionados à personalização
- [ ] Aumento de 20% na conversão para planos premium devido às funcionalidades exclusivas
- [ ] Maior personalização nos perfis dos usuários

## Cronograma Sugerido

### Fase 1: Estrutura Básica

- [ ] Layout principal (editor/preview)
- [ ] Componentes básicos do EditorPanel e PreviewPanel
- [ ] Integração básica com Supabase

### Fase 2: Funcionalidades Essenciais

- [ ] ProfileTab completo
- [ ] AppearanceTab básico
- [ ] LinksTab completo
- [ ] Salvamento em tempo real

### Fase 3: Recursos Avançados

- [ ] AppearanceTab completo com todos os recursos premium
- [ ] InteractiveTab com acordeões e tabs
- [ ] Custom thumbnails
- [ ] AnalyticsTab completo

### Fase 4: Polimento e Otimização

- [ ] Melhorias de performance
- [ ] Testes de usabilidade
- [ ] Refinamentos de UI/UX
- [ ] Documentação completa
