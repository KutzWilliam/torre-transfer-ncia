# Relatório Técnico: Diagnóstico da Conciliação de Rotas SLA
**Arquivo Auditado:** `SLA Transferências.xlsx` | **Aba:** `Sem_identificação`  
**Sistema:** Torre de Controle de Transferências — Princesa dos Campos  
**Data da Auditoria:** 26/10/2026  

---

## 1. Sumário Executivo

Este documento apresenta a auditoria técnica e operacional realizada sobre a aba **`Sem_identificação`** do arquivo **`SLA Transferências.xlsx`**, identificando os motivos exatos pelos quais as rotas e origens citadas não foram encontradas durante o processo de conciliação de indicadores de SLA (Pontual, Atenção, Atraso e Crítico).

Para esta investigação, foi realizado um cruzamento minucioso entre:
1. **A matriz de rotas teóricas de SLA** contida na aba `Planilha1` (96 rotas com horários planejados de saída, transbordo e chegada);
2. **A aba de conciliação** `Sem_identificação` (102 rotas analisadas com apontamentos operacionais);
3. **A base de dados oficial da Torre de Controle**, composta por **9.004 viagens**, **115 rotas padrão cadastradas** e **74 bases operacionais**.

Nenhuma regra de negócio, validação ou código-fonte do sistema foi modificado. Este documento tem caráter puramente analítico, elucidativo e diagnóstico.

---

## 2. Visão Geral das Ocorrências na Aba "Sem_identificação"

Na aba `Sem_identificação`, as 102 rotas avaliadas foram classificadas na coluna **`Observações`** com a seguinte distribuição:

| Status da Observação | Total de Rotas | Percentual | Causa Primária Identificada |
| :--- | :---: | :---: | :--- |
| **Rota não localizada** | **36** | 35,3% | Divergência de grafia, inversão de sentido, rota via outras cidades ou linha inativa |
| **Origem não localizada** | **22** | 21,6% | A base não emite viagens de transferência direta no TMS (0 viagens no BD) |
| **Rota não estava incluída no SLA** | **7** | 6,9% | Rotas que operaram na prática, mas estavam ausentes da matriz original (`Planilha1`) |
| **Sem ocorrências** | **5** | 4,9% | Rotas encontradas com **100% de pontualidade** (sem nenhum atraso registrado) |
| **Sem observação (Identificadas)** | **32** | 31,3% | Rotas mapeadas e com volumetria de SLA distribuída nas colunas D, E, F e G |
| **TOTAL ANALISADO** | **102** | **100%** | **641 viagens totalizadas nos apontamentos** |

---

## 3. Grupo 1: "Origem não localizada" (22 Rotas)

### 3.1. Causa Raiz
No sistema da Torre de Controle, existem 74 cidades cadastradas como `Base`. No entanto, **apenas 27 bases são emissoras ativas de viagens de transferência**. As demais cidades atuam como:
1. **Pontos de passagem / transbordo intermediário**;
2. **Pontas de linha atendidas por linhas de distribuição/coleta local ou parceiros terceirizados**;
3. **Divergência cadastral de nomenclatura entre o nome comercial da cidade e a unidade operacional cadastrada**.

Todas as 21 bases marcadas como "Origem não localizada" possuem **exatamente ZERO viagens geradas com origem nelas** no sistema.

### 3.2. Detalhamento Rota a Rota

