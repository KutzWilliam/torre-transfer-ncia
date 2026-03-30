"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
            className="text-xs font-semibold text-gray-500 hover:text-red-400 transition-colors uppercase tracking-wider"
        >
            Sair
        </button>
    );
}

