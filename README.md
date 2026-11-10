# 🚛 Torre de Controle — Sistema de Transferências

> **Sistema operacional e analítico interno da Princesa dos Campos** para monitoramento em tempo real de viagens de transferência de cargas, integração com telemetria GPS (Sascar) e ERP (Brudam), gestão de ocorrências em tempo real, análise de aproveitamento de frota e rentabilidade, monitoramento de seguros (Angel) e auditoria de manifestos financeiros.

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
- [Autenticação, Segurança e Monitoria](#-autenticação-segurança-e-monitoria)
- [Integração com Sascar e ERP (Telemetria e Carga)](#-integração-com-sascar-e-erp-telemetria-e-carga)
- [Integração com AngelLira (Alarmes e Seguros)](#-integração-com-angellira-alarmes-e-seguros)
- [Relatório Semanal Automático](#-relatório-semanal-automático)
- [Setup e Instalação](#-setup-e-instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Deploy em Produção](#-deploy-em-produção)
- [Estrutura de Diretórios](#-estrutura-de-diretórios)
- [Notas Técnicas](#-notas-técnicas)

---

## 🎯 Objetivo

A **Torre de Controle** é o sistema central de operações de transferência de cargas da **Princesa dos Campos**. Seu propósito é substituir planilhas manuais e comunicação fragmentada por uma plataforma unificada que permite:

- **Acompanhar em tempo real** todas as viagens de transferência em andamento, cruzando dados de programação com o GPS das frotas (via Sascar).
- **Detectar e classificar atrasos** automaticamente por nível de criticidade (`PONTUAL` → `ATENÇÃO` → `ATRASADO` → `CRÍTICO` → `SEM SINAL`).
- **Registrar e gerenciar ocorrências** com fluxo completo em 3 fases (Abertura → Torre → Unidade Responsável), painel dedicado por filial e alertas visuais/sonoros em tempo real no Painel de TV.
- **Analisar o aproveitamento de frota e rentabilidade** cruzando peso/cubagem carregados, capacidades contratuais de fornecedores, receitas de frete e custos operacionais por manifesto e minuta.
- **Auditar manifestos financeiros** acima de R$ 140.000 com conferência de bipagens de embarque/desembarque e vínculo automático de viagens.
- **Monitorar a vigência de seguros** de motoristas e veículos cadastrados na gerenciadora de risco **Angel** em cruzamento direto com o ERP.
- **Gerar relatórios semanais** automáticos por gerente/regional com consolidado de ocorrências.

---

## 🏢 Contexto e Aplicação

| Contexto | Detalhe |
|---|---|
| **Empresa** | Princesa dos Campos (transportadora) |
| **Setor** | Operações de Transferência e Logística |
| **Usuários** | Operadores de torre, unidades/filiais, gerentes regionais, administradores |
| **Escopo geográfico** | Filiais/bases em múltiplas cidades do Paraná, Santa Catarina e São Paulo |
| **Volume típico** | Dezenas de viagens simultâneas por dia, múltiplos veículos próprios e terceiros rastreados |
| **Tipo de acesso** | Intranet corporativa integrada à Torre de Monitoria dos Sistemas Princesa |

O sistema opera sobre **dois bancos de dados PostgreSQL**:
1. **Banco principal PostgreSQL (Prisma)** — dados operacionais do sistema (viagens, ocorrências, paradas, usuários, bases, rotas-padrão, regionais e cadastros importados da Angel).
2. **Banco Sascar / ERP Brudam (PostgreSQL legado)** — dados brutos de telemetria GPS (`rastreamento_sascar`, `veiculos_sascar`), manifestos, minutas, bipagens de volumes (`historico_volume`), motoristas terceiros e fornecedores.

---

## ✨ Funcionalidades

### 🗂 Importação de Viagens via Planilha
- Upload de planilha Excel (`.xlsx`) com os dados do relatório diário de programação de transferências.
- **Detecção interativa de rotas ausentes**: identifica rotas da planilha que ainda não possuem cadastro na matriz padrão e permite cadastrar a rota e suas paradas intermediárias diretamente na tela antes de concluir a importação.
- Processamento linha a linha com **upsert inteligente**: cria ou atualiza a viagem sem duplicar registros.
- Mapeamento automático de rota padrão por nome normalizado (tolerante a acentos, maiúsculas e espaços irregulares).
- Criação automática de bases (cidades origem/destino) caso não existam no cadastro.
- Validação de placa ativa via consulta ao banco Sascar — escolhe entre Placa Programada, Placa Mobile e Reboque.
- Vinculação automática de paradas intermediárias com horários calculados a partir da rota-padrão cadastrada.

### 📡 Monitoramento em Tempo Real (`/dashboard`)
- **Dashboard Operacional** com tabela de todas as viagens do período, atualizando a cada 30 segundos via polling tRPC + React Query.
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

### 📺 Painel de TV (Modo Fullscreen + Alertas em Tempo Real)
- Modo de exibição em **fullscreen** otimizado para monitores e TVs da sala de operações.
- Paginação automática a cada 60 segundos com barra de contagem regressiva animada.
- **KPI Pills** no cabeçalho: Em Rota, Atrasadas, Críticas (com pulse animado) e Concluídas.
- **Modal e Alerta Sonoro de Ocorrências em Tempo Real (`ModalAlertaOcorrenciaTV`)**:
  - Sintetizador de áudio via Web Audio API (`alertaSonoro.ts`) integrado ao painel.
  - **Nova Ocorrência (🚨 Vermelho)**: emite bip urgente e exibe modal destacando placa, viagem, motorista, rota, tipo e descrição do problema.
  - **Em Atendimento (⚠️ Âmbar)**: emite tom de atenção informando qual operador da Torre assumiu o caso, qual filial foi acionada e a orientação registrada.
  - **Resolução (✅ Verde)**: emite acorde de conclusão exibindo quem resolveu e a descrição da solução.
  - Fila inteligente para múltiplos alertas simultâneos, fechamento automático em 20s com barra regressiva, botão de silenciar (`🔊`/`🔇`) e botão de simulação/teste no topo da TV.
- Relógio em tempo real **sincronizado com o servidor** (`useHoraReal`).

### 🚨 Central de Ocorrências e Painel por Unidade
Fluxo estruturado em 3 fases para gestão de incidentes:
1. **Fase 1 — Abertura**: registro manual pelo operador (com busca automática de viagem por placa e captura da última posição GPS) ou abertura automática via leitura IMAP de alarmes da **AngelLira**.
2. **Fase 2 — Atendimento pela Torre**: operador assume o caso, registra a nota de contato com o motorista e aciona a **Unidade Responsável**.
3. **Fase 3 — Resolução pela Unidade**: filial responsável registra a solução adotada e encerra o chamado (`RESOLVIDA`).

Recursos dedicados:
- **Ocorrências por Unidade (`/ocorrencias/painel-unidades`)**: painel agrupado por filial responsável mostrando ocorrências pendentes (`ABERTA` e `EM_ATENDIMENTO`), tempo decorrido de espera, contatos do responsável da base, equipe vinculada e última telemetria do veículo.
- **Histórico de Ocorrências (`/ocorrencias/historico`)**: consulta histórica com linha do tempo completa das 3 fases (quem abriu, quem assumiu na torre, quem resolveu e horários exatos).
- **Mapa Interativo** (Leaflet + OpenStreetMap) com marcador de localização e alertas sonoros na Central.
- **Notificação automática por e-mail (SMTP)** enviada aos responsáveis da unidade.

### 🚛 Aproveitamento de Frota e Rentabilidade (`/analise/aproveitamento`)
Módulo estratégico que cruza manifestos e minutas do ERP Brudam com a planilha contratual de fornecedores (`Capacidade veiculos transferências por fornecedor.xlsx`):
- **Ocupação Física (Peso e Volume)**:
  - Calcula a taxa de ocupação em **Peso (`kg`)** e **Cubagem (`m³`)** frente à capacidade real ou contratual do veículo.
  - Classifica automaticamente a frota em `CAMINHAO` (`TRUCK`, `CAVALO MECANICO`, `VUC / 3/4`) ou `ONIBUS` (bagageiro padrão 3.000 kg / 8 m³).
  - Identifica o **gargalo predominante** da viagem (`PESO` vs `VOLUME`), calcula a **capacidade ociosa** (`kg` e `m³`) e classifica o nível de ocupação (`IDEAL`, `ATENCAO`, `CRITICA`).
  - **Detecção e correção de anomalias de volume**: identifica erros de digitação de metragem cúbica na minuta (`anomaliaVolume`) e aplica estimativa corretiva baseada na densidade padrão (250 kg/m³), preservando o valor original para auditoria.
- **Análise Financeira e Rateio por Manifesto / Minuta**:
  - Calcula **Receita Bruta Rateada**, **Custos de Pontas** (Coleta + Entrega + Seguro RCF-DC/RCT-RC), **Impostos** (9,25%), **Receita Líquida**, **Custo de Transferência do Parceiro** (Custo Motorista + Valor KM + Pedágio) e **Margem / Resultado Financeiro** (`LUCRO` ou `PREJUIZO`).
  - **Drill-down de Minutas**: ao expandir um manifesto, exibe todas as minutas vinculadas com chave CT-e, volumes, peso real/cubado/taxado, frete rateado no trecho e o **Lucro Real Global da Minuta** considerando todas as pernas de transferência pelas quais a carga passou.
- **Rankings Gerenciais**: Ranking de Parceiros/Fornecedores, Rotas com Pior Ocupação (subutilizadas) e Rotas de Maior Movimento Financeiro.

### 📊 Hub Central de Análises (`/analise`)
Centraliza 4 módulos analíticos:
1. **Analytics Operacional (`/analise/operacional`)**: KPIs gerenciais de viagens finalizadas, índice de pontualidade, ranking de rotas, distribuição de atrasos e exportação para Excel.
2. **Comparativo por Período (`/analise/comparativo`)**: comparação lado a lado entre semanas ou meses com abertura por nível de atraso na saída (Pontual, Atenção, Atrasado, Crítico) e drill-down detalhado por rota.
3. **Aproveitamento de Frota (`/analise/aproveitamento`)**: análise de ocupação física (peso/cubagem), ociosidade e margem financeira por viagem/parceiro.
4. **Atrasos por Origem (`/analise/origem`)**: ranking das bases de origem com maior incidência de atrasos para atuação focada nas filiais críticas.

### 🛡 Auditoria de Manifestos (`/auditoria-manifesto`)
- Cruza manifestos do banco ERP/Sascar cujo valor total de notas fiscais nas minutas ultrapassa **R$ 140.000** com as viagens registradas na Torre.
- **Algoritmo inteligente de vínculo**: avalia placa (com/sem hífen), janela temporal de múltiplos dias da viagem, score de compatibilidade de origem/destino na rota e trava de tolerância de 4 horas para evitar falsos positivos.
- **Conferência de Bipagens e Volumes**: exibe quantidade de minutas, total de volumes, **volumes embarcados** (bipagem tipo 1 em `historico_volume`) e **volumes desembarcados** (bipagem tipo 2 para manifestos encerrados).
- **Classificação Operacional**: diferencia automaticamente manifestos de `TRANSFERENCIA` e `COLETA_ENTREGA` com contadores e filtros dedicados.
- Exportação completa para Excel (`.xlsx`).

### 📦 Chegadas por Unidade (`/chegadas-unidade` e `/chegadas-unidade/[id]`)
- Painel agrupado por filial de destino mostrando quantas cargas **já chegaram** (`FINALIZADA`), estão **a caminho** e o total de manifestos esperados no dia.
- **Drill-down por Unidade (`/chegadas-unidade/[id]`)**: lista todos os manifestos destinados àquela filial com status da viagem vinculada e permite expandir cada manifesto para inspecionar suas **minutas** (cliente remetente, destinatário, volumes, previsão de entrega e destaque se a filial é o destino final ou trânsito).

### 🛡️ Monitoramento de Seguro — Gerenciadora Angel (`/seguradora`)
- Controla a regularidade cadastral e vigência de seguro de **Motoristas Terceiros** e **Veículos** na gerenciadora de risco **Angel**.
- **Importação de CSV**: upload direto dos relatórios exportados da Angel (motoristas e veículos) com atualização em lote no banco principal (`CadastroAngelMotorista` e `CadastroAngelVeiculo`).
- **Cruzamento ERP × Angel**:
  - Compara todos os motoristas (por CPF normalizado) e veículos (por placa normalizada) ativos no ERP com a base da Angel.
  - Classifica automaticamente a situação: **Expirado**, **Vence em ≤ 7 dias**, **Vence em ≤ 30 dias**, **Vigente/Regular** ou **Não Cadastrado na Angel**.
  - Exibe dados completos de CNH, categoria, RENAVAM, RNTRC, transportadora/proprietário e dias restantes de vigência.

### ⚙ Administração (`/admin`)
Disponível exclusivamente para o perfil `ADMIN`:
- **Gerenciar Usuários (`/admin/usuarios`)**: criar, editar, excluir usuários, configurar recebimento do relatório semanal e **redefinir senha** para a senha padrão inicial (`Princesa123`), exigindo troca no próximo login.
- **Gerenciar Bases (`/admin/bases`)**: cadastrar e editar bases/filiais com geocerca (latitude, longitude, raio em metros), nome do responsável e telefone/e-mail de contato.
- **Gerenciar Rotas Padrão (`/admin/rotas`)**: cadastrar e editar a matriz de rotas-padrão, adicionar/remover paradas intermediárias e ajustar horários previstos (`HH:MM:SS`).
- **Gerenciar Regionais (`/admin/regionais`)**: configurar gerentes regionais e associar frotas de veículos (incluindo importação via CSV).
- **Auditoria de E-mails (`/admin/emails`)**: monitorar os e-mails processados automaticamente da caixa da AngelLira e verificar as ocorrências geradas.

---

## 🏗 Arquitetura do Sistema

```
┌──────────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                            │
│                                                                      │
│   Next.js 15 App Router  ─── React 19 ─── TailwindCSS v4            │
│   tRPC Client + React Query  ─── Leaflet Maps ─── Web Audio API      │
└─────────────────────────┬────────────────────────────────────────────┘
                           │ HTTPS / tRPC (type-safe RPC over HTTP)
┌─────────────────────────▼────────────────────────────────────────────┐
│                     SERVIDOR (Next.js API)                           │
│                                                                      │
│  ┌──────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  tRPC Routers        │  │  REST API Routes (Next.js)           │  │
│  │  • viagem            │  │  • POST /api/auth/login              │  │
│  │  • manifesto         │  │  • GET  /api/sync  (telemetria/cron) │  │
│  │  • ocorrencia        │  │  • GET  /api/hora  (sincronização)   │  │
│  │  • aproveitamento    │  │  • POST /api/process-emails          │  │
│  │  • seguradora        │  │  • POST /api/relatorio-semanal       │  │
│  │  • regional          │  └──────────────────────────────────────┘  │
│  │  • conta             │                                            │
│  │  • admin             │                                            │
│  └──────────┬───────────┘                                            │
│             │                                                        │
│  ┌──────────▼────────────────────────────────────────────────────┐   │
│  │                      Services & Libs                          │   │
│  │  • viagemService           (processamento GPS/geocerca)       │   │
│  │  • capacidadeFornecedores  (matriz contratual XLSX + cache)   │   │
│  │  • emailProcessorService   (IMAP → AngelLira → Ocorrência)    │   │
│  │  • emailNotificacaoService (SMTP → notificações)              │   │
│  │  • relatorioSemanalService (Canvas PNG → e-mail gerente)      │   │
│  │  • monitor                 (sync de sessão Torre Monitoria)   │   │
│  └───────────────────────────────────────────────────────────────┘   │
└─────────┬──────────────────────────────────────────┬─────────────────┘
          │                                          │
┌─────────▼───────────────┐            ┌─────────────▼─────────────────┐
│  PostgreSQL             │            │  PostgreSQL (Sascar / ERP)    │
│  (Banco Principal)      │            │  (Telemetria / Carga / Frota) │
│                         │            │                               │
│  • Viagem / ParadaViagem│            │  • veiculos_sascar            │
│  • Telemetria           │            │  • rastreamento_sascar        │
│  • Ocorrencia           │            │  • manifesto / manifesto_list │
│  • User / Base          │            │  • minuta / historico_volume  │
│  • RotaPadrao           │            │  • veiculos / terceiros       │
│  • Regional             │            │  • motorista_terceiro         │
│  • CadastroAngel*       │            │  • fornecedores / unidades    │
└─────────────────────────┘            └───────────────────────────────┘
```

---

## 🛠 Stack Tecnológica

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| **Next.js** | 15.x (App Router) | Framework principal, SSR, API Routes e Middleware |
| **React** | 19.x | Componentes de interface |
| **TailwindCSS** | 4.x | Estilização responsiva |
| **tRPC Client** | 11.x | Chamadas RPC type-safe ponta a ponta |
| **TanStack React Query** | 5.x | Cache, polling em tempo real e mutações |
| **Leaflet + react-leaflet** | 1.9 / 5.x | Mapas interativos de viagens e ocorrências |
| **Web Audio API** | Nativa | Síntese de alertas sonoros na TV e Central de Ocorrências |
| **date-fns** | 4.x | Manipulação e formatação de datas |
| **xlsx** | 0.18 | Leitura de planilhas de viagens/capacidade e exportação Excel |
| **jsPDF + jspdf-autotable** | 4.x / 5.x | Exportação de relatórios em PDF |

### Backend
| Tecnologia | Versão | Uso |
|---|---|---|
| **tRPC Server** | 11.x | Camada de API com validação Zod |
| **Prisma** | 6.x | ORM para o banco de dados principal |
| **node-postgres (`pg`)** | 8.x | Pool de conexão direta ao banco Sascar / ERP Brudam |
| **NextAuth v5** | 5.0-beta | Autenticação JWT e controle de sessão |
| **bcryptjs** | 3.x | Hash seguro de senhas |
| **Zod** | 3.x | Validação de schemas de entrada |

### Comunicação e Processamento
| Tecnologia | Versão | Uso |
|---|---|---|
| **imapflow + mailparser** | 1.4 / 3.9 | Leitura IMAP e parse de alarmes da AngelLira |
| **nodemailer** | 8.x | Disparo SMTP de notificações e relatórios semanais |
| **@napi-rs/canvas** | 0.1.x | Renderização server-side de relatórios em PNG |

---

## 🗄 Banco de Dados

### Modelos Principais (Prisma / PostgreSQL)

| Model | Descrição |
|---|---|
| `User` | Usuários do sistema (`ADMIN`, `GERENTE`, `OPERADOR`), vínculo opcional com `Base`, flags `recebeRelatorioSemanal` e `precisaTrocarSenha`. |
| `Base` | Filiais/unidades operacionais com geocerca (`latitude`, `longitude`, `raioMetros`) e contato do responsável. |
| `Veiculo` | Frota rastreada (ID oficial Sascar ou `temp_` até a primeira sincronização, placa única de 7 caracteres). |
| `Viagem` | Registro de transferência com horários planejados, efetivos, `novaPrevisaoSaida` e status automático. |
| `ParadaViagem` | Paradas reais de cada viagem com horários previstos e efetivos preenchidos via geocerca GPS. |
| `RotaPadrao` / `ParadaPadrao` | Matriz de rotas pré-cadastradas com sequência de bases e horários-padrão (`HH:MM:SS`). |
| `Telemetria` | Posições GPS otimizadas recebidas da Sascar com retenção automática de 15 dias. |
| `JustificativaAtraso` | Justificativas operacionais (`SAIDA_BASE`, `TEMPO_PARADA_EXCEDIDO`, `DESLOCAMENTO_ROTA`). |
| `Ocorrencia` | Incidentes da viagem com fluxo de 3 fases, coordenadas GPS, vínculo com unidade responsável e idempotência por `emailMessageId`. |
| `Regional` / `VeiculoRegional` | Agrupamento de frotas por gerente regional para disparo do relatório semanal. |
| `CadastroAngelMotorista` | Base importada da gerenciadora Angel com CPF normalizado, validade e data de vigência do motorista. |
| `CadastroAngelVeiculo` | Base importada da gerenciadora Angel com placa normalizada, proprietário, CNPJ/CPF e vigência do veículo. |

---

## 📄 Módulos e Páginas

| Rota | Perfil | Descrição |
|---|---|---|
| `/login` | Público | Tela de autenticação padronizada (`LoginModal`) |
| `/trocar-senha` | Autenticado | Troca obrigatória da senha inicial (`Princesa123`) no primeiro acesso |
| `/dashboard` | Todos | Dashboard Operacional em tempo real + modo **Painel de TV** fullscreen |
| `/viagens` | Todos | Lista paginada de viagens com filtros por período e status |
| `/viagens/[id]` | Todos | Detalhe da viagem: timeline de paradas, mapa Leaflet, ocorrências e justificativas |
| `/viagens/upload` | `ADMIN` | Upload de planilha diária `.xlsx` com criação interativa de rotas ausentes |
| `/ocorrencias` | Todos | Central de Ocorrências com abertura por placa, mapa e atendimento |
| `/ocorrencias/painel-unidades` | Todos | Painel de ocorrências pendentes agrupadas por filial responsável |
| `/ocorrencias/historico` | Todos | Histórico completo de ocorrências com linha do tempo das 3 fases |
| `/analise` | Todos | Hub Central de Análises |
| `/analise/operacional` | Todos | Analytics de pontualidade, ranking de rotas e exportação Excel |
| `/analise/comparativo` | Todos | Comparativo entre semanas/meses com drill-down por rota |
| `/analise/aproveitamento` | Todos | Aproveitamento de frota (peso/cubagem), anomalias de volume e margem financeira |
| `/analise/origem` | Todos | Ranking e diagnóstico de atrasos por base de origem |
| `/auditoria-manifesto` | Todos | Auditoria de manifestos > R$ 140.000, bipagens de volumes e vínculo de viagem |
| `/chegadas-unidade` | Todos | Painel de chegadas de cargas agrupado por unidade de destino |
| `/chegadas-unidade/[id]` | Todos | Detalhamento de manifestos e minutas destinados a uma unidade específica |
| `/seguradora` | Todos | Monitoramento de Seguro (cruzamento ERP × Angel para motoristas e veículos) |
| `/admin` | `ADMIN` | Hub administrativo com indicadores gerais do sistema |
| `/admin/usuarios` | `ADMIN` | Gestão de usuários, permissões e redefinição de senha |
| `/admin/bases` | `ADMIN` | Gestão de filiais, responsáveis e geocercas |
| `/admin/rotas` | `ADMIN` | Gestão da matriz de rotas-padrão e paradas |
| `/admin/regionais` | `ADMIN` | Gestão de gerentes regionais e importação CSV de frota |
| `/admin/emails` | `ADMIN` | Auditoria de e-mails e alarmes importados da AngelLira |

---

## 🔌 API e Rotas de Integração

### tRPC Routers (`src/server/api/routers/`)

| Router | Procedures Principais |
|---|---|
| `viagem` | `uploadPlanilha`, `verificarRotasPlanilha`, `obterDashboard`, `listar`, `obterDetalhes`, `obterAnalise`, `obterComparativo`, `obterAnaliseOrigem`, `registrarJustificativa` |
| `ocorrencia` | `buscarViagemPorPlaca`, `criar`, `listar`, `assumir`, `resolver`, `listarHistorico`, `listarPorUnidade`, `obterAlertasRecentesTV`, `listarEmailsAudit` |
| `manifesto` | `auditoria`, `datasDisponiveis`, `chegadasPorUnidade`, `manifestosPorUnidade`, `minutasPorManifesto` |
| `aproveitamento` | `obterAnalise`, `obterMinutasManifesto` |
| `seguradora` | `resumoCadastros`, `importarMotoristasAngel`, `importarVeiculosAngel`, `obterCruzamentoMotoristas`, `obterCruzamentoVeiculos` |
| `regional` | `listar`, `criar`, `editar`, `excluir`, `importarCSV` |
| `conta` | `trocarSenha` |
| `admin` | `stats`, `usuarios.*` (`listar`, `criar`, `editar`, `alterarSenha`, `excluir`), `bases.*`, `rotas.*` |

### REST API Routes (`src/app/api/`)

| Rota | Método | Autenticação | Descrição |
|---|---|---|---|
| `/api/auth/[...nextauth]` | GET / POST | — | Handlers padrão do NextAuth |
| `/api/auth/login` | POST | — | Endpoint de autenticação direta com suporte a sessão monitorada |
| `/api/hora` | GET | — | Retorna timestamp exato do servidor para o hook `useHoraReal` |
| `/api/sync` | GET | Pública / Interna | Sincroniza veículos e telemetrias Sascar, atualiza geocercas e purga dados > 15 dias |
| `/api/process-emails` | POST | `CRON_SECRET` | Processa caixa IMAP da AngelLira e gera ocorrências automáticas |
| `/api/relatorio-semanal` | POST | `CRON_SECRET` | Gera imagens PNG por regional e envia relatório semanal por e-mail |

---

## ⚙ Serviços de Background

### `viagemService.ts` — Processador de Telemetria e Geocercas
- Analisa os pontos GPS em ordem cronológica dentro da janela de cada viagem ativa.
- Calcula distância geodésica via **Haversine** para detectar entrada e saída do raio de cada `Base`.
- Preenche automaticamente `dataChegadaEfetiva`, `dataSaidaEfetiva`, `dataInicioEfetivo`, `dataFimEfetivo` e transiciona o status da viagem (`PROGRAMADA` → `EM_ANDAMENTO` → `FINALIZADA`).

### `capacidadeFornecedores.ts` — Matriz Contratual de Terceiros
- Lê e mantém em cache (5 minutos) a planilha `Capacidade veiculos transferências por fornecedor.xlsx`.
- Normaliza razões sociais do ERP Brudam para os parceiros contratuais (Emiko, Transvel, JR Abraão, Dalla Corte, ABC) e localiza a rota contratual compatível para fornecer capacidade real (`kg` e `m³`) e valores acordados.

### `emailProcessorService.ts` — Importador IMAP AngelLira
- Conecta via IMAP a cada 60 segundos, filtra alarmes não lidos da AngelLira, extrai placa, viagem, tipo de alarme e link do mapa, e cria a `Ocorrencia` vinculada garantindo idempotência via `emailMessageId`.

### `emailNotificacaoService.ts` & `relatorioSemanalService.ts`
- Disparo de alertas operacionais por e-mail a cada mudança de fase de ocorrência e geração automática do quadro consolidado semanal em PNG (`@napi-rs/canvas`) toda sexta-feira às 08h00.

---

## 🔐 Autenticação, Segurança e Monitoria

- **NextAuth v5 (JWT)**: autenticação com e-mail e senha criptografada com `bcryptjs`.
- **Política de Senha Inicial (`Princesa123`)**:
  - Todo usuário recém-criado ou que teve a senha redefinida pelo administrador recebe `precisaTrocarSenha = true`.
  - O middleware bloqueia o acesso a qualquer rota do sistema e redireciona obrigatoriamente para `/trocar-senha` até que o usuário defina uma senha pessoal segura (mínimo de 8 caracteres e diferente da senha inicial).
- **Integração com a Torre de Monitoria (`src/lib/monitor.ts`)**:
  - A cada requisição autenticada, o middleware sincroniza a presença da sessão (`syncUserSession`) com a Torre de Monitoria (`MONITOR_URL`), enviando identificação do usuário, perfil e endereço IP.
  - Caso o administrador revogue a sessão remotamente na Torre de Monitoria (`revoked: true`), o middleware invalida imediatamente todos os cookies de autenticação e desconecta o usuário em tempo real.

---

## 📡 Integração com Sascar e ERP (Telemetria e Carga)

### Otimização de Sincronização (`/api/sync`)
1. **Deduplicação e Migração Segura de Veículos**: prioriza placas canônicas de 7 caracteres de `veiculos_sascar` e migra via transação SQL apenas veículos temporários (`temp_`), evitando locks na tabela de telemetria.
2. **Amostragem Inteligente de GPS**: filtra o fluxo bruto de `rastreamento_sascar` mantendo apenas **1 ponto a cada 60 segundos** por veículo ou mudanças imediatas no status de **ignição**, reduzindo em ~90% o armazenamento sem perda de precisão nas geocercas.
3. **Retenção Automática (15 dias)**: ao final de cada ciclo de sincronização, remove automaticamente registros de `Telemetria` com mais de 15 dias (`dataHoraLocal < NOW() - 15 days`), mantendo o banco leve e rápido.

---

## 📧 Integração com AngelLira (Alarmes e Seguros)

### 1. Importação Automática de Alarmes (IMAP)
Mapeia automaticamente assuntos de e-mail para categorias padronizadas de ocorrência (Excesso de Velocidade, Fadiga do Motorista, Parada Não Autorizada, Bloqueio de Veículo, Desvio de Rota, Violação de Geocerca, Perda de Sinal GPS).

### 2. Monitoramento de Seguros (`/seguradora`)
Cruza as tabelas `motorista_terceiro` e `veiculos` do ERP com os dados importados da gerenciadora Angel (`CadastroAngelMotorista` e `CadastroAngelVeiculo`), destacando cadastros expirados, prestes a vencer (7 e 30 dias) ou ausentes antes da liberação de viagens.

---

## 📈 Relatório Semanal Automático

Gerado com `@napi-rs/canvas`:
- Renderiza uma tabela em alta definição (PNG) contendo as ocorrências da semana para os veículos de cada `Regional`.
- Enviado automaticamente toda **sexta-feira às 08h00** via PM2 cron (`0 8 * * 5`) para os usuários marcados com `recebeRelatorioSemanal: true`.

---

## 🚀 Setup e Instalação

### Pré-requisitos
- Node.js 20+ / npm 11+
- PostgreSQL 15+ (banco principal)
- Acesso de leitura ao banco PostgreSQL Sascar / ERP Brudam
- PM2 (para ambiente de produção)

### Desenvolvimento Local

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Subir banco PostgreSQL local via Docker
docker compose up -d

# 4. Sincronizar schema do Prisma com o banco
npm run db:push

# 5. Popular dados iniciais (usuários, bases, rotas e regionais)
npm run db:seed
npm run db:seed-rotas

# 6. Iniciar servidor de desenvolvimento (Turbopack)
npm run dev
```

Acesse em `http://localhost:3000`.

---

## 🔑 Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `AUTH_SECRET` | ✅ | Segredo do NextAuth (32 bytes base64) |
| `AUTH_URL` | Em produção | URL base da aplicação (ex: `http://172.20.10.210:3001`) |
| `DATABASE_URL` | ✅ | Connection string PostgreSQL do banco principal |
| `TELEMETRIA_DB_URL` | ✅ | Connection string PostgreSQL do banco Sascar / ERP Brudam |
| `MONITOR_URL` | Opcional | URL da Torre de Monitoria (padrão: `http://localhost:3100`) |
| `EMAIL_IMAP_HOST` | Para cron | Servidor IMAP da caixa de alarmes AngelLira |
| `EMAIL_IMAP_PORT` | Para cron | Porta IMAP (`993` SSL ou `143` STARTTLS) |
| `EMAIL_IMAP_USER` | Para cron | Usuário da caixa IMAP |
| `EMAIL_IMAP_PASS` | Para cron | Senha da caixa IMAP |
| `EMAIL_SMTP_HOST` | Para e-mails | Servidor SMTP para disparo de notificações e relatórios |
| `EMAIL_SMTP_USER` | Para e-mails | Usuário SMTP |
| `EMAIL_SMTP_PASS` | Para e-mails | Senha SMTP |
| `CRON_SECRET` | Para crons | Token Bearer para autenticação das rotas de cron |
| `ANGELLIRA_BOT_USER_ID` | Para cron | ID do usuário bot atribuído às ocorrências automáticas |
| `NODE_ENV` | ✅ | `development` ou `production` |

---

## 📜 Scripts Disponíveis

| Script | Comando | Descrição |
|---|---|---|
| Dev | `npm run dev` | Inicia servidor Next.js em desenvolvimento com Turbopack |
| Build | `npm run build` | Gera build otimizado de produção |
| Start | `npm run start` | Inicia servidor de produção |
| Lint | `npm run lint` | Executa análise estática com ESLint |
| Typecheck | `npm run typecheck` | Verifica tipagem com TypeScript (`tsc --noEmit`) |
| Format | `npm run format:write` | Formata código com Prettier |
| DB Push | `npm run db:push` | Sincroniza `schema.prisma` diretamente no banco |
| DB Migrate | `npm run db:migrate` | Aplica migrações em produção (`prisma migrate deploy`) |
| DB Seed | `npm run db:seed` | Popula usuários e bases iniciais |
| DB Seed Rotas | `npm run db:seed-rotas` | Popula a matriz de rotas-padrão |
| DB Studio | `npm run db:studio` | Abre interface visual Prisma Studio |

---

## 🖥 Deploy em Produção

### Processos PM2 (`ecosystem.config.cjs`)

| Processo | Trigger | Descrição |
|---|---|---|
| `transferencia` | Contínuo (porta 3001) | Servidor Next.js principal |
| `email-cron` | Loop a cada 60s | Polling IMAP de alarmes da AngelLira |
| `relatorio-semanal` | Cron `0 8 * * 5` | Disparo do relatório semanal toda sexta-feira às 08h00 |

### Comandos de Deploy

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
│   ├── schema.prisma              # Schema completo do banco principal
│   ├── seed.ts                    # Seed inicial (usuários e bases)
│   ├── seed-rotas.ts              # Seed da matriz de rotas-padrão
│   └── seed-regionais.ts          # Seed de regionais e veículos por gerente
│
├── scripts/
│   ├── email-cron.mjs             # Processo PM2: polling IMAP AngelLira (60s)
│   └── relatorio-semanal-cron.mjs # Processo PM2: relatório semanal (sexta 08h)
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── _components/           # Navbar (menu retrátil) e SignOutButton
│   │   ├── admin/                 # Hub Admin: usuarios, bases, rotas, regionais, emails
│   │   ├── analise/               # Hub de Análises: operacional, comparativo, aproveitamento, origem
│   │   ├── api/                   # REST APIs: auth, hora, sync, process-emails, relatorio-semanal
│   │   ├── auditoria-manifesto/   # Auditoria de manifestos > R$ 140k e bipagens
│   │   ├── chegadas-unidade/      # Painel de chegadas por filial e drill-down [id]
│   │   ├── dashboard/             # Dashboard Operacional, PainelTV e ModalAlertaOcorrenciaTV
│   │   ├── login/                 # Página de autenticação
│   │   ├── ocorrencias/           # Central de ocorrências, painel-unidades, historico e alertaSonoro
│   │   ├── seguradora/            # Monitoramento de Seguro (ERP × Angel)
│   │   ├── trocar-senha/          # Troca obrigatória de senha no primeiro acesso
│   │   ├── viagens/               # Lista, detalhe [id] e upload de planilha
│   │   ├── layout.tsx             # Layout raiz
│   │   └── page.tsx               # Redirect inicial → /dashboard
│   │
│   ├── components/                # LoginModal, TrocarSenhaModal, TruckLoader
│   ├── hooks/
│   │   └── useHoraReal.ts         # Relógio sincronizado com o servidor
│   ├── lib/
│   │   ├── logoBase64.ts          # Asset base64 para relatórios
│   │   └── monitor.ts             # Integração com a Torre de Monitoria (sync/revoke session)
│   ├── middleware.ts              # Proteção de rotas, troca de senha e sync de monitoria
│   │
│   ├── server/
│   │   ├── api/
│   │   │   ├── routers/           # tRPC: viagem, ocorrencia, manifesto, aproveitamento, seguradora, regional, conta, admin
│   │   │   ├── root.ts            # Router raiz tRPC
│   │   │   └── trpc.ts            # Contexto e procedures protegidas
│   │   ├── auth/                  # Configuração NextAuth v5
│   │   ├── services/
│   │   │   ├── capacidadeFornecedores.ts   # Leitura e cache da planilha de capacidade de terceiros
│   │   │   ├── emailNotificacaoService.ts  # Disparo SMTP de avisos de ocorrência
│   │   │   ├── emailProcessorService.ts    # Leitura IMAP AngelLira
│   │   │   ├── relatorioSemanalService.ts  # Geração de PNG com Canvas + envio SMTP
│   │   │   └── viagemService.ts            # Processamento GPS + geocerca Haversine
│   │   ├── utils/                 # geolocalizacao, sascarUtils, stringUtils
│   │   ├── db.ts                  # Cliente Prisma (banco principal)
│   │   └── db-telemetria.ts       # Pool pg (banco Sascar / ERP Brudam)
│   │
│   ├── styles/                    # Estilos globais TailwindCSS
│   ├── trpc/                      # Provider tRPC + React Query
│   └── utils/                     # Utilitários de formatação e regras Brudam
│
├── Capacidade veiculos transferências por fornecedor.xlsx # Base contratual de capacidades
├── docker-compose.yml             # PostgreSQL local para desenvolvimento
├── ecosystem.config.cjs           # Configuração de processos PM2
└── .env.example                   # Template de variáveis de ambiente
```

---

## 📝 Notas Técnicas

### Sincronização de Relógio (`useHoraReal`)
TVs e computadores de operação frequentemente apresentam desvio no relógio local do sistema operacional. O hook consulta `/api/hora`, calcula o offset compensando metade da latência de rede (RTT/2) e mantém o relógio do Painel de TV e os cálculos de contagem regressiva sincronizados com o servidor.

### Inferência de Capacidade e Tratamento de Anomalias de Cubagem
No módulo de **Aproveitamento de Frota** (`aproveitamento.ts`), registros de veículos no ERP que possuem capacidades genéricas/dummy (ex.: `999.99` ou valores em toneladas) são normalizados automaticamente combinando:
1. A matriz contratual da planilha de fornecedores (`RotaContratual`);
2. O modelo e categoria do veículo (`CAVALO MECANICO`, `TRUCK`, `VUC / 3/4`, `ONIBUS`).
Além disso, minutas com erro de digitação de metragem cúbica (`metragem_cubica > 120 m³` ou relação volume/peso incompatível) são sinalizadas com a flag `anomaliaVolume` e têm seu volume estimado pela densidade padrão de carga geral (`250 kg/m³`), evitando distorções nas médias de ocupação da frota.

### Cálculo de Data Absoluta em Rotas Noturnas
A função `calcularDataAbsoluta` resolve rotas que cruzam a meia-noite: ancora o horário `HH:MM:SS` de cada parada intermediária na data de início da viagem e incrementa automaticamente o dia sempre que o horário previsto da parada seguinte for cronologicamente menor que o da parada anterior.

---

*Sistema desenvolvido para uso interno — Princesa dos Campos · Setor de Transferências*