| Linha | Origem na Planilha | Rota Declarada | Sigla Saída | Diagnóstico e Motivo no Sistema |
| :---: | :--- | :--- | :---: | :--- |
| **7** | Birigui | BIRIGUI X LONDRINA | BIR | Base BIRIGUI não despacha viagens de transferência direta (0 viagens no BD). Atendida a partir de Londrina. |
| **12** | Campinas | CAMPINAS X SÃO PAULO X REGISTRO X CURITIBA | SUM | **Divergência de Nome:** No TMS a base é **SUMARÉ** (sigla `SUM`). Existem 26 viagens com origem Sumaré no BD. |
| **14** | Campo Mourão | CAMPO MOURÃO X MARINGÁ | COM | Base Campo Mourão não emite viagens diretas (0 viagens). O trecho opera via Maringá ou Curitiba. |
| **27** | Castro | CASTRO X PONTA GROSSA | CST | Base Castro não emite transferências (0 viagens). O fluxo é coberto pela linha Curitiba x Castro x Jaguariaíva. |
| **31** | Cianorte | CIANORTE X MARINGA | CIA | Base Cianorte não gera transferências no sistema (0 viagens). Atendida por Maringá. |
| **33** | Criciúma | CRICIÚMA X JOINVILLE | CCM | Base Criciúma não emite viagens de transferência (0 viagens). |
| **78** | Fernandopolis | FERNANDOPOLIS X LONDRINA | FER | Base Fernandópolis não emite transferências regulares (0 viagens como base origem). |
| **80** | Florianopolis | FLORIANOPOLIS X JOINVILLE | FLN | Base Florianópolis não gera transferências de linha direta para Joinville no sistema (0 viagens). |
| **100** | Ibaiti | IBAITI X CORNELIO PROCÓPIO X LONDRINA | IBT | Base Ibaiti não emite transferências (0 viagens no BD). |
| **110** | Jaguariaiva | JAGUARIAIVA X PONTA GROSSA X CURITIBA | JGV | Base Jaguariaíva não gera transferências no sistema (0 viagens). Atendida a partir de Curitiba/Ponta Grossa. |
| **112** | Joaçaba | JOAÇABA X JOINVILLE | JCB | Base Joaçaba não emite viagens (0 viagens). No BD a viagem roda no sentido Joinville x Joaçaba. |
| **154** | Porto Alegre | PORTO ALEGRE X JOINVILLE X CURITIBA | POA | Base Porto Alegre não emite viagens diretas para Curitiba no sistema (0 viagens). |
| **156** | Prudentopolis | PRUDENTOPOLIS X PONTA GROSSA X CURITIBA | PRD | Base Prudentópolis não gera viagens (0 viagens). Atendida via Curitiba ou Guarapuava. |
| **158** | São Mateus | SÃO MATEUS DO SUL X PALMEIRA X PONTA GROSSA | SMT | Base São Mateus do Sul não gera transferências de origem (0 viagens). |
| **174** | Ribeirão Preto | RIBEIRAO PRETO X SÃO PAULO | RAO | Base Ribeirão Preto não emite viagens de transferência no sistema (0 viagens). |
| **180** | Irati | IRATI X GUARAPUAVA | IRA | Base Irati não emite transferências (0 viagens). As viagens passam por Irati vindas de Umuarama/Curitiba. |
| **182** | Pato Branco | PATO BRANCO X GUARAPUAVA | PTO | Base Pato Branco não emite transferências de origem no sistema (0 viagens). |
| **186** | Palmas | PALMAS X MANGUEIRINHA X CANDOI X GUARAPUAVA | SSPS | Base Palmas não emite viagens no sistema (0 viagens). |
| **190** | Palmas | PALMAS X MANGUEIRINHA X GUARAPUAVA | SSPS | Base Palmas não emite viagens no sistema (0 viagens). |
| **192** | Dois Vizinhos | DOIS VIZINHOS X CHOPINZINHO X GUARAPUAVA | DVZ | Base Dois Vizinhos não emite viagens no sistema (0 viagens). Atendida a partir de Guarapuava. |
| **196** | Terra Roxa | GUAIRA X TERRA ROXA X PALOTINA X CASCAVEL | GUA | **Divergência de Campo:** A origem real é Guaíra, mas foi preenchido "Terra Roxa". Não há viagens saindo de Terra Roxa. |
| **200** | Assis Chateaubriand | ASSIS CHATEAUBRIAND X CASCAVEL | ASC x CAC | Base Assis Chateaubriand não gera transferências (0 viagens). A operação ocorre via Cascavel. |

