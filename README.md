# 🚛 Torre de Controle — Sistema de Transferência

Sistema de **Gestão à Vista** para monitoramento logístico em tempo real das transferências de carga da **Princesa dos Campos**. Permite acompanhar as viagens em andamento, rastrear caminhões via GPS (integração Sascar), analisar atrasos e gerenciar usuários e bases operacionais.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológica](#stack-tecnológica)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Rodando o Projeto](#rodando-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Banco de Dados](#banco-de-dados)
- [Módulos do Sistema](#módulos-do-sistema)
- [Integração Sascar (GPS)](#integração-sascar-gps)
- [Controle de Acesso](#controle-de-acesso)
- [Scripts Disponíveis](#scripts-disponíveis)

---

## Visão Geral

A Torre de Controle é um painel operacional interno desenvolvido para a equipe logística da Princesa dos Campos. O sistema importa as viagens programadas via planilha Excel, sincroniza automaticamente os dados de telemetria GPS da frota (via integração com o banco da Sascar), calcula atrasos em tempo real e exibe tudo em um dashboard ao vivo atualizado a cada 30 segundos.

---

## Funcionalidades

| Módulo | Descrição |
|---|---|
| **🚛 Dashboard Operacional** | Painel ao vivo com todos os caminhões em rota, status de cada viagem e indicadores de alerta (Pontual / Atenção / Atrasado / Crítico) |
| **🗺️ Torre de Controle Unitária** | Mapa interativo por viagem com telemetria GPS em tempo real, timeline de paradas e previsão de chegada preditiva |
| **📊 Analytics Gerencial** | Dashboard de análise com KPIs, ranking de rotas por atraso, distribuição de pontualidade e tabela detalhada para gestores |
| **📋 Lista de Viagens** | Listagem completa com filtros de status, busca e acesso rápido aos detalhes |
| **📁 Upload de Planilha** | Importação do relatório Excel de viagens programadas com mapeamento automático de rotas e paradas |
| **⚙️ Administração** | CRUD de usuários (com controle de roles) e bases operacionais (com coordenadas de geocerca) |
| **🔄 Sync Automático** | Sincronização silenciosa de telemetria Sascar em background a cada 60 segundos |

---

## Stack Tecnológica

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **API:** [tRPC v11](https://trpc.io/) com tipagem end-to-end
- **ORM:** [Prisma 6](https://www.prisma.io/) + PostgreSQL
- **Autenticação:** [NextAuth.js v5 (Auth.js)](https://authjs.dev/) com adapter Prisma
- **UI:** React 19 + Tailwind CSS v4 + CSS puro (sem component library)
- **Mapas:** [Leaflet](https://leafletjs.com/) / [React Leaflet](https://react-leaflet.js.org/)
- **Data/Hora:** [date-fns](https://date-fns.org/)
- **Planilhas:** [SheetJS (xlsx)](https://sheetjs.com/)
- **Cache/Estado:** TanStack Query v5 (embutido no tRPC)

---

## Pré-requisitos

- **Node.js** >= 20.x
- **npm** >= 11.x
- **PostgreSQL** >= 14 (banco principal da aplicação)
- Acesso ao banco SQL Server da **Sascar** (telemetria GPS) — configurado via `TELEMETRIA_DB_URL`

---

## Configuração do Ambiente

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.example .env
```

### Variáveis obrigatórias (`.env`)

```env
# ── Banco de Dados Principal (PostgreSQL) ──────────────────────────────────────
DATABASE_URL="postgresql://usuario:senha@host:5432/torre_transferencia"

# ── Banco de Telemetria Sascar (SQL Server) ────────────────────────────────────
TELEMETRIA_DB_URL="Server=IP_SASCAR;Database=NOME_DB;User Id=usuario;Password=senha;TrustServerCertificate=true"

# ── NextAuth (Auth.js) ─────────────────────────────────────────────────────────
AUTH_SECRET="gere-um-secret-seguro-com-openssl-rand-base64-32"

# ── Ambiente ───────────────────────────────────────────────────────────────────
NODE_ENV="development"
```

> **Gerar `AUTH_SECRET`:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
> ```

---

## Rodando o Projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar o banco de dados

```bash
# Aplicar o schema no banco PostgreSQL
npm run db:push

# Popular com bases e usuários iniciais
npm run db:seed
```

### 3. Importar a Matriz de Rotas

```bash
# Importa o arquivo Excel de rotas para o banco (execute uma vez)
npx tsx importar-rotas.ts
```

> O arquivo `Horário saída de transferências.xlsx` deve estar na raiz do projeto.

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:3000**

### 5. Build de produção

```bash
npm run build
npm start
```

---

## Estrutura do Projeto

```
torre-transferencia/
├── prisma/
│   ├── schema.prisma          # Schema do banco (modelos, enums, relações)
│   └── seed.ts                # Seed com bases e usuários cadastrados
│
├── src/
│   ├── app/                   # Páginas (Next.js App Router)
│   │   ├── _components/       # Componentes globais (Navbar, SignOutButton)
│   │   ├── admin/             # Painel de administração (usuários e bases)
│   │   ├── analise/           # Dashboard analítico gerencial
│   │   │   └── origem/        # Análise de atrasos por origem (legado)
│   │   ├── dashboard/         # Dashboard operacional (Gestão à Vista)
│   │   ├── login/             # Página de autenticação
│   │   ├── viagens/
│   │   │   ├── [id]/          # Torre de controle unitária (mapa + timeline)
│   │   │   └── upload/        # Importação de planilha Excel
│   │   └── api/
│   │       └── sync/          # Endpoint de sincronização de telemetria Sascar
│   │
│   ├── server/
│   │   ├── api/
│   │   │   ├── routers/
│   │   │   │   ├── viagem.ts  # Todas as procedures de viagem e analytics
│   │   │   │   ├── admin.ts   # CRUD de usuários e bases (adminProcedure)
│   │   │   │   └── post.ts    # Scaffold (não utilizado em produção)
│   │   │   ├── root.ts        # Router raiz do tRPC
│   │   │   └── trpc.ts        # Configuração base do tRPC
│   │   ├── auth/              # Configuração do NextAuth (config, index)
│   │   ├── db.ts              # Instância do PrismaClient
│   │   └── utils/             # Utilitários: geocerca, strings, Sascar
│   │
│   ├── middleware.ts           # Proteção global de rotas (NextAuth)
│   ├── styles/globals.css      # Estilos globais + tokens de cor (Tailwind)
│   └── trpc/                  # Client-side tRPC (react, server)
│
├── .env.example               # Template de variáveis de ambiente
├── next.config.js             # Configuração do Next.js
├── postcss.config.js          # PostCSS + postcss-preset-env (compat. TV)
├── docker-compose.yml         # PostgreSQL local para desenvolvimento
└── package.json
```

---

## Banco de Dados

### Modelos principais

| Modelo | Descrição |
|---|---|
| `User` | Usuários do sistema com roles (ADMIN / GERENTE / OPERADOR) |
| `Base` | Bases operacionais com coordenadas GPS e raio de geocerca |
| `Veiculo` | Veículos da frota (sincronizados com a Sascar) |
| `Viagem` | Viagens programadas com status, motorista e datas previstas/reais |
| `ParadaViagem` | Paradas individuais de cada viagem com horários previstos e efetivos |
| `RotaPadrao` | Matriz de rotas do Excel com paradas e horários padrão |
| `ParadaPadrao` | Paradas padrão de cada rota da matriz |
| `Telemetria` | Posições GPS recebidas da Sascar (lat, lon, velocidade, ignição) |
| `JustificativaAtraso` | Justificativas de atraso registradas por operadores |

### PostgreSQL local (Docker)

```bash
docker-compose up -d
```

---

## Módulos do Sistema

### Dashboard Operacional (`/dashboard`)
- Atualiza automaticamente a cada **30 segundos**
- Sync de telemetria Sascar em background a cada **60 segundos**
- Filtra por **Unidade** (base) e **Período** (24h ou 48h)
- Nível de alerta calculado por ETA preditivo vs. horário planejado
- Cards com previsão dinâmica da **próxima parada** (não apenas o destino final)

### Torre de Controle Unitária (`/viagens/[id]`)
- Mapa Leaflet com rota desenhada via GPS
- **Viagens em andamento:** atualização em tempo real, rota do início até a última posição
- **Viagens finalizadas:** rota histórica exata dentro do horário de início e fim real (sem rastrear o caminhão após a entrega)
- Timeline de paradas com status Chegou / Aguardando / Pontual / Atrasado

### Dashboard Analítico (`/analise`)
- Filtros de **período** (Hoje / Esta Semana / Este Mês / Dia ou Mês específico)
- Filtro de **Unidade** (base de origem)
- KPIs: Total de Viagens, Pontualidade %, Média de Atraso, Críticas, Horas Acumuladas
- Gráfico de barras: **Top 10 rotas** com maior atraso médio
- Distribuição de pontualidade por nível
- Tabela detalhada com Δ Saída, Δ Chegada, Duração real vs. prevista

### Upload de Planilha (`/viagens/upload`)
- Aceita o relatório Excel padrão da operação
- Faz `upsert` de viagens, veículos e bases automaticamente
- Associa a **Rota Padrão** usando match fuzzy (tolerante a acentuação e espaços)
- Clona as paradas e horários da matriz para cada viagem específica

---

## Integração Sascar (GPS)

A sincronização com o banco SQL Server da Sascar é feita pelo endpoint `/api/sync`:

1. Busca as viagens **em andamento** no banco local
2. Consulta a tabela de telemetria da Sascar por placa e janela de tempo
3. Insere novos pontos GPS no banco local (evita duplicatas)
4. O sync é chamado automaticamente pelo frontend a cada 60s (polling silencioso)

> **Obs.:** O `TELEMETRIA_DB_URL` deve apontar para o banco SQL Server da Sascar com as tabelas de posicionamento GPS.

---

## Controle de Acesso

| Role | Permissões |
|---|---|
| **ADMIN** | Acesso total: todas as páginas + painel `/admin` (CRUD de usuários e bases) |
| **GERENTE** | Dashboard, Analytics, Lista de Viagens, Torre de Controle |
| **OPERADOR** | Dashboard, Lista de Viagens, Torre de Controle |

A autenticação é feita via NextAuth.js com banco de credenciais (bcrypt). O middleware global (`src/middleware.ts`) protege todas as rotas exceto `/login`.

---

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia o servidor de desenvolvimento (Turbopack)

# Build & Produção
npm run build            # Gera o build de produção
npm start                # Inicia o servidor de produção

# Banco de Dados
npm run db:push          # Aplica o schema no banco sem migrations
npm run db:generate      # Cria ou aplica migrations
npm run db:seed          # Popula o banco com bases e usuários padrão
npm run db:studio        # Abre o Prisma Studio (interface visual do banco)

# Qualidade
npm run lint             # Verifica lint (Next.js ESLint)
npm run typecheck        # Verifica tipos TypeScript
npm run format:write     # Formata o código com Prettier
```

---

## Compatibilidade

O sistema foi projetado para rodar em **Smart TVs** e monitores dedicados na operação. Para isso:
- CSS moderno (OKLCH/color-function do Tailwind v4) é transpilado via **postcss-preset-env**
- O tema de cores é forçado para **light mode** via CSS global, evitando telas em branco em TVs com dark mode automático
- O layout é responsivo mas otimizado para telas **≥ 1280px**

---

## Licença

Uso interno — **Princesa dos Campos Transporte e Logística**.
