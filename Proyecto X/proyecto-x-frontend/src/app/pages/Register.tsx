import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/register.css";
import "../../assets/Logo_Iprocess.png";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

type TouchedRegister = Record<keyof RegisterForm, boolean>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return typeof baseUrl === "string" ? baseUrl.replace(/\/$/, "") : "";
}

export function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState<"register" | "verify">("register");

  // Registro
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [touched, setTouched] = useState<TouchedRegister>({
    name: false,
    email: false,
    password: false,
    passwordConfirm: false,
  });

  // Verificación
  const [verifyCode, setVerifyCode] = useState("");
  const [savedEmail, setSavedEmail] = useState("");

  const [registerLoading, setRegisterLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [uiError, setUiError] = useState<string | null>(null);
  const [uiSuccess, setUiSuccess] = useState<string | null>(null);

  // Validaciones del formulario de registro
  const registerErrors = useMemo(() => {
    const e: Partial<Record<keyof RegisterForm, string>> = {};

    if (!registerForm.name.trim()) e.name = "Ingresa tu nombre";
    else if (registerForm.name.trim().length < 2) e.name = "Mínimo 2 caracteres";

    if (!registerForm.email.trim()) e.email = "Ingresa tu correo";
    else if (!emailRegex.test(registerForm.email)) e.email = "Correo inválido";

    if (!registerForm.password) e.password = "Ingresa contraseña";
    else if (registerForm.password.length < 6) e.password = "Mínimo 6 caracteres";

    if (!registerForm.passwordConfirm) e.passwordConfirm = "Confirma contraseña";
    else if (registerForm.password !== registerForm.passwordConfirm)
      e.passwordConfirm = "No coinciden";

    return e;
  }, [registerForm]);

  const canRegister = !registerLoading && Object.keys(registerErrors).length === 0;

  function setRegisterField<K extends keyof RegisterForm>(key: K, value: string) {
    setRegisterForm((p) => ({ ...p, [key]: value }));
  }

  // Registro
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canRegister) return;

    setRegisterLoading(true);
    setUiError(null);
    setUiSuccess(null);

    try {
      const res = await fetch(`${getApiBaseUrl()}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerForm.name.trim(),
          email: registerForm.email.trim(),
          password: registerForm.password,
          password_confirmation: registerForm.passwordConfirm,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as any;

      if (!res.ok) {
        let msg = data.message || "No se pudo registrar";

        // Manejo seguro de errores { "email": ["ya existe"], "name": ["muy corto"] }
        if (data.errors && typeof data.errors === "object" && !Array.isArray(data.errors)) {
          const firstErrorArray = Object.values(data.errors)[0];
          if (Array.isArray(firstErrorArray) && firstErrorArray.length > 0) {
            msg = firstErrorArray[0];
          }
        }

        setUiError(msg);
        return;
      }

      // Registro exitoso → pasar a verificación
      setSavedEmail(registerForm.email.trim());
      setStep("verify");
      setUiSuccess("¡Registro exitoso! Revisa tu correo para el código de verificación.");
    } catch {
      setUiError("Error de conexión");
    } finally {
      setRegisterLoading(false);
    }
  }

  // Verificar código
  async function handleVerify() {
    if (verifyCode.trim().length !== 6 || !/^\d+$/.test(verifyCode)) {
      setUiError("Ingresa un código válido de 6 dígitos");
      return;
    }

    setVerifyLoading(true);
    setUiError(null);

    try {
      const res = await fetch(`${getApiBaseUrl()}/verify-email-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: savedEmail,
          code: verifyCode.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setUiError(data.message || "Código inválido o expirado");
        return;
      }

      setUiSuccess("¡Correo verificado correctamente! Ahora puedes iniciar sesión.");

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { verificationSuccess: "¡Cuenta verificada! Inicia sesión." },
        });
      }, 2000);
    } catch {
      setUiError("Error de conexión");
    } finally {
      setVerifyLoading(false);
    }
  }

  // Reenviar código
  async function handleResend() {
    setResendLoading(true);
    setUiError(null);
    setUiSuccess(null);

    try {
      const res = await fetch(`${getApiBaseUrl()}/resend-verification-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: savedEmail }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setUiError(data.message || "No se pudo reenviar el código");
        return;
      }

      setUiSuccess("¡Código reenviado! Revisa tu correo.");
      setTimeout(() => setUiSuccess(null), 5000);
    } catch {
      setUiError("Error de conexión");
    } finally {
      setResendLoading(false);
    }
  }

  // ====================== PANTALLA DE REGISTRO ======================
  if (step === "register") {
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
            <p className="auth-brand__subtitle">Regístrate para comenzar</p>
          </aside>

          <main className="auth-panel">
            <form className="auth-form" onSubmit={handleRegister} noValidate>
              <div className="auth-header">
                <h1>Crear cuenta</h1>
                <p>Completa tus datos para registrarte.</p>
              </div>

              {uiSuccess && <div className="auth-success">{uiSuccess}</div>}
              {uiError && <div className="auth-error">{uiError}</div>}

              <label className="auth-label" htmlFor="name">
                Tu nombre
                <input
                  id="name"
                  className="auth-input"
                  value={registerForm.name}
                  onChange={(e) => setRegisterField("name", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                  autoComplete="name"
                  placeholder="Tu nombre completo"
                />
                {touched.name && registerErrors.name && (
                  <div className="auth-field-error">{registerErrors.name}</div>
                )}
              </label>

              <label className="auth-label" htmlFor="email">
                Correo
                <input
                  id="email"
                  className="auth-input"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterField("email", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                  autoComplete="email"
                  placeholder="tucorreo@ejemplo.com"
                />
                {touched.email && registerErrors.email && (
                  <div className="auth-field-error">{registerErrors.email}</div>
                )}
              </label>

              <label className="auth-label" htmlFor="password">
                Contraseña
                <input
                  id="password"
                  className="auth-input"
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterField("password", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                />
                {touched.password && registerErrors.password && (
                  <div className="auth-field-error">{registerErrors.password}</div>
                )}
              </label>

              <label className="auth-label" htmlFor="passwordConfirm">
                Confirmar contraseña
                <input
                  id="passwordConfirm"
                  className="auth-input"
                  type="password"
                  value={registerForm.passwordConfirm}
                  onChange={(e) => setRegisterField("passwordConfirm", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, passwordConfirm: true }))}
                  autoComplete="new-password"
                  placeholder="Repite tu contraseña"
                />
                {touched.passwordConfirm && registerErrors.passwordConfirm && (
                  <div className="auth-field-error">{registerErrors.passwordConfirm}</div>
                )}
              </label>

              <button className="auth-button" type="submit" disabled={!canRegister}>
                {registerLoading ? "Creando cuenta..." : "Registrarse"}
              </button>

              <div className="auth-register">
                <span>¿Ya tienes una cuenta?</span>{" "}
                <Link className="auth-register__link" to="/login">
                  Inicia sesión
                </Link>
              </div>
            </form>
          </main>
        </div>
      </div>
    );
  }

  // ====================== PANTALLA DE VERIFICACIÓN ======================
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
                Enviamos un código de 6 dígitos a <strong>{savedEmail}</strong>
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
                value={verifyCode}
                onChange={(e) =>
                  setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="123456"
                autoFocus
              />
            </label>

            <button
              className="auth-button"
              onClick={handleVerify}
              disabled={verifyLoading || verifyCode.length !== 6}
            >
              {verifyLoading ? "Verificando..." : "Verificar"}
            </button>

            <button
              type="button"
              className="auth-button auth-button--secondary"
              onClick={handleResend}
              disabled={resendLoading}
              style={{ marginTop: "12px", background: "transparent", color: "#007bff" }}
            >
              {resendLoading ? "Enviando..." : "Reenviar código"}
            </button>

            <div className="auth-register" style={{ marginTop: "20px" }}>
              <Link className="auth-register__link" to="/login">
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}