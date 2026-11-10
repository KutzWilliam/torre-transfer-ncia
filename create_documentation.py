import docx
import copy
import sys
import os

def set_cell_text(cell, new_text):
    """Update text in cell preserving formatting of first run if present."""
    if not cell.paragraphs:
        p = cell.add_paragraph()
        p.text = new_text
        return
    p = cell.paragraphs[0]
    lines = new_text.split('\n')
    
    # First line in existing paragraph
    if p.runs:
        p.runs[0].text = lines[0]
        for r in p.runs[1:]:
            r.text = ""
    else:
        p.text = lines[0]
    
    # Remove extra paragraphs in cell if any
    for extra_p in cell.paragraphs[1:]:
        p_element = extra_p._p
        p_element.getparent().remove(p_element)
        
    # If new_text had multiple lines, add them as line breaks
    for extra_line in lines[1:]:
        p.add_run('\n' + extra_line)

def clone_and_append_row(table, template_row_idx, cell_texts):
    """Clone a row structure and append it with given cell texts."""
    tr = table.rows[template_row_idx]._tr
    new_tr = copy.deepcopy(tr)
    table._tbl.append(new_tr)
    new_row = table.rows[-1]
    for c_idx, text in enumerate(cell_texts):
        if c_idx < len(new_row.cells):
            set_cell_text(new_row.cells[c_idx], text)
    return new_row

def update_row(table, row_idx, cell_texts):
    row = table.rows[row_idx]
    for c_idx, text in enumerate(cell_texts):
        if c_idx < len(row.cells):
            set_cell_text(row.cells[c_idx], text)

def set_table_data(table, data, template_row_idx=1):
    """Update table with a matrix of strings. Automatically clone rows if needed."""
    for r_idx, row_vals in enumerate(data):
        if r_idx < len(table.rows):
            update_row(table, r_idx, list(row_vals))
        else:
            ref_idx = min(template_row_idx, len(table.rows) - 1)
            clone_and_append_row(table, ref_idx, list(row_vals))

def set_paragraph_text(p, new_text):
    if p.runs:
        p.runs[0].text = new_text
        for r in p.runs[1:]:
            r.text = ""
    else:
        p.text = new_text

