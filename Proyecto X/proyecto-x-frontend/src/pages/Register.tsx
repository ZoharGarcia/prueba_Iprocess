import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

/* =======================
   Tipos
======================= */

type FormState = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

type ApiRegisterResponse = {
  token?: string;
};

/* =======================
   Utilidades
======================= */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return typeof baseUrl === "string" ? baseUrl.replace(/\/$/, "") : "";
}

function extractToken(payload: unknown): string | null {
  if (
    payload &&
    typeof payload === "object" &&
    "token" in payload &&
    typeof (payload as { token: unknown }).token === "string"
  ) {
    return (payload as { token: string }).token;
  }
  return null;
}

/* =======================
   Componente
======================= */

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    name: false,
    email: false,
    password: false,
    passwordConfirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [uiError, setUiError] = useState<string | null>(null);

  /* =======================
     Validaciones
  ======================= */

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) {
      e.name = "Ingresa tu nombre.";
    } else if (form.name.trim().length < 2) {
      e.name = "El nombre debe tener al menos 2 caracteres.";
    }

    if (!form.email.trim()) {
      e.email = "Ingresa tu correo.";
    } else if (!emailRegex.test(form.email)) {
      e.email = "Correo inválido.";
    }

    if (!form.password) {
      e.password = "Ingresa tu contraseña.";
    } else if (form.password.length < 6) {
      e.password = "Mínimo 6 caracteres.";
    }

    if (!form.passwordConfirm) {
      e.passwordConfirm = "Confirma tu contraseña.";
    } else if (form.passwordConfirm !== form.password) {
      e.passwordConfirm = "Las contraseñas no coinciden.";
    }

    return e;
  }, [form]);

  const canSubmit =
    !loading &&
    Object.keys(errors).length === 0;

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /* =======================
     Submit
  ======================= */

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      password: true,
      passwordConfirm: true,
    });

    if (!canSubmit) return;

    setLoading(true);
    setUiError(null);

    try {
      const res = await fetch(`${getApiBaseUrl()}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data: ApiRegisterResponse = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 409) {
          setUiError("El correo ya está registrado.");
        } else if (res.status === 422) {
          setUiError("Datos inválidos. Revisa el formulario.");
        } else {
          setUiError("No se pudo crear la cuenta.");
        }
        return;
      }

      const token = extractToken(data);
      if (token) {
        localStorage.setItem("auth_token", token);
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch {
      setUiError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  /* =======================
     UI
  ======================= */

  return (
    <div className="register">
      <form className="register__card" onSubmit={onSubmit} noValidate>
        <h1 className="register__title">Crear cuenta</h1>
        <p className="register__subtitle">
          Regístrate para acceder a Proyecto X
        </p>

        {uiError && <div className="register__alert">{uiError}</div>}

        {/* Nombre */}
        <div className="register__field">
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          />
          {touched.name && errors.name && (
            <span className="register__error">{errors.name}</span>
          )}
        </div>

        {/* Email */}
        <div className="register__field">
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          />
          {touched.email && errors.email && (
            <span className="register__error">{errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className="register__field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setField("password", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          />
          {touched.password && errors.password && (
            <span className="register__error">{errors.password}</span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="register__field">
          <label htmlFor="passwordConfirm">Confirmar contraseña</label>
          <input
            id="passwordConfirm"
            type="password"
            value={form.passwordConfirm}
            onChange={(e) => setField("passwordConfirm", e.target.value)}
            onBlur={() =>
              setTouched((t) => ({ ...t, passwordConfirm: true }))
            }
          />
          {touched.passwordConfirm && errors.passwordConfirm && (
            <span className="register__error">
              {errors.passwordConfirm}
            </span>
          )}
        </div>

        <button type="submit" disabled={!canSubmit}>
          {loading ? "Creando..." : "Crear cuenta"}
        </button>

        <p className="register__footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
