/**
 * Cliente de sincronização de presença e revogação de sessão
 * com a Torre de Monitoria dos Sistemas Princesa.
 */

const MONITOR_URL = process.env.MONITOR_URL || "http://localhost:3100";
const SYSTEM_SLUG = "transferencia";

export async function syncUserSession({
  sessionId,
  userRef,
  userName,
  userRole,
  ip,
}: {
  sessionId: string;
  userRef: string;
  userName: string;
  userRole?: string;
  ip?: string;
}): Promise<{ ok: boolean; revoked: boolean }> {
  if (!sessionId) return { ok: false, revoked: false };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1200);

  try {
    const res = await fetch(`${MONITOR_URL}/api/ingest/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-system-slug": SYSTEM_SLUG,
      },
      body: JSON.stringify({
        action: "sync",
        sessionId,
        userRef,
        userName,
        userRole,
        ip,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return { ok: false, revoked: false };
    }

    const data = await res.json();
    return { ok: true, revoked: Boolean(data.revoked) };
  } catch {
    // Falha silenciosa: a monitoria nunca derruba a navegação do sistema
    return { ok: false, revoked: false };
  } finally {
    clearTimeout(timer);
  }
}
