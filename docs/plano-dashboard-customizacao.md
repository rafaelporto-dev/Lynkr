# Plano de Implementação do Dashboard de Customização Lynkr

## Fase 1: Preparação e Estrutura

### 1. Configuração do Ambiente

- Criar branch dedicada: `feature/customization-dashboard`
- Adicionar dependências necessárias:
  ```bash
  npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
  ```

### 2. Estrutura do Projeto

- Criar pasta para o novo módulo:
  ```
  src/
    app/
      dashboard/
        personalization/
          page.tsx           # Página principal
          components/        # Componentes específicos da personalização
          store/             # Store Zustand para o estado
          types/             # Tipos e interfaces
  ```

### 3. Store Zustand para Gerenciamento de Estado

```typescript
// src/app/dashboard/personalization/store/use-editor-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EditorState {
  // Estado da personalização
  theme: "light" | "dark" | "blue" | "purple" | string;
  layout: "list" | "grid" | string;
  typography: {
    fontFamily: string;
    fontWeight: string;
    fontSize: string;
  };
  blocks: Array<{
    id: string;
    type: string;
    content: any;
    position: number;
  }>;

  // Ações
  setTheme: (theme: string) => void;
  setLayout: (layout: string) => void;
  setTypography: (config: Partial<EditorState["typography"]>) => void;
  addBlock: (blockType: string) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (sourceIndex: number, destinationIndex: number) => void;
  updateBlock: (id: string, data: any) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      // Estado inicial
      theme: "light",
      layout: "list",
      typography: {
        fontFamily: "inter",
        fontWeight: "normal",
        fontSize: "medium",
      },
      blocks: [],

      // Implementações das ações
      setTheme: (theme) => set({ theme }),
      setLayout: (layout) => set({ layout }),
      setTypography: (config) =>
        set((state) => ({
          typography: { ...state.typography, ...config },
        })),
      addBlock: (blockType) =>
        set((state) => ({
          blocks: [
            ...state.blocks,
            {
              id: crypto.randomUUID(),
              type: blockType,
              content: {},
              position: state.blocks.length,
            },
          ],
        })),
      removeBlock: (id) =>
        set((state) => ({
          blocks: state.blocks.filter((block) => block.id !== id),
        })),
      reorderBlocks: (sourceIndex, destinationIndex) =>
        set((state) => {
          const newBlocks = [...state.blocks];
          const [removed] = newBlocks.splice(sourceIndex, 1);
          newBlocks.splice(destinationIndex, 0, removed);
          return { blocks: newBlocks };
        }),
      updateBlock: (id, data) =>
        set((state) => ({
          blocks: state.blocks.map((block) =>
            block.id === id
              ? { ...block, content: { ...block.content, ...data } }
              : block
          ),
        })),
    }),
    {
      name: "lynkr-editor-storage",
    }
  )
);
```

## Fase 2: Implementação dos Componentes

### 1. Layout Principal

```tsx
// src/app/dashboard/personalization/page.tsx
"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { useState } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditorSidebar from "./components/editor-sidebar";
import ProfilePreview from "./components/profile-preview";
import ThemeSelector from "./components/theme-selector";
import Typography from "./components/typography";
import { useEditorStore } from "./store/use-editor-store";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function PersonalizationPage() {
  const [activeTab, setActiveTab] = useState("design");
  const { theme, layout, typography, blocks } = useEditorStore();

  // Função para salvar as alterações no perfil
  const saveChanges = async () => {
    // Implementar lógica para salvar no Supabase
  };

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Personalização de Perfil</h1>
            <Button onClick={saveChanges}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>
        </header>

        {/* Editor Layout - Grid de duas colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar de edição */}
          <div className="lg:col-span-4 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="design" className="flex-1">
                  Design
                </TabsTrigger>
                <TabsTrigger value="blocks" className="flex-1">
                  Blocos
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex-1">
                  Configurações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="space-y-6 mt-6">
                <ThemeSelector />
                <Typography />
              </TabsContent>

              <TabsContent value="blocks" className="mt-6">
                <EditorSidebar />
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                {/* Configurações adicionais */}
              </TabsContent>
            </Tabs>
          </div>

          {/* Área de preview */}
          <div className="lg:col-span-8">
            <ProfilePreview />
          </div>
        </div>
      </main>
    </>
  );
}
```

