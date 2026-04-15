"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import Link from "next/link";
import { api } from "@/trpc/react"; // Ajuste o caminho de importação se necessário no seu T3 App

export default function UploadViagensPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState("");

    // Chamada à nossa mutação tRPC criada anteriormente
    const uploadMutation = api.viagem.uploadPlanilha.useMutation({
        onSuccess: (data) => {
            setMessage(`✅ ${data.message}`);
            setIsUploading(false);
        },
        onError: (error) => {
            setMessage(`❌ Erro: ${error.message}`);
            setIsUploading(false);
        }
    });

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setMessage("A processar o ficheiro Excel...");

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheetName = workbook.SheetNames[0];

                if (!firstSheetName) {
                    throw new Error("A planilha não possui folhas válidas.");
                }

                const worksheet = workbook.Sheets[firstSheetName];

                if (!worksheet) {
                    throw new Error("A folha selecionada não foi encontrada ou está vazia.");
                }

                // Converter a folha para um array de objetos JSON
                const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

                // Mapear as colunas do seu relatório para o formato que o tRPC (Zod) espera
                const formattedData = jsonData.map((row) => {

                    // Função auxiliar para converter "18/03/2026 22:20:00" em ISO String
                    const parseDate = (dateVal?: unknown): string | null => {
                        const dateStr = String(dateVal || "").trim();
                        if (!dateStr || dateStr === "null" || dateStr === "undefined") return null;
                        if (!dateStr.includes("/")) return null;
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
                    };

                    // Função para normalizar o status ("Iniciada" ou "Finalizada" para o nosso Enum)
                    const mapStatus = (statusVal?: unknown): "PROGRAMADA" | "EM_ANDAMENTO" | "FINALIZADA" | "CANCELADA" => {
                        const s = String(statusVal || "").toUpperCase();
                        if (s.includes("FINALIZADA")) return "FINALIZADA";
                        if (s.includes("INICIADA") || s.includes("ANDAMENTO")) return "EM_ANDAMENTO";
                        if (s.includes("CANCELADA")) return "CANCELADA";
                        return "PROGRAMADA";
                    };

                    const prevInicio = parseDate(row["Prev. Início"]);
                    const prevFim = parseDate(row["Prev. Fim"]);

                    return {
                        numeroViagem: String(row["Nº Viagem"] || ""),
                        motorista: String(row["Motorista/Usuário MOBILE"] || ""),
                        placa: String(row["Placa Programação"] || ""),
                        placaMob: String(row["Placa/MOBILE"] || ""),
                        reboque: String(row["Reboque 1"] || ""),
                        origem: String(row["Origem"] || "Desconhecida"),
                        destino: String(row["Destino"] || "Desconhecida"),
                        rotaDescricao: String(row["Rota"] || ""),
                        prevInicio: prevInicio ?? new Date().toISOString(),
                        prevFim: prevFim ?? new Date().toISOString(),
                        status: mapStatus(row["Status Viagem"]),
                        dataInicioEfetivo: parseDate(row["Data Início"]),
                        dataFimEfetivo: parseDate(row["Data Fim"]),
                    };
                });

                // ── BLINDAGEM: rejeitar linhas incompletas antes de enviar ao banco ──
                const totalBruto = formattedData.length;
                const dadosValidos = formattedData.filter((v) => {
                    const camposObrigatorios = [
                        { campo: v.numeroViagem, nome: "Nº Viagem" },
                        { campo: v.motorista, nome: "Motorista/Usuário MOBILE" },
                        { campo: v.placaMob,  nome: "Placa/MOBILE" },
                        { campo: v.placa,     nome: "Placa Programação" },
                        { campo: v.rotaDescricao, nome: "Rota" },
                    ];
                    const vazios = camposObrigatorios.filter(c => !c.campo.trim());
                    if (vazios.length > 0) {
                        console.warn(`Linha ignorada (viagem #${v.numeroViagem}): campos vazios → ${vazios.map(c => c.nome).join(", ")}`);
                        return false;
                    }
                    return true;
                });
                const totalIgnoradas = totalBruto - dadosValidos.length;

                if (dadosValidos.length === 0) {
                    setMessage(`⚠️ Nenhuma linha válida encontrada. ${totalIgnoradas} linha(s) foram ignoradas por campos obrigatórios vazios (Motorista, Placa/MOBILE, Placa Programação, Rota).`);
                    setIsUploading(false);
                    return;
                }

                // Enviar apenas os dados válidos para o backend
                await uploadMutation.mutateAsync(dadosValidos);

                const avisoIgnoradas = totalIgnoradas > 0
                    ? ` ⚠️ ${totalIgnoradas} linha(s) ignoradas por dados incompletos.`
                    : "";
                setMessage(`✅ ${dadosValidos.length} viagem(ns) importada(s) com sucesso!${avisoIgnoradas}`);

            } catch (error) {
                console.error(error);
                const msg = error instanceof Error ? error.message : String(error);
                setMessage(`❌ Erro ao processar: ${msg}`);
                setIsUploading(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="max-w-4xl mx-auto p-8 mt-10 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="mb-6">
                <Link href="/viagens" className="text-sm font-semibold text-gray-400 hover:text-princesa-green transition-colors flex items-center gap-2 w-fit">
                    ← Voltar à Lista de Viagens
                </Link>
            </div>
            <h1 className="text-2xl font-bold mb-6 text-princesa-dark">Integração de Viagens</h1>
            <p className="text-gray-600 mb-4">
                Selecione o relatório de programação diária (.xlsx) para atualizar a base de dados.
            </p>

            <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex justify-center items-center">
                <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer disabled:opacity-50"
                />
            </div>

            {isUploading && (
                <div className="flex items-center text-blue-600 font-medium">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    A processar e a sincronizar com a base de dados...
                </div>
            )}

            {message && (
                <div className={`mt-4 p-4 rounded-md font-medium ${message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {message}
                </div>
            )}
        </div>
    );
}