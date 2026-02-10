import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../app/components/LoginForm";
import "../styles/Login.css";

type FormState = {
  email: string;
  password: string;
  remember: boolean;
};

type ApiLoginResponse = {
  token?: string;
  access_token?: string;
  data?: { token?: string };
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function extractToken(payload: ApiLoginResponse): string | null {
  return (
    payload.token ??
    payload.access_token ??
    payload.data?.token ??
    null
  );
}

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    remember: true,
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [loading, setLoading] = useState(false);
  const [uiError, setUiError] = useState<string | null>(null);

  const errors = useMemo(() => {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (!form.email) next.email = "Ingresa tu correo.";
    else if (!emailRegex.test(form.email)) {
      next.email = "Correo inválido.";
    }

    if (!form.password) next.password = "Ingresa tu contraseña.";
    else if (form.password.length < 6) {
      next.password = "Mínimo 6 caracteres.";
    }

    return next;
  }, [form]);

  const canSubmit = !loading && !errors.email && !errors.password;

  function onChange(field: keyof FormState, value: string | boolean) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function onBlur(field: "email" | "password") {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setUiError(null);

    if (!canSubmit) return;

    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data: ApiLoginResponse = await res.json();
      if (!res.ok) throw new Error();

      const token = extractToken(data);
      if (!token) throw new Error();

      if (form.remember) {
        localStorage.setItem("auth_token", token);
      } else {
        sessionStorage.setItem("auth_token", token);
      }

      navigate("/dashboard", { replace: true });
    } catch {
      setUiError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginForm
      email={form.email}
      password={form.password}
      remember={form.remember}
      loading={loading}
      canSubmit={canSubmit}
      errors={errors}
      touched={touched}
      uiError={uiError}
      onSubmit={onSubmit}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
}