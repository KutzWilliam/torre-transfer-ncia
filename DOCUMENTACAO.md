# 🚛 Torre de Controle — Manual do Usuário

Bem-vindo à **Torre de Controle**, o sistema da **Princesa dos Campos** para acompanhar as viagens de transferência, tratar ocorrências e analisar o desempenho da operação, tudo em um só lugar.

> 📸 **Imagens:** cada tela tem um espaço `![...](imagens/arquivo.png)`. Salve o print na pasta `imagens/` (ao lado deste arquivo) com o nome indicado.

---

## Índice

1. [O que é o sistema](#1-o-que-é-o-sistema)
2. [Como acessar](#2-como-acessar)
3. [Menu de navegação](#3-menu-de-navegação)
4. [Dashboard Operacional](#4-dashboard-operacional)
5. [Painel de TV](#5-painel-de-tv)
6. [Lista de Viagens](#6-lista-de-viagens)
7. [Detalhe da Viagem](#7-detalhe-da-viagem)
8. [Upload de Planilha](#8-upload-de-planilha-admin)
9. [Central de Ocorrências](#9-central-de-ocorrências)
10. [Ocorrências por Unidade](#10-ocorrências-por-unidade)
11. [Histórico de Ocorrências](#11-histórico-de-ocorrências)
12. [Análise de Atrasos](#12-análise-de-atrasos)
13. [Auditoria de Manifestos](#13-auditoria-de-manifestos)
14. [Chegadas por Unidade](#14-chegadas-por-unidade)
15. [Monitoramento de Seguro](#15-monitoramento-de-seguro)
16. [Administração](#16-administração-admin)
17. [Automações do sistema](#17-automações-do-sistema)
18. [Glossário e dúvidas frequentes](#18-glossário-e-dúvidas-frequentes)

---

## 1. O que é o sistema

A Torre de Controle reúne em uma única plataforma:

- 📍 **Acompanhamento em tempo real** das viagens, com a posição do veículo vinda do rastreador (Sascar).
- ⏱ **Alertas automáticos de atraso**, sem precisar conferir planilhas.
- 🚨 **Gestão de ocorrências** (pneu furado, acidente, alarmes da AngelLira etc.), do aviso até a resolução.
- 🛡 **Auditoria de manifestos** de alto valor.
- 📊 **Análises gerenciais** de pontualidade, rotas e bases.
- 📑 **Monitoramento dos cadastros de seguro** (motoristas e veículos na Angel).
- 📧 **Relatório semanal** enviado automaticamente aos gerentes.

### Quem usa

| Perfil | O que pode fazer |
|---|---|
| **Operador** | Acompanhar viagens e registrar/atender ocorrências |
| **Gerente** | Tudo do operador + análises, auditoria e seguro |
| **Administrador** | Tudo + upload da planilha diária e cadastros do sistema |

---

## 2. Como acessar

![Tela de login](imagens/login.png)

1. Abra o endereço do sistema no navegador.
2. Informe seu **e-mail** e **senha**.
3. Clique em entrar. Você será levado ao Dashboard.

Se a sessão expirar, o sistema volta ao login e, depois de entrar, retorna à página onde você estava. Para sair, use o botão **Sair** no menu superior.

### Primeiro acesso (senha inicial)

Todo usuário novo é criado com a senha inicial **`Princesa123`**. No primeiro login o sistema pede automaticamente que você **crie uma nova senha**:

![Tela de troca de senha](imagens/trocar-senha.png)

1. Entre com seu e-mail e a senha inicial `Princesa123`.
2. Na tela *Crie sua nova senha*, informe a senha atual (inicial), a **nova senha** (mínimo de 8 caracteres, diferente da inicial) e a confirmação.
3. Clique em **Salvar nova senha**. Você voltará ao login: entre agora com a nova senha.

Enquanto a senha inicial não for trocada, nenhuma outra tela do sistema fica disponível.

> Esqueceu a senha? Peça a um administrador: ele pode **redefinir** sua senha para `Princesa123`, e você criará uma nova no próximo acesso.

---

## 3. Menu de navegação

![Menu superior](imagens/menu.png)

O menu fica no topo de todas as telas e mostra o seu e-mail logado:

| Item | Para que serve |
|---|---|
| Dashboard Operacional | Acompanhar viagens do dia |
| Central de Ocorrências | Abrir e atender ocorrências |
| Ocorrências por Unidade | Ver pendências de cada filial |
| Lista de Viagens | Consultar viagens por período |
| Análise de Atrasos | Relatórios e indicadores |
| Auditoria Manifestos | Conferir manifestos de alto valor |
| Chegadas por Unidade | Cargas que chegam em cada filial |
| Monitoramento de Seguro | Validade dos cadastros na Angel |
| Upload de Planilha *(admin)* | Importar a programação diária |
| Administração *(admin)* | Cadastros do sistema |

---

## 4. Dashboard Operacional

![Dashboard Operacional](imagens/dashboard.png)

**Para que serve:** é a tela principal. Mostra todas as viagens do período escolhido e se atualiza sozinha a cada **30 segundos**.

### O que você vê
- **Tabela de viagens** com: número da viagem, placa, motorista, rota, horários de saída e chegada (**previsto, real e diferença**), próxima parada, alerta e situação.
- **Barra de progresso** do percurso, calculada pelo GPS, e a **previsão de chegada** conforme a velocidade atual.
- **Selo de chegada antecipada** quando o veículo chega 30 min ou mais antes do previsto.
- **Ícone ⚠** nas viagens com ocorrência em andamento.

### O que você pode fazer
- Trocar o período: **Hoje, Ontem, Esta Semana, Este Mês** ou uma data específica.
- Filtrar por status, origem, destino ou nível de alerta, e buscar por texto (placa, motorista, rota...).
- Clicar em uma viagem para abrir o detalhe.
- **Sincronizar** manualmente os dados do GPS.
- Abrir o **Painel de TV**.

### Como ler os alertas

| Alerta | Significado |
|---|---|
| 🟢 **Pontual** | Dentro do prazo |
| 🟡 **Atenção** | 1 a 30 min de atraso |
| 🟠 **Atrasado** | 31 a 120 min de atraso |
| 🔴 **Crítico** | Mais de 120 min de atraso |
| ⚫ **Sem sinal** | Rastreador sem comunicar há mais de 2 horas |

---

## 5. Painel de TV

![Painel de TV](imagens/painel-tv.png)

**Para que serve:** exibir a operação em monitores/TVs da sala de controle, em tela cheia.

- **Indicadores no topo:** Em Rota, Atrasadas, Críticas (piscando) e Concluídas.
- **Troca de página automática** a cada 60 segundos, com barra de contagem regressiva.
- **Filtros rápidos:** Em Rota, Concluídas, Próximas 6h, e período por data.
- **Relógio sincronizado com o servidor**, para que a TV nunca mostre hora errada.
- **Controle de som (🔊 / 🔇):** no cabeçalho, permite ativar ou silenciar os alertas sonoros da TV.
- **Botão Testar:** no cabeçalho, permite simular e demonstrar o alerta na TV.
- Para sair, pressione **ESC** (caso haja um alerta de ocorrência na tela, o primeiro ESC fecha apenas o alerta).

### 🚨 Alerta em Tempo Real de Ocorrências na TV
Sempre que ocorrer uma movimentação em ocorrências, o Painel da TV emite um **alerta sonoro automático** e exibe um **modal central** com todas as informações essenciais:

![Alerta de ocorrência na TV](imagens/painel-tv-alerta.png)

1. **Nova Ocorrência (🚨 Vermelho):** toca bip de atenção urgente repetido e exibe veículo/placa, viagem, motorista, rota (origem → destino), tipo do problema e descrição completa relatada.
2. **Em Atendimento (⚠️ Âmbar):** toca tom de atenção e atualiza a tela informando quem da Torre assumiu o caso, qual unidade/filial foi acionada e as instruções alinhadas com o motorista.
3. **Resolução (✅ Verde):** toca tom harmonioso de sucesso confirmando a liberação do veículo, quem concluiu e a descrição da solução aplicada.

O modal fecha automaticamente após 20 segundos com contagem regressiva em tempo real na tela, ou pode ser dispensado a qualquer momento com a tecla **ESC** ou pelo botão dispensar. Se houver mais de um alerta simultâneo, o painel organiza em fila (ex.: "1 de 2").

Abra pelo botão de TV no Dashboard.

---

## 6. Lista de Viagens

![Lista de Viagens](imagens/viagens-lista.png)

**Para que serve:** consultar qualquer viagem, passada ou futura, de forma paginada.

- Filtre por **período** e **status** (Programada, Em andamento, Finalizada, Cancelada).
- Clique na viagem para ver todos os detalhes.

---

## 7. Detalhe da Viagem

![Detalhe da Viagem](imagens/viagem-detalhe.png)

**Para que serve:** ver tudo sobre uma única viagem.

- **Dados gerais:** motorista, veículo, rota, origem e destino, previsto × realizado.
- **Linha do tempo das paradas:** chegada e saída previstas e efetivas de cada base.
- **Mapa** com a posição do veículo e o trajeto.
- **Ocorrências** registradas na viagem.
- **Justificativas de atraso** (saída, tempo de parada excedido ou deslocamento) com motivo, minutos e quem registrou.

> **Transbordo:** se o veículo chega atrasado a uma base intermediária, o sistema recalcula até que horas ele pode sair (*nova previsão de saída*).

---

## 8. Upload de Planilha *(admin)*

![Upload de Planilha](imagens/upload.png)

**Para que serve:** importar a programação diária de transferências.

**Passo a passo**
1. Acesse **Upload de Planilha**.
2. Selecione o arquivo Excel (`.xlsx`) do relatório de viagens.
3. Confira o resumo e confirme a importação.
4. Acompanhe o resultado (viagens criadas/atualizadas).

**O sistema faz automaticamente:**
- Cria a viagem ou atualiza se ela já existir (não duplica).
- Associa a **rota padrão** (mesmo com diferença de acento ou maiúsculas).
- Cadastra bases novas, se necessário.
- Escolhe a placa correta (programada, mobile ou reboque) conforme o rastreador.
- Monta as paradas e horários previstos.

---

## 9. Central de Ocorrências

![Central de Ocorrências](imagens/ocorrencias.png)

**Para que serve:** registrar e tratar qualquer problema de uma viagem. Novas ocorrências emitem um **alerta sonoro**.

### Como uma ocorrência funciona (3 fases)

| Fase | Quem | O que acontece |
|---|---|---|
| 1. **Abertura** | Torre ou sistema | Registra tipo e descrição. A localização do veículo é copiada automaticamente. |
| 2. **Atendimento** | Torre | Assume o caso, liga ao motorista, anota o que foi combinado e define a **unidade responsável**. |
| 3. **Resolução** | Unidade | Registra como foi resolvido. A ocorrência fica como **Resolvida**. |

### Como abrir uma ocorrência
1. Clique para criar nova ocorrência.
2. Digite a **placa** — o sistema localiza a viagem.
3. Escolha o **tipo** e descreva o problema.
4. Salve.

**Tipos:** Pneu Furado, Avaria Mecânica, Acidente, Atraso de Tráfego, Problema com Carga, Combustível, Interdição de Via, Problema com Documentação e Outro.

### Ocorrências automáticas
Alarmes enviados por e-mail pela **AngelLira** (excesso de velocidade, fadiga, parada não autorizada, desvio de rota, perda de sinal etc.) viram ocorrências sozinhos, sem duplicar.

### Outros recursos
- **Mapa** com o local da ocorrência.
- **Notificação por e-mail** ao responsável da unidade.
- Status: 🔴 Aberta → 🟠 Em atendimento → 🟢 Resolvida.

---

## 10. Ocorrências por Unidade

![Ocorrências por Unidade](imagens/ocorrencias-unidades.png)

**Para que serve:** mostrar, para cada filial, quais ocorrências estão aguardando ação e **há quanto tempo** (ex.: "há 1h 20m"). Ideal para cobrar respostas.

---

## 11. Histórico de Ocorrências

![Histórico de Ocorrências](imagens/ocorrencias-historico.png)

**Para que serve:** consultar o que já aconteceu. Cada ocorrência mostra a linha do tempo: **aberta (por quem/quando) → torre assumiu → resolvida (por quem/quando e como)**.

---

## 12. Análise de Atrasos

![Hub de Análises](imagens/analise.png)

**Para que serve:** entender o desempenho da operação. A tela inicial reúne três módulos:

### 📊 Analytics Operacional
![Analytics Operacional](imagens/analise-operacional.png)

Indicadores das viagens finalizadas: **pontualidade**, **ranking de rotas**, distribuição de atrasos e tabela detalhada com **exportação para Excel**.

### 🔁 Comparativo por Período
![Comparativo por Período](imagens/analise-comparativo.png)

Compara semanas ou meses lado a lado e mostra quantas rotas atrasaram na saída por nível (Pontual → Crítico). Clique em uma rota para ver os detalhes.

### 📍 Atrasos por Origem
![Atrasos por Origem](imagens/analise-origem.png)

Ranking das bases de origem com mais atrasos, para direcionar ações nas unidades mais críticas.

---

## 13. Auditoria de Manifestos

![Auditoria de Manifestos](imagens/auditoria.png)

**Para que serve:** garantir que toda carga de alto valor tenha uma viagem registrada no sistema.

- Analisa manifestos com valor total acima de **R$ 140.000**.
- **✅ OK:** existe viagem correspondente.
- **⚠ Alerta:** manifesto sem viagem — precisa de verificação.
- Mostra: total auditado, quantidade com alerta, OK e valor em trânsito.
- Filtros por data, placa e busca; botão para **exportar em Excel**.

---

## 14. Chegadas por Unidade

![Chegadas por Unidade](imagens/chegadas.png)

**Para que serve:** cada filial vê quantas cargas **já chegaram**, quantas estão **a caminho** e o total esperado no dia, com barra de progresso.

Clique em uma unidade para ver os **manifestos e minutas** dela.

![Detalhe da unidade](imagens/chegadas-detalhe.png)

---

## 15. Monitoramento de Seguro

![Monitoramento de Seguro](imagens/seguradora.png)

**Para que serve:** controlar se os **motoristas** e **veículos** estão com cadastro válido na gerenciadora de risco **Angel**.

- **Importação:** envie os arquivos CSV exportados da Angel (um de motoristas, outro de veículos).
- **Aba Motoristas:** nome, CNH/categoria, vigência na Angel e último cadastro.
- **Aba Veículos:** placa, modelo/marca, proprietário e vigência.
- Cruza as informações com a operação para destacar cadastros **vencidos ou ausentes**.
- Mostra a data da última importação — mantenha os dados atualizados.

---

## 16. Administração *(admin)*

![Painel de Administração](imagens/admin.png)

Painel com números gerais do sistema e acesso aos cadastros:

### 👥 Usuários
![Usuários](imagens/admin-usuarios.png)

Criar, editar e excluir usuários; definir o **papel** (Admin, Gerente, Operador) e a **base**; **redefinir senha** (volta para `Princesa123` e exige nova troca no próximo acesso); marcar quem recebe o **relatório semanal**. Todo usuário criado recebe a senha inicial `Princesa123`.

### 🏢 Bases
![Bases](imagens/admin-bases.png)

Cadastro das filiais com cidade, responsável, contato e **geocerca** (latitude, longitude e raio em metros). A geocerca é o que permite ao sistema saber quando o veículo chegou ou saiu da base.

### 🛣 Rotas Padrão
![Rotas Padrão](imagens/admin-rotas.png)

Cadastro das rotas com paradas na ordem e horários previstos de chegada e saída. É a base para calcular previsões nas viagens importadas.

### 🧑‍💼 Regionais
![Regionais](imagens/admin-regionais.png)

Cadastro dos gerentes regionais e dos veículos de cada um (placa, unidade, proprietário, responsável). Usado no relatório semanal.

### 📧 Auditoria de E-mails
![Auditoria de E-mails](imagens/admin-emails.png)

Lista as ocorrências criadas automaticamente pelos e-mails da AngelLira, com status, para conferir se tudo está sendo importado.

---

## 17. Automações do sistema

Você não precisa fazer nada, o sistema trabalha sozinho:

| Automação | Quando | O que faz |
|---|---|---|
| Sincronização do GPS | Contínua / botão manual | Atualiza posições e status das viagens |
| Leitura de e-mails AngelLira | A cada 1 minuto | Cria ocorrências a partir dos alarmes |
| Relatório semanal | Sextas, 08h00 | Envia por e-mail o consolidado de ocorrências a cada gerente |
| Notificação de ocorrência | Ao assumir/resolver | Avisa por e-mail o responsável da unidade |

O status da viagem muda sozinho: **Programada → Em andamento → Finalizada**, conforme o veículo entra e sai das bases.

---

## 18. Glossário e dúvidas frequentes

**Glossário**
- **Viagem:** transferência de carga entre bases.
- **Rota padrão:** modelo de rota com paradas e horários.
- **Geocerca:** círculo virtual em volta de uma base.
- **Transbordo:** parada intermediária para troca/descarga de carga.
- **Manifesto / Minuta:** documentos de carga e seus valores.
- **Sascar:** empresa de rastreamento dos veículos.
- **AngelLira / Angel:** gerenciadora de risco e seguro.

**Dúvidas frequentes**

- **A viagem aparece "Sem sinal".** O rastreador não envia posição há mais de 2 h. Verifique com o motorista/manutenção.
- **Uma viagem não aparece no dashboard.** Confirme se a planilha do dia foi importada e se o período do filtro está correto.
- **Os dados parecem desatualizados.** Use o botão de sincronizar e aguarde alguns segundos.
- **A hora da TV está errada?** O painel usa a hora do servidor, não a do computador.
- **Não vejo Upload/Administração no menu.** São exclusivos de administradores.
- **Uma ocorrência foi criada sozinha.** Veio de um alarme da AngelLira; veja em Administração → Auditoria de E-mails.

---

*Sistema de uso interno — Princesa dos Campos · Setor de Transferências*
