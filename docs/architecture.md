# Arquitetura do Projeto Castle

## 1. Objetivo

Castle é uma aplicação desktop premium, construída com Electron + React + Vite + TypeScript, voltada para gerenciamento visual e navegação de aplicativos, com experiência semelhante a um cliente moderno de jogos e ferramentas.

A arquitetura foi pensada para ser escalável, modular e preparada para evoluir com:
- biblioteca de aplicativos
- favoritos
- categorias
- busca e filtros
- seleção múltipla
- contexto visual premium
- integração futura com dados reais e APIs

---

## 2. Visão de Alto Nível

### Stack principal
- Electron: camada desktop
- React: interface do usuário
- Vite: build e dev server do renderer
- TypeScript: tipagem estática
- TailwindCSS: estilização e tokens visuais
- React Router: navegação
- Framer Motion: animações
- Electron Store: persistência local
- Lucide React: ícones

### Arquitetura geral
- Renderer: UI React responsiva e premium
- Main Process: criação de janela e integração com Electron
- Preload: expor APIs seguras para o renderer
- Persistência: armazenamento local via Electron Store
- Componentização: estrutura modular para UI reutilizável

---

## 3. Estrutura de Pastas

```text
src/
  components/
    common/
    layout/
    library/
    ui/
  contexts/
  hooks/
  layouts/
  pages/
  services/
  store/
  styles/
  types/
  utils/
  assets/
  app.tsx
  main.tsx

electron/
  main.ts
  preload.ts

docs/
  architecture.md
```

---

## 4. Responsabilidades por Camada

### 4.1 Camada de Apresentação
Localizada em `src/components`, `src/pages` e `src/layouts`.

Responsabilidades:
- renderizar interface
- lidar com estados visuais
- interagir com contexto e hooks
- manter o design system consistente

Exemplos:
- `Sidebar`
- `HeaderBar`
- `Footer`
- `SearchBar`
- `LibraryGrid`
- `SteamCard`
- `ContextMenu`

### 4.2 Camada de Estado e Dados
Localizada em `src/contexts`, `src/store`, `src/services`.

Responsabilidades:
- centralizar estado compartilhado
- controlar dados de biblioteca
- gerenciar filtros, seleção, busca e ordenação
- abstrair acesso a persistência

Exemplos:
- `LibraryContext`
- `ThemeContext`
- `electronStore.ts`

### 4.3 Camada de Negócio
Localizada em `src/hooks`, `src/utils` e `src/services`.

Responsabilidades:
- processar regras de negócio
- preparar dados para UI
- encapsular lógica reutilizável
- tornar componentes mais limpos

Exemplos:
- `useSize`
- utilidades de formatação, filtragem e ordenação

### 4.4 Camada de Integração com Electron
Localizada em `electron/`.

Responsabilidades:
- criar e controlar janelas do aplicativo
- expor APIs do processo principal ao renderer
- tratar ciclo de vida do app
- configurar ambiente desktop

Exemplos:
- `electron/main.ts`
- `electron/preload.ts`

---

## 5. Componentes Principais

### 5.1 Layout
- `MainLayout`: estrutura base com sidebar, header, conteúdo e footer
- `Sidebar`: navegação principal do app
- `HeaderBar`: pesquisa, ações rápidas e perfil/usuário
- `Footer`: informações de status e rodapé do app

### 5.2 Biblioteca
- `LibraryPage`: página principal da biblioteca
- `LibraryGrid`: grid virtualizado de itens
- `SteamCard`: card visual premium para cada aplicativo
- `ContextMenu`: menu contextual para operações rápidas
- `SearchBar`: pesquisa de itens

### 5.3 UI Reutilizável
- `Button`
- `Input`
- `Card`
- `Modal`
- `Dropdown`
- `Menu`
- `Tooltip`

---

## 6. Fluxo de Dados

### Fluxo principal da Biblioteca
1. Usuário abre a página de Biblioteca.
2. O `LibraryPage` lê o estado do `LibraryContext`.
3. O contexto fornece itens, filtros, busca e ordenação.
4. O `LibraryGrid` renderiza somente os itens visíveis.
5. A virtualização limita a quantidade de componentes montados.
6. Interações como clique, clique direito, favorito e seleção atualizam o estado.
7. O estado pode ser persistido via Electron Store no futuro.

### Fluxo de navegação
1. O `App` monta o `Router`.
2. Cada rota renderiza uma página específica.
3. O `MainLayout` mantém o shell do app consistente.
4. O `Sidebar` controla a navegação entre páginas.

### Fluxo de persistência
1. O renderer acessa serviços abstraídos.
2. Os serviços usam `Electron Store` para leitura/escrita local.
3. O estado é sincronizado com a UI.

---

## 7. Gerenciamento de Estado

### Estratégia inicial
- Context API para estado de UI e biblioteca
- estado local para componentes específicos quando necessário

### Futuras extensões
- Zustand ou Redux Toolkit, caso o estado se torne mais complexo
- cache e sincronização com backend remoto, se necessário

---

## 8. Design System

A interface segue uma linguagem premium inspirada em:
- Steam
- Battle.net
- Discord
- Raycast

### Princípios visuais
- aparência de aplicativo desktop
- fundo escuro, contraste forte e detalhes metálicos
- componentes com profundidade, bordas sutis e brilho controlado
- animações suaves e responsivas

### Tokens visuais
- paleta principal: preto, cinza, vermelho e branco
- sombras elevadas
- blur e glass effect
- hover e transições suaves

---

## 9. Performance

### Estratégias aplicadas
- virtualização da grade de biblioteca
- renderização otimizada por componente
- uso de `react-window` para milhares de itens
- evitar re-renderização desnecessária
- componentes leves e reutilizáveis

### Diretrizes futuras
- memoização de listas e filtros
- lazy loading de dados pesados
- paginação/scroll incremental quando necessário

---

## 10. Escalabilidade e Manutenção

A arquitetura foi concebida para permitir:
- crescimento de páginas e módulos
- adoção de novas features sem reescrever o shell
- facilidades de testes unitários e de integração
- separação clara entre UI, estado e integração

---

## 11. Decisões de Arquitetura

- React para UI declarativa e modular
- Electron para distribuição desktop
- TypeScript para segurança e escalabilidade
- Context API no início para reduzir complexidade
- Tailwind para design system consistente
- Componentes reutilizáveis para acelerar evolução do produto

---

## 12. Próximos Passos

- implementar páginas restantes da sidebar
- integrar persistência real com Electron Store
- expandir o design system com componentes mais ricos
- conectar biblioteca a dados reais ou mocks estruturados
- evoluir para testes e automação de build
