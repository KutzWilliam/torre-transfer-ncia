# 🚛 Torre de Controle — Sistema de Gestão de Transferências
### Apresentação Executiva · Princesa dos Campos

---

## 1. O Problema que Existia

Antes do sistema, a operação de transferências enfrentava desafios críticos do dia a dia:

| Situação Anterior | Impacto |
|---|---|
| Controle de viagens em **planilhas manuais e descentralizadas** | Informação desatualizada, erros de digitação, retrabalho |
| Acompanhamento de atrasos feito **por telefone** ou visualmente | Tempo de resposta lento, falhas de comunicação |
| Ocorrências (pneu furado, acidentes, avarias) **registradas informalmente** | Sem histórico, sem responsabilização, sem métricas |
| Manifestos de alto valor **sem cruzamento operacional** | Risco financeiro e de segurança de carga não monitorado |
| Motoristas e veículos de terceiros com **seguro não monitorado** | Exposição a riscos jurídicos e financeiros por veículos sem cobertura |
| Relatórios para gestores feitos **manualmente toda semana** | Horas de trabalho improdutivo toda sexta-feira |

> [!CAUTION]
> **A operação funcionava no escuro.** Decisões críticas eram tomadas sem dados confiáveis em tempo real, aumentando o risco operacional e financeiro da empresa.

---

## 2. A Solução: Torre de Controle

A **Torre de Controle** é um sistema web interno, desenvolvido sob medida para a Princesa dos Campos, que centraliza e automatiza toda a gestão das operações de transferência de cargas.

```
Uma única tela. Todas as viagens. Em tempo real.
```

O sistema foi desenvolvido internamente, sem custo de licença de software terceiro, utilizando tecnologias modernas e consolidadas no mercado.

---

## 3. O que o Sistema Faz — Funcionalidades

### 📡 Monitoramento em Tempo Real
- Rastreamento de **todas as viagens simultâneas** do dia via integração direta com a telemetria GPS da **Sascar**.
- **Classificação automática de atrasos** em 4 níveis: Pontual → Atenção → Atrasado → Crítico.
- **Previsão de chegada calculada automaticamente** com base na velocidade real e distância restante.
- Atualização automática a cada **30 segundos**, sem necessidade de ação manual.

### 📺 Painel de TV para a Sala de Operações
- Modo fullscreen otimizado para **monitores e TVs** da torre.
- KPIs visuais em destaque: viagens em rota, atrasadas, críticas, concluídas.
- Relógio sincronizado com o servidor — corrige automaticamente relógios desatualizados dos equipamentos.

### 🚨 Gestão Estruturada de Ocorrências
- Registro formal de incidentes com **fluxo de 3 fases**: Abertura → Atendimento da Torre → Resolução pela Unidade.
- Tipos suportados: Pneu Furado, Avaria Mecânica, Acidente, Atraso de Tráfego, Problema com Carga, Combustível, Interdição, Documentação, entre outros.
- **Integração automática com a AngelLira**: alarmes de segurança (velocidade excessiva, fadiga, desvio de rota, etc.) chegam por e-mail e são convertidos em ocorrências no sistema **automaticamente**, sem intervenção humana.
- Mapa interativo mostrando exatamente onde a ocorrência aconteceu.
- **Notificação automática por e-mail** à unidade responsável pela resolução.

### 🛡 Gestão de Seguros — Motoristas e Veículos de Terceiros
- **Painel dedicado** cruzando os cadastros do ERP interno com os cadastros da gerenciadora de seguros (Angel).
- Identificação imediata de motoristas e veículos que **estão no ERP mas não possuem seguro ativo**.
- **Alerta automático** com antecedência de 7 dias para vencimento de seguros — tempo hábil para o operador acionar a transportadora.
- Visibilidade completa por transportadora: qual empresa, quais motoristas, qual a validade do seguro.

### 💰 Auditoria de Manifestos de Alto Valor
- Cruzamento automático entre **manifestos financeiros acima de R$ 140.000** e as viagens registradas no sistema.
- Identifica imediatamente cargas de alto valor **sem viagem correspondente** — potencial risco de desvio ou falha operacional.
- KPI em tempo real: valor total em trânsito auditado, manifestos com alerta, manifestos OK.
- Exportação para Excel para análise e arquivamento.

### 📊 Análise Histórica de Atrasos
- Dashboard analítico com filtros por período (dia, semana, mês, período customizado).
- Tipos de análise: recuperação de atraso, atraso na rota, atraso total.
- Base de dados para tomada de decisão sobre rotas, horários e fornecedores.

### 📧 Relatório Semanal Automático para Gestores
- Todo **sexta-feira às 08h00**, o sistema gera e envia automaticamente por e-mail o consolidado de ocorrências da semana para cada gerente regional.
- Elimina completamente o trabalho manual de compilação de relatórios.

---

## 4. Benefícios Diretos e Ganhos Financeiros

> [!IMPORTANT]
> Os benefícios abaixo são concretos e mensuráveis. Cada um deles representa **horas de trabalho economizadas, riscos evitados e decisões mais inteligentes**.

### 💵 Redução de Riscos Financeiros

| Risco Mitigado | Como o Sistema Ajuda | Impacto Potencial |
|---|---|---|
| **Veículo sem seguro em rota** | Alerta 7 dias antes do vencimento | Evita sinistros sem cobertura (prejuízo pode ser de centenas de milhares de reais) |
| **Carga de alto valor sem rastreamento** | Auditoria de manifestos > R$ 140k | Reduz risco de desvio e perda de carga |
| **Atraso não identificado a tempo** | Classificação automática em 4 níveis | Permite intervenção rápida antes que o atraso se torne crítico |
| **Ocorrência sem responsável definido** | Fluxo formal de 3 fases com notificação | Garante que toda ocorrência tem um dono e um prazo de resolução |

