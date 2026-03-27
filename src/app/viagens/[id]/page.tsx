"use client";

import { use, useMemo, useEffect } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { calcularDistanciaGeocerca } from "@/server/utils/geolocalizacao";

const MapaViagem = dynamic(() => import("./MapaViagem"), {
    ssr: false,
    loading: () => <div className="h-[450px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">A carregar mapa e rota...</div>
});

export default function ViagemDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    
    // Atualiza a viagem inteira e as coordenadas a cada 30 segundos
    const { data: viagem, isLoading } = api.viagem.obterPorId.useQuery(id, {
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
    });

    // Auto-sync invisível em background para garantir que a Sascar envie os novos pontos GPS
    useEffect(() => {
        const syncSascar = async () => {
            try { await fetch('/api/sync'); } catch (err) { console.error("Falha no sync do detalhe", err); }
        };
        const interval = setInterval(syncSascar, 60000); // Tira pontos da Sascar a cada 1min
        return () => clearInterval(interval);
    }, []);

    // Analisa a telemetria e calcula as chegadas e saídas de TODAS as paradas
    const { timeline, ultimaPosicao } = useMemo(() => {
        if (!viagem) return { timeline: [], ultimaPosicao: null };

        const telemetrias = viagem.telemetrias;
        const ultimaPos = telemetrias.length > 0 ? telemetrias[telemetrias.length - 1] : null;
        const paradas = viagem.paradasRota;

        // --- CÁLCULO REAL-TIME (geofence sequencial e cronológico e à prova de jitter) ---
        // Percorre o GPS em ordem cronológica. Começamos da Parada 1 (pulamos a origem 0)
        // porque caminhões frequentemente partem de garagens fora do raio de 5km. A origem já usa `viagem.dataInicioEfetivo`.
        const resultadosRT: { horaChegada: Date | null; horaSaida: Date | null }[] =
            paradas.map(() => ({ horaChegada: null, horaSaida: null }));

        let paradaIdx = 0;
        if (paradas.length > 0 && telemetrias.length > 0) {
            const origem = paradas[0]!;
            const primeiraTel = telemetrias[0]!;
            if (origem.latitude && origem.longitude) {
                const distOrigem = calcularDistanciaGeocerca(primeiraTel.latitude, primeiraTel.longitude, origem.latitude, origem.longitude);
                if (distOrigem > (origem.raioMetros ?? 5000)) {
                    // Começou bem longe da origem (ex: garagem fora da cidade), então pula a origem e confia no dataInicioEfetivo
                    paradaIdx = paradas.length > 1 ? 1 : 0;
                }
            }
        }

        let primeiraEntrada: Date | null = null;
        let ultimaDentro: Date | null = null;

        for (const t of telemetrias) {
            if (paradaIdx >= paradas.length) break;
            const paradaAtual = paradas[paradaIdx]!;
            if (!paradaAtual.latitude || !paradaAtual.longitude) { paradaIdx++; continue; }

            const raioAtual = paradaAtual.raioMetros ?? 5000;
            const distAtual = calcularDistanciaGeocerca(t.latitude, t.longitude, paradaAtual.latitude, paradaAtual.longitude);

            if (distAtual <= raioAtual) {
                // Chegou ou continua na parada atual
                if (!primeiraEntrada) primeiraEntrada = new Date(t.dataHoraLocal);
                ultimaDentro = new Date(t.dataHoraLocal);
            } else if (primeiraEntrada) {
                // Saiu da parada atual. Mas NÃO avançamos imediatamente (previne GPS jitter na borda dos 5km).
                // Só avançamos para a próxima se o caminhão de fato entrou na PRÓXIMA parada.
                if (paradaIdx + 1 < paradas.length) {
                    const proxParada = paradas[paradaIdx + 1]!;
                    if (proxParada.latitude && proxParada.longitude) {
                        const proxRaio = proxParada.raioMetros ?? 5000;
                        const distProx = calcularDistanciaGeocerca(t.latitude, t.longitude, proxParada.latitude, proxParada.longitude);
                        
                        if (distProx <= proxRaio) {
                            // Entrou na próxima cidade! Então podemos fechar com segurança a parada atual.
                            resultadosRT[paradaIdx] = {
                                horaChegada: paradaIdx === 0 ? null : primeiraEntrada,
                                horaSaida: paradaIdx === paradas.length - 1 ? null : ultimaDentro,
                            };
                            paradaIdx++;
                            primeiraEntrada = new Date(t.dataHoraLocal);
                            ultimaDentro = new Date(t.dataHoraLocal);
                        }
                    }
                }
            }
        }
        // Se terminou com uma parada em andamento, fechar com o último ponto dentro dela
        if (primeiraEntrada && paradaIdx < paradas.length) {
            resultadosRT[paradaIdx] = {
                horaChegada: paradaIdx === 0 ? null : primeiraEntrada,
                horaSaida: paradaIdx === paradas.length - 1 ? null : ultimaDentro,
            };
        }

        // --- MONTAR TIMELINE com prioridade: persistido > real-time > null ---
        const timelineCalculada = paradas.map((parada: any, index: number) => {
            const rt = resultadosRT[index] ?? { horaChegada: null, horaSaida: null };

            // 1. Dados persistidos pelo backend (geofence server-side) — verdade definitiva
            let horaChegada: Date | null = parada.dataChegadaEfetiva ? new Date(parada.dataChegadaEfetiva) : rt.horaChegada;
            let horaSaida: Date | null = parada.dataSaidaEfetiva ? new Date(parada.dataSaidaEfetiva) : rt.horaSaida;

            // 2. Dados definitivos do servidor (início/fim da viagem)
            if (index === 0 && viagem.dataInicioEfetivo) horaSaida = new Date(viagem.dataInicioEfetivo);
            if (index === paradas.length - 1 && viagem.dataFimEfetivo) horaChegada = new Date(viagem.dataFimEfetivo);

            return { ...parada, horaChegada, horaSaida, isOrigem: index === 0, isDestino: index === paradas.length - 1 };
        });

        return { timeline: timelineCalculada, ultimaPosicao: ultimaPos };
    }, [viagem]);

    if (isLoading) return <div className="p-8 text-center text-gray-500">A carregar torre de controlo...</div>;
    if (!viagem) return <div className="p-8 text-center text-red-500">Viagem não encontrada.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex justify-between items-center">
                    <Link href="/viagens" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                        &larr; Voltar ao Painel
                    </Link>
                    <div className="text-sm bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-gray-600">
                        Sinal GPS: <span className={`font-semibold ${ultimaPosicao ? 'text-green-600' : 'text-red-500'}`}>
                            {ultimaPosicao ? ultimaPosicao.dataHoraLocal.toLocaleString("pt-BR") : "Sem comunicação"}
                        </span>
                    </div>
                </div>

                {/* Mapa Panorâmico */}
                <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <MapaViagem paradas={viagem.paradasRota} telemetrias={viagem.telemetrias} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Card Resumo */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1 h-fit">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Viagem #{viagem.id}</h2>
                        <p className="text-gray-500 mb-6 text-sm font-medium">{viagem.rotaDescricao}</p>

                        <div className="space-y-5">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Motorista</p>
                                <p className="font-medium text-gray-900">{viagem.motorista}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Veículo</p>
                                <p className="font-medium text-gray-900">{viagem.veiculo.placa}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Completa Dinâmica */}
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-900 mb-8">Evolução da Rota</h2>

                        <div className="relative border-l-2 border-gray-200 ml-4 space-y-12">
                            {timeline.map((parada: any, index: number) => {

                                // Define a cor do marcador baseado se ele já passou por lá
                                const jaPassou = parada.horaChegada || parada.horaSaida;
                                const markerColor = jaPassou ? 'bg-blue-600 border-white' : 'bg-gray-200 border-white';

                                return (
                                    <div key={index} className="relative pl-8">
                                        {/* Bolinha da Timeline */}
                                        <div className={`absolute -left-[11px] top-1.5 h-5 w-5 rounded-full border-4 ${markerColor}`}></div>

                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                {parada.isOrigem ? "Origem:" : parada.isDestino ? "Destino:" : "Parada:"} {parada.nome}
                                                {!parada.latitude && (
                                                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-normal">Sem coordenadas</span>
                                                )}
                                            </h3>

                                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">

                                                {!parada.isOrigem && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Chegada</p>
                                                        {parada.prevChegada && (
                                                            <p className="text-sm text-gray-500 mb-1">Previsto: {parada.prevChegada.toLocaleString("pt-BR")}</p>
                                                        )}
                                                        <p className={`font-semibold ${parada.horaChegada ? "text-blue-700" : "text-gray-400"}`}>
                                                            Real: {parada.horaChegada ? parada.horaChegada.toLocaleString("pt-BR") : "Aguardando..."}
                                                        </p>
                                                    </div>
                                                )}

                                                {!parada.isDestino && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Saída</p>
                                                        {parada.prevSaida && (
                                                            <p className="text-sm text-gray-500 mb-1">Previsto: {parada.prevSaida.toLocaleString("pt-BR")}</p>
                                                        )}
                                                        <p className={`font-semibold ${parada.horaSaida ? "text-blue-700" : "text-gray-400"}`}>
                                                            Real: {parada.horaSaida ? parada.horaSaida.toLocaleString("pt-BR") : "Aguardando..."}
                                                        </p>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}