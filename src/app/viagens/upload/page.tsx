"use client";

import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import Link from "next/link";
import { api } from "@/trpc/react";

type UploadStatus = "idle" | "reading" | "uploading" | "success" | "warning" | "error";

interface ProgressState {
    loteAtual: number;
    totalLotes: number;
    processados: number;
    total: number;
    percent: number;
}

interface LogEntry {
    id: string;
    timestamp: string;
    type: "info" | "success" | "warning" | "error";
    message: string;
}

export default function UploadViagensPage() {
    const [status, setStatus] = useState<UploadStatus>("idle");
    const [statusMessage, setStatusMessage] = useState("");
    const [statusDetails, setStatusDetails] = useState<string | null>(null);
    const [progress, setProgress] = useState<ProgressState | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [copiado, setCopiado] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const logContainerRef = useRef<HTMLDivElement>(null);

    const uploadMutation = api.viagem.uploadPlanilha.useMutation();

    const addLog = (type: LogEntry["type"], message: string) => {
        const now = new Date();
        const timestamp = now.toTimeString().split(" ")[0] ?? now.toLocaleTimeString();
        const entry: LogEntry = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            timestamp,
            type,
            message,
        };
        setLogs((prev) => [...prev, entry]);
    };

    // Auto-scroll nos logs
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const copiarLogs = () => {
        const texto = logs.map((l) => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.message}`).join("\n");
        navigator.clipboard.writeText(texto).then(() => {
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        });
    };

    const parseExcelDate = (dateVal?: unknown): string | null => {
        if (!dateVal || dateVal === "null" || dateVal === "undefined") return null;

        if (dateVal instanceof Date) {
            return isNaN(dateVal.getTime()) ? null : dateVal.toISOString();
        }

        if (typeof dateVal === "number") {
            try {
                const utcDays = dateVal - 25569;
                const utcValue = utcDays * 86400;
                const d = new Date(utcValue * 1000);
                return isNaN(d.getTime()) ? null : d.toISOString();
            } catch {
                return null;
            }
        }

        const dateStr = String(dateVal || "").trim();
        if (!dateStr) return null;

        if (dateStr.includes("/")) {
            try {
                const [datePart, timePart] = dateStr.split(" ");
                const [day, month, year] = (datePart || "").split("/");
                const [hour, minute, second] = (timePart || "00:00:00").split(":");
                const d = new Date(
                    Number(year),
                    Number(month) - 1,
                    Number(day),
                    Number(hour),
                    Number(minute),
                    Number(second)
                );
                return isNaN(d.getTime()) ? null : d.toISOString();
            } catch {
                return null;
            }
        }

        try {
            const d = new Date(dateStr);
            return isNaN(d.getTime()) ? null : d.toISOString();
        } catch {
            return null;
        }
    };

    const mapStatus = (statusVal?: unknown): "PROGRAMADA" | "EM_ANDAMENTO" | "FINALIZADA" | "CANCELADA" => {
        const s = String(statusVal || "").toUpperCase();
        if (s.includes("FINALIZADA")) return "FINALIZADA";
        if (s.includes("INICIADA") || s.includes("ANDAMENTO")) return "EM_ANDAMENTO";
        if (s.includes("CANCELADA")) return "CANCELADA";
        return "PROGRAMADA";
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setStatus("reading");
        setStatusMessage("Lendo e analisando a planilha Excel...");
        setStatusDetails(null);
        setProgress(null);
        setLogs([]);

        addLog("info", `Arquivo selecionado: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`);

        const reader = new FileReader();

        reader.onerror = () => {
            const erroMsg = "Falha ao ler o arquivo no navegador (arquivo corrompido ou bloqueado por outro aplicativo).";
            setStatus("error");
            setStatusMessage("Erro ao ler o arquivo selecionado.");
            setStatusDetails(erroMsg);
            addLog("error", erroMsg);
            if (fileInputRef.current) fileInputRef.current.value = "";
        };

        reader.onload = async (event) => {
            try {
                addLog("info", "Decodificando conteúdo binário da planilha...");
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheetName = workbook.SheetNames[0];

                if (!firstSheetName) {
                    throw new Error("A planilha não possui folhas (abas) válidas.");
                }

                addLog("info", `Aba selecionada: "${firstSheetName}"`);
                const worksheet = workbook.Sheets[firstSheetName];
                if (!worksheet) {
                    throw new Error("A folha selecionada não foi encontrada ou está vazia.");
                }

                const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: "" });

                if (jsonData.length === 0) {
                    throw new Error("A planilha não contém linhas de dados para processar.");
                }

                addLog("info", `Total bruto de linhas encontradas no Excel: ${jsonData.length}`);

                // Mapear linhas para o formato esperado
                const formattedData = jsonData.map((row) => {
                    const prevInicio = parseExcelDate(row["Prev. Início"]);
                    const prevFim = parseExcelDate(row["Prev. Fim"]);

                    return {
                        numeroViagem: String(row["Nº Viagem"] || "").trim(),
                        motorista: String(row["Motorista/Usuário MOBILE"] || "").trim(),
                        placa: String(row["Placa Programação"] || "").trim(),
                        placaMob: String(row["Placa/MOBILE"] || "").trim(),
                        reboque: String(row["Reboque 1"] || "").trim(),
                        origem: String(row["Origem"] || "Desconhecida").trim(),
                        destino: String(row["Destino"] || "Desconhecida").trim(),
                        rotaDescricao: String(row["Rota"] || "").trim(),
                        prevInicio: prevInicio ?? new Date().toISOString(),
                        prevFim: prevFim ?? new Date().toISOString(),
                        status: mapStatus(row["Status Viagem"]),
                        dataInicioEfetivo: parseExcelDate(row["Data Início"]),
                        dataFimEfetivo: parseExcelDate(row["Data Fim"]),
                    };
                });

                // Validação de campos obrigatórios
                const totalBruto = formattedData.length;
                const dadosValidos = formattedData.filter((v) => {
                    const camposObrigatorios = [
                        v.numeroViagem,
                        v.motorista,
                        v.placaMob,
                        v.placa,
                        v.rotaDescricao,
                    ];
                    return camposObrigatorios.every((c) => Boolean(c && c.length > 0));
                });

                const totalIgnoradas = totalBruto - dadosValidos.length;
                addLog("info", `Validação concluída: ${dadosValidos.length} válidas, ${totalIgnoradas} ignoradas por campos em branco.`);

                if (dadosValidos.length === 0) {
                    setStatus("warning");
                    setStatusMessage("Nenhuma viagem válida encontrada na planilha.");
                    setStatusDetails(
                        `Todas as ${totalBruto} linha(s) foram ignoradas por falta de campos obrigatórios (Nº Viagem, Motorista, Placa/MOBILE, Placa Programação ou Rota).`
                    );
                    addLog("warning", "Operação encerrada: nenhuma viagem possui os campos obrigatórios preenchidos.");
                    return;
                }

                // Divisão em lotes (chunks) de 25 para processamento ágil e seguro
                const CHUNK_SIZE = 25;
                const lotes: (typeof dadosValidos)[] = [];
                for (let i = 0; i < dadosValidos.length; i += CHUNK_SIZE) {
                    lotes.push(dadosValidos.slice(i, i + CHUNK_SIZE));
                }

                addLog("info", `Dividindo em ${lotes.length} lote(s) de até ${CHUNK_SIZE} viagens para envio seguro.`);
                setStatus("uploading");

                let criadasAcumulado = 0;
                let atualizadasAcumulado = 0;

                // Processar cada lote com Timeout de 60 segundos
                for (let index = 0; index < lotes.length; index++) {
                    const lote = lotes[index]!;
                    const processadosAteAgora = Math.min((index + 1) * CHUNK_SIZE, dadosValidos.length);
                    const percent = Math.round(((index + 1) / lotes.length) * 100);

                    setProgress({
                        loteAtual: index + 1,
                        totalLotes: lotes.length,
                        processados: processadosAteAgora,
                        total: dadosValidos.length,
                        percent,
                    });

                    setStatusMessage(
                        `Sincronizando com o banco: lote ${index + 1} de ${lotes.length} (${processadosAteAgora} de ${dadosValidos.length} viagens)...`
                    );

                    const primeiraViagem = lote[0]?.numeroViagem ?? "";
                    const ultimaViagem = lote[lote.length - 1]?.numeroViagem ?? "";
                    addLog("info", `Enviando Lote ${index + 1}/${lotes.length} (${lote.length} viagens: #${primeiraViagem} a #${ultimaViagem})...`);

                    const TIMEOUT_MS = 60000;
                    const timeoutPromise = new Promise<never>((_, reject) => {
                        setTimeout(() => {
                            reject(new Error(`Timeout de ${TIMEOUT_MS / 1000}s excedido no Lote ${index + 1}. O servidor demorou para responder (possível lentidão ou lock no banco de dados).`));
                        }, TIMEOUT_MS);
                    });

                    const tLote0 = Date.now();
                    const resultado = await Promise.race([
                        uploadMutation.mutateAsync(lote),
                        timeoutPromise,
                    ]);
                    const duracaoLote = Date.now() - tLote0;

                    const criadas = resultado.criadas ?? 0;
                    const atualizadas = resultado.atualizadas ?? 0;
                    criadasAcumulado += criadas;
                    atualizadasAcumulado += atualizadas;

                    addLog(
                        "success",
                        `Lote ${index + 1}/${lotes.length} processado em ${duracaoLote}ms (${criadas} criadas, ${atualizadas} atualizadas).`
                    );
                }

                // Conclusão com sucesso
                setStatus("success");
                setStatusMessage("Importação concluída com sucesso!");
                const detalhesIgnoradas = totalIgnoradas > 0
                    ? ` (${totalIgnoradas} linha(s) ignoradas por conterem campos em branco).`
                    : ".";
                const msgFinal = `Total de ${dadosValidos.length} viagem(ns) processada(s): ${criadasAcumulado} nova(s) criada(s) e ${atualizadasAcumulado} atualizada(s)${detalhesIgnoradas}`;
                setStatusDetails(msgFinal);
                addLog("success", `🎉 ${msgFinal}`);

            } catch (error) {
                console.error("Erro na importação de viagens:", error);
                const msg = error instanceof Error ? error.message : String(error);
                setStatus("error");
                setStatusMessage("Falha durante o processamento da planilha.");
                setStatusDetails(msg);
                addLog("error", `ERRO: ${msg}`);
            } finally {
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const isProcessing = status === "reading" || status === "uploading";

    return (
        <div className="max-w-4xl mx-auto p-8 mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="mb-6">
                <Link
                    href="/viagens"
                    className="text-sm font-semibold text-gray-500 hover:text-emerald-600 transition-colors inline-flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Voltar à Lista de Viagens
                </Link>
            </div>

            <div className="border-b border-gray-100 pb-5 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Integração de Viagens</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Importe o relatório de programação diária (.xlsx, .xls ou .csv) para atualizar a grade de viagens e matriz de rotas.
                </p>
            </div>

            {/* Caixa de Upload */}
            <div className={`p-8 border-2 border-dashed rounded-xl transition-all ${
                isProcessing
                    ? "border-blue-300 bg-blue-50/40 opacity-90 cursor-not-allowed"
                    : "border-gray-300 bg-gray-50/70 hover:border-emerald-500 hover:bg-emerald-50/20"
            }`}>
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 mb-3 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>

                    <p className="text-sm font-medium text-gray-700 mb-1">
                        {fileName ? `Arquivo: ${fileName}` : "Clique abaixo para selecionar o arquivo da planilha"}
                    </p>
                    <p className="text-xs text-gray-400 mb-4">Suporta formatos .xlsx, .xls e .csv</p>

                    <label className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all shadow-sm ${
                        isProcessing
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-emerald-600 hover:bg-emerald-700 cursor-pointer active:scale-95"
                    }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        {isProcessing ? "Processando..." : "Escolher Arquivo Excel"}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            onChange={handleFileUpload}
                            disabled={isProcessing}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            {/* Estado de Processamento e Progresso */}
            {isProcessing && (
                <div className="mt-6 p-5 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="flex items-center gap-3">
                        <svg className="animate-spin h-5 w-5 text-blue-600 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-blue-900">{statusMessage}</p>
                            {progress && (
                                <p className="text-xs text-blue-700 mt-0.5">
                                    Lote {progress.loteAtual} de {progress.totalLotes} ({progress.processados} de {progress.total} viagens)
                                </p>
                            )}
                        </div>
                        {progress && (
                            <span className="text-sm font-bold text-blue-700">{progress.percent}%</span>
                        )}
                    </div>

                    {progress && (
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-3 overflow-hidden">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress.percent}%` }}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Mensagem de Sucesso */}
            {status === "success" && (
                <div className="mt-6 p-5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-emerald-900">{statusMessage}</h3>
                            {statusDetails && (
                                <p className="text-sm text-emerald-700 mt-1">{statusDetails}</p>
                            )}
                            <div className="mt-4 flex items-center gap-3">
                                <Link
                                    href="/viagens"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
                                >
                                    Ver Viagens Atualizadas
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mensagem de Aviso */}
            {status === "warning" && (
                <div className="mt-6 p-5 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-amber-900">{statusMessage}</h3>
                            {statusDetails && (
                                <p className="text-sm text-amber-800 mt-1">{statusDetails}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Mensagem de Erro com Detalhes */}
            {status === "error" && (
                <div className="mt-6 p-5 rounded-xl bg-rose-50 border border-rose-200">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-rose-900">{statusMessage}</h3>
                            {statusDetails && (
                                <p className="text-xs text-rose-700 mt-2 font-mono bg-rose-100/60 p-3 rounded-lg border border-rose-200 break-all whitespace-pre-wrap">
                                    {statusDetails}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Painel de Logs ao Vivo e Diagnóstico */}
            {logs.length > 0 && (
                <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden bg-gray-900 shadow-inner">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800/80 border-b border-gray-700 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="font-semibold text-gray-200 font-mono">Console de Diagnóstico & Logs de Importação</span>
                            <span className="text-gray-400">({logs.length} eventos)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={copiarLogs}
                                className="px-2.5 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-mono transition-colors"
                            >
                                {copiado ? "✓ Copiado!" : "Copiar Logs"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setLogs([])}
                                className="px-2.5 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-200 text-xs font-mono transition-colors"
                            >
                                Limpar
                            </button>
                        </div>
                    </div>

                    <div
                        ref={logContainerRef}
                        className="p-4 max-h-56 overflow-y-auto font-mono text-xs space-y-1.5 scrollbar-thin scrollbar-thumb-gray-700"
                    >
                        {logs.map((log) => {
                            let corTexto = "text-gray-300";
                            let prefixo = "INFO";
                            if (log.type === "success") {
                                corTexto = "text-emerald-400";
                                prefixo = "OK  ";
                            } else if (log.type === "warning") {
                                corTexto = "text-amber-400";
                                prefixo = "AVISO";
                            } else if (log.type === "error") {
                                corTexto = "text-rose-400 font-semibold";
                                prefixo = "ERRO ";
                            }

                            return (
                                <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
                                    <span className="text-gray-500 shrink-0 select-none">[{log.timestamp}]</span>
                                    <span className={`shrink-0 font-bold ${
                                        log.type === "success"
                                            ? "text-emerald-400"
                                            : log.type === "error"
                                            ? "text-rose-400"
                                            : log.type === "warning"
                                            ? "text-amber-400"
                                            : "text-blue-400"
                                    }`}>
                                        [{prefixo}]
                                    </span>
                                    <span className={`${corTexto} break-all`}>{log.message}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}