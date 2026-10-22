"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  X,
  LogOut,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { api } from "@/trpc/react";
import styles from "./LoginModal.module.css";

export interface TrocarSenhaModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  isModal?: boolean;
  title?: string;
  subtitle?: string;
}

export function TrocarSenhaModal({
  isOpen = true,
  onClose,
  onSuccess,
  isModal = false,
  title = "Transferência",
  subtitle = "Crie sua nova senha para continuar o acesso",
}: TrocarSenhaModalProps) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const trocar = api.conta.trocarSenha.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setError(null);
      setTimeout(async () => {
        if (onSuccess) {
          onSuccess();
        } else {
          await signOut({ redirect: false });
          window.location.href = "/login";
        }
      }, 1600);
    },
    onError: (err) => {
      setError(err.message || "Erro ao alterar senha.");
    },
  });

  if (!isOpen && isModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!senhaAtual) {
      setError("Informe sua senha atual.");
      return;
    }
    if (novaSenha.length < 8) {
      setError("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }
    if (novaSenha.toLowerCase() === "princesa123") {
      setError("A nova senha não pode ser a senha padrão inicial.");
      return;
    }
    if (novaSenha !== confirmar) {
      setError("A confirmação não confere com a nova senha digitada.");
      return;
    }

    trocar.mutate({ senhaAtual, novaSenha });
  };

  const sairParaLogin = async () => {
    await signOut({ redirect: false });
    window.location.href = "/login";
  };

  const cardContent = (
    <div
      className={styles.loginCard}
      onClick={(e) => isModal && e.stopPropagation()}
    >
      <div className={styles.topAccentBar} />

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

      {/* Cabeçalho com Logo idêntico ao Login */}
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

      {error && (
        <div className={styles.alertError}>
          <AlertCircle size={18} className={styles.alertIcon} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className={styles.alertSuccess}>
          <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
          <span>Senha alterada com sucesso! Redirecionando para o login...</span>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.firstAccessBanner}>
            <div className={styles.firstAccessTitle}>
              <ShieldCheck size={18} />
              <span>Primeiro Acesso Detectado</span>
            </div>
            <p className={styles.firstAccessText}>
              Por segurança, sua senha padrão precisa ser alterada por uma nova senha pessoal antes de continuar.
            </p>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="modal-senha-atual">
              Senha Atual (Inicial)
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="modal-senha-atual"
                type={showSenhaAtual ? "text" : "password"}
                autoComplete="current-password"
                className={styles.input}
                placeholder="Ex: Princesa123"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                disabled={trocar.isPending}
                autoFocus
                required
              />
              <button
                type="button"
                className={styles.togglePassBtn}
                onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                aria-label={showSenhaAtual ? "Ocultar senha" : "Ver senha"}
              >
                {showSenhaAtual ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="modal-nova-senha">
              Nova Senha
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="modal-nova-senha"
                type={showNovaSenha ? "text" : "password"}
                autoComplete="new-password"
                className={styles.input}
                placeholder="Mínimo 8 caracteres"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                disabled={trocar.isPending}
                required
                minLength={8}
              />
              <button
                type="button"
                className={styles.togglePassBtn}
                onClick={() => setShowNovaSenha(!showNovaSenha)}
                aria-label={showNovaSenha ? "Ocultar senha" : "Ver senha"}
              >
                {showNovaSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <span className={styles.helperText}>Mínimo de 8 caracteres.</span>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="modal-confirmar-senha">
              Confirmar Nova Senha
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="modal-confirmar-senha"
                type={showConfirmar ? "text" : "password"}
                autoComplete="new-password"
                className={styles.input}
                placeholder="Repita a nova senha"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                disabled={trocar.isPending}
                required
                minLength={8}
              />
              <button
                type="button"
                className={styles.togglePassBtn}
                onClick={() => setShowConfirmar(!showConfirmar)}
                aria-label={showConfirmar ? "Ocultar senha" : "Ver senha"}
              >
                {showConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.btnSubmit}
            disabled={trocar.isPending}
          >
            {trocar.isPending ? (
              <>
                <Loader2 size={18} className={styles.spinner} />
                <span>Atualizando...</span>
              </>
            ) : (
              <>
                <span>Atualizar Senha</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => void sairParaLogin()}
            className={styles.btnSecondary}
          >
            <LogOut size={16} />
            <span>Sair do Sistema</span>
          </button>
        </form>
      )}
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

export default TrocarSenhaModal;