### ⏱ Ganho de Produtividade

| Atividade | Antes | Depois |
|---|---|---|
| Monitorar status de viagens | Ligações telefônicas constantes | Dashboard em tempo real, zero ligações |
| Gerar relatório semanal para gestores | Horas de trabalho manual toda sexta | **Automático, zero minutos de trabalho** |
| Registrar e acompanhar ocorrências | Informal (WhatsApp, e-mail avulso) | Sistema estruturado com histórico completo |
| Verificar seguros de motoristas | Consulta manual planilha a planilha | Painel unificado com alertas automáticos |
| Cruzar manifestos com viagens | Impossível manualmente em escala | Automático, resultado em segundos |

### 📈 Qualidade de Decisão

- Gestores recebem **dados confiáveis** para tomar decisões sobre rotas, transportadoras e fornecedores.
- Histórico de atrasos por rota permite **renegociar contratos** e ajustar rotas-padrão com base em evidências.
- Histórico de ocorrências por veículo e por transportadora permite **avaliar o desempenho de fornecedores** com dados objetivos.

---

## 5. Integrações Técnicas — O Sistema Não Trabalha Isolado

O sistema é um hub de integração que conecta múltiplas fontes de dados em um único painel:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Sascar (GPS)   │────▶│                 │◀────│  ERP Interno    │
│  Telemetria     │     │  Torre de       │     │  Motoristas     │
│  em tempo real  │     │  Controle       │     │  Veículos       │
└─────────────────┘     │                 │     └─────────────────┘
                        │  ◀── Painel ──▶ │
┌─────────────────┐     │   Unificado     │     ┌─────────────────┐
│  AngelLira      │────▶│                 │◀────│  Gerenciadora   │
│  Alarmes via    │     │                 │     │  de Seguros     │
│  e-mail         │     └─────────────────┘     │  (Angel)        │
└─────────────────┘                             └─────────────────┘
```

**Sem o sistema**, cada uma dessas fontes precisaria ser consultada separadamente, manualmente, sem cruzamento de dados.

---

## 6. Segurança e Controle de Acesso

O sistema possui controle de acesso por perfil de usuário:

| Perfil | Acesso |
|---|---|
| **Administrador** | Acesso total, configurações, usuários, rotas |
| **Gerente** | Dashboard, viagens, análises, auditorias |
| **Operador** | Dashboard operacional e gestão de ocorrências |

- Autenticação com **usuário e senha** (hash bcrypt, padrão de mercado).
- Todas as rotas são protegidas — impossível acessar sem login.
- Sistema roda na **intranet corporativa**, sem exposição à internet.

---

## 7. Escalabilidade e Manutenção

O sistema foi desenvolvido com tecnologias modernas e amplamente adotadas no mercado:

- **Next.js 15 + React 19**: Framework utilizado por grandes empresas como Vercel, Airbnb e outros.
- **PostgreSQL**: Banco de dados relacional robusto, gratuito e de nível enterprise.
- **Prisma ORM**: Controle de banco de dados com histórico de mudanças rastreável.
- **PM2**: Gerenciamento de processos em produção com reinício automático em caso de falha.

> [!TIP]
> Por ser desenvolvido internamente, **qualquer nova necessidade do negócio pode ser implementada rapidamente**, sem depender de fornecedores externos ou pagar por funcionalidades adicionais.

---

## 8. O Investimento

| Item | Custo |
|---|---|
| Licença de software | **R$ 0,00** (desenvolvimento interno) |
| Infraestrutura (servidor interno) | Custo já existente na empresa |
| Banco de dados PostgreSQL | **R$ 0,00** (open source) |
| Integrações (Sascar, AngelLira) | Utiliza conexões já existentes |
| **Total de custo de licença** | **R$ 0,00** |

O único investimento é o **tempo de desenvolvimento interno**, que gerou uma ferramenta proprietária da empresa, que pode ser evoluída continuamente sem custos adicionais de licença.

---

## 9. O que Ainda Pode ser Desenvolvido

O sistema já está em produção e funcionando, mas tem capacidade de crescer com a empresa:

- [ ] App mobile para operadores de pátio
- [ ] Integração com sistema de NF-e para rastreamento de documentos
- [ ] Painel de performance de transportadoras terceirizadas
- [ ] Alertas por WhatsApp/SMS para gestores
- [ ] Dashboard financeiro com custo por viagem e por rota
- [ ] Integração com mais gerenciadoras de risco além da Angel

---

## 10. Conclusão

A **Torre de Controle** transforma a operação de transferências de um processo **reativo** (descobrir problemas depois que acontecem) para um processo **proativo** (ver os problemas antes que se tornem críticos).

> [!NOTE]
> Um sistema que **paga por si mesmo** ao evitar um único sinistro de carga sem seguro, ou ao identificar uma única carga de alto valor sem viagem correspondente.

**O que foi construído:**
- ✅ Sistema web completo e em produção
- ✅ Integração com GPS em tempo real (Sascar)
- ✅ Integração com gerenciadora de riscos (AngelLira)
- ✅ Integração com ERP interno
- ✅ Gestão de seguros com alertas automáticos
- ✅ Auditoria de manifestos financeiros
- ✅ Relatórios automáticos para gestores
- ✅ Histórico completo de ocorrências
- ✅ Controle de acesso por perfil
- ✅ Painel de TV para sala de operações

---

*Desenvolvido por: William Kutz · Setor de TI / Operações*
*Sistema: Torre de Controle — Transferências · Princesa dos Campos*
*Versão do documento: Outubro 2026*
