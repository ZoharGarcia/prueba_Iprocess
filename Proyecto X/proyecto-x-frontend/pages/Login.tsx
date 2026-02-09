import { useState } from "react";
import { useNavigate } from "react-router-dom";

type LoginResponse = {
  token: string;
  user?: { id: number; name: string; email: string };
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

function saveToken(token: string) {
  localStorage.setItem("auth_token", token);
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Opcional: si quieres agregar "recordarme"
  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const canSubmit =
    email.trim().length > 0 &&
    emailRegex.test(email.trim()) &&
    password.length >= 6 &&
    !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) return;

    setLoading(true);

    try {
      if (!API_BASE_URL) {
        throw new Error("Falta VITE_API_BASE_URL en tu .env");
      }

      const res = await fetch(`${API_BASE_URL}/login`, {  // ← Corrección clave: /api/login
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          remember, // ← opcional, si tu backend lo soporta
        }),
      });

      if (!res.ok) {
        let msg = "Credenciales inválidas o error en el servidor.";
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
          if (data?.errors) {
            const firstError = Object.values(data.errors)[0] as string[];
            if (firstError?.[0]) msg = firstError[0];
          }
        } catch {
          // Si no se puede parsear JSON
        }
        throw new Error(msg);
      }

      const data = (await res.json()) as LoginResponse;

      if (!data?.token) {
        throw new Error("Respuesta inválida del servidor: no se recibió token.");
      }

      saveToken(data.token);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error desconocido."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Proyecto X</h1>
          <p>Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Correo
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              placeholder="tu@correo.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-label">
            Contraseña
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {/* Opcional: checkbox recordarme */}
          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Recordarme
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button
            className="auth-button"
            type="submit"
            disabled={!canSubmit || loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="auth-footer">
          <small>
            API: {API_BASE_URL || "No configurada (revisa .env)"}
          </small>
        </div>
      </div>
    </div>
  );
}