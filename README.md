# 🚛 Torre de Controle — Sistema de Transferências

> **Sistema operacional interno da Princesa dos Campos** para monitoramento em tempo real de viagens de transferência de cargas, integração com telemetria GPS (Sascar), gestão de ocorrências e auditoria de manifestos financeiros.

---

## 📋 Índice

- [Objetivo](#-objetivo)
- [Contexto e Aplicação](#-contexto-e-aplicação)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Stack Tecnológica](#-stack-tecnológica)
- [Banco de Dados](#-banco-de-dados)
- [Módulos e Páginas](#-módulos-e-páginas)
- [API e Rotas de Integração](#-api-e-rotas-de-integração)
- [Serviços de Background](#-serviços-de-background)
- [Autenticação e Controle de Acesso](#-autenticação-e-controle-de-acesso)
- [Integração com Sascar (Telemetria)](#-integração-com-sascar-telemetria)
- [Integração com AngelLira (Alarmes)](#-integração-com-angellira-alarmes)
- [Relatório Semanal Automático](#-relatório-semanal-automático)
- [Setup e Instalação](#-setup-e-instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Deploy em Produção](#-deploy-em-produção)
- [Estrutura de Diretórios](#-estrutura-de-diretórios)

---

## 🎯 Objetivo

A **Torre de Controle** é o sistema central de operações de transferência de cargas da **Princesa dos Campos**. Seu propósito é substituir planilhas manuais e comunicação fragmentada por um painel unificado que permite:

- **Acompanhar em tempo real** todas as viagens de transferência em andamento, cruzando dados de planilhas operacionais com o GPS das frotas (via Sascar).
- **Detectar e classificar atrasos** automaticamente por nível de criticidade (Pontual → Atenção → Atrasado → Crítico).
- **Registrar e gerenciar ocorrências** (pneu furado, acidentes, avarias, etc.) com fluxo de atendimento em 3 fases: abertura → torre → unidade responsável.
- **Auditar manifestos financeiros** acima de R$ 140.000 para garantir que toda carga de alto valor tem uma viagem correspondente registrada no sistema.
- **Gerar relatórios semanais** automáticos por gerente/regional com consolidado de ocorrências.

---

## 🏢 Contexto e Aplicação

| Contexto | Detalhe |
|---|---|
| **Empresa** | Princesa dos Campos (transportadora) |
| **Setor** | Operações de Transferência |
| **Usuários** | Operadores de torre, gerentes regionais, administradores |
| **Escopo geográfico** | Filiais/bases em múltiplas cidades do Paraná e Santa Catarina |
| **Volume típico** | Dezenas de viagens simultâneas por dia, múltiplos veículos rastreados |
| **Tipo de acesso** | Intranet corporativa (IP fixo ou domínio interno) |

O sistema opera sobre **dois bancos de dados distintos**:
1. **Banco principal PostgreSQL** — dados operacionais do sistema (viagens, ocorrências, usuários, etc.)
2. **Banco Sascar (PostgreSQL legado)** — dados brutos de telemetria GPS e manifestos importados da plataforma de rastreamento da Sascar

---

## ✨ Funcionalidades

### 🗂 Importação de Viagens via Planilha

- Upload de planilha Excel (`.xlsx`) com os dados do relatório diário de programação de transferências.
- Processamento linha a linha com **upsert inteligente**: cria ou atualiza a viagem sem duplicar registros.
- Mapeamento automático de rota padrão por nome normalizado (tolerante a acentos, maiúsculas e espaços irregulares).
- Criação automática de bases (cidades origem/destino) caso não existam no cadastro.
- Validação de placa ativa via consulta ao banco Sascar — escolhe entre Placa Programada, Placa Mobile e Reboque.
- Vinculação automática de paradas intermediárias com horários calculados a partir da rota-padrão cadastrada.

### 📡 Monitoramento em Tempo Real

- **Dashboard Operacional** com tabela de todas as viagens do dia, atualizando a cada 30 segundos via polling tRPC + React Query.
- **Nível de alerta calculado automaticamente**:
  - `PONTUAL` — dentro do prazo (≤ 0 minutos de atraso)
  - `ATENÇÃO` — 1 a 30 minutos de atraso
  - `ATRASADO` — 31 a 120 minutos de atraso
  - `CRÍTICO` — mais de 120 minutos de atraso
  - `SEM SINAL` — última telemetria há mais de 2 horas
- **Barra de progresso GPS** em tempo real: calcula a porcentagem do percurso concluída via fórmula de Haversine (distância geodésica em km).
- **Previsão de chegada calculada** com base na velocidade atual e distância restante.
- **Detecção de chegada antecipada** (30+ min antes do previsto) com badge especial.
- **Regra de compensação de horário**: se o veículo chega atrasado à base de transbordo intermediária, o sistema calcula automaticamente um novo horário-limite de saída (`novaPrevisaoSaida`).

### 📺 Painel de TV (Modo Fullscreen)

- Modo de exibição em **fullscreen** otimizado para monitores e TVs da sala de operações.
- Paginação automática a cada 60 segundos com barra de contagem regressiva animada.
- **KPI Pills** no cabeçalho: Em Rota, Atrasadas, Críticas (com pulse animado), Concluídas.
- Filtros rápidos de status (Em Rota / Concluídas / Próximas 6h) e filtro de período por data.
- Relógio em tempo real **sincronizado com o servidor** (corrige relógios de TVs/computadores com hora incorreta do OS).
- Fechar com tecla `ESC`.

### 🚨 Gestão de Ocorrências

Fluxo de 3 fases para gestão de incidentes:

**Fase 1 — Abertura:**
- Operador da torre registra a ocorrência (tipo, descrição, coordenadas GPS do momento).
- Tipos suportados: Pneu Furado, Avaria Mecânica, Acidente, Atraso de Tráfego, Problema com Carga, Combustível, Interdição de Via, Problema com Documentação, Outro.
- Pode ser aberta **manualmente** pelo operador ou **automaticamente** via e-mail da AngelLira.

**Fase 2 — Atendimento pela Torre:**
- Operador assume o atendimento, registra nota após contato com o motorista.
- Define qual unidade ficará responsável pela resolução.

**Fase 3 — Resolução pela Unidade:**
- Unidade responsável registra a resolução com descrição detalhada.
- Status final: `RESOLVIDA`.

Recursos adicionais:
- **Histórico completo** de ocorrências por viagem.
- Visualização em **mapa interativo** (Leaflet + OpenStreetMap) com marcador da posição da ocorrência.
- Indicador visual de ocorrências ativas no Painel de TV (ícone ⚠ com cor por status).
- **Notificação por e-mail** automática ao responsável da unidade ao assumir/resolver uma ocorrência.

### 🛡 Auditoria de Manifestos

- Cruza dados do banco da Sascar (manifestos financeiros) com os registros de viagens do sistema.
- **Filtra automaticamente** manifestos com valor total de minutas acima de **R$ 140.000**.
- Classifica cada manifesto como `OK` (viagem encontrada) ou `ALERTA` (sem viagem correspondente).
- KPIs: total de manifestos auditados, com alerta, OK, valor total em trânsito.
- **Exportação para Excel** (.xlsx) com todos os dados da auditoria.
- Filtragem por placa e busca textual.

### 📦 Chegadas por Unidade

- Painel agrupado por unidade mostrando quantas cargas já **chegaram**, estão **a caminho** e o total de manifestos esperados para o dia.
- Barra de progresso visual por unidade.
- Filtro por data e atualização manual.

### 📊 Análise de Atrasos

- Análise histórica de atrasos filtrada por período: Hoje, Semana, Mês, ou períodos customizados.
- Filtros por tipo: Todas / Recuperação (chegou depois de sair atrasado) / Atraso na Rota / Atraso Total.
- Lista detalhada de viagens com: atraso na saída, atraso na chegada, tempo de duração, nível de alerta.
- KPIs: total de viagens, pontual, atenção, atrasado, crítico.
- Acesso ao detalhe completo de cada viagem.

### ⚙ Administração

Disponível apenas para o papel `ADMIN`:

- **Gerenciar Usuários**: criar, editar (nome, e-mail, senha, papel, base), listar e excluir usuários. Configurar quais usuários recebem o relatório semanal.
- **Gerenciar Bases**: cadastrar e editar bases/filiais com geocerca (latitude, longitude, raio em metros), dados do responsável e contato.
- **Gerenciar Rotas Padrão**: cadastrar a matriz de rotas com paradas intermediárias e horários-padrão. Usado para cálculo automático de previsões.
- **Gerenciar Regionais**: configurar gerentes regionais e associar frotas de veículos (importação via CSV).

---

## 🏗 Arquitetura do Sistema

```
┌──────────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                            │
│                                                                      │
│   Next.js 15 App Router  ─── React 19 ─── TailwindCSS v4            │
│   tRPC Client + React Query  ─── Leaflet Maps                        │
└─────────────────────────┬────────────────────────────────────────────┘
                           │ HTTPS / tRPC (type-safe RPC over HTTP)
┌─────────────────────────▼────────────────────────────────────────────┐
│                     SERVIDOR (Next.js API)                           │
│                                                                      │
│  ┌───────────────────┐    ┌──────────────────────────────────────┐   │
│  │  tRPC Routers     │    │  REST API Routes (Next.js)           │   │
│  │  • viagem         │    │  • GET /api/sync  (telemetria cron)  │   │
│  │  • manifesto      │    │  • GET /api/hora  (sincronização)    │   │
│  │  • ocorrencia     │    │  • POST /api/process-emails          │   │
│  │  • regional       │    │  • POST /api/relatorio-semanal       │   │
│  │  • admin          │    └──────────────────────────────────────┘   │
│  └──────────┬────────┘                                               │
│             │                                                         │
│  ┌──────────▼────────────────────────────────────────────────────┐   │
│  │                      Services Layer                            │   │
│  │  • viagemService         (processamento GPS/geocerca)          │   │
│  │  • emailProcessorService (IMAP → AngelLira → Ocorrência)      │   │
│  │  • emailNotificacaoService (SMTP → notificações)               │   │
│  │  • relatorioSemanalService (Canvas PNG → e-mail gerente)       │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────┬──────────────────────────────────────────┬────────────────┘
           │                                           │
┌──────────▼──────────┐               ┌───────────────▼──────────────┐
│  PostgreSQL          │               │  PostgreSQL (Sascar Legado)   │
│  (Banco Principal)   │               │  (Telemetria / Manifestos)    │
│                      │               │                               │
│  • Viagem            │               │  • veiculos_sascar            │
│  • Telemetria        │               │  • posicoes_sascar            │
│  • Ocorrencia        │               │  • manifesto / minuta         │
│  • User / Base       │               │  • unidades / aero            │
│  • RotaPadrao        │               └───────────────────────────────┘
│  • Regional          │
└──────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    PROCESSOS PM2 (Background)                        │
│                                                                      │
│  • transferencia        → Next.js app (porta 3001)                  │
│  • email-cron           → Verifica IMAP a cada 60s                  │
│  • relatorio-semanal    → Cron sexta-feira 08h00                    │
└─────────────────────────────────────────────────────────────────────┘
```

### Fluxo de dados principal

```
Planilha XLSX → Upload → tRPC uploadPlanilha → Upsert Viagem + Paradas
                                                        ↓
Sascar GPS → Banco Sascar → GET /api/sync (cron) → Telemetria → processarStatusViagens
                                                        ↓
                                              Atualização status Viagem
                                              (PROGRAMADA → EM_ANDAMENTO → FINALIZADA)
                                                        ↓
                                              Dashboard / Painel TV (polling 30s)
```

---

## 🛠 Stack Tecnológica

### Frontend

| Tecnologia | Versão | Uso |
|---|---|---|
| **Next.js** | 15.x (App Router) | Framework principal, SSR/SSG, API Routes |
| **React** | 19.x | UI components |
| **TailwindCSS** | 4.x | Estilização |
| **tRPC Client** | 11.x | Chamadas type-safe ao backend |
| **TanStack React Query** | 5.x | Cache, polling e estado de servidor |
| **Leaflet + react-leaflet** | 1.9/5.x | Mapas interativos |
| **date-fns** | 4.x | Manipulação de datas |
| **xlsx** | 0.18 | Leitura de planilhas Excel e exportação |
| **jsPDF + jspdf-autotable** | 4.x | Exportação de PDFs |

### Backend

| Tecnologia | Versão | Uso |
|---|---|---|
| **Next.js API Routes** | 15.x | Endpoints REST e cron |
| **tRPC Server** | 11.x | API type-safe |
| **Prisma** | 6.x | ORM para banco principal |
| **node-postgres (pg)** | 8.x | Acesso direto ao banco Sascar |
| **NextAuth v5** | 5.0-beta | Autenticação com sessão |
| **bcryptjs** | 3.x | Hash de senhas |
| **Zod** | 3.x | Validação de schemas |

### Comunicação / Integração

| Tecnologia | Versão | Uso |
|---|---|---|
| **imapflow** | 1.4 | Leitura IMAP (caixa AngelLira) |
| **mailparser** | 3.9 | Parse de e-mails recebidos |
| **nodemailer** | 9.x | Envio de e-mails (notificações e relatórios) |
| **@napi-rs/canvas** | 1.x | Geração de imagens PNG para relatórios |

### Infraestrutura

| Ferramenta | Uso |
|---|---|
| **PostgreSQL 15** | Banco de dados principal (Docker em dev, servidor em prod) |
| **PM2** | Gerenciamento de processos em produção |
| **Docker / docker-compose** | Banco local para desenvolvimento |
| **Prisma Migrate** | Controle de schema e migrações |
| **tsx** | Execução de scripts TypeScript (seeds, crons) |

---

## 🗄 Banco de Dados

### Schema Principal (Prisma / PostgreSQL)

#### Relacionamentos

```
User ──────── Base ──────── Viagem ──────── Veiculo
  │              │              │
  │              │              ├──── ParadaViagem ──── Base
  │              │              ├──── JustificativaAtraso ──── User, Base
  │              │              ├──── Telemetria ──── Veiculo
  │              │              └──── Ocorrencia ──── User (aberta/acionada/resolvida)
  │              └──── OcorrenciasUnidade (Base responsável)
  └──── JustificativaAtraso

RotaPadrao ──── ParadaPadrao ──── Base
     └──── Viagem (vinculada)

Regional ──── VeiculoRegional
```

#### Modelos principais

| Model | Descrição |
|---|---|
| `User` | Usuários do sistema com papel ADMIN, GERENTE ou OPERADOR |
| `Base` | Filiais/unidades com geocerca (lat, lng, raio) e dados do responsável |
| `Veiculo` | Frota rastreada — ID vem da Sascar, placa é única |
| `Viagem` | Registro completo de cada transferência com datas planejadas e efetivas |
| `JustificativaAtraso` | Justificativas registradas pelos operadores para atrasos |
| `Telemetria` | Pontos GPS recebidos da Sascar (lat, lng, ignição, velocidade) |
| `RotaPadrao` | Matriz de rotas pré-cadastradas com paradas e horários-padrão |
| `ParadaPadrao` | Parada de uma rota-padrão (base, ordem, prevChegada, prevSaida como "HH:MM") |
| `ParadaViagem` | Parada real de uma viagem com datas absolutas e horários efetivos |
| `Ocorrencia` | Incidente em uma viagem com fluxo de 3 fases e integração de e-mail |
| `Regional` | Gerente regional agrupando veículos para relatório semanal |
| `VeiculoRegional` | Associação veículo → regional com dados de unidade, proprietário e responsável |

#### Enums

| Enum | Valores |
|---|---|
| `Role` | `ADMIN`, `GERENTE`, `OPERADOR` |
| `StatusViagem` | `PROGRAMADA`, `EM_ANDAMENTO`, `FINALIZADA`, `CANCELADA` |
| `TipoAtraso` | `SAIDA_BASE`, `TEMPO_PARADA_EXCEDIDO`, `DESLOCAMENTO_ROTA` |
| `StatusOcorrencia` | `ABERTA`, `EM_ATENDIMENTO`, `RESOLVIDA` |

#### Índices de Performance

Os índices críticos garantem performance nas queries mais frequentes do dashboard:

- `Viagem`: `prevInicioReal`, `status`, `veiculoId`
- `Telemetria`: `(veiculoId, dataHoraLocal DESC)` — busca da última posição
- `ParadaViagem`, `Ocorrencia`: `viagemId`, `status`, `origem`

---

## 📄 Módulos e Páginas

### `/dashboard` — Dashboard Operacional

Página central do sistema. Exibe todas as viagens do período com:
- Seletor de data com atalhos (Hoje, Ontem, Esta Semana, Este Mês).
- Filtros por status, origem, destino e nível de alerta.
- Tabela com colunas: `#Viagem`, `Placa`, `Motorista`, `Rota`, `Saída Prev/Real/Δ`, `Chegada Prev/Real/Δ`, `Próx. Parada`, `Alerta`, `Situação`.
- Busca textual em tempo real.
- Botão para ativar o **Painel de TV** (fullscreen).
- Botão de sincronização manual (`/api/sync`).

### Painel de TV (Fullscreen)

Otimizado para monitores da sala de operações:
- Cabeçalho com KPI Pills e relógio sincronizado com o servidor.
- Paginação automática (14 linhas/página a cada 60s) com barra de contagem regressiva.
- Filtros de status e período.
- Fecha com ESC.

### `/viagens` — Lista e Detalhe de Viagens

- Lista paginada com filtros de período e status.
- Detalhe individual: timeline de paradas, mapa Leaflet, ocorrências, justificativas, telemetria.
- `/viagens/upload` (ADMIN): upload da planilha Excel diária.

### `/analise` — Análise de Atrasos

Dashboard analítico histórico com filtros de período e tipo, KPIs e tabela detalhada.

### `/auditoria-manifesto` — Auditoria de Manifestos

Cruzamento financeiro-operacional dos manifestos > R$ 140.000 com exportação Excel.

### `/chegadas-unidade` — Chegadas por Unidade

Visão agrupada por filial com barras de progresso e filtro por data.

### `/ocorrencias` — Gestão de Ocorrências

Central de incidentes com mapa, fluxo de 3 fases e histórico.

### `/admin` — Painel de Administração (ADMIN)

| Sub-página | Função |
|---|---|
| `/admin/usuarios` | CRUD completo de usuários |
| `/admin/bases` | CRUD de bases com geocerca |
| `/admin/rotas` | CRUD da matriz de rotas-padrão |
| `/admin/regionais` | Gerenciar regionais e frota por gerente |

---

## 🔌 API e Rotas de Integração

### tRPC Routers

Todos os procedures são `protectedProcedure` (requerem sessão NextAuth ativa):

| Router | Procedures principais |
|---|---|
| `viagem` | `uploadPlanilha`, `obterDashboard`, `listar`, `obterDetalhes`, `obterAnalise`, `registrarJustificativa` |
| `manifesto` | `auditoria`, `chegadasPorUnidade` |
| `ocorrencia` | `buscarViagemPorPlaca`, `criar`, `listar`, `assumir`, `resolver`, `listarHistorico` |
| `regional` | `listar`, `criar`, `editar`, `excluir`, `importarCSV` |
| `admin` | `stats`, `listarUsuarios`, `criarUsuario`, `editarUsuario`, `excluirUsuario`, `listarBases`, `upsertBase`, `listarRotas`, `upsertRota` |

### REST API Routes

| Rota | Método | Autenticação | Descrição |
|---|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | — | Handlers NextAuth |
| `/api/hora` | GET | — | Timestamp do servidor para sincronização |
| `/api/sync` | GET | Cron Secret | Sincroniza telemetria Sascar e processa status |
| `/api/process-emails` | POST | Cron Secret | Importa alarmes AngelLira como ocorrências |
| `/api/relatorio-semanal` | POST | Cron Secret | Gera e envia relatório semanal |

---

## ⚙ Serviços de Background

### `viagemService.ts` — Processador de Telemetria GPS

Para cada viagem ativa:
1. Busca telemetrias na janela temporal (com margem de 6h).
2. Percorre os pontos GPS em ordem cronológica.
3. Verifica entrada/saída de **geocercas** via Haversine.
4. Registra `dataChegadaEfetiva` e `dataSaidaEfetiva` por parada.
5. Atualiza `dataInicioEfetivo`, `dataFimEfetivo` e `status` da viagem.

### `emailProcessorService.ts` — Importador AngelLira

A cada 60 segundos:
1. Conecta à caixa IMAP `torre.notificacoes@princesadoscampos.com.br`.
2. Busca e-mails não lidos da AngelLira (por remetente, palavras-chave no assunto ou corpo).
3. Faz parse para extrair: placa, código de viagem, tipo de alarme, link do mapa.
4. Mapeia o assunto para tipo de ocorrência.
5. Vincula à viagem e cria `Ocorrencia` com `emailMessageId` único.
6. Marca o e-mail como lido.

### `emailNotificacaoService.ts` — Notificações de Ocorrência

Envia e-mail SMTP ao responsável da unidade ao assumir ou resolver uma ocorrência, com template detalhado da viagem e nota da torre.

### `relatorioSemanalService.ts` — Relatório por Gerente (Sexta 08h00)

1. Para cada `Regional` configurado, busca ocorrências da semana.
2. Gera imagem PNG com `@napi-rs/canvas` (cabeçalho, tabela, rodapé).
3. Envia por e-mail para usuários com `recebeRelatorioSemanal: true`.

---

## 🔐 Autenticação e Controle de Acesso

- **NextAuth v5** com adapter Prisma — credenciais e-mail + senha (hash bcrypt), sessão JWT.
- Middleware protege **todas as rotas**, redirecionando para `/login` se não há sessão.
- Rotas de API com cron secret (`CRON_SECRET`) são liberadas do middleware de sessão.

### Papéis (RBAC)

| Papel | Permissões |
|---|---|
| `ADMIN` | Acesso total + upload de planilhas + administração de usuários/bases/rotas |
| `GERENTE` | Dashboard, viagens, análise, ocorrências e auditoria |
| `OPERADOR` | Dashboard, viagens e gestão de ocorrências |

---

## 📡 Integração com Sascar (Telemetria)

Conexão com banco PostgreSQL legado da Sascar (somente leitura) via `pg` Pool.

### Fluxo de Sincronização (`/api/sync`)

1. **Veículos**: sincroniza `veiculos_sascar` → `Veiculo`. Migra IDs temporários para reais via raw SQL.
2. **Telemetrias**: importa posições GPS com janela de 30 min. Converte UTC → GMT-3.
3. **Status**: chama `processarStatusViagens()` para atualizar viagens com base nas novas telemetrias.

### Geocerca (Haversine)

```
d = 2R × arcsin(√(sin²(Δlat/2) + cos(lat1)·cos(lat2)·sin²(Δlon/2)))
```

Veículo "dentro da base" quando `d < raioMetros` configurado.

---

## 📧 Integração com AngelLira (Alarmes)

### Mapeamento de Tipos

| Palavra-chave | Tipo de Ocorrência |
|---|---|
| VELOCIDADE | Excesso de Velocidade |
| JORNADA / FADIGA | Fadiga do Motorista |
| PARADA | Parada Não Autorizada |
| BLOQUEIO | Bloqueio de Veículo |
| DESVIO / ROTA | Desvio de Rota |
| GEOCERCA / CERCA | Violação de Geocerca |
| PERDA DE SINAL | Perda de Sinal GPS |

**Idempotência**: campo `emailMessageId @unique` garante que o mesmo e-mail nunca gere duas ocorrências.

---

## 📈 Relatório Semanal Automático

Gerado com `@napi-rs/canvas` (bindings Rust, sem dependências de sistema):
- Cabeçalho com nome do gerente e período.
- Tabela com ocorrências da semana por veículo da regional.
- Rodapé com total e data de geração.
- Enviado toda **sexta-feira às 08h00** via PM2 cron (`0 8 * * 5`).

---

## 🚀 Setup e Instalação

### Pré-requisitos

- Node.js 20+ / npm 11+
- PostgreSQL 15+ (banco principal)
- Acesso ao banco Sascar (leitura)
- PM2 (produção)

### Desenvolvimento Local

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Subir banco via Docker
docker compose up -d

# 4. Aplicar schema
npm run db:push

# 5. Popular dados iniciais
npm run db:seed
npm run db:seed-rotas  # opcional

# 6. Iniciar dev server
npm run dev
```

Acesse em `http://localhost:3000`.

---

## 🔑 Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `AUTH_SECRET` | ✅ | Segredo NextAuth (32 bytes base64) |
| `AUTH_URL` | Em produção | URL base (ex: `http://172.20.10.210:3001`) |
| `DATABASE_URL` | ✅ | Connection string PostgreSQL principal |
| `TELEMETRIA_DB_URL` | Para sync | Connection string PostgreSQL Sascar |
| `EMAIL_IMAP_HOST` | Para cron | Host IMAP |
| `EMAIL_IMAP_PORT` | Para cron | Porta IMAP (993=SSL, 143=STARTTLS) |
| `EMAIL_IMAP_USER` | Para cron | Usuário IMAP |
| `EMAIL_IMAP_PASS` | Para cron | Senha IMAP |
| `EMAIL_SMTP_HOST` | Para notificações | Host SMTP |
| `EMAIL_SMTP_USER` | Para notificações | Usuário SMTP |
| `EMAIL_SMTP_PASS` | Para notificações | Senha SMTP |
| `CRON_SECRET` | Para crons | Token das rotas de cron |
| `ANGELLIRA_BOT_USER_ID` | Para cron | ID do usuário bot |
| `NODE_ENV` | ✅ | `development` ou `production` |

---

## 📜 Scripts Disponíveis

| Script | Comando | Descrição |
|---|---|---|
| Dev | `npm run dev` | Servidor Next.js com Turbopack |
| Build | `npm run build` | Build de produção |
| Start | `npm run start` | Servidor de produção |
| Lint | `npm run lint` | ESLint |
| Typecheck | `npm run typecheck` | TypeScript check |
| Format | `npm run format:write` | Prettier |
| DB Push | `npm run db:push` | Sincroniza schema |
| DB Migrate | `npm run db:migrate` | Aplica migrações (produção) |
| DB Seed | `npm run db:seed` | Dados iniciais |
| DB Seed Rotas | `npm run db:seed-rotas` | Matriz de rotas |
| DB Studio | `npm run db:studio` | Interface gráfica do banco |

---

## 🖥 Deploy em Produção

### Processos PM2

| Processo | Trigger | Descrição |
|---|---|---|
| `transferencia` | Contínuo (porta 3001) | Aplicação Next.js |
| `email-cron` | Loop 60s | Polling IMAP AngelLira |
| `relatorio-semanal` | Sexta 08h00 | Relatório semanal |

### Deploy

```bash
npm run build
npm run db:migrate
pm2 start ecosystem.config.cjs
pm2 save && pm2 startup
```

---

## 📁 Estrutura de Diretórios

```
torre-transferencia/
├── prisma/
│   ├── schema.prisma              # Schema do banco principal
│   ├── seed.ts                    # Dados iniciais (usuários, bases)
│   ├── seed-rotas.ts              # Matriz de rotas-padrão
│   └── seed-regionais.ts          # Regionais e veículos por gerente
│
├── scripts/
│   ├── email-cron.mjs             # PM2: polling IMAP AngelLira (60s)
│   └── relatorio-semanal-cron.mjs # PM2: cron relatório semanal
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── _components/           # Navbar, SignOutButton
│   │   ├── admin/                 # Administração (usuários, bases, rotas, regionais)
│   │   ├── analise/               # Análise histórica de atrasos
│   │   ├── api/                   # REST: auth, hora, sync, process-emails, relatorio
│   │   ├── auditoria-manifesto/   # Auditoria de manifestos financeiros
│   │   ├── chegadas-unidade/      # Chegadas por filial
│   │   ├── dashboard/             # Dashboard + PainelTV (fullscreen)
│   │   ├── login/                 # Autenticação
│   │   ├── ocorrencias/           # Gestão de incidentes
│   │   ├── viagens/               # Lista, detalhe e upload de viagens
│   │   ├── layout.tsx             # Layout raiz
│   │   └── page.tsx               # Redirect → /dashboard
│   │
│   ├── components/                # TruckLoader e outros UI
│   ├── hooks/
│   │   └── useHoraReal.ts         # Relógio sincronizado com servidor
│   ├── middleware.ts              # Proteção de rotas NextAuth
│   │
│   ├── server/
│   │   ├── api/
│   │   │   ├── routers/           # tRPC: viagem, manifesto, ocorrencia, admin, regional
│   │   │   ├── root.ts            # Router raiz
│   │   │   └── trpc.ts            # Config tRPC + context
│   │   ├── auth/                  # NextAuth config
│   │   ├── services/
│   │   │   ├── emailNotificacaoService.ts  # SMTP: notificações
│   │   │   ├── emailProcessorService.ts    # IMAP: AngelLira
│   │   │   ├── relatorioSemanalService.ts  # Canvas PNG + SMTP
│   │   │   └── viagemService.ts            # GPS geocerca + status
│   │   ├── utils/
│   │   │   ├── geolocalizacao.ts  # Haversine
│   │   │   ├── sascarUtils.ts     # Utilitários de placa
│   │   │   └── stringUtils.ts     # Normalização de strings
│   │   ├── db.ts                  # Prisma (banco principal)
│   │   └── db-telemetria.ts       # pg Pool (banco Sascar)
│   │
│   ├── styles/                    # CSS global
│   └── trpc/                      # tRPC client + React Query setup
│
├── public/                        # Logo, favicon
├── docker-compose.yml             # PostgreSQL local (dev)
├── ecosystem.config.cjs           # PM2 (produção)
├── next.config.js                 # Next.js config
├── tsconfig.json                  # TypeScript
└── .env.example                   # Template de variáveis
```

---

## 📝 Notas Técnicas

### Sincronização de Relógio (`useHoraReal`)

TVs e computadores de operação frequentemente têm relógio desatualizado. O hook busca o timestamp do servidor, calcula o offset compensando metade do RTT e aplica a cada tick de 1s, re-sincronizando a cada 15 minutos.

### Cálculo de Data Absoluta de Paradas

A função `calcularDataAbsoluta` resolve rotas que cruzam meia-noite: ancora o horário "HH:MM" no dia da viagem e avança automaticamente para o dia seguinte se o horário calculado for anterior à última parada processada.

### Compensação de Horário em Transbordos

Quando um veículo chega atrasado a uma base intermediária, o campo `novaPrevisaoSaida` é atualizado automaticamente com o novo horário-limite de saída, permitindo que a operação saiba até quando o veículo pode permanecer na base.

### Tratamento de Veículos Sascar

Placas são sanitizadas (remove caracteres não alfanuméricos, limita a 7 caracteres). IDs temporários (`temp_XXXX`) criados no upload da planilha são migrados para IDs reais da Sascar via raw SQL com controle rigoroso de chaves estrangeiras.

---

*Sistema desenvolvido para uso interno — Princesa dos Campos · Setor de Transferências*
