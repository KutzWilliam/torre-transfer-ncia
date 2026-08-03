import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params;
    
    if (!path || path.length < 3) {
        return new NextResponse("Invalid tile path", { status: 400 });
    }

    const tilePath = path.join("/");
    const tileUrl = `https://tile.openstreetmap.org/${tilePath}`;

    try {
        const response = await fetch(tileUrl, {
            headers: {
                "User-Agent": "TorreTransferenciaApp/1.0 (Sistema Princesa)",
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
