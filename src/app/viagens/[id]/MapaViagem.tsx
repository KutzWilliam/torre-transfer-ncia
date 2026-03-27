"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const truckIcon = L.divIcon({
    html: `
        <div style="
            background: white;
            border: 3px solid #16a34a;
            border-radius: 50%;
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 0 0 4px rgba(22,163,74,0.25), 0 2px 8px rgba(0,0,0,0.3);
        ">🚛</div>
    `,
    className: "",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
});

export default function MapaViagem({ paradas, telemetrias }: any) {
    useEffect(() => {
        L.Marker.prototype.options.icon = customIcon;
    }, []);

    const rotaCaminhao = telemetrias.map((t: any) => [t.latitude, t.longitude]);
    const posicaoAtual = rotaCaminhao.length > 0 ? rotaCaminhao[rotaCaminhao.length - 1] : null;

    // Encontra o centro (primeira parada com coordenadas)
    const primeiraComGeo = paradas.find((p: any) => p.latitude && p.longitude);
    const center = primeiraComGeo ? [primeiraComGeo.latitude, primeiraComGeo.longitude] : [-25.0945, -50.1633];

    return (
        <div style={{ height: "450px", width: "100%", borderRadius: "0.5rem", overflow: "hidden", zIndex: 0 }}>
            <MapContainer center={center as any} zoom={7} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                />

                {/* Plotar TODAS as paradas intermediárias que tenham Latitude/Longitude */}
                {paradas.map((parada: any, index: number) => {
                    if (!parada.latitude || !parada.longitude) return null;
                    return (
                        <Marker key={index} position={[parada.latitude, parada.longitude]}>
                            <Popup>
                                <strong>{index === 0 ? "Origem: " : index === paradas.length - 1 ? "Destino: " : "Parada: "}</strong>
                                {parada.nome}
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Marcador do Caminhão com ícone customizado */}
                {posicaoAtual && (
                    <Marker position={posicaoAtual as any} icon={truckIcon}>
                        <Popup>🚛 Posição Atual do Veículo</Popup>
                    </Marker>
                )}

                {/* Linha do Trajeto percorrido */}
                {rotaCaminhao.length > 0 && (
                    <Polyline positions={rotaCaminhao} color="#2563eb" weight={5} opacity={0.8} />
                )}
            </MapContainer>
        </div>
    );
}