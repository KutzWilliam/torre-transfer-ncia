"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LoginModal } from "@/components/LoginModal";

function LoginForm() {
  const searchParams = useSearchParams();

  // Sanitiza o callbackUrl: extrai APENAS o pathname, nunca um host externo/localhost
  const rawCallback =
    searchParams.get("callbackUrl") ??
    searchParams.get("redirect") ??
    "/dashboard";
  const safeCallback = rawCallback.startsWith("/") ? rawCallback : "/dashboard";

  return (
    <LoginModal
      isOpen={true}
      isModal={false}
      redirectUrl={safeCallback}
      title="Transferência"
      subtitle="Monitoramento em tempo real de viagens e frotas"
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
