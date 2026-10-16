"use client";

import { useState, useMemo } from "react";
import { api } from "@/trpc/react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type MotoristaAngelUpload = {
    nome: string;
    tipo?: string;
    cpf: string;
    validade?: string;
    ultimoCadastro?: string;
    vigencia?: string;
};

type VeiculoAngelUpload = {
    placa: string;
    proprietario?: string;
    cnpjCpf?: string;
    validade?: string;
    ultimoCadastro?: string;
    vigencia?: string;
};

// ─── Parser CSV ───────────────────────────────────────────────────────────────

function parseCSVMotoristas(csvText: string): MotoristaAngelUpload[] {
    const linhas = csvText.trim().split(/\r?\n/);
    const resultado: MotoristaAngelUpload[] = [];
    for (let i = 1; i < linhas.length; i++) {
        const linha = linhas[i];
        if (!linha?.trim()) continue;
        const campos = linha.split(";").map((c) => c.replace(/^"|"$/g, "").trim());
        if (campos.length < 3) continue;
        resultado.push({
            nome: campos[0] ?? "",
            tipo: campos[1] ?? "Padrão",
            cpf: campos[2] ?? "",
            validade: campos[3] ?? "",
            ultimoCadastro: campos[4] ?? "",
            vigencia: campos[5] ?? "",
        });
    }
    return resultado;
}

function parseCSVVeiculos(csvText: string): VeiculoAngelUpload[] {
    const linhas = csvText.trim().split(/\r?\n/);
    const resultado: VeiculoAngelUpload[] = [];
    for (let i = 1; i < linhas.length; i++) {
        const linha = linhas[i];
        if (!linha?.trim()) continue;
        const campos = linha.split(";").map((c) => c.replace(/^"|"$/g, "").trim());
        if (campos.length < 1) continue;
        resultado.push({
            placa: campos[0] ?? "",
            proprietario: campos[1] ?? "",
            cnpjCpf: campos[2] ?? "",
            validade: campos[3] ?? "",
            ultimoCadastro: campos[4] ?? "",
            vigencia: campos[5] ?? "",
        });
    }
    return resultado;
}

// ─── Helpers visuais ──────────────────────────────────────────────────────────

function formatarData(dataStr: string | null | undefined): string {
    if (!dataStr || dataStr === "0000-00-00") return "—";
    try {
        const d = new Date(dataStr);
        if (!isNaN(d.getTime())) {
            return d.toLocaleDateString("pt-BR");
        }
        return dataStr.split(",")[0]?.split("T")[0]?.trim() ?? dataStr;
    } catch {
        return dataStr;
    }
}

function formatarCPF(cpf: string | null | undefined): string {
    if (!cpf) return "—";
    const nums = cpf.replace(/\D/g, "");
    if (nums.length === 11) {
        return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
    }
    return cpf;
}

function BadgeStatus({
    expirado,
    venceEm7Dias,
    venceEm30Dias,
    diasRestantes,
}: {
    expirado: boolean;
    venceEm7Dias: boolean;
    venceEm30Dias: boolean;
    diasRestantes: number | null;
}) {
    if (expirado) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                Expirado ({Math.abs(diasRestantes ?? 0)}d atrás)
            </span>
        );
    }
    if (venceEm7Dias) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                Vence em {diasRestantes}d ⚠️
            </span>
        );
    }
    if (venceEm30Dias) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Vence em {diasRestantes}d
            </span>
        );
    }
    if (diasRestantes !== null) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Válido ({diasRestantes}d)
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold bg-slate-100 text-slate-500">
            Sem dado
        </span>
    );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
    label,
    value,
    icon,
    cor,
}: {
    label: string;
    value: number | string;
    icon: string;
    cor: string;
}) {
    return (
        <div className={`rounded-2xl border p-5 flex items-center gap-4 bg-white shadow-sm ${cor}`}>
            <span className="text-3xl">{icon}</span>
            <div>
                <p className="text-2xl font-extrabold text-slate-900 leading-tight">{value}</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
            </div>
        </div>
    );
}

// ─── Componente de Upload de Planilha ─────────────────────────────────────────

