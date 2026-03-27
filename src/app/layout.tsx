import "@/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Transferência - Princesa",
  description: "Monitoramento em tempo real de viagens e frotas",
  icons: [{ rel: "icon", url: "/cropped-icon.png" }],
};

import { auth } from "@/server/auth";
import Navbar from "./_components/Navbar";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased text-slate-800 bg-slate-50 min-h-screen">
        <TRPCReactProvider>
          <Navbar session={session} />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