### 2. Componentes Principais

#### Seletor de Temas

```tsx
// src/app/dashboard/personalization/components/theme-selector.tsx
"use client";

import { useEditorStore } from "../store/use-editor-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const themes = [
  {
    id: "light",
    name: "Light",
    previewClass: "bg-gradient-to-r from-white to-slate-100",
  },
  {
    id: "dark",
    name: "Dark",
    previewClass: "bg-gradient-to-r from-slate-900 to-slate-800",
  },
  {
    id: "blue",
    name: "Blue",
    previewClass: "bg-gradient-to-r from-blue-500 to-cyan-500",
  },
  {
    id: "purple",
    name: "Purple",
    previewClass: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useEditorStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecionar Tema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {themes.map((item) => (
            <button
              key={item.id}
              onClick={() => setTheme(item.id)}
              className={cn(
                "relative rounded-md aspect-[4/3] p-2 transition-all overflow-hidden border-2",
                theme === item.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border"
              )}
            >
              <div className={cn("absolute inset-0", item.previewClass)} />
              <div className="absolute inset-x-0 bottom-0 bg-background/90 p-1 text-xs font-medium">
                {item.name}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

#### Sidebar de Blocos

```tsx
// src/app/dashboard/personalization/components/editor-sidebar.tsx
"use client";

import { useEditorStore } from "../store/use-editor-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Text,
  Link,
  Image,
  MapPin,
  Calendar,
  AtSign,
  Youtube,
  Twitter,
  Instagram,
  Facebook,
} from "lucide-react";

const blockTypes = [
  { id: "text", name: "Texto", icon: Text },
  { id: "button", name: "Botão", icon: Link },
  { id: "image", name: "Imagem", icon: Image },
  { id: "map", name: "Mapa", icon: MapPin },
  { id: "calendar", name: "Agenda", icon: Calendar },
  { id: "social", name: "Social", icon: AtSign },
];

const socialTypes = [
  { id: "youtube", name: "YouTube", icon: Youtube },
  { id: "twitter", name: "Twitter", icon: Twitter },
  { id: "instagram", name: "Instagram", icon: Instagram },
  { id: "facebook", name: "Facebook", icon: Facebook },
];