def build_torre_transferencia_doc():
    source_file = "Documentação Support Point (1).docx"
    output_file = "Documentação Torre de Transferência.docx"
    
    print(f"Loading {source_file}...")
    doc = docx.Document(source_file)
    
    # ── 1. PARAGRAPHS UPDATES ────────────────────────────────────────────────
    para_updates = {
        11: "Periodicidade mínima de revisão: Anual e após incidente ou mudança relevante.",
        12: "Local oficial de armazenamento: GitHub – repositório privado torre-transfer-ncia (branch main) + cópia no servidor de produção em /docs.",
        13: "Documentos relacionados: README.md, ecosystem.config.cjs (repositório torre-transferencia); Política de Segurança da Informação da Princesa dos Campos (a anexar).",
        16: "Definir responsabilidades, recursos, procedimentos e critérios para manter ou restabelecer o funcionamento do sistema Torre de Transferência em níveis aceitáveis após uma interrupção tecnológica, operacional ou de conectividade.",
        18: "Processos de negócio cobertos: Gestão e monitoramento em tempo real de viagens de transferência de cargas e encomendas; rastreamento e telemetria GPS da frota integrada ao banco Sascar; controle de geocercas e janelas de transbordo entre filiais/bases; detecção de desvios e cálculo automático de atrasos (inclusive cruzamento de meia-noite); ingestão e despacho automatizado de ocorrências operacionais via e-mails AngelLira (IMAP); auditoria de manifestos fiscais/financeiros de viagens; painel TV operacional (fullscreen) e relatórios executivos semanais por regional.",
        19: "Ambientes cobertos: Produção (http://172.20.10.210:3001) gerenciado via PM2 (processos transferencia, email-cron e relatorio-semanal). Desenvolvimento local via Docker PostgreSQL (porta 5433). Contingência manual via planilhas compartilhadas em rede e comunicação direta com as filiais. Sem ambiente de homologação dedicado atualmente.",
        20: "Unidades/empresas cobertas: Expresso Princesa dos Campos S.A. – sede operacional (Ponta Grossa/PR) e toda a malha de filiais, bases e pontos de transbordo da operação de transferência (Curitiba, Londrina, Maringá, Cascavel, Toledo, Foz do Iguaçu, Guarapuava, etc.). CNPJ a confirmar com a área administrativa.",
        21: "Fora do escopo: Sistema de telemetria e rastreadores físicos embarcados Sascar/Life (responsabilidade da fornecedora); plataforma de gerenciamento de risco AngelLira (serviço terceiro); ERP corporativo/financeiro; sistemas de RH e folha; aplicativo mobile de motoristas.",
        23: "A recuperação deverá priorizar a segurança de motoristas e cargas, a integridade dos dados de viagens e a rápida retomada do monitoramento dos veículos em trânsito.",
        24: "Credenciais de emergência, chaves secretas (AUTH_SECRET, CRON_SECRET) e senhas de banco ou e-mail não devem ser registradas em texto aberto neste documento; residem exclusivamente no arquivo .env local e cofre de senhas de TI.",
        25: "Toda alteração de status ou apontamento de viagens realizado durante o período de contingência deverá ser registrado em planilha padronizada para posterior conciliação e auditoria no sistema.",
        26: "O sistema depende criticamente da conectividade de rede local (LAN) para comunicação com o PostgreSQL local e leitura externa ao banco de telemetria Sascar (172.20.10.205). A ausência de ambiente de homologação dedicado implica que manutenções urgentes são aplicadas diretamente no ambiente de produção, exigindo rigor no versionamento git e processo de validação prévia.",
        34: "Justificativa executiva: O sistema Torre de Transferência é a plataforma central para gestão e monitoramento das viagens de transferência de cargas e encomendas da Princesa dos Campos. Sua indisponibilidade afeta diretamente a pontualidade das entregas, a integridade da carga em trânsito e a operação sincronizada de dezenas de filiais e pontos de transbordo. Por operar em regime contínuo 24x7 sem infraestrutura redundante automatizada e depender da atuação direta dos desenvolvedores, é classificado como criticidade Alta.",
        37: "Pontos únicos de falha: (1) William Kutz e Weslen Rian – únicos desenvolvedores com domínio da arquitetura e das regras de cálculo de transbordo; Mitigação: documentar runbooks e realizar treinamentos de passagem de bastão com a equipe de TI. (2) Banco de dados PostgreSQL único sem replicação em tempo real; Mitigação: rotina diária de backup automatizado e retenção em storage seguro. (3) Servidor de produção único na porta 3001 sem cluster de balanceamento; Mitigação: manter procedimentos de subida rápida em máquina virtual de contingência. (4) Integração de telemetria Sascar dependente da disponibilidade do banco externo; Mitigação: formalização de SLA com a fornecedora e acesso de contingência via portal web.",
        45: "Tempo para iniciar a contingência manual: 60 minutos",
        46: "Critério para encerrar a contingência: Aplicação respondendo na porta 3001, banco íntegro, telemetria Sascar conectada e autenticação operacional. Aprovação formal do Responsável Técnico.",
        54: "Responsável por autorizar restauração em produção: William Kutz; Weslen Rian – Responsáveis Técnicos.",
        75: "Aprovador do retorno à operação: William Kutz; Weslen Rian – Responsáveis técnicos"
    }
    
    for idx, text in para_updates.items():
        if idx < len(doc.paragraphs):
            set_paragraph_text(doc.paragraphs[idx], text)
            print(f"Updated paragraph {idx}")
            
    # ── 2. TABLES UPDATES ────────────────────────────────────────────────────
    
    # TABLE 0: Objetivo do modelo
    set_cell_text(doc.tables[0].cell(0, 0), 
        "Objetivo do documento\nRegistrar como o sistema Torre de Transferência será mantido ou recuperado diante de falhas, indisponibilidade de pessoas, infraestrutura, dados ou fornecedores, garantindo a continuidade operacional das viagens de transferência da Princesa dos Campos.")
    
    # TABLE 1: Informações do Sistema
    t1_data = [
        ("Informação", "Preenchimento"),
        ("Nome do sistema", "Torre de Transferência"),
        ("Área proprietária", "Torre de Controle / Setor de Transferências – Princesa dos Campos"),
        ("Gestor do sistema", "William Kutz; Weslen Rian – Desenvolvedor / Responsável técnico"),
        ("Responsável técnico", "William Kutz; Weslen Rian - Desenvolvedor / Responsável técnico"),
        ("Classificação de criticidade", "Alta"),
        ("Versão do documento", "01"),
        ("Data de aprovação", "14/10/2026"),
        ("Próxima revisão", "14/10/2027"),
        ("Classificação da informação", "Uso interno"),
    ]
    set_table_data(doc.tables[1], t1_data)
        
    # TABLE 2: Aprovações
    t2_data = [
        ("Papel", "Nome", "Data", "Aceite"),
        ("Proprietário do processo", "Mauricio Chedid", "14/10/2026", "[Assinatura/aceite]"),
        ("Tecnologia da Informação", "Wesley Martinelli", "14/10/2026", "[Assinatura/aceite]"),
        ("Segurança/Compliance", "Wesley Martinelli", "14/10/2026", "[Assinatura/aceite]"),
        ("Diretoria patrocinadora", "Marcelo Brandão", "14/10/2026", "[Assinatura/aceite]"),
    ]
    set_table_data(doc.tables[2], t2_data)
        
    # TABLE 3: Controle do documento
    t3_data = [
        ("Versão", "Data", "Alteração", "Responsável", "Aprovador"),
        ("00", "28/07/2026", "Estruturação inicial do modelo de continuidade", "William Kutz; Weslen Rian", "Mauricio Chedid"),
        ("01", "14/10/2026", "Emissão inicial – Documentação do Sistema Torre de Transferência", "William Kutz; Weslen Rian", "Mauricio Chedid"),
        ("", "", "", "", "")
    ]
    set_table_data(doc.tables[3], t3_data)
        
    # TABLE 4: Identificação e visão do sistema
    t4_data = [
        ("Item", "Descrição"),
        ("Nome e finalidade", "Plataforma de gestão, controle e monitoramento em tempo real das operações de transferência e transporte de cargas e encomendas da Princesa dos Campos. Realiza rastreamento contínuo de frota via telemetria GPS Sascar, gestão de rotas e janelas de transbordo entre filiais com geocercas eletrônicas, cálculo dinâmico de previsões e atrasos (inclusive cruzamento de meia-noite), ingestão e despacho de ocorrências operacionais via e-mails AngelLira, auditoria de manifestos fiscais de carga, painel TV full-screen contínuo e relatórios semanais gerenciais por regional."),
        ("Usuários", "Operadores da Torre de Transferência / Central de Controle, Gestores de Frota e Gerentes Regionais, Despachantes de Filiais e Administradores de TI. Uso exclusivo interno – estimativa de 10 a 25 usuários simultâneos mais telas de Painel TV contínuas."),
        ("Horário de operação", "24x7 (operação contínua de frota). Janela crítica: Período noturno e madrugadas (18h00 às 08h00), quando trafega a quase totalidade dos veículos pesados em transferência e ocorrem as janelas de transbordo de cargas, além de plantões nos finais de semana."),
        ("Tecnologias", "TypeScript · Next.js 15 (App Router) · React 19 · tRPC v11 · NextAuth.js v5 · Prisma ORM v6 · PostgreSQL 15 · Pool pg (SQL Server / PostgreSQL Sascar) · Node.js v20+ · PM2 · Tailwind CSS v4 · Leaflet / React-Leaflet · ImapFlow / Mailparser · Nodemailer · @napi-rs/canvas · jsPDF / XLSX · Docker"),
        ("Hospedagem", "Servidor local na sede Princesa dos Campos (172.20.10.210), aplicação servida na porta 3001. Banco de dados principal PostgreSQL em 172.20.10.210:5432. Banco de telemetria Sascar externo em 172.20.10.205 (porta 5432/torre_controle). Sem redundância geográfica automatizada atualmente."),
        ("Repositório de código", "GitHub – repositório privado dos colaboradores: https://github.com/KutzWilliam/torre-transfer-ncia.git (branch main)"),
        ("Pipeline de entrega", "Deploy no servidor de produção via Git pull + npm run db:migrate + npm run build + pm2 restart ecosystem.config.cjs. Não há pipeline CI/CD automatizado configurado."),
        ("Monitoramento", "Logs de aplicação via PM2 (pm2 log transferencia, pm2 log email-cron). Polling contínuo de alarmes a cada 60s. Alertas de e-mail e relatórios consolidados por SMTP Office 365 (torre.notificacoes@princesadoscampos.com.br). Responsável: William Kutz; Weslen Rian."),
        ("Dados sensíveis", "Dados operacionais de frota (localização GPS em tempo real, trajetos, placas, rotas, paradas e motoristas), dados de ocorrências de trânsito, manifestos e notas fiscais de cargas transportadas, credenciais de usuário com hash bcrypt e salt seguro. Não armazena dados de cartão de crédito ou faturamento direto.")
    ]
    set_table_data(doc.tables[4], t4_data)
        
    # TABLE 5: Callout BIA
    set_cell_text(doc.tables[5].cell(0, 0),
        "Como preencher\nAvalie o impacto crescente da indisponibilidade. RTO é o tempo máximo para restabelecer o serviço; RPO é a perda máxima de dados aceitável no tempo.")
        
    # TABLE 6: Processos Críticos
    t6_data = [
        ("Processo/Função", "Impacto", "MTPD", "RTO", "RPO", "Período crítico"),
        ("Monitoramento de viagens e Painel TV em tempo real",
         "Operacional alto: perda de visibilidade das transferências em rota, atraso na detecção de desvios/atrasos, risco de perda de conexões e transbordos nas filiais com consequente atraso na entrega de encomendas.",
         "4h", "2h", "15 min", "Noites, madrugadas (18h-08h) e fins de semana"),
        ("Sincronização de telemetria GPS (Sascar)",
         "Operacional alto: ausência de posições em tempo real da frota ativa, impedindo a verificação de paradas e cálculo dinâmico de previsões de chegada nas bases.",
         "4h", "2h", "30 min", "24x7 contínuo (pico das 20h às 06h)"),
        ("Ingestão de ocorrências e alarmes AngelLira (IMAP)",
         "Operacional médio-alto: falha ou retardo na captura de alarmes de desvio de rota, excesso de velocidade e paradas não autorizadas de carretas.",
         "6h", "3h", "1h", "24x7 contínuo"),
        ("Auditoria de manifestos e chegadas em unidade",
         "Operacional/Administrativo médio: atraso na conciliação dos manifestos das carretas e validação de descarga nas filiais de destino.",
         "8h", "4h", "1h", "Janela matutina (06h às 10h)")
    ]
    set_table_data(doc.tables[6], t6_data, template_row_idx=1)
        
    # TABLE 7: Matriz de Impacto por Tempo
    t7_data = [
        ("Tempo indisponível", "Impacto operacional", "Impacto financeiro", "Impacto legal/compliance", "Impacto reputacional"),
        ("Até 1 hora", "Moderado a Alto (atraso no acompanhamento de viagens em trânsito e identificação de comboios fora de horário)", "Baixo (custos operacionais residuais)", "Baixo (sem infração fiscal/regulatória imediata)", "Baixo a moderado (dúvidas operacionais nas filiais)"),
        ("1 a 4 horas", "Alto (desorganização nas janelas de transbordo das bases intermediárias, acúmulo de carga nos armazéns)", "Médio (horas extras de equipes de armazém e risco de penalidades contratuais de entrega de encomendas expressas)", "Médio (atraso na baixa fiscal de manifestos de transporte MDF-e)", "Médio (reclamações de filiais e clientes corporativos)"),
        ("4 a 24 horas", "Muito Alto (quebra da malha de sincronização de cargas interestadual e estadual)", "Alto (custos expressivos com retenção de frota, cancelamento de viagens e multas por descumprimento de SLA)", "Médio a Alto (descumprimento de prazos de trânsito fiscal)", "Alto (impacto reputacional perante grandes clientes de encomendas expressas)"),
        ("Acima de 24 horas", "Crítico (colapso da visibilidade logística da malha de transferências da empresa)", "Crítico (prejuízos operacionais severos, perda de clientes e quebra de contratos corporativos)", "Alto (não conformidades fiscais e regulatórias)", "Crítico (grave abalo à credibilidade e imagem da marca no mercado logístico)"),
    ]
    set_table_data(doc.tables[7], t7_data)
        
    # TABLE 8: Dependências e Pontos Únicos de Falha
    t8_data = [
        ("Dependência", "Tipo", "Criticidade", "Responsável", "Contingência/alternativa"),
        ("PostgreSQL local (172.20.10.210:5432) – banco torre-transferencia", "Tecnologia", "Alta", "William Kutz; Weslen Rian / TI Princesa", "Restauração via backup pg_dump diário. Container Docker de emergência (porta 5433). Sem réplica síncrona atualmente."),
        ("Banco de telemetria Sascar externo (172.20.10.205) – posições GPS da frota", "Fornecedor - Sascar/Life", "Alta", "Wesley Martinelli / Gabriel Cordeiro", "Acesso direto ao portal web da Sascar para consulta pontual de veículos; acompanhamento de contrato e suporte emergencial."),
        ("Caixa postal IMAP e SMTP (torre.notificacoes@princesadoscampos.com.br / Office 365)", "Comunicação", "Média-Alta", "William Kutz; Weslen Rian / TI Princesa", "Acesso direto à plataforma web AngelLira para leitura manual de alarmes; comunicação direta via WhatsApp e e-mail corporativo."),
        ("William Kutz; Weslen Rian (desenvolvedores e mantenedores do sistema)", "Conhecimento", "Alta", "Mauricio Chedid", "Capacitar profissional adicional da equipe de TI e manter runbooks e documentação técnica atualizados."),
        ("Rede interna 172.20.10.x – infraestrutura de TI da Princesa dos Campos", "Infraestrutura", "Alta", "Wesley Martinelli", "Suporte preventivo de redes e contingência via link secundário corporativo.")
    ]
    set_table_data(doc.tables[8], t8_data, template_row_idx=1)
        
    # TABLE 9: Arquitetura e Inventário Técnico
    t9_data = [
        ("Componente", "Versão", "Local/Host", "Função", "Redundância", "Responsável"),
        ("Next.js 15 (App Router) / tRPC API / React 19", "v0.1.0", "172.20.10.210:3001",
         "Frontend operacional e API backend da aplicação Torre de Transferência (Dashboard, Viagens, Painel TV, Auditoria, Ocorrências)",
         "Não", "William Kutz; Weslen Rian"),
        ("Banco de Dados PostgreSQL / Prisma ORM", "v15 / Prisma v6", "172.20.10.210:5432",
         "Armazenamento persistente de viagens, veículos, bases, rotas, paradas, telemetrias e usuários",
         "Não", "William Kutz; Weslen Rian"),
        ("Processo PM2 email-cron (scripts/email-cron.mjs)", "v1.0", "172.20.10.210 (Node.js)",
         "Processador de e-mails em polling contínuo (loop 60s) via IMAP para ingestão de alarmes AngelLira",
         "Não", "William Kutz; Weslen Rian"),
        ("Processo PM2 relatorio-semanal (scripts/relatorio-semanal-cron.mjs)", "v1.0", "172.20.10.210 (Node.js)",
         "Trigger de envio de relatórios semanais com gráficos em Canvas (toda sexta-feira às 08h00)",
         "Não", "William Kutz; Weslen Rian"),
        ("Banco de Telemetria Sascar (SQL Server / pg Pool)", "Remoto", "172.20.10.205 (TELEMETRIA_DB_URL)",
         "Leitura de posições GPS da frota ativa e sincronização com histórico local",
         "Gerenciado", "Wesley Martinelli / Gabriel Cordeiro")
    ]
    set_table_data(doc.tables[9], t9_data, template_row_idx=1)
        
    # TABLE 10: Estratégia de Continuidade
    t10_data = [
        ("Cenário", "Estratégia primária", "Estratégia alternativa", "Critério de acionamento"),
        ("Falha da aplicação (crash Next.js / PM2)", "Reiniciar processo da aplicação via PM2 (pm2 restart transferencia)", "Rollback para commit estável anterior (git checkout <hash> + npm run build + pm2 restart all)", "Aplicação não responde em http://172.20.10.210:3001 por mais de 5 minutos"),
        ("Falha do banco de dados (PostgreSQL corrompido / inacessível)", "Restaurar backup pg_dump mais recente na instância local", "Subir container PostgreSQL Docker de emergência (porta 5433 / docker-compose.yml) e restaurar dados", "Banco de dados inacessível ou erros de conexão Prisma em cascata"),
        ("Perda física da infraestrutura do servidor", "Provisionar VM temporária a partir do repositório Git e backup do banco", "Ativação de contingência manual por planilha Excel compartilhada e contato telefônico/WhatsApp com as filiais", "Falha de hardware do servidor 172.20.10.210 sem previsão de retorno imediato"),
        ("Indisponibilidade de integração Sascar / Telemetria", "Reconectar pool de telemetria e reiniciar processo; consultar portal web Sascar", "Operação com base nas tabelas de horários padrão das rotas e contato direto com motoristas/bases", "Falta de resposta do banco de telemetria por mais de 30 minutos"),
        ("Falha no processador de e-mails AngelLira (IMAP)", "Reiniciar processo PM2 email-cron e verificar credenciais da caixa postal", "Acesso direto à plataforma web da gerenciadora AngelLira para acompanhamento manual", "Processo email-cron em erro ou ausência de ingestão de ocorrências por mais de 15 minutos"),
        ("Ataque cibernético / Incidente de segurança", "Isolar imediatamente o servidor da rede, coletar logs do PM2 e PostgreSQL e acionar equipe de segurança", "Reinstalação do sistema em ambiente limpo a partir do código do GitHub e backup íntegro pré-incidente", "Tentativa de invasão, infecção por malware, tráfego anômalo ou alerta de intrusão"),
        ("Indisponibilidade de pessoa-chave", "Designação de profissional técnico de TI para seguir o Runbook detalhado documentado no README e neste BCP", "Contatar suporte terceirizado / parceiros de desenvolvimento sob gestão de TI", "Ausência simultânea de William Kutz e Weslen Rian durante crise")
    ]
    set_table_data(doc.tables[10], t10_data)
    
    # TABLE 11: Operação em contingência
    t11_data = [
        ("Atividade", "Procedimento temporário", "Responsável", "Limite/capacidade", "Registro gerado"),
        ("Acompanhamento de viagens de transferência e chegadas nas bases",
         "Planilha Excel compartilhada em rede local + grupo operacional do WhatsApp das filiais",
         "Central de Controle / Operadores da Transferência",
         "Até 60 viagens ativas/dia – suportável manualmente por até 12 horas",
         "Planilha de contingência com horários de partida, paradas, transbordos e chegadas registradas"),
        ("Registro e despacho de ocorrências operacionais",
         "Anotação em planilha de contingência e contato telefônico com equipes de manutenção/filiais",
         "Operadores da Torre de Transferência",
         "Até 30 ocorrências/dia – suportável manualmente",
         "Planilha de contingência com protocolo, placa, descrição da falha e ação tomada")
    ]
    set_table_data(doc.tables[11], t11_data, template_row_idx=1)
        
    # TABLE 12: Backup, Restauração e Proteção de dados
    t12_data = [
        ("Ativo", "Método", "Frequência", "Retenção", "Local", "Criptografia", "Último teste"),
        ("Banco de dados PostgreSQL (torre-transferencia)", "Dump lógico completo (pg_dump)", "Diária (agendada às 02h00)", "14 dias", "Servidor local / NAS interno Princesa dos Campos", "Não", "Pós-implantação"),
        ("Arquivos de logs da aplicação (PM2)", "Rotação automática de logs (pm2-logrotate)", "Contínua", "30 dias", "Servidor de produção local", "Não", "Em operação"),
        ("Variáveis de ambiente (.env) e segredos", "Cópia em cofre corporativo de senhas de TI", "A cada alteração de configuração", "Histórico de versões", "Cofre de senhas corporativo da TI", "Sim", "Validação na instalação"),
        ("Código-fonte – GitHub (repositório privado torre-transfer-ncia)", "Commit e push com histórico Git completo", "Diária / por entrega de versão", "Indeterminado", "GitHub (repositório privado)", "Sim", "14/10/2026")
    ]
    set_table_data(doc.tables[12], t12_data)
        
    # TABLE 13: Pessoas, Papéis e Contatos (Mesmos nomes e setores)
    t13_data = [
        ("Papel", "Titular", "Substituto", "Responsabilidade", "Contato corporativo"),
        ("Coordenador da crise", "Mauricio Chedid", "Bruno Silva", "Decisão e comunicação executiva", "mauricio.chedid@princesadoscampos.com.br\nbruno.silva@princesadoscampos.com.br"),
        ("Líder técnico", "William Kutz; Weslen Rian", "TI Princesa", "Diagnóstico e recuperação técnica do sistema", "william.kutz@princesadoscampos.com.br\nweslen.silva@princesadoscampos.com.br"),
        ("Dono do processo", "William Kutz; Weslen Rian", "TI Princesa", "Prioridade e validação de regras de negócio", "william.kutz@princesadoscampos.com.br\nweslen.silva@princesadoscampos.com.br"),
        ("Segurança da informação", "Wesley Martinelli", "TI Princesa", "Resposta cibernética, análise de vulnerabilidade e evidências", "wesley.soares@princesadoscampos.com.br"),
        ("Infraestrutura/Cloud", "Wesley Martinelli", "TI Princesa", "Ambiente físico/virtual, rede corporativa e capacidade de hardware", "wesley.soares@princesadoscampos.com.br"),
        ("Desenvolvimento", "William Kutz; Weslen Rian", "TI Princesa", "Correção de bugs, migrações de banco, build e deploy", "william.kutz@princesadoscampos.com.br\nweslen.silva@princesadoscampos.com.br"),
        ("Comunicação", "Mauricio Chedid", "Bruno Silva", "Mensagens e comunicados aos usuários e públicos afetados", "mauricio.chedid@princesadoscampos.com.br\nbruno.silva@princesadoscampos.com.br"),
    ]
    set_table_data(doc.tables[13], t13_data)
        
    # TABLE 14: Callout Regra de Disponibilidade
    set_cell_text(doc.tables[14].cell(0, 0),
        "Regra de disponibilidade: Mantenha pelo menos dois profissionais capazes de executar os procedimentos críticos. Contatos devem ser validados periodicamente.")
        
    # TABLE 15: Critérios de acionamento e escalonamento
    t15_data = [
        ("Nível", "Condição", "Exemplo", "Autoridade", "Prazo de escalonamento"),
        ("N1 - Alerta", "Risco sem impacto operacional imediato", "Lentidão no carregamento do Painel TV ou atraso leve no processamento de e-mails AngelLira", "William Kutz; Weslen Rian", "15 min"),
        ("N2 - Incidente", "Impacto parcial ou RTO em risco", "Módulo de viagens ou auditoria inacessível; falha de sincronização de telemetria Sascar", "William Kutz + Weslen Rian", "30 min"),
        ("N3 - Crise", "Indisponibilidade crítica total ou segurança", "Sistema Torre de Transferência completamente fora do ar, banco corrompido ou incidente de segurança cibernética", "Wesley Soares / Wesley Martinelli (Gerente de TI)", "Imediato"),
    ]
    set_table_data(doc.tables[15], t15_data)
        
    # TABLE 16: Callout Runbook
    set_cell_text(doc.tables[16].cell(0, 0),
        "Importante: O runbook deve ser executável por um profissional habilitado que não seja o autor original do sistema. Comandos sensíveis e senhas devem permanecer em repositórios seguros.")
        
    # TABLE 17: Runbook de Recuperação (10 Etapas)
    t17_data = [
        ("Etapa", "Ação", "Responsável", "Tempo estimado", "Evidência/resultado"),
        ("1", "Confirmar escopo e congelar mudanças em produção", "Mauricio Chedid", "20 min", "Log de incidente aberto e equipe notificada"),
        ("2", "Preservar logs do PM2 e do PostgreSQL para análise", "Responsável Técnico", "15 min", "Cópias dos arquivos de log salvas"),
        ("3", "Verificar conectividade de rede, PostgreSQL e banco Sascar", "Responsável Técnico", "20 min", "Diagnóstico de infraestrutura concluído"),
        ("4", "Aplicar failover / reinício / rollback / restauração de backup", "Responsável Técnico", "1 h", "Serviço reiniciado ou restore concluído"),
        ("5", "Executar scripts de migração e consistência (prisma migrate)", "Responsável Técnico", "10 min", "Schema do banco validado"),
        ("6", "Validar integrações (Sascar GPS, IMAP AngelLira, SMTP)", "Responsável Técnico", "15 min", "Serviços externos respondendo"),
        ("7", "Executar testes de fumaça (acesso web, login, dashboard)", "Responsável Técnico", "15 min", "Telas carregando com HTTP 200"),
        ("8", "Submeter validação ao negócio (Torre / Transferências)", "Wesley Martinelli", "30 min", "Aceite formal do coordenador"),
        ("9", "Liberar acessos aos usuários e reativar Painel TV", "Responsável Técnico", "15 min", "Operação plena reestabelecida"),
        ("10", "Encerrar crise e registrar pendências para pós-incidente", "Responsável Técnico", "10 min", "Relatório pós-crise documentado"),
    ]
    set_table_data(doc.tables[17], t17_data)
        
    # TABLE 18: Comandos, scripts e acessos
    t18_data = [
        ("Item", "Repositório seguro/localização", "Responsável", "Última validação"),
        ("Scripts de recuperação e deploy", "GitHub – repositório torre-transfer-ncia (npm run build, pm2 restart ecosystem.config.cjs)", "William Kutz; Weslen Rian", "14/10/2026"),
        ("Infraestrutura como código", "Docker Compose (docker-compose.yml) para PostgreSQL local de emergência", "William Kutz; Weslen Rian", "14/10/2026"),
        ("Pacote de versão estável", "Commit “0d5a2d49ff37f44f351bbaeb2d77c0d21f362c71” (branch main)", "William Kutz; Weslen Rian", "14/10/2026"),
        ("Cofre de credenciais", ".env local no servidor e cofre seguro de TI", "William Kutz; Weslen Rian", "14/10/2026"),
        ("Logs e dashboards", "pm2 log transferencia; pm2 log email-cron; pm2 status", "William Kutz; Weslen Rian", "14/10/2026"),
        ("Rotinas de banco e seeds", "npx tsx prisma/seed.ts (bases/usuários) e npx tsx prisma/seed-rotas.ts", "William Kutz; Weslen Rian", "14/10/2026")
    ]
    set_table_data(doc.tables[18], t18_data, template_row_idx=1)
        
    # TABLE 19: Validação do restabelecimento
    t19_data = [
        ("Verificação", "Critério de aceite", "Executor", "Resultado"),
        ("Aplicação responde", "http://172.20.10.210:3001 e /api/hora – resposta < 3s com HTTP 200", "William Kutz; Weslen Rian", "200 OK"),
        ("Autenticação e perfis", "ADMIN, GERENTE e OPERADOR realizam login via NextAuth", "Usuário / Operador", "Sessão ativa e redirecionamento correto"),
        ("Integridade do banco", "SELECT COUNT(*) FROM \"Viagem\" e \"Base\" retornam dados consistentes", "William Kutz; Weslen Rian", "Dados íntegros e consistentes"),
        ("Integrações de telemetria", "Banco de telemetria Sascar acessível (172.20.10.205) e posições GPS atualizando", "Gabriel Cordeiro / Wesley Martinelli", "Conectado com sucesso"),
        ("Processo de e-mails", "Processo email-cron rodando no PM2 sem erros de conexão IMAP", "William Kutz; Weslen Rian", "Polling IMAP operando a cada 60s"),
        ("Processo crítico operacional", "Abertura do Dashboard, Painel TV (/dashboard?painel=true) e listagem de viagens", "Operador da Torre de Transferência", "Grid operacional exibindo viagens em tempo real"),
        ("Monitoramento PM2", "pm2 status exibe processos \"transferencia\" e \"email-cron\" como online", "William Kutz; Weslen Rian", "Processos online e estáveis"),
        ("RPO atendido", "Dados de viagens e telemetrias não superiores a 15-30 min de diferença", "TI Princesa", "RPO dentro do limite aceitável"),
    ]
    set_table_data(doc.tables[19], t19_data, template_row_idx=1)
        
    # TABLE 20: Comunicação durante a interrupção
    t20_data = [
        ("Público", "Quando comunicar", "Canal", "Responsável", "Conteúdo mínimo"),
        ("Diretoria", "N3 (Crise)", "Teams / E-mail corporativo", "Mauricio Chedid", "Impacto, previsão de retomada e decisões tomadas"),
        ("Usuários da Torre e Filiais", "Assim que impacto confirmado", "WhatsApp grupo de operações / E-mail institucional", "William Kutz; Weslen Rian", "Serviço afetado e procedimentos de contingência"),
        ("Clientes corporativos / Embarcadores", "Conforme impacto operacional", "Canal formal definido pela diretoria", "Mauricio Chedid", "Previsões de atendimento e orientações logísticas"),
        ("Jurídico / DPO", "Se houver vazamento de dados pessoais", "E-mail urgente de incidente de segurança", "William Kutz; Weslen Rian", "Escopo dos dados afetados e relatório técnico"),
        ("Fornecedores (Sascar / AngelLira)", "Se serviço externo de rastreamento envolvido", "Canal de suporte e escalonamento da fornecedora", "William Kutz; Weslen Rian", "Severidade, evidências e protocolo de chamado"),
    ]
    set_table_data(doc.tables[20], t20_data)
        
    # TABLE 21: Modelo de comunicado inicial
    set_cell_text(doc.tables[21].cell(0, 0),
        "Assunto: Indisponibilidade da Torre de Transferência\n\nIdentificamos uma indisponibilidade no sistema Torre de Transferência em [data/hora], afetando o monitoramento de viagens e acompanhamento de transbordos entre filiais. A equipe responsável já está atuando para reestabelecimento do serviço. Enquanto isso, deverá ser utilizada a Planilha de Contingência de Viagens compartilhada na rede. A próxima atualização ocorrerá até [horário], mesmo que não haja alteração relevante de status.")
        
    # TABLE 22: Modelo de restabelecimento
    set_cell_text(doc.tables[22].cell(0, 0),
        "Assunto: Restabelecimento da Torre de Transferência\n\nO sistema Torre de Transferência foi restabelecido em [data/hora] e encontra-se operando sob monitoramento. Solicitamos aos operadores da Torre e das filiais que realizem a conciliação dos dados de viagens registrados durante a contingência. O incidente será analisado tecnicamente para implementação de melhorias corretivas e preventivas.")
        
    # TABLE 23: Retorno à normalidade e reconciliação
    t23_data = [
        ("Item de reconciliação", "Origem", "Destino", "Responsável", "Prazo", "Status"),
        ("Viagens e horários de partida/chegada registrados na contingência",
         "Planilha Excel de contingência",
         "Sistema Torre de Transferência",
         "Central de Controle / Operadores",
         "Até 4h após restabelecimento",
         "Aberto"),
        ("Ocorrências de rota e transbordo recebidas durante a indisponibilidade",
         "Anotações da contingência",
         "Módulo de Ocorrências da Torre",
         "Operadores da Torre",
         "Até 2h após restabelecimento",
         "Aberto")
    ]
    set_table_data(doc.tables[23], t23_data, template_row_idx=1)
        
    # TABLE 24: Testes, exercícios e manutenção
    t24_data = [
        ("Tipo de teste", "Periodicidade", "Escopo", "Responsável", "Evidência"),
        ("Restauração de backup", "Trimestral", "PostgreSQL (torre-transferencia) + configs (.env)", "William Kutz; Weslen Rian", "Relatório de restauração em ambiente isolado"),
        ("Mesa / Simulação", "Semestral", "Falha total do servidor 172.20.10.210 + indisponibilidade de pessoa-chave", "Gestor TI", "Ata de simulação de crise e lições aprendidas"),
        ("Failover técnico", "Anual", "Servidor de aplicação + banco de dados + pool de telemetria", "William Kutz; Weslen Rian", "Evidência de subida em ambiente alternativo"),
        ("Operação manual", "Anual", "Simulação de contingência manual por planilha da Torre de Transferência", "William Kutz; Weslen Rian", "Relatório de eficácia do preenchimento manual"),
        ("Recuperação completa", "Anual", "Do registro da viagem até a entrega e conciliação de manifestos", "William Kutz; Weslen Rian", "Checklist executivo de validação ponta a ponta"),
    ]
    set_table_data(doc.tables[24], t24_data)
        
    # TABLE 26: Gestão do conhecimento e sucessão técnica
    t26_data = [
        ("Conhecimento crítico", "Titular", "Substituto", "Material", "Último treinamento"),
        ("Deploy / CI / PM2", "William Kutz; Weslen Rian", "TI Princesa",
         "GitHub – repositório torre-transfer-ncia / ecosystem.config.cjs", "A definir"),
        ("Banco de dados / Prisma ORM", "William Kutz; Weslen Rian", "TI Princesa",
         "prisma/schema.prisma e migrações", "A definir"),
        ("Banco externo de telemetria (Sascar)", "Gabriel Cordeiro", "Wesley Martinelli",
         "src/server/db-telemetria.ts e rotinas Sascar", "A definir"),
        ("Processamento IMAP e SMTP (AngelLira)", "William Kutz; Weslen Rian", "TI Princesa",
         "scripts/email-cron.mjs e serviços de e-mail", "A definir"),
        ("Regras de transferência e transbordos", "Operador Torre de Transferência", "Tráfego Ponta Grossa",
         "Manual Operacional e Matriz de Rotas", "A definir")
    ]
    set_table_data(doc.tables[26], t26_data, template_row_idx=1)
        
    # TABLE 27: Riscos e plano de tratamento
    t27_data = [
        ("Risco", "Prob.", "Impacto", "Nível", "Tratamento", "Responsável", "Prazo"),
        ("Dependência de pessoas-chave (desenvolvedores)", "Alta", "Alta", "Alto", "Documentar runbooks exaustivamente e treinar terceiro profissional na TI", "Mauricio Chedid", "A definir"),
        ("Falha na integração com telemetria Sascar", "Média", "Alta", "Alto", "Estabelecer rotina de monitoramento de heartbeat e procedimento web", "Wesley Martinelli", "A definir"),
        ("Falha na rotina de backup do banco principal", "Média", "Alta", "Alto", "Automatizar script pg_dump com alerta de falha e retenção em NAS", "William Kutz; Weslen Rian", "A definir"),
        ("Obsolescência ou falha de hardware do servidor", "Média", "Alta", "Alto", "Planejar provisionamento de VM espelho ou contingência em nuvem", "Wesley Martinelli", "A definir"),
        ("Credenciais e segredos sem cofre corporativo", "Média", "Média", "Médio", "Migrar credenciais para cofre corporativo de senhas de TI", "William Kutz; Weslen Rian", "A definir"),
        ("Falha de conexão IMAP com e-mails AngelLira", "Média", "Média", "Médio", "Criar indicador visual no dashboard para alarmes de conexão IMAP", "William Kutz; Weslen Rian", "A definir"),
    ]
    set_table_data(doc.tables[27], t27_data)
        
    # TABLE 29: Ação corretiva
    update_row(doc.tables[29], 1, [
        "[Ação]", "Alta", "[A preencher]", "[A definir pós-incidente]", "[Aberta]", "GitHub – repositório torre-transfer-ncia"
    ])
    
    # TABLE 31: Glossário
    t31_data = [
        ("Termo", "Definição"),
        ("BCP/PCN", "Plano de Continuidade de Negócio."),
        ("DRP/PRD", "Plano de Recuperação de Desastre, com foco tecnológico."),
        ("BIA", "Análise de Impacto no Negócio (Business Impact Analysis)."),
        ("RTO", "Tempo máximo desejado para restabelecer o serviço."),
        ("RPO", "Ponto máximo de perda de dados aceitável, medido no tempo."),
        ("MTPD", "Período máximo tolerável de interrupção operacional."),
        ("Failover", "Mudança automática ou manual para recurso ou ambiente alternativo."),
        ("Rollback", "Retorno a uma versão de software ou estado de banco anterior estável."),
        ("Geocerca", "Cerca virtual delimitando a área geográfica de uma base/filial para detecção automática de entrada e saída por telemetria GPS."),
        ("Transbordo", "Operação de descarregamento e transferência de mercadorias entre veículos em base intermediária com janela horária definida.")
    ]
    set_table_data(doc.tables[31], t31_data, template_row_idx=1)
    
    # ── 3. FOOTER UPDATE ─────────────────────────────────────────────────────
    for sec in doc.sections:
        if sec.footer and sec.footer.paragraphs:
            fp = sec.footer.paragraphs[0]
            if fp.runs:
                fp.runs[0].text = fp.runs[0].text.replace('[00]', '01')
                print("Updated footer revision to 01")
                
    # Save the updated document
    doc.save(output_file)
    print(f"Successfully saved {output_file}!")

if __name__ == "__main__":
    build_torre_transferencia_doc()
