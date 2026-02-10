import React from "react";

type Errors = {
  email?: string;
  password?: string;
};

type Touched = {
  email: boolean;
  password: boolean;
};

type LoginFormProps = {
  email: string;
  password: string;
  remember: boolean;
  loading: boolean;
  canSubmit: boolean;
  errors: Errors;
  touched: Touched;
  uiError: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (
    field: "email" | "password" | "remember",
    value: string | boolean
  ) => void;
  onBlur: (field: "email" | "password") => void;
};

export default function LoginForm({
  email,
  password,
  remember,
  loading,
  canSubmit,
  errors,
  touched,
  uiError,
  onSubmit,
  onChange,
  onBlur,
}: LoginFormProps) {
  return (
    <>
      <style>{`
        .login {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f172a;
          font-family: system-ui, sans-serif;
        }

        .login__card {
          width: 100%;
          max-width: 380px;
          background: #020617;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0,0,0,.4);
          color: #e5e7eb;
        }

        .login__title {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          text-align: center;
        }

        .login__subtitle {
          margin: 8px 0 24px;
          font-size: 14px;
          text-align: center;
          color: #9ca3af;
        }

        .login__alert {
          background: #7f1d1d;
          color: #fecaca;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .login__field {
          margin-bottom: 16px;
        }

        .login__label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
        }

        .login__input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #1e293b;
          background: #020617;
          color: #e5e7eb;
          outline: none;
        }

        .login__input:focus {
          border-color: #38bdf8;
        }

        .login__error {
          margin-top: 4px;
          font-size: 12px;
          color: #fca5a5;
        }

        .login__remember {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .login__submit {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: none;
          background: #38bdf8;
          color: #020617;
          font-weight: 600;
          cursor: pointer;
        }

        .login__submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="login">
        <form className="login__card" onSubmit={onSubmit} noValidate>
          <h1 className="login__title">Iniciar sesión</h1>
          <p className="login__subtitle">
            Ingresa tus credenciales para continuar.
          </p>

          {uiError && (
            <div className="login__alert" role="alert">
              {uiError}
            </div>
          )}

          <div className="login__field">
            <label htmlFor="email" className="login__label">
              Correo
            </label>
            <input
              id="email"
              className="login__input"
              type="email"
              value={email}
              onChange={(e) => onChange("email", e.target.value)}
              onBlur={() => onBlur("email")}
              autoComplete="email"
            />
            {touched.email && errors.email && (
              <div className="login__error">{errors.email}</div>
            )}
          </div>

          <div className="login__field">
            <label htmlFor="password" className="login__label">
              Contraseña
            </label>
            <input
              id="password"
              className="login__input"
              type="password"
              value={password}
              onChange={(e) => onChange("password", e.target.value)}
              onBlur={() => onBlur("password")}
              autoComplete="current-password"
            />
            {touched.password && errors.password && (
              <div className="login__error">{errors.password}</div>
            )}
          </div>

          <label className="login__remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => onChange("remember", e.target.checked)}
            />
            <span>Recordarme</span>
          </label>

          <button
            className="login__submit"
            type="submit"
            disabled={!canSubmit}
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </div>
    </>
  );
}