export default function EditorSidebar() {
  const { addBlock } = useEditorStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Blocos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {blockTypes.map((block) => {
              const Icon = block.icon;
              return (
                <Button
                  key={block.id}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => addBlock(block.id)}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs">{block.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {socialTypes.map((social) => {
              const Icon = social.icon;
              return (
                <Button
                  key={social.id}
                  variant="outline"
                  className="h-16 flex items-center justify-center gap-2"
                  onClick={() => addBlock(`social_${social.id}`)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{social.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### Componente de Preview

```tsx
// src/app/dashboard/personalization/components/profile-preview.tsx
"use client";

import { useEditorStore } from "../store/use-editor-store";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import BlockRenderer from "./block-renderer";

export default function ProfilePreview() {
  const { theme, layout, typography, blocks } = useEditorStore();
  const { setNodeRef } = useDroppable({ id: "profile-droppable" });

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-6">
      {/* Phone Frame */}
      <div className="relative w-[375px] h-[720px] bg-background border-8 border-black rounded-[40px] overflow-hidden shadow-xl">
        {/* Status Bar */}
        <div className="h-6 w-full bg-black flex justify-between items-center px-6">
          <span className="text-white text-xs">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-white/80" />
            <div className="w-4 h-4 rounded-full bg-white/80" />
          </div>
        </div>

        {/* Content */}
        <div
          className={cn(
            "h-full overflow-y-auto",
            theme === "dark" ? "bg-slate-900 text-white" : "",
            theme === "blue"
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
              : "",
            theme === "purple"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "",
            {
              "font-sans": typography.fontFamily === "inter",
              "font-mono": typography.fontFamily === "mono",
              "font-serif": typography.fontFamily === "serif",
            }
          )}
        >
          <div ref={setNodeRef} className="p-4 min-h-full">
            {blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}

            {blocks.length === 0 && (
              <div className="h-full flex items-center justify-center text-center opacity-50 p-8">
                <p>
                  Arraste e solte blocos da barra lateral para começar a
                  personalizar seu perfil
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### Renderizador de Blocos

```tsx
// src/app/dashboard/personalization/components/block-renderer.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditorStore } from "../store/use-editor-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Grip, X, Edit, Save, Link, MapPin } from "lucide-react";
import { useState } from "react";

interface BlockRendererProps {
  block: {
    id: string;
    type: string;
    content: any;
    position: number;
  };
}

export default function BlockRenderer({ block }: BlockRendererProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { removeBlock, updateBlock } = useEditorStore();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRemove = () => removeBlock(block.id);

  const renderBlockContent = () => {
    switch (block.type) {
      case "text":
        if (isEditing) {
          return (
            <Textarea
              value={block.content.text || ""}
              onChange={(e) => updateBlock(block.id, { text: e.target.value })}
              placeholder="Digite seu texto aqui..."
              className="w-full resize-none"
            />
          );
        }
        return (
          <p className="py-2">{block.content.text || "Texto de exemplo..."}</p>
        );

      case "button":
        if (isEditing) {
          return (
            <div className="space-y-3">
              <Input
                value={block.content.label || ""}
                onChange={(e) =>
                  updateBlock(block.id, { label: e.target.value })
                }
                placeholder="Texto do botão"
              />
              <Input
                value={block.content.url || ""}
                onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                placeholder="URL"
              />
            </div>
          );
        }
        return (
          <Button className="w-full flex items-center justify-center gap-2">
            <Link className="h-4 w-4" />
            {block.content.label || "Botão"}
          </Button>
        );

      case "map":
        return (
          <div className="bg-muted rounded-md p-4 flex items-center justify-center">
            <MapPin className="h-6 w-6 mr-2" />
            <span>Localização no Mapa</span>
          </div>
        );

      // Implementar outros tipos de blocos conforme necessário

      default:
        return <div>Bloco não reconhecido</div>;
    }
  };

  return (
    <Card ref={setNodeRef} style={style} className="mb-4 relative group">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-move p-1 text-muted-foreground"
          >
            <Grip className="h-4 w-4" />
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <Save className="h-4 w-4" />
              ) : (
                <Edit className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {renderBlockContent()}
      </CardContent>
    </Card>
  );
}
```

## Fase 3: Integrações e Funcionalidades Avançadas

### 1. Implementação do Drag and Drop para Reordenar Blocos

```tsx
// src/app/dashboard/personalization/page.tsx (atualizações)
"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEditorStore } from "./store/use-editor-store";

export default function PersonalizationPage() {
  // ... código existente

  const { blocks, reorderBlocks } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      reorderBlocks(oldIndex, newIndex);
    }
  };

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 flex flex-col gap-8">
        {/* ... código existente */}

        {/* Editor Layout - Grid de duas colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ... código existente */}

          {/* Área de preview */}
          <div className="lg:col-span-8">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={blocks.map((block) => block.id)}
                strategy={verticalListSortingStrategy}
              >
                <ProfilePreview />
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </main>
    </>
  );
}
```

### 2. Integração com o Supabase para Salvar Personalização

```typescript
// src/app/dashboard/personalization/utils/save-profile.ts
import { createClient } from "../../../../supabase/client";
import { toast } from "@/components/ui/use-toast";

export async function saveProfilePersonalization(data: {
  theme: string;
  layout: string;
  typography: any;
  custom_css: string | null;
}) {
  const supabase = createClient();

  try {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      throw new Error("Usuário não autenticado");
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        theme: data.theme,
        layout: data.layout,
        font_family: data.typography.fontFamily,
        button_style:
          data.typography.fontWeight === "bold" ? "pill" : "rounded",
        custom_css: data.custom_css,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userData.user.id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    toast({
      title: "Erro ao salvar personalização",
      description: error.message,
      variant: "destructive",
    });

    return { success: false, error };
  }
}
```

### 3. Gerador de AI para Estilos

```tsx
// src/app/dashboard/personalization/components/ai-generator.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { useEditorStore } from "../store/use-editor-store";

export default function AIGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setTheme, setTypography, addBlock } = useEditorStore();

  const generateDesign = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);

    try {
      // Esta seria a chamada para uma API de IA
      // Por enquanto, vamos simular algumas sugestões
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Tema baseado no prompt
      if (
        prompt.toLowerCase().includes("escuro") ||
        prompt.toLowerCase().includes("dark")
      ) {
        setTheme("dark");
      } else if (
        prompt.toLowerCase().includes("azul") ||
        prompt.toLowerCase().includes("blue")
      ) {
        setTheme("blue");
      } else if (
        prompt.toLowerCase().includes("roxo") ||
        prompt.toLowerCase().includes("purple")
      ) {
        setTheme("purple");
      } else {
        setTheme("light");
      }

      // Tipografia baseada no prompt
      if (
        prompt.toLowerCase().includes("moderno") ||
        prompt.toLowerCase().includes("clean")
      ) {
        setTypography({ fontFamily: "inter", fontWeight: "medium" });
      } else if (
        prompt.toLowerCase().includes("código") ||
        prompt.toLowerCase().includes("tech")
      ) {
        setTypography({ fontFamily: "mono", fontWeight: "normal" });
      } else if (
        prompt.toLowerCase().includes("elegante") ||
        prompt.toLowerCase().includes("formal")
      ) {
        setTypography({ fontFamily: "serif", fontWeight: "medium" });
      }

      // Adicionar blocos baseados no prompt
      addBlock("text");

      if (
        prompt.toLowerCase().includes("botão") ||
        prompt.toLowerCase().includes("button")
      ) {
        addBlock("button");
      }

      if (
        prompt.toLowerCase().includes("mapa") ||
        prompt.toLowerCase().includes("localização")
      ) {
        addBlock("map");
      }

      if (
        prompt.toLowerCase().includes("social") ||
        prompt.toLowerCase().includes("rede")
      ) {
        addBlock("social_instagram");
      }
    } catch (error) {
      console.error("Erro ao gerar design com IA:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Gerador de AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Descreva como você quer que seu perfil pareça..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />

          <Button
            className="w-full"
            onClick={generateDesign}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar com IA
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Fase 4: Testes, Refinamento e Deployment

### 1. Plano de Testes

- Criar testes unitários para componentes críticos
- Realizar testes de integração para a funcionalidade Drag & Drop
- Testar a responsividade em diferentes dispositivos
- Verificar a compatibilidade com diferentes navegadores

### 2. Otimização de Performance

- Implementar memoização para componentes pesados
- Lazy loading para componentes secundários
- Otimizar re-renderizações desnecessárias

### 3. Acessibilidade

- Garantir que todos os componentes sejam acessíveis via teclado
- Adicionar aria-labels apropriados
- Verificar contraste de cores

### 4. Deployment

- Realizar merge da branch `feature/customization-dashboard` para `main` após aprovação
- Implementar gradualmente em ambiente de produção
- Monitorar erros e performance após o lançamento

## Cronograma Sugerido

| Fase                 | Atividades                           | Tempo Estimado |
| -------------------- | ------------------------------------ | -------------- |
| Preparação           | Configuração e Store                 | 1-2 dias       |
| Componentes Básicos  | Layout e componentes principais      | 3-4 dias       |
| Integrações          | DnD e Supabase                       | 2-3 dias       |
| AI Generator         | Implementação                        | 1-2 dias       |
| Testes e Refinamento | Testes, otimizações e acessibilidade | 2-3 dias       |
| Total                |                                      | 9-14 dias      |
