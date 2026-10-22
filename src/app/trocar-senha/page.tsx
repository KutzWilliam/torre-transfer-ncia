"use client";

import { Suspense } from "react";
import { TrocarSenhaModal } from "@/components/TrocarSenhaModal";

export default function TrocarSenhaPage() {
  return (
    <Suspense>
      <TrocarSenhaModal
        isModal={false}
        title="Transferência"
        subtitle="Crie sua nova senha para continuar o acesso"
      />
    </Suspense>
  );
}
