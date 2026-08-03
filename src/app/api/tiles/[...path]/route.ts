import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    const path = params.path;
    
    if (!path || path.length < 3) {
        return new NextResponse("Invalid tile path", { status: 400 });
    }

    const tilePath = path.join("/");
    // Usando CartoDB Positron (light) em vez do OpenStreetMap para evitar o bloqueio severo de IP do OSM
    const tileUrl = `https://a.basemaps.cartocdn.com/light_all/${tilePath}`;

    try {
        const response = await fetch(tileUrl, {
            headers: {
                "User-Agent": "TorreTransferencia/1.0 (Sistema Princesa)",
                "Referer": "http://localhost:3000",
            },
        });

        if (!response.ok) {
            return new NextResponse("Error fetching tile", { status: response.status });
        }

        const imageBuffer = await response.arrayBuffer();

        return new NextResponse(imageBuffer, {
            headers: {
                "Content-Type": response.headers.get("Content-Type") || "image/png",
                "Cache-Control": "public, max-age=604800, immutable",
            },
        });
    } catch (error) {
        return new NextResponse("Internal server error", { status: 500 });
    }
}