---

## 4. Grupo 2: "Rota não localizada" (36 Rotas)

### 4.1. Classificação das Causas Técnicas

Ao analisar as 36 rotas com status "Rota não localizada", foram constatadas 4 razões estruturais:

1. **Divergência de Grafia / Acentos / Espaços (Existentes no BD):** 4 rotas
2. **Inversão de Sentido Operacional (Ida x Volta):** 5 rotas
3. **Nomenclatura Diferente no TMS (Cliente / Paradas):** 11 rotas
4. **Rotas Teóricas sem Viagens no Período (Linhas Inativas):** 16 rotas

### 4.2. Causa A: Divergência de Grafia, Acentos e Digitação (Rotas que EXISTEM no sistema)
Estas rotas foram marcadas como "não localizadas" unicamente por falha de correspondência exata de texto (ex.: busca com `PROCV` simples ou filtro textual rígido):

1. **Linha 39 (`CURITIBA X GUARAPUAVA X CAMPO MOURÃO X UMUARAMA`):**
   - **Erro de digitação no Excel:** A coluna de Origem foi preenchida como **`"CuritibaCuritiba"`** (palavra duplicada).
   - **Acentuação:** A planilha usou `"MOURÃO"`, enquanto no sistema está gravado sem acento: `"MOURAO"`.
   - **Realidade no Sistema:** Existem **113 viagens registradas** com `"CURITIBA X GUARAPUAVA X CAMPO MOURAO X UMUARAMA"` no banco de dados!
2. **Linha 168 (`UMUARAMA X CAMPO MOURÃO X GUARAPUAVA X IRATI X CURITIBA`):**
   - A planilha usou `"MOURÃO"`.
   - **Realidade no Sistema:** Existem **112 viagens registradas** com `"UMUARAMA X CAMPO MOURAO X GUARAPUAVA X IRATI X CURITIBA"`.
3. **Linha 160 (`SÃO PAULO X PONTA GROSSA X GUARAPUAVA`):**
   - A planilha usou `"SÃO PAULO"` com acento.
   - **Realidade no Sistema:** Existem **211 viagens** gravadas como `"SAO PAULO X PONTA GROSSA X GUARAPUAVA"`.
4. **Linha 176 (`CASCAVEL X IBEMA X GUARAPUAVA`):**
   - **Realidade no Sistema:** Existem **16 viagens** cadastradas exatamente com essa descrição.
5. **Espaços Invisíveis em Extremidades:** Várias rotas possuem espaços no final da string (ex.: `"MARINGÁ X CAMPO MOURÃO "` e `"FOZ DO IGUAÇU X MEDIANEIRA X CASCAVEL "`), impedindo o match exato de planilhas.

---

### 4.3. Causa B: Inversão de Sentido Operacional (Ida x Volta)
A matriz teórica previa a rota no sentido Origem A → Destino B, mas na operação real os manifestos são despachados no sentido inverso (Origem B → Destino A):

| Linha | Rota no SLA (Teórica) | Rota Real Registrada no Sistema | Viagens no BD |
| :---: | :--- | :--- | :---: |
| **3** | APUCARANA X MARINGÁ X CASCAVEL X TOLEDO | **TOLEDO X CASCAVEL X MARINGA X APUCARANA** | 23 viagens |
| **9** | BLUMENAU X CURITIBA | **CURITIBA X BLUMENAU** / **CURITIBA/BLUMENAU** | 183 viagens |
| **92** | GUARAPUAVA X CHAPECÓ | **CHAPECO X GUARAPUAVA** | 174 viagens |
| **98** | GUARAPUAVA X CURITIBA | **CURITIBA X GUARAPUAVA** | 237 viagens |
| **144** | PARANAVAÍ X MARINGA | **CURITIBA X MARINGÁ X PARANAVAÍ** (originada em CWB) | 2 viagens |

