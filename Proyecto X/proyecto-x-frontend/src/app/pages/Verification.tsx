// src/app/pages/Verification.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/register.css";

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

  // ✅ Botón "Verificar" (solo navegar a login)
  function goToLogin() {
    navigate("/login", { replace: true });
  }

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

      let data: any;
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

      setUiSuccess("¡Correo verificado correctamente! Ahora puedes iniciar sesión.");

      // ✅ En vez de redirigir automático, dejamos que el usuario pulse "Verificar" (ir a login)
      // Si igual quieres el auto-redirect, te lo vuelvo a poner.
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

      let data: any;
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

  const disabledAll = verifyLoading || resendLoading;

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
          <p className="auth-brand__subtitle">Verificación de correo</p>

          {/* ✅ Toque visual: mini guía */}
          <div
            style={{
              marginTop: 18,
              padding: 14,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              lineHeight: 1.35,
              fontSize: 13,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Tip</div>
            Revisa <b>Spam</b> / <b>Promociones</b>. El código expira, así que úsalo apenas llegue.
          </div>
        </aside>

        <main className="auth-panel">
          <div className="auth-form">
            <div className="auth-header">
              <h1 style={{ display: "flex", gap: 10, alignItems: "center" }}>
                Verifica tu cuenta
                <span
                  style={{
                    fontSize: 12,
                    padding: "4px 10px",
                    borderRadius: 999,
                    border: "1px solid #e5e7eb",
                    background: "#f8fafc",
                    color: "#334155",
                    fontWeight: 700,
                  }}
                >
                  6 dígitos
                </span>
              </h1>

              <p style={{ marginTop: 8 }}>
                {email ? (
                  <>
                    Enviamos un código a <strong>{email}</strong>. Ingrésalo para confirmar tu correo.
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
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                autoFocus
                disabled={disabledAll}
                style={{
                  letterSpacing: "0.35em",
                  fontWeight: 800,
                  textAlign: "center",
                }}
              />
            </label>

            {/* ✅ Botón principal: verifica el código */}
            <button
              className="auth-button"
              onClick={handleVerify}
              disabled={verifyLoading || resendLoading || code.length !== 6 || !email}
              style={{
                borderRadius: 12,
                boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
              }}
            >
              {verifyLoading ? "Verificando..." : "Verificar código"}
            </button>

            {/* ✅ Botón secundario: reenviar */}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading || !email || verifyLoading}
              style={{
                marginTop: 12,
                width: "100%",
                borderRadius: 12,
                padding: "12px 14px",
                fontWeight: 700,
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                color: "#0f172a",
                cursor: resendLoading ? "not-allowed" : "pointer",
              }}
            >
              {resendLoading ? "Enviando nuevo código..." : "Reenviar código"}
            </button>

            {/* ✅ NUEVO: Botón "Verificar" que lleva a login */}
            <button
              type="button"
              onClick={goToLogin}
              disabled={disabledAll}
              style={{
                marginTop: 12,
                width: "100%",
                borderRadius: 12,
                padding: "12px 14px",
                fontWeight: 800,
                border: "1px solid #0f172a",
                background: "#0f172a",
                color: "#ffffff",
                cursor: disabledAll ? "not-allowed" : "pointer",
              }}
              title="Ir al inicio de sesión"
            >
              Verificar
            </button>

            <div className="auth-register" style={{ marginTop: 18, textAlign: "center" }}>
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
