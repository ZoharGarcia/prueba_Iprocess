// src/app/pages/Verification.tsx

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/register.css"; // Reutiliza estilos (puedes crear uno específico si lo prefieres)

function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return typeof baseUrl === "string" ? baseUrl.replace(/\/$/, "") : "";
}

export function Verification() {
  const navigate = useNavigate();
  const location = useLocation();

  const prefilledEmail = (location.state?.email as string) || "";
  const initialMessage = (location.state?.message as string) || "";

  const [email] = useState(prefilledEmail);
  const [code, setCode] = useState("");
  const [uiSuccess, setUiSuccess] = useState<string | null>(initialMessage);
  const [uiError, setUiError] = useState<string | null>(null);

  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Auto-ocultar mensajes de éxito después de 6 segundos
  useEffect(() => {
    if (uiSuccess) {
      const timer = setTimeout(() => setUiSuccess(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [uiSuccess]);

  // Verificar código
  async function handleVerify() {
    if (code.trim().length !== 6 || !/^\d+$/.test(code)) {
      setUiError("Ingresa un código válido de 6 dígitos numéricos");
      return;
    }

    if (!email) {
      setUiError("No se encontró el correo electrónico. Regresa al login e intenta de nuevo.");
      return;
    }

    setVerifyLoading(true);
    setUiError(null);
    setUiSuccess(null);

    try {
      const res = await fetch(`${getApiBaseUrl()}/verify-email-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim(),
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        let errorMsg = data.message || "Código inválido o expirado";

        if (res.status === 404) {
          errorMsg = "No encontramos una cuenta con ese correo electrónico";
        } else if (res.status === 422) {
          errorMsg = data.message || "El código es incorrecto o ha expirado";
        } else if (res.status === 500) {
          errorMsg = "Error en el servidor. Intenta nuevamente en unos minutos";
        }

        setUiError(errorMsg);
        return;
      }

      setUiSuccess("¡Correo verificado correctamente! Redirigiendo al inicio de sesión...");

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            successMessage: "¡Tu cuenta ha sido verificada exitosamente! Ahora puedes iniciar sesión.",
          },
        });
      }, 1800);
    } catch (err) {
      console.error("Error al verificar código:", err);
      setUiError("Error de conexión. Verifica tu internet e intenta de nuevo.");
    } finally {
      setVerifyLoading(false);
    }
  }

  // Reenviar código
  async function handleResend() {
    if (!email) {
      setUiError("No se encontró el correo electrónico asociado.");
      return;
    }

    setResendLoading(true);
    setUiError(null);
    setUiSuccess(null);

    try {
      const res = await fetch(`${getApiBaseUrl()}/resend-verification-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        let errorMsg = data.message || "No se pudo reenviar el código";

        if (res.status === 404) {
          errorMsg = "No encontramos una cuenta registrada con ese correo";
        } else if (res.status === 422) {
          errorMsg = data.message || "El correo ya está verificado o la solicitud es inválida";
        } else if (res.status === 429) {
          errorMsg = "Demasiados intentos. Espera unos minutos antes de volver a intentarlo";
        } else if (res.status >= 500) {
          errorMsg = "Error temporal en el servidor. Intenta de nuevo más tarde";
        }

        setUiError(errorMsg);
        return;
      }

      setUiSuccess(
        data.message ||
        "¡Código reenviado correctamente! Revisa tu bandeja de entrada y la carpeta de spam."
      );
      setTimeout(() => setUiSuccess(null), 6000);
    } catch (err) {
      console.error("Error al reenviar código:", err);
      setUiError("No pudimos conectar con el servidor. Verifica tu conexión.");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-split">
        <aside className="auth-brand">
          <div className="auth-brand__logoWrap">
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "0.06em" }}>
              IPROCESS
            </div>
          </div>

          <div className="auth-brand__divider" />
          <h2 className="auth-brand__title">Proyecto X</h2>
          <p className="auth-brand__subtitle">Verifica tu correo</p>
        </aside>

        <main className="auth-panel">
          <div className="auth-form">
            <div className="auth-header">
              <h1>Verifica tu cuenta</h1>
              <p>
                {email ? (
                  <>
                    Enviamos un código de 6 dígitos a <strong>{email}</strong>
                  </>
                ) : (
                  "Ingresa el código que te enviamos a tu correo electrónico."
                )}
              </p>
            </div>

            {uiSuccess && <div className="auth-success">{uiSuccess}</div>}
            {uiError && <div className="auth-error">{uiError}</div>}

            <label className="auth-label" htmlFor="code">
              Código de verificación
              <input
                id="code"
                className="auth-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="123456"
                autoFocus
                disabled={verifyLoading || resendLoading}
              />
            </label>

            <button
              className="auth-button"
              onClick={handleVerify}
              disabled={verifyLoading || code.length !== 6 || !email || resendLoading}
            >
              {verifyLoading ? "Verificando..." : "Verificar código"}
            </button>

            <button
              type="button"
              className="auth-button auth-button--secondary"
              onClick={handleResend}
              disabled={resendLoading || !email || verifyLoading}
              style={{
                marginTop: "16px",
                background: "transparent",
                color: "#007bff",
                border: "1px solid #007bff",
              }}
            >
              {resendLoading ? "Enviando nuevo código..." : "Reenviar código"}
            </button>

            <div className="auth-register" style={{ marginTop: "28px", textAlign: "center" }}>
              <Link className="auth-register__link" to="/login">
                ← Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}