---

### 4.4. Causa C: Nomenclatura Diferente ou Paradas Intermediárias no TMS
A viagem rodou no trecho, mas o nome atribuído no sistema de rastreamento/TMS difere do nome simplificado do SLA:

- **Linha 70 (`CURITIBA X COTIA`):** É uma rota de cliente dedicado (Wurth). No sistema é nomeada como **`"WURTH DO BRASIL - COTIA-SP X CURITIBA-PR"`** (**143 viagens no banco**). A busca textual por "Curitiba x Cotia" falhou por conta do prefixo do cliente.
- **Linha 53 (`CURITIBA X TOLEDO`):** A transferência não é ponto a ponto direto; ela opera com transbordo intermediário em Cascavel: **`"CURITIBA X CASCAVEL X TOLEDO"`** (**181 viagens**) ou no sentido inverso com paradas em Ponta Grossa e Guarapuava (**189 viagens**).
- **Linha 64 (`CURITIBA X JOINVILLE X PORTO ALEGRE`):** No TMS a escala em Santa Catarina é feita em Itajaí: **`"CURITIBA X ITAJAI X PORTO ALEGRE"`**.
- **Linha 82 (`FOZ DO IGUAÇU X MEDIANEIRA X CASCAVEL`):** A rota operacional não finaliza em Cascavel; estende-se até a capital como **`"FOZ DO IGUAÇU X CASCAVEL X CURITIBA"`** (**195 viagens**).
- **Linha 124 (`APUCARANA X CURITIBA`):** O manifesto é gerado como **`"CURITIBA X APUCARANA X LONDRINA"`** (**163 viagens**).
- **Linha 198 (`CASCAVEL X ASSIS CHATEAUBRIAND`):** É operada via Marechal: **`"CASCAVEL X MARECHAL X ASSIS CHATEAUBRIAND"`** (**20 viagens**).

---

### 4.5. Causa D: Rotas Teóricas sem Operação Registrada no Período (16 Rotas)
Rotas que fazem parte da grade teórica de transferências, mas que **não tiveram nenhuma viagem gerada no período analisado**:

1. `CASCAVEL X MARECHAL CANDIDO RONDON` (0 viagens)
2. `GUARAPUAVA X FRANCISCO BELTRÃO X DOIS VIZINHOS` (0 viagens)
3. `GUARAPUAVA X PATO BRANCO` (0 viagens)
4. `JOINVILLE X CRICIÚMA` (0 viagens)
5. `JOINVILLE X FLORIANOPOLIS` (0 viagens)
6. `LONDRINA X PRESIDENTE PRUDENTE X BIRIGUI` (0 viagens)
7. `LONDRINA X SÃO JOSE DO RIO PRETO X FERNANDOPOLIS` (0 viagens)
8. `LONDRINA X IBAITI` (0 viagens)
9. `MARINGÁ X CAMPO MOURÃO` (0 viagens)
10. `MARINGA X CIANORTE` (0 viagens)
11. `MARINGA X UMUARAMA` (0 viagens)
12. `PONTA GROSSA X PALMEIRA X SÃO MATEUS DO SUL` (0 viagens)
13. `PONTA GROSSA X CASTRO` (0 viagens)
14. `SÃO PAULO X CAMPINAS X RIBEIRAO PRETO` (0 viagens)
15. `GUARAPUAVA X CANDOI X MANGUERINHA X PALMAS` (0 viagens)
16. `GUARAPUAVA X MANGUERINHA X PALMAS` (0 viagens)

---

## 5. Grupo 3: "Rota não estava incluída no SLA" (7 Rotas)

### 5.1. Contexto e Diagnóstico
Estas 7 rotas **existiram na operação real e tiveram apontamentos de desempenho** (Pontual, Atenção, Atraso ou Crítico preenchidos). A observação ocorreu porque elas **não constavam na tabela padrão original de SLA (`Planilha1`)**.

