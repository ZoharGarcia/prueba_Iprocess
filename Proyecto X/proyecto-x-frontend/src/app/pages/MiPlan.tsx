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
  role?: "owner" | "admin" | "user";

  plan_expires_at?: string | null;
  days_left?: number | null;
  is_subscription_active?: boolean | null;

  current_plan_id?: number | null;
  current_plan_name?: string | null;

  company?: {
    id?: number | null;
    plan_id?: number | null;
    plan?: string | null;
    type?: "individual" | "business" | string | null;
    name?: string | null;
    status?: "active" | "trial" | "suspended" | string | null;
  } | null;
};

type CompanyUser = {
  id: number;
  name: string;
  email: string;
  role: "owner" | "admin" | "user";
  created_at: string;
};

type PaginatedUsers = {
  data: CompanyUser[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
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

  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPageLoading, setUsersPageLoading] = useState(false);
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [usersMeta, setUsersMeta] = useState<
    Pick<PaginatedUsers, "current_page" | "last_page" | "total">
  >({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [usersError, setUsersError] = useState<string | null>(null);
  const [usersSuccess, setUsersSuccess] = useState<string | null>(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "user" | "admin",
    send_email: true,
  });
  const [creatingUser, setCreatingUser] = useState(false);

  const [attachUser, setAttachUser] = useState({
    email: "",
    role: "user" as "user" | "admin",
  });
  const [attachingUser, setAttachingUser] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

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

  const currentPlanId =
    typeof me?.current_plan_id === "number"
      ? me.current_plan_id
      : typeof me?.company?.plan_id === "number"
      ? me.company.plan_id
      : null;

  const currentPlan =
    currentPlanId != null ? plans.find((p) => p.id === currentPlanId) : null;

  const isBusinessPlan =
    currentPlan?.type === "business" || me?.company?.type === "business";

  const canManageUsers =
    isBusinessPlan && isActive && ["owner", "admin"].includes(me?.role || "");

  async function activatePlan(plan: Plan) {
    if (!token) {
      navigate("/login");
      return;
    }

    if (currentPlanId === plan.id) return;

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

  async function fetchCompanyUsers(page = 1) {
    if (!token) return;

    setUsersError(null);

    const setLoading = page === 1 ? setUsersLoading : setUsersPageLoading;
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/company/users?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setUsersError((data?.error as string) || "No se pudieron cargar los usuarios.");
        return;
      }

      const paged = data as PaginatedUsers;
      setUsers(Array.isArray(paged?.data) ? paged.data : []);
      setUsersMeta({
        current_page: paged?.current_page ?? page,
        last_page: paged?.last_page ?? page,
        total: paged?.total ?? 0,
      });
    } catch {
      setUsersError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!canManageUsers) return;
    fetchCompanyUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManageUsers]);

  async function createCompanyUser() {
    if (!token) return;

    setUsersSuccess(null);
    setUsersError(null);

    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      setUsersError("Completa nombre, correo y contraseña.");
      return;
    }

    setCreatingUser(true);

    try {
      const res = await fetch(`${apiBase}/company/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newUser.name.trim(),
          email: newUser.email.trim(),
          password: newUser.password,
          role: newUser.role,
          send_email: newUser.send_email,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data?.error ||
          data?.message ||
          (data?.errors ? "Revisa los datos del formulario." : "No se pudo crear el usuario.");
        setUsersError(msg);
        return;
      }

      if (newUser.send_email) {
        setUsersSuccess(
          data?.email_sent
            ? "Usuario creado y correo enviado con credenciales."
            : "Usuario creado. No se pudo enviar el correo."
        );
      } else {
        setUsersSuccess("Usuario creado correctamente.");
      }

      setNewUser({ name: "", email: "", password: "", role: "user", send_email: true });

      await fetchCompanyUsers(1);
    } finally {
      setCreatingUser(false);
    }
  }

  async function attachExistingUser() {
    if (!token) return;

    setUsersSuccess(null);
    setUsersError(null);

    if (!attachUser.email.trim()) {
      setUsersError("Escribe el correo del usuario existente.");
      return;
    }

    setAttachingUser(true);

    try {
      const res = await fetch(`${apiBase}/company/users/attach`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: attachUser.email.trim(),
          role: attachUser.role,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data?.error ||
          data?.message ||
          (data?.errors ? "Revisa el correo y vuelve a intentar." : "No se pudo agregar el usuario.");
        setUsersError(msg);
        return;
      }

      setUsersSuccess("Usuario agregado al plan correctamente.");
      setAttachUser({ email: "", role: "user" });
      await fetchCompanyUsers(1);
    } finally {
      setAttachingUser(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

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
              <div className={`mt-1 text-lg font-bold ${isActive ? "text-green-700" : "text-red-700"}`}>
                {isActive ? "Activo" : "Inactivo"}
              </div>
            </div>

            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="text-xs text-muted-foreground">Plan actual</div>
              <div className="mt-1 text-lg font-bold text-slate-900">
                {meLoading ? "Cargando..." : currentPlan?.name || me?.current_plan_name || me?.company?.plan || "—"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {currentPlan ? `Usuarios: ${currentPlan.max_users} • Dispositivos: ${currentPlan.max_devices}` : ""}
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
                {isActive ? "Tu suscripción está vigente." : "Renueva tu plan para continuar."}
              </div>
            </div>
          </div>
        </section>

        {(isBusinessPlan || plans.some((p) => p.type === "business")) && (
          <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b">
              <div className="font-semibold text-slate-900">Datos para plan Empresa</div>
              <div className="text-xs text-muted-foreground">Solo requerido si eliges un plan tipo business.</div>
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
                Si estás en plan individual, no necesitás completar esto.
              </div>
            </div>
          </section>
        )}

        {canManageUsers && (
          <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-900">Usuarios del plan</div>
                <div className="text-xs text-muted-foreground">
                  Agrega personas a tu plan grupal y administra accesos.
                </div>
              </div>

              <Button
                variant="outline"
                disabled={usersLoading || usersPageLoading}
                onClick={() => fetchCompanyUsers(1)}
              >
                Actualizar
              </Button>
            </div>

            <div className="p-5 space-y-4">
              {usersError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {usersError}
                </div>
              )}

              {usersSuccess && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                  {usersSuccess}
                </div>
              )}

              <div className="rounded-2xl border p-4">
                <div className="font-semibold text-slate-900">Agregar usuario (nuevo)</div>

                <div className="mt-3 grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Nombre</label>
                    <input
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                      value={newUser.name}
                      onChange={(e) => setNewUser((s) => ({ ...s, name: e.target.value }))}
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Correo</label>
                    <input
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                      value={newUser.email}
                      onChange={(e) => setNewUser((s) => ({ ...s, email: e.target.value }))}
                      placeholder="usuario@empresa.com"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Contraseña</label>
                    <input
                      type="password"
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                      value={newUser.password}
                      onChange={(e) => setNewUser((s) => ({ ...s, password: e.target.value }))}
                      placeholder="mínimo 6 caracteres"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Rol</label>
                    <select
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser((s) => ({ ...s, role: e.target.value as "user" | "admin" }))
                      }
                    >
                      <option value="user">Usuario</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    id="send_email"
                    type="checkbox"
                    checked={newUser.send_email}
                    onChange={(e) => setNewUser((s) => ({ ...s, send_email: e.target.checked }))}
                  />
                  <label htmlFor="send_email" className="text-sm text-slate-700">
                    Enviar correo con credenciales y link de acceso
                  </label>
                </div>

                <div className="mt-4">
                  <Button className="w-full" disabled={creatingUser} onClick={createCompanyUser}>
                    {creatingUser ? "Creando..." : "Crear usuario"}
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border p-4">
                <div className="font-semibold text-slate-900">Agregar usuario existente</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Agrega a tu plan a alguien que ya tiene cuenta (por correo).
                </div>

                <div className="mt-3 grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Correo</label>
                    <input
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                      value={attachUser.email}
                      onChange={(e) => setAttachUser((s) => ({ ...s, email: e.target.value }))}
                      placeholder="usuario@empresa.com"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Rol</label>
                    <select
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                      value={attachUser.role}
                      onChange={(e) =>
                        setAttachUser((s) => ({
                          ...s,
                          role: e.target.value as "user" | "admin",
                        }))
                      }
                    >
                      <option value="user">Usuario</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <Button className="w-full" disabled={attachingUser} onClick={attachExistingUser}>
                    {attachingUser ? "Agregando..." : "Agregar al plan"}
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900">Usuarios ({usersMeta.total})</div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      disabled={usersMeta.current_page <= 1 || usersLoading || usersPageLoading}
                      onClick={() => fetchCompanyUsers(usersMeta.current_page - 1)}
                    >
                      Anterior
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      Página {usersMeta.current_page} / {usersMeta.last_page}
                    </div>
                    <Button
                      variant="outline"
                      disabled={
                        usersMeta.current_page >= usersMeta.last_page ||
                        usersLoading ||
                        usersPageLoading
                      }
                      onClick={() => fetchCompanyUsers(usersMeta.current_page + 1)}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>

                <div className="mt-3">
                  {usersLoading ? (
                    <div className="text-sm text-muted-foreground">Cargando usuarios...</div>
                  ) : users.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No hay usuarios registrados en tu empresa.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs text-muted-foreground">
                            <th className="py-2">Nombre</th>
                            <th className="py-2">Correo</th>
                            <th className="py-2">Rol</th>
                            <th className="py-2">Creado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u) => (
                            <tr key={u.id} className="border-t">
                              <td className="py-2 font-medium text-slate-900">{u.name}</td>
                              <td className="py-2">{u.email}</td>
                              <td className="py-2">{u.role}</td>
                              <td className="py-2">{formatDate(u.created_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

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
              <div className="text-sm text-muted-foreground">No hay planes disponibles.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {plans.map((p) => {
                  const isCurrent = currentPlanId === p.id;

                  return (
                    <div
                      key={p.id}
                      className={`rounded-2xl border p-5 ${isCurrent ? "opacity-70" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Tipo: {p.type} • Usuarios: {p.max_users} • Dispositivos: {p.max_devices}
                          </div>

                          {isCurrent && (
                            <div className="mt-2 inline-flex text-xs font-semibold px-2 py-1 rounded-full bg-slate-200 text-slate-700">
                              Plan actual
                            </div>
                          )}
                        </div>

                        <div className="text-lg font-bold text-slate-900">${p.price}</div>
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