function UploadBox({
    label,
    icon,
    onParsed,
    isLoading,
}: {
    label: string;
    icon: string;
    onParsed: (text: string) => void;
    isLoading: boolean;
}) {
    const [arrastar, setArrastar] = useState(false);

    function handleFile(file: File) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (text) onParsed(text);
        };
        reader.readAsText(file, "utf-8");
    }

    return (
        <label
            onDragOver={(e) => { e.preventDefault(); setArrastar(true); }}
            onDragLeave={() => setArrastar(false)}
            onDrop={(e) => {
                e.preventDefault();
                setArrastar(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFile(file);
            }}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-2 transition-all ${
                isLoading
                    ? "border-blue-400 bg-blue-50/50 animate-pulse"
                    : arrastar
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
            }`}
        >
            <span className="text-4xl">{isLoading ? "⏳" : icon}</span>
            <div className="text-center">
                <p className="font-bold text-slate-700 text-sm">{label}</p>
                <p className="text-xs text-slate-400 mt-1">
                    {isLoading ? "Salvando no banco de dados..." : "Clique ou arraste o novo CSV para atualizar o banco"}
                </p>
            </div>
            <input
                type="file"
                accept=".csv"
                disabled={isLoading}
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                }}
            />
        </label>
    );
}

// ─── Tabela Motoristas ────────────────────────────────────────────────────────

type FiltroStatus = "todos" | "expirado" | "vence7" | "vence30" | "valido" | "semAngel";

type AngelStatus = {
    nome?: string;
    cpf?: string;
    tipo?: string;
    vigencia: string | null;
    ultimoCadastro: string | null;
    diasRestantes: number | null;
    expirado: boolean;
    venceEm7Dias: boolean;
    venceEm30Dias: boolean;
    dataVigencia: Date | null;
    proprietario?: string;
    placa?: string;
    cnpjCpf?: string;
};

type ItemMotorista = {
    idERP: string | number;
    nomeERP: string;
    nomeCompletoERP: string | null;
    cpfERP: string | null;
    transportadora: string | null;
    cnhERP?: {
        numero: string | null;
        categoria: string | null;
        validade: string | null;
    };
    seguroERP?: {
        validade: string | null;
        status: string | number | null;
        autorizacao: string | null;
    };
    statusERP: number | string | null;
    telefoneERP: string | null;
    rntrcERP: string | null;
    cadastradoAngel: boolean;
    angelData?: AngelStatus;
};

type DadosMotoristas = {
    motoristasERPxAngel: ItemMotorista[];
    apenasAngel: (AngelStatus & { nome: string; cpf: string; tipo: string })[];
    totalERP: number;
    totalAngel: number;
    totalCruzados: number;
    totalExpirados: number;
    totalVence7Dias: number;
    totalVence30Dias: number;
};

type ItemVeiculo = {
    idVeiculo: number;
    placaERP: string;
    renavamERP: string | null;
    marcaERP: string | null;
    modeloERP: string | null;
    anoERP: number | null;
    transportadora: string | null;
    gerenciadoraERP: string | null;
    seguroERP?: {
        validade: string | null;
        status: number | null;
        autorizacao: string | null;
    };
    rntrcERP: string | null;
    statusERP: number | null;
    cadastradoAngel: boolean;
    angelData?: AngelStatus;
};

type DadosVeiculos = {
    veiculosERPxAngel: ItemVeiculo[];
    apenasAngel: (AngelStatus & { placa: string; proprietario: string; cnpjCpf: string })[];
    totalERP: number;
    totalAngel: number;
    totalCruzados: number;
    totalExpirados: number;
    totalVence7Dias: number;
    totalVence30Dias: number;
};

function TabelaMotoristas({
    dados,
    filtro,
    busca,
}: {
    dados: DadosMotoristas | undefined;
    filtro: FiltroStatus;
    busca: string;
}) {
    if (!dados) return null;

    const itens = useMemo(() => {
        return dados.motoristasERPxAngel.filter((m) => {
            const termoBusca = busca.toLowerCase();
            const matchBusca =
                !busca ||
                m.nomeERP.toLowerCase().includes(termoBusca) ||
                (m.cpfERP && m.cpfERP.includes(termoBusca)) ||
                (m.transportadora && m.transportadora.toLowerCase().includes(termoBusca)) ||
                (m.angelData?.cpf && m.angelData.cpf.includes(termoBusca));

            if (!matchBusca) return false;
            switch (filtro) {
                case "expirado": return m.angelData?.expirado;
                case "vence7": return m.angelData?.venceEm7Dias;
                case "vence30": return m.angelData?.venceEm30Dias;
                case "valido": return m.cadastradoAngel && !m.angelData?.expirado && !m.angelData?.venceEm7Dias && !m.angelData?.venceEm30Dias;
                case "semAngel": return !m.cadastradoAngel;
                default: return true;
            }
        });
    }, [dados, filtro, busca]);

    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-sm">
                <thead className="bg-slate-900 text-white">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Motorista (ERP)</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Transportadora</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">CPF</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider hidden md:table-cell">CNH / Categoria</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Status Seguro (Angel)</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider hidden lg:table-cell">Vigência Angel</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider hidden xl:table-cell">Último Cadastro</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {itens.map((m, i) => (
                        <tr
                            key={i}
                            className={`transition-colors hover:bg-slate-50 ${
                                m.angelData?.expirado
                                    ? "bg-red-50/40"
                                    : m.angelData?.venceEm7Dias
                                    ? "bg-orange-50/40"
                                    : m.angelData?.venceEm30Dias
                                    ? "bg-amber-50/30"
                                    : ""
                            }`}
                        >
                            <td className="px-4 py-3">
                                <div className="font-semibold text-slate-800">{m.nomeERP}</div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    {m.telefoneERP && (
                                        <span className="text-xs text-slate-500">📞 {m.telefoneERP}</span>
                                    )}
                                    {!m.cadastradoAngel && (
                                        <span className="text-[10px] text-slate-400 bg-slate-100 rounded px-1.5 py-0.2">Sem cadastro Angel</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                {m.transportadora ? (
                                    <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-800 border border-blue-100">
                                        🏢 {m.transportadora}
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-400">Autônomo / Sem vínculo</span>
                                )}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-slate-600">
                                {formatarCPF(m.cpfERP || m.angelData?.cpf)}
                            </td>
                            <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">
                                {m.cnhERP?.numero ? (
                                    <div>
                                        <span className="font-medium text-slate-700">{m.cnhERP.numero}</span>
                                        {m.cnhERP.categoria && (
                                            <span className="ml-1.5 bg-slate-100 text-slate-600 px-1 py-0.5 rounded text-[10px] font-bold">
                                                Cat {m.cnhERP.categoria}
                                            </span>
                                        )}
                                    </div>
                                ) : "—"}
                            </td>
                            <td className="px-4 py-3">
                                {m.cadastradoAngel && m.angelData ? (
                                    <BadgeStatus
                                        expirado={m.angelData.expirado}
                                        venceEm7Dias={m.angelData.venceEm7Dias}
                                        venceEm30Dias={m.angelData.venceEm30Dias}
                                        diasRestantes={m.angelData.diasRestantes}
                                    />
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold bg-slate-100 text-slate-500">
                                        ❌ Não cadastrado
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-slate-600 hidden lg:table-cell font-medium">
                                {formatarData(m.angelData?.vigencia) ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-slate-400 text-xs hidden xl:table-cell">
                                {formatarData(m.angelData?.ultimoCadastro) ?? "—"}
                            </td>
                        </tr>
                    ))}
                    {itens.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                                Nenhum motorista encontrado com os filtros atuais.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

// ─── Tabela Veículos ──────────────────────────────────────────────────────────

function TabelaVeiculos({
    dados,
    filtro,
    busca,
}: {
    dados: DadosVeiculos | undefined;
    filtro: FiltroStatus;
    busca: string;
}) {
    if (!dados) return null;

    const itens = useMemo(() => {
        return dados.veiculosERPxAngel.filter((v) => {
            const termoBusca = busca.toLowerCase();
            const matchBusca =
                !busca ||
                v.placaERP.toLowerCase().includes(termoBusca) ||
                (v.marcaERP ?? "").toLowerCase().includes(termoBusca) ||
                (v.modeloERP ?? "").toLowerCase().includes(termoBusca) ||
                (v.transportadora && v.transportadora.toLowerCase().includes(termoBusca)) ||
                (v.angelData?.proprietario ?? "").toLowerCase().includes(termoBusca);

            if (!matchBusca) return false;
            switch (filtro) {
                case "expirado": return v.angelData?.expirado;
                case "vence7": return v.angelData?.venceEm7Dias;
                case "vence30": return v.angelData?.venceEm30Dias;
                case "valido": return v.cadastradoAngel && !v.angelData?.expirado && !v.angelData?.venceEm7Dias && !v.angelData?.venceEm30Dias;
                case "semAngel": return !v.cadastradoAngel;
                default: return true;
            }
        });
    }, [dados, filtro, busca]);

    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-sm">
                <thead className="bg-slate-900 text-white">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Placa (ERP)</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Transportadora / Proprietário</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider hidden md:table-cell">Modelo / Marca</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Status Seguro (Angel)</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider hidden lg:table-cell">Proprietário Angel</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider hidden lg:table-cell">Vigência Angel</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider hidden xl:table-cell">Último Cadastro</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {itens.map((v, i) => (
                        <tr
                            key={i}
                            className={`transition-colors hover:bg-slate-50 ${
                                v.angelData?.expirado
                                    ? "bg-red-50/40"
                                    : v.angelData?.venceEm7Dias
                                    ? "bg-orange-50/40"
                                    : v.angelData?.venceEm30Dias
                                    ? "bg-amber-50/30"
                                    : ""
                            }`}
                        >
                            <td className="px-4 py-3">
                                <div className="font-bold text-slate-800 font-mono tracking-wider text-base">{v.placaERP}</div>
                                {v.gerenciadoraERP && (
                                    <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                                        ERP: {v.gerenciadoraERP}
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                {v.transportadora ? (
                                    <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-800 border border-blue-100">
                                        🏢 {v.transportadora}
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-400">Frota Própria / Não inf.</span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-slate-600 text-xs hidden md:table-cell">
                                <div className="font-medium text-slate-800">
                                    {[v.marcaERP, v.modeloERP].filter(Boolean).join(" - ") || "—"}
                                </div>
                                {v.anoERP ? <span className="text-slate-400">Ano: {v.anoERP}</span> : null}
                            </td>
                            <td className="px-4 py-3">
                                {v.cadastradoAngel && v.angelData ? (
                                    <BadgeStatus
                                        expirado={v.angelData.expirado}
                                        venceEm7Dias={v.angelData.venceEm7Dias}
                                        venceEm30Dias={v.angelData.venceEm30Dias}
                                        diasRestantes={v.angelData.diasRestantes}
                                    />
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold bg-slate-100 text-slate-500">
                                        ❌ Não cadastrado
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-slate-600 text-xs hidden lg:table-cell font-medium">
                                {v.angelData?.proprietario ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-slate-600 hidden lg:table-cell font-medium">
                                {formatarData(v.angelData?.vigencia) ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-slate-400 text-xs hidden xl:table-cell">
                                {formatarData(v.angelData?.ultimoCadastro) ?? "—"}
                            </td>
                        </tr>
                    ))}
                    {itens.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                                Nenhum veículo encontrado com os filtros atuais.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

// ─── Página Principal ─────────────────────────────────────────────────────────

type AbaAtiva = "motoristas" | "veiculos";

export default function SeguradoraPage() {
    const [aba, setAba] = useState<AbaAtiva>("motoristas");
    const [filtro, setFiltro] = useState<FiltroStatus>("todos");
    const [busca, setBusca] = useState("");
    const [mostrarUpload, setMostrarUpload] = useState(false);
    const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

    const utils = api.useUtils();

    // Consultas diretas ao banco de dados (carregamento automático)
    const { data: dadosMotoristas, isLoading: loadingMotoristas } =
        api.seguradora.obterCruzamentoMotoristas.useQuery(undefined, {
            refetchOnWindowFocus: false,
        });

    const { data: dadosVeiculos, isLoading: loadingVeiculos } =
        api.seguradora.obterCruzamentoVeiculos.useQuery(undefined, {
            refetchOnWindowFocus: false,
        });

    const { data: metadados, refetch: refetchMetadados } =
        api.seguradora.obterMetadadosImportacao.useQuery();

    // Mutações para importar/atualizar novas planilhas no banco
    const mutationMotoristas = api.seguradora.importarMotoristasAngel.useMutation({
        onSuccess: (res) => {
            utils.seguradora.obterCruzamentoMotoristas.invalidate();
            refetchMetadados();
            setMensagemSucesso(`✅ ${res.salvos} motoristas atualizados com sucesso no banco de dados!`);
            setTimeout(() => setMensagemSucesso(null), 6000);
        },
    });

    const mutationVeiculos = api.seguradora.importarVeiculosAngel.useMutation({
        onSuccess: (res) => {
            utils.seguradora.obterCruzamentoVeiculos.invalidate();
            refetchMetadados();
            setMensagemSucesso(`✅ ${res.salvos} veículos atualizados com sucesso no banco de dados!`);
            setTimeout(() => setMensagemSucesso(null), 6000);
        },
    });

    function handleImportMotoristas(csvText: string) {
        const parsed = parseCSVMotoristas(csvText);
        mutationMotoristas.mutate({ motoristas: parsed });
    }

    function handleImportVeiculos(csvText: string) {
        const parsed = parseCSVVeiculos(csvText);
        mutationVeiculos.mutate({ veiculos: parsed });
    }

    // Botões de filtro
    const filtrosBotoes: { key: FiltroStatus; label: string; cor: string }[] = [
        { key: "todos", label: "Todos", cor: "bg-slate-200 text-slate-700 hover:bg-slate-300" },
        { key: "expirado", label: "🔴 Expirado", cor: "bg-red-100 text-red-700 hover:bg-red-200" },
        { key: "vence7", label: "🟠 Vence em 7 dias", cor: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
        { key: "vence30", label: "🟡 Vence em 30 dias", cor: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
        { key: "valido", label: "🟢 Válido", cor: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
        { key: "semAngel", label: "⚫ Sem Angel", cor: "bg-slate-100 text-slate-600 hover:bg-slate-200" },
    ];

    const dadosAtivos = aba === "motoristas" ? dadosMotoristas : dadosVeiculos;
    const loading = aba === "motoristas" ? loadingMotoristas : loadingVeiculos;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-blue-900/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                                🛡️
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                                    Monitoramento de Seguro — Angel
                                </h1>
                                <p className="text-sm text-blue-300/80 mt-1">
                                    Cruzamento automático entre ERP (<code className="bg-blue-950 px-1 rounded text-blue-200">motorista_terceiro</code>, <code className="bg-blue-950 px-1 rounded text-blue-200">veiculos</code> e <code className="bg-blue-950 px-1 rounded text-blue-200">fornecedores</code>) e base salva da Angel
                                </p>
                            </div>
                        </div>

                        {/* Botão de abrir painel de atualização de planilha */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setMostrarUpload(!mostrarUpload)}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
                            >
                                <span>{mostrarUpload ? "✕ Fechar Importação" : "📥 Atualizar Planilhas Angel"}</span>
                            </button>
                        </div>
                    </div>

                    {/* Metadata de sincronização */}
                    {metadados && (
                        <div className="mt-4 pt-4 border-t border-blue-900/40 flex flex-wrap items-center gap-4 text-xs text-blue-200/70">
                            <span>📦 <strong>{metadados.totalMotoristasAngel}</strong> motoristas cadastrados</span>
                            <span>🚛 <strong>{metadados.totalVeiculosAngel}</strong> veículos cadastrados</span>
                            {metadados.ultimaAtualizacaoMotoristas && (
                                <span>🕒 Última sincronização: <strong>{new Date(metadados.ultimaAtualizacaoMotoristas).toLocaleString("pt-BR")}</strong></span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                {/* Notificação de Sucesso */}
                {mensagemSucesso && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 font-bold text-sm flex items-center justify-between shadow-sm">
                        <span>{mensagemSucesso}</span>
                        <button onClick={() => setMensagemSucesso(null)} className="text-emerald-600 hover:text-emerald-900 font-extrabold">✕</button>
                    </div>
                )}

                {/* Painel de Upload (apenas quando solicitado pelo operador para atualizar) */}
                {mostrarUpload && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <div>
                                <h3 className="font-bold text-slate-800 text-base">Atualização de Cadastros Angel</h3>
                                <p className="text-xs text-slate-500">Envie novos relatórios CSV da gerenciadora Angel. Os dados serão salvos no banco de dados permanentemente.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <UploadBox
                                label="Atualizar Motoristas Angel (CSV)"
                                icon="👤"
                                onParsed={handleImportMotoristas}
                                isLoading={mutationMotoristas.isPending}
                            />
                            <UploadBox
                                label="Atualizar Veículos Angel (CSV)"
                                icon="🚛"
                                onParsed={handleImportVeiculos}
                                isLoading={mutationVeiculos.isPending}
                            />
                        </div>
                    </div>
                )}

                {/* KPIs */}
                {dadosAtivos && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        <KpiCard
                            label="Total ERP"
                            value={dadosAtivos.totalERP}
                            icon="🏢"
                            cor="border-slate-200"
                        />
                        <KpiCard
                            label="Total Angel"
                            value={dadosAtivos.totalAngel}
                            icon="🛡️"
                            cor="border-blue-200"
                        />
                        <KpiCard
                            label="Cruzados"
                            value={dadosAtivos.totalCruzados}
                            icon="🔗"
                            cor="border-emerald-200"
                        />
                        <KpiCard
                            label="Expirados"
                            value={dadosAtivos.totalExpirados}
                            icon="🔴"
                            cor={dadosAtivos.totalExpirados > 0 ? "border-red-300 bg-red-50" : "border-slate-200"}
                        />
                        <KpiCard
                            label="Vence em 7 dias"
                            value={dadosAtivos.totalVence7Dias}
                            icon="🟠"
                            cor={dadosAtivos.totalVence7Dias > 0 ? "border-orange-300 bg-orange-50" : "border-slate-200"}
                        />
                        <KpiCard
                            label="Vence em 30 dias"
                            value={dadosAtivos.totalVence30Dias}
                            icon="🟡"
                            cor={dadosAtivos.totalVence30Dias > 0 ? "border-amber-300 bg-amber-50" : "border-slate-200"}
                        />
                    </div>
                )}

                {/* Alertas de Expiração / Vencimento Próximo */}
                {dadosAtivos && dadosAtivos.totalExpirados + dadosAtivos.totalVence7Dias > 0 && (
                    <div className={`rounded-2xl border-l-4 p-4 ${
                        dadosAtivos.totalExpirados > 0
                            ? "border-l-red-500 bg-red-50 border border-red-100"
                            : "border-l-orange-500 bg-orange-50 border border-orange-100"
                    }`}>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">
                                {dadosAtivos.totalExpirados > 0 ? "🚨" : "⚠️"}
                            </span>
                            <div>
                                <p className={`font-bold text-sm ${
                                    dadosAtivos.totalExpirados > 0 ? "text-red-800" : "text-orange-800"
                                }`}>
                                    {dadosAtivos.totalExpirados > 0
                                        ? `${dadosAtivos.totalExpirados} cadastro(s) com seguro EXPIRADO — notifique a transportadora imediatamente!`
                                        : `${dadosAtivos.totalVence7Dias} cadastro(s) com seguro vencendo em até 7 dias — agende a renovação com a transportadora.`
                                    }
                                </p>
                                <p className={`text-xs mt-0.5 ${
                                    dadosAtivos.totalExpirados > 0 ? "text-red-600" : "text-orange-600"
                                }`}>
                                    Use os filtros abaixo para visualizar e contatar as transportadoras responsáveis.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Abas + Filtros */}
                <div className="space-y-4">
                    {/* Abas */}
                    <div className="flex gap-2 border-b border-slate-200 pb-0">
                        <button
                            onClick={() => { setAba("motoristas"); setFiltro("todos"); setBusca(""); }}
                            className={`px-5 py-2.5 rounded-t-xl text-sm font-bold transition-colors border-b-2 -mb-px ${
                                aba === "motoristas"
                                    ? "border-blue-600 text-blue-700 bg-blue-50"
                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                            👤 Motoristas
                            {dadosMotoristas && (
                                <span className="ml-2 text-xs bg-blue-600 text-white rounded-full px-1.5 py-0.5">
                                    {dadosMotoristas.totalERP}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => { setAba("veiculos"); setFiltro("todos"); setBusca(""); }}
                            className={`px-5 py-2.5 rounded-t-xl text-sm font-bold transition-colors border-b-2 -mb-px ${
                                aba === "veiculos"
                                    ? "border-blue-600 text-blue-700 bg-blue-50"
                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                            🚛 Veículos
                            {dadosVeiculos && (
                                <span className="ml-2 text-xs bg-blue-600 text-white rounded-full px-1.5 py-0.5">
                                    {dadosVeiculos.totalERP}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Barra de filtros + busca */}
                    <div className="flex flex-wrap items-center gap-2">
                        {filtrosBotoes.map((fb) => (
                            <button
                                key={fb.key}
                                onClick={() => setFiltro(fb.key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${fb.cor} ${
                                    filtro === fb.key
                                        ? "ring-2 ring-offset-1 ring-blue-400 shadow-sm"
                                        : ""
                                }`}
                            >
                                {fb.label}
                            </button>
                        ))}
                        <div className="ml-auto flex-1 min-w-[240px] max-w-sm">
                            <input
                                type="text"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder={aba === "motoristas" ? "Buscar por motorista, transportadora ou CPF..." : "Buscar por placa, transportadora ou proprietário..."}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                            />
                        </div>
                    </div>

                    {/* Tabela de Dados */}
                    {loading ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                            <div className="text-slate-400 text-sm animate-pulse">Cruzando dados entre o ERP e a base Angel...</div>
                        </div>
                    ) : aba === "motoristas" ? (
                        <TabelaMotoristas dados={dadosMotoristas} filtro={filtro} busca={busca} />
                    ) : (
                        <TabelaVeiculos dados={dadosVeiculos} filtro={filtro} busca={busca} />
                    )}
                </div>
            </div>
        </div>
    );
}
