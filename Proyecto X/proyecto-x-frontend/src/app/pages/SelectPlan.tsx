import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/register.css";

type Plan = {
  id: number;
  name: string;
  type: "individual" | "business";
};

type FormState = {
  plan_id: string;
  company_name: string;
};

type Touched = Record<keyof FormState, boolean>;

function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return typeof baseUrl === "string" ? baseUrl.replace(/\/$/, "") : "";
}

function getAuthToken(): string | null {
  return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
}

export function SelectPlan() {
  const navigate = useNavigate();

  const plans: Plan[] = [
    { id: 1, name: "Individual Básico", type: "individual" },
    { id: 2, name: "Empresa Pro", type: "business" },
  ];

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const [form, setForm] = useState<FormState>({
    plan_id: "",
    company_name: "",
  });

  const [touched, setTouched] = useState<Touched>({
    plan_id: false,
    company_name: false,
  });

  const [loading, setLoading] = useState(false);
  const [uiError, setUiError] = useState<string | null>(null);

  // Actualiza el plan seleccionado
  useEffect(() => {
    if (form.plan_id) {
      const plan = plans.find((p) => p.id === parseInt(form.plan_id, 10));
      setSelectedPlan(plan || null);
      setForm((prev) => ({ ...prev, company_name: "" }));
      setTouched((prev) => ({ ...prev, company_name: false }));
    } else {
      setSelectedPlan(null);
    }
  }, [form.plan_id]);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};

    if (!form.plan_id) e.plan_id = "Selecciona un plan";

    if (selectedPlan?.type === "business") {
      if (!form.company_name.trim()) {
        e.company_name = "Ingresa el nombre de la empresa";
      } else if (form.company_name.trim().length < 2) {
        e.company_name = "Mínimo 2 caracteres";
      }
    }

    return e;
  }, [form, selectedPlan]);

  const canSubmit = !loading && Object.keys(errors).length === 0;

  function setField<K extends keyof FormState>(key: K, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setUiError(null);

    const token = getAuthToken();

    if (!token) {
      setUiError("No estás autenticado. Por favor inicia sesión nuevamente.");
      setLoading(false);
      navigate("/login", { replace: true });
      return;
    }

    try {
      const body: any = {
        plan_id: parseInt(form.plan_id, 10),
      };

      if (selectedPlan?.type === "business") {
        body.company_name = form.company_name.trim();
      }

      const res = await fetch(`${getApiBaseUrl()}/company/assign-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data: any = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMessage =
          data.message ||
          (data.errors ? Object.values(data.errors).flat()[0] : undefined) ||
          `Error ${res.status}`;

        setUiError(errorMessage);
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Error en assign-plan:", err);
      setUiError("Error de conexión");
    } finally {
      setLoading(false);
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
          <p className="auth-brand__subtitle">Selecciona tu plan para comenzar</p>
        </aside>

        <main className="auth-panel">
          <form className="auth-form" onSubmit={onSubmit} noValidate>
            <div className="auth-header">
              <h1>Elige tu plan</h1>
              <p>Selecciona el plan que mejor se adapte a ti.</p>
            </div>

            {uiError && (
              <div className="auth-error" role="alert">
                {uiError}
              </div>
            )}

            <label className="auth-label" htmlFor="plan">
              Plan
              <select
                id="plan"
                className="auth-input"
                value={form.plan_id}
                onChange={(e) => setField("plan_id", e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, plan_id: true }))}
              >
                <option value="">Selecciona un plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
              {touched.plan_id && errors.plan_id && (
                <div className="auth-field-error">{errors.plan_id}</div>
              )}
            </label>

            {selectedPlan?.type === "business" && (
              <label className="auth-label" htmlFor="company_name">
                Nombre de la empresa
                <input
                  id="company_name"
                  className="auth-input"
                  value={form.company_name}
                  onChange={(e) => setField("company_name", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, company_name: true }))}
                  placeholder="Nombre de tu empresa"
                />
                {touched.company_name && errors.company_name && (
                  <div className="auth-field-error">{errors.company_name}</div>
                )}
              </label>
            )}

            <button
              className="auth-button"
              type="submit"
              disabled={!canSubmit}
            >
              {loading ? "Asignando plan..." : "Continuar"}
            </button>

            <div className="auth-register">
              <span>¿Necesitas ayuda?</span>{" "}
              <Link className="auth-register__link" to="/support">
                Contactar soporte
              </Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}