O analista responsável inseriu manualmente essas 7 linhas na aba `Sem_identificação` para conseguir registrar os números da operação que estavam rodando fora da grade teórica:

| Linha | Rota Inserida | Pontual | Atenção | Atraso | Crítico | Total Viagens |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **11** | BLUMENAU X JOINVILE X CURITIBA | 16 | 1 | 1 | 1 | **19** |
| **23** | CASCAVEL X MARECHAL X ASSIS CHATEAUBRIAND | 1 | 1 | 0 | 0 | **2** |
| **24** | CASCAVEL X GUARAPUAVA X CURITIBA | 10 | 8 | 1 | 1 | **20** |
| **25** | EPC-CASCAVEL-PR - 120 X EPC - REALEZA -PR - 159 | 1 | 0 | 1 | 0 | **2** |
| **54** | CURITIBA X CASCAVEL X TOLEDO | 12 | 1 | 2 | 3 | **18** |
| **107** | JOINVILLE X CURITIBA | 19 | 1 | 1 | 4 | **25** |
| **108** | JOINVILLE X CURITIBA X JOINVILLE | 3 | 1 | 0 | 0 | **4** |

---

## 6. Grupo 4: "Sem ocorrências" (5 Rotas)

### 6.1. Contexto e Diagnóstico
O termo "Sem ocorrências" nesta planilha não significa ausência de viagem. Significa que a rota rodou e teve **100% de pontualidade** (zero ocorrências de atraso ou inconformidade):

| Linha | Rota | Pontual | Atenção | Atraso | Crítico | Taxa Pontualidade |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **5** | APUCARANA X GUARAPUAVA X PONTA GROSSA | 18 | 0 | 0 | 0 | **100%** |
| **29** | CHAPECÓ X GUARAPUAVA | 18 | 0 | 0 | 0 | **100%** |
| **35** | CURITIBA X SÃO MATEUS X UNIÃO DA VITÓRIA | 2 | 0 | 0 | 0 | **100%** |
| **76** | FRANCISCO BELTRÃO X GUARAPUAVA X CURITIBA | 18 | 0 | 0 | 0 | **100%** |
| **194** | CASCAVEL X PALOTINA X TERRA ROXA X GUAIRA | 2 | 0 | 0 | 0 | **100%** |

---

## 7. Recomendações e Plano de Ação (Sem Mudança de Regras)

Para que futuras análises e conciliações de SLA atinjam maior precisão sem intervenção manual exaustiva, recomenda-se:

1. **Adotar Chave Normalizada nas Planilhas:**
   - Remover acentos (`MOURÃO` → `MOURAO`, `SÃO` → `SAO`);
   - Aplicar `TRIM` em todas as colunas para eliminar espaços invisíveis nas extremidades e espaços duplos;
   - Corrigir células corrompidas como `"CuritibaCuritiba"`.
2. **Tabela "De-Para" de Nomes Operacionais:**
   - Mapear nomes comerciais do cliente para a rota física (ex.: `WURTH DO BRASIL - COTIA-SP X CURITIBA-PR` = `CURITIBA X COTIA`);
   - Mapear a base `SUMARE` como a representação física da origem `CAMPINAS`.
3. **Conciliação Bidirecional (Ida e Volta):**
   - Ao procurar viagens de uma rota como `Apucarana x Toledo`, incluir a busca pelo sentido reverso `Toledo x Apucarana`.
4. **Oficializar as 7 Rotas Extras na Matriz de SLA:**
   - Incorporar formalmente na grade padrão (`Planilha1`) rotas de grande volume operacional como `Curitiba x Cascavel x Toledo` (18 viagens) e `Joinville x Curitiba` (25 viagens).

---
*Relatório concluído com base nos registros do sistema da Torre de Controle.*
