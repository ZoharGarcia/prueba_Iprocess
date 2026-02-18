// src/pages/MiPlan.tsx
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return typeof baseUrl === "string" ? baseUrl.replace(/\/$/, "") : "";
}

type Plan = {
  id: number;
  name: string;
  type: "individual" | "business";
  price: number;
  max_users: number;
  max_devices: number;
};

type MeResponse = {
  id?: number;
  name?: string;
  email?: string;

  plan_expires_at?: string | null;
  days_left?: number | null;
  is_subscription_active?: boolean | null;

  // ✅ Nuevo (recomendado desde /me)
  current_plan_id?: number | null;
  current_plan_name?: string | null;

  // fallback si no agregas los campos arriba
  company?: {
    plan_id?: number | null;
    plan?: string | null;
    type?: string | null;
    name?: string | null;
  } | null;
};

function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleDateString("es-NI");
}

export default function MiPlan() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, logout } = useAuth();

  const apiBase = useMemo(() => getApiBaseUrl(), []);
  const token =
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

  const [me, setMe] = useState<MeResponse | null>(null);
  const [meLoading, setMeLoading] = useState(false);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);

  const [activating, setActivating] = useState<number | null>(null);
  const [companyName, setCompanyName] = useState("");

  // =========================
  // Fetch /me
  // =========================
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    let cancelled = false;

    async function fetchMe() {
      setMeLoading(true);
      try {
        const res = await fetch(`${apiBase}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            logout?.();
            navigate("/login", { replace: true });
          }
          return;
        }

        const data = (await res.json()) as MeResponse;
        if (!cancelled) {
          setMe(data);

          // Si ya hay company name, prellenamos el input (opcional)
          const cn = data?.company?.name;
          if (typeof cn === "string" && cn.trim()) setCompanyName(cn);
        }
      } catch {
        // silencioso
      } finally {
        if (!cancelled) setMeLoading(false);
      }
    }

    fetchMe();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token, apiBase, logout, navigate]);

  // =========================
  // Fetch /plans
  // =========================
  useEffect(() => {
    let cancelled = false;

    async function fetchPlans() {
      setPlansLoading(true);
      try {
        const res = await fetch(`${apiBase}/plans`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;

        const data = (await res.json()) as Plan[];
        if (!cancelled) setPlans(Array.isArray(data) ? data : []);
      } catch {
        // silencioso
      } finally {
        if (!cancelled) setPlansLoading(false);
      }
    }

    fetchPlans();
    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  const isActive = Boolean(me?.is_subscription_active);

  // ✅ Determina plan actual (usa current_plan_id si existe; si no, cae a company.plan_id)
  const currentPlanId =
    typeof me?.current_plan_id === "number"
      ? me.current_plan_id
      : typeof me?.company?.plan_id === "number"
      ? me.company.plan_id
      : null;

  const currentPlan =
    currentPlanId != null ? plans.find((p) => p.id === currentPlanId) : null;

  // =========================
  // Activate / Reactivate Plan
  // =========================
  async function activatePlan(plan: Plan) {
    if (!token) {
      navigate("/login");
      return;
    }

    // 🔒 No permitir seleccionar el mismo plan actual
    if (currentPlanId === plan.id) return;

    // Si es business y no hay nombre
    if (plan.type === "business" && !companyName.trim()) {
      alert("Para plan Empresa debes escribir el nombre de la empresa.");
      return;
    }

    setActivating(plan.id);

    try {
      const res = await fetch(`${apiBase}/company/activate-plan`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_id: plan.id,
          company_name: plan.type === "business" ? companyName.trim() : null,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data?.message || "No se pudo activar el plan.");
        return;
      }

      // ✅ Mejor: re-fetch /me para reflejar plan actual sin inconsistencias
      // (en vez de intentar “parchar” el state)
      try {
        const resMe = await fetch(`${apiBase}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (resMe.ok) {
          const meData = (await resMe.json()) as MeResponse;
          setMe(meData);
        }
      } catch {
        // silencioso
      }

      navigate("/inicio");
    } finally {
      setActivating(null);
    }
  }

  // =========================
  // Render states
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mi plan</h1>
            <p className="text-sm text-muted-foreground">
              Estado de suscripción, vencimiento y acciones de renovación.
            </p>
          </div>

          <Button variant="outline" onClick={() => navigate(-1)}>
            Atrás
          </Button>
        </div>

        {/* Resumen */}
        <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b">
            <div className="font-semibold text-slate-900">Resumen de suscripción</div>
            <div className="text-xs text-muted-foreground">
              Cuenta: {meLoading ? "Cargando..." : me?.email || "—"}
            </div>
          </div>

          <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="text-xs text-muted-foreground">Estado</div>
              <div
                className={`mt-1 text-lg font-bold ${
                  isActive ? "text-green-700" : "text-red-700"
                }`}
              >
                {isActive ? "Activo" : "Inactivo"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {me?.days_left === 0 && isActive ? "Vence hoy" : ""}
              </div>
            </div>

            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="text-xs text-muted-foreground">Plan actual</div>
              <div className="mt-1 text-lg font-bold text-slate-900">
                {meLoading
                  ? "Cargando..."
                  : currentPlan?.name || me?.current_plan_name || me?.company?.plan || "—"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {currentPlan
                  ? `Usuarios: ${currentPlan.max_users} • Dispositivos: ${currentPlan.max_devices}`
                  : ""}
              </div>
            </div>

            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="text-xs text-muted-foreground">Vence</div>
              <div className="mt-1 text-lg font-bold text-slate-900">
                {formatDate(me?.plan_expires_at)}
              </div>
            </div>

            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="text-xs text-muted-foreground">Días restantes</div>
              <div className="mt-1 text-lg font-bold text-slate-900">
                {typeof me?.days_left === "number" ? me.days_left : "—"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isActive
                  ? "Tu suscripción está vigente."
                  : "Renueva tu plan para continuar."}
              </div>
            </div>
          </div>
        </section>

        {/* Datos para business */}
        <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b">
            <div className="font-semibold text-slate-900">Datos para plan Empresa</div>
            <div className="text-xs text-muted-foreground">
              Solo requerido si eliges un plan tipo business.
            </div>
          </div>
          <div className="p-5">
            <label className="text-xs text-muted-foreground">Nombre de empresa</label>
            <input
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ej: Integración de Procesos Industriales S.A."
            />
            <div className="mt-2 text-xs text-muted-foreground">
              Tip: si tu plan actual es individual, este campo no es necesario.
            </div>
          </div>
        </section>

        {/* Planes */}
        <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900">Planes disponibles</div>
              <div className="text-xs text-muted-foreground">
                Elige un plan para activar, renovar o cambiar.
              </div>
            </div>
          </div>

          <div className="p-5">
            {plansLoading ? (
              <div className="text-sm text-muted-foreground">Cargando planes...</div>
            ) : plans.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No hay planes disponibles.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {plans.map((p) => {
                  const isCurrent = currentPlanId === p.id;

                  return (
                    <div
                      key={p.id}
                      className={`rounded-2xl border p-5 ${
                        isCurrent ? "opacity-70" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Tipo: {p.type} • Usuarios: {p.max_users} • Dispositivos:{" "}
                            {p.max_devices}
                          </div>

                          {isCurrent && (
                            <div className="mt-2 inline-flex text-xs font-semibold px-2 py-1 rounded-full bg-slate-200 text-slate-700">
                              Plan actual
                            </div>
                          )}
                        </div>

                        <div className="text-lg font-bold text-slate-900">
                          ${p.price}
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button
                          className="w-full"
                          disabled={activating !== null || isCurrent}
                          onClick={() => activatePlan(p)}
                        >
                          {isCurrent
                            ? "Plan actual"
                            : activating === p.id
                            ? "Procesando..."
                            : isActive
                            ? "Cambiar / Renovar"
                            : "Activar / Reactivar"}
                        </Button>
                      </div>

                      {p.type === "business" && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Requiere nombre de empresa.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
