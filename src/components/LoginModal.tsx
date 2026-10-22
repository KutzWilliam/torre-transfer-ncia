"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { signIn } from "next-auth/react";
import styles from "./LoginModal.module.css";

interface LoginModalProps {
  isOpen?: boolean;
  isModal?: boolean; // false para renderizar como página inteira (estilo bipagem)
  onClose?: () => void;
  onSuccess?: (userData?: any) => void;
  title?: string;
  subtitle?: string;
  redirectUrl?: string;
}

export function LoginModal({
  isOpen = true,
  isModal = false,
  onClose,
  onSuccess,
  title = "Transferência",
  subtitle = "Monitoramento em tempo real de viagens e frotas",
  redirectUrl = "/dashboard",
}: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      setError("Por favor, informe o usuário e a senha.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Autenticação integrada NextAuth para criar os cookies de sessão seguros
      const result = await signIn("credentials", {
        email: username.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Usuário ou senha inválidos.");
      }

      // Sincronização com o endpoint de autenticação
      let userData: any = { username: username.trim() };
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.user) userData = data.user;
        }
      } catch {
        // Fallback silencioso mantendo o resultado do signIn
      }

      if (onSuccess) {
        onSuccess(userData);
      }

      const safeDestination = redirectUrl.startsWith("/") ? redirectUrl : "/dashboard";
      if (redirectUrl) {
        window.location.href = safeDestination;
      } else if (onClose) {
        onClose();
      } else {
        window.location.href = safeDestination;
      }
    } catch (err: any) {
      setError(err.message || "Erro ao efetuar login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const cardContent = (
    <div className={styles.loginCard} onClick={(e) => isModal && e.stopPropagation()}>
      {/* Barra superior de destaque */}
      <div className={styles.topAccentBar} />

      {/* Botão de Fechar (apenas em modo modal com onClose) */}
      {isModal && onClose && (
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={20} />
        </button>
      )}

      {/* Cabeçalho com Logo */}
      <div className={styles.brandHeader}>
        <Image
          src="/logo.png"
          alt="Princesa dos Campos"
          width={80}
          height={80}
          className={styles.logoImage}
          priority
        />
        <h2 className={styles.systemTitle}>{title}</h2>
        <p className={styles.systemSubtitle}>{subtitle}</p>
      </div>

      {/* Alerta de Erro */}
      {error && (
        <div className={styles.alertError}>
          <AlertCircle size={18} className={styles.alertIcon} />
          <span>{error}</span>
        </div>
      )}

      {/* Formulário de Login */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Campo Usuário */}
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="modal-username">
            Usuário ou E-mail
          </label>
          <div className={styles.inputWrapper}>
            <UserIcon size={18} className={styles.inputIcon} />
            <input
              id="modal-username"
              type="text"
              autoComplete="username"
              className={styles.input}
              placeholder="Digite seu usuário ou e-mail"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>
        </div>

        {/* Campo Senha */}
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="modal-password">
            Senha de Acesso
          </label>
          <div className={styles.inputWrapper}>
            <Lock size={18} className={styles.inputIcon} />
            <input
              id="modal-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className={styles.togglePassBtn}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar senha" : "Ver senha"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Botão de Envio */}
        <button type="submit" className={styles.btnSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={18} className={styles.spinner} />
              <span>Autenticando...</span>
            </>
          ) : (
            <>
              <span>Acessar o Sistema</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className={styles.footerHint}>
        Novo usuário? A senha padrão inicial é <strong>Princesa123</strong>.
        <br />
        Você será solicitado a alterá-la no primeiro acesso.
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        {cardContent}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {cardContent}
    </div>
  );
}

export default LoginModal;
