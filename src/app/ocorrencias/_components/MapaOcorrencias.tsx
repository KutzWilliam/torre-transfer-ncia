"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

// Ícone de alerta para caminhões com ocorrência
const alertTruckIcon = L.divIcon({
    html: `
        <div style="
            position: relative;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <div style="
                background: white;
                border: 3px solid #dc2626;
                border-radius: 50%;
                width: 38px;
                height: 38px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                box-shadow: 0 0 0 4px rgba(220,38,38,0.25), 0 2px 8px rgba(0,0,0,0.3);
                animation: pulseRed 1.5s ease-in-out infinite;
            ">🚛</div>
            <div style="
                position: absolute;
                top: -4px;
                right: -4px;
                width: 16px;
                height: 16px;
                background: #fbbf24;
                border: 2px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 9px;
                font-weight: bold;
                color: #78350f;
            ">!</div>
        </div>
        <style>
            @keyframes pulseRed {
                0%, 100% { box-shadow: 0 0 0 4px rgba(220,38,38,0.25), 0 2px 8px rgba(0,0,0,0.3); }
                50% { box-shadow: 0 0 0 8px rgba(220,38,38,0.1), 0 2px 8px rgba(0,0,0,0.3); }
            }
        </style>
    `,
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
});

export default function MapaOcorrencias({ ocorrencias }: { ocorrencias: any[] }) {
    useEffect(() => {
        L.Marker.prototype.options.icon = customIcon;
    }, []);

    // Centro padrão no Paraná
    const center: [number, number] = [-23.5, -51.0];

    // Usa posição atual do caminhão (última telemetria) se disponível, senão usa a localização da ocorrência
    const pontos = ocorrencias.map(oc => ({
        lat: oc.ultimaTelemetria?.latitude ?? oc.latOcorrencia,
        lng: oc.ultimaTelemetria?.longitude ?? oc.lngOcorrencia,
        placa: oc.viagem.veiculo.placa,
        motorista: oc.viagem.motorista,
        tipo: oc.tipoOcorrencia,
        descricao: oc.descricao,
        viagemId: oc.viagemId,
        id: oc.id,
        status: oc.status,
    })).filter(p => p.lat && p.lng);

    const primeiroComPos = pontos[0];
    const mapCenter: [number, number] = primeiroComPos ? [primeiroComPos.lat, primeiroComPos.lng] : center;

    return (
        <div style={{ height: "100%", width: "100%", borderRadius: "0 0 1rem 1rem", overflow: "hidden", zIndex: 0 }}>
            <MapContainer
                center={mapCenter}
                zoom={primeiroComPos ? 8 : 7}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                />
                {pontos.map((p, i) => (
                    <Marker key={i} position={[p.lat, p.lng]} icon={alertTruckIcon}>
                        <Popup>
                            <div style={{ minWidth: "180px" }}>
                                <p style={{ fontWeight: "bold", marginBottom: "4px" }}>🚛 {p.placa}</p>
                                <p style={{ fontSize: "12px", color: "#555", marginBottom: "4px" }}>{p.motorista}</p>
                                <p style={{ fontSize: "12px", fontWeight: "600", color: "#dc2626" }}>⚠️ {p.tipo}</p>
                                <p style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>{p.descricao}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
