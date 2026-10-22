import { NextResponse } from "next/server";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawLogin = (body.username || body.email || "").toString().trim();
    const password = (body.password || "").toString();

    if (!rawLogin || !password) {
      return NextResponse.json(
        { error: "Por favor, informe o usuário e a senha." },
        { status: 400 }
      );
    }

    const hasAt = rawLogin.includes("@");
    const user = await db.user.findFirst({
      where: hasAt
        ? { email: { equals: rawLogin, mode: "insensitive" } }
        : {
            OR: [
              { email: { equals: rawLogin, mode: "insensitive" } },
              { email: { startsWith: `${rawLogin}@`, mode: "insensitive" } },
            ],
          },
      select: {
        id: true,
        name: true,
        email: true,
        senhaHash: true,
        role: true,
        baseId: true,
        precisaTrocarSenha: true,
      },
    });

    if (!user || !user.senhaHash) {
      return NextResponse.json(
        { error: "Usuário ou senha inválidos." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.senhaHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Usuário ou senha inválidos." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        baseId: user.baseId,
        precisaTrocarSenha: user.precisaTrocarSenha,
      },
    });
  } catch (error: any) {
    console.error("[API_AUTH_LOGIN_ERROR]", error);
    return NextResponse.json(
      { error: "Erro interno ao processar login." },
      { status: 500 }
    );
  }
}
