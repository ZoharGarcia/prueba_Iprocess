// src/pages/Inicio.tsx
import { useEffect, useMemo, useState } from "react";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { Pricing } from "../components/Pricing";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import logoIprocess from "@/assets/Logo_Iprocess.png";

type PlanInfo = {
  plan_expires_at?: string | null;
  days_left?: number | null;
  is_subscription_active?: boolean | null;
};

type MeResponse = {
  name?: string;
  email?: string;
  plan_expires_at?: string | null;
  days_left?: number | null;
  is_subscription_active?: boolean | null;
};

type SensorRow = {
  id: string;
  name: string;
  status: "online" | "offline";
  last_value: string;
  last_seen: string; // texto simple por ahora (ej: "hace 2 min")
  battery?: string | null;
  rssi?: string | null;
};

type ActivityItem = {
  id: string;
  level: "critico" | "advertencia" | "info";
  title: string;
  meta: string; // ej: "hace 5 min • Tanque 2"
};

function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return typeof baseUrl === "string" ? baseUrl.replace(/\/$/, "") : "";
}

function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString();
}

function initials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
}

function levelBadge(level: ActivityItem["level"]) {
  if (level === "critico")
    return "bg-red-100 text-red-800 border-red-200";
  if (level === "advertencia")
    return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-slate-100 text-slate-800 border-slate-200";
}

export default function Inicio() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, logout } = useAuth();

  const token =
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

  const [menuOpen, setMenuOpen] = useState(false);
  const [meLoading, setMeLoading] = useState(false);
  const [me, setMe] = useState<MeResponse | null>(null);

  const apiBase = useMemo(() => getApiBaseUrl(), []);

  const plan: PlanInfo = useMemo(() => {
    return {
      plan_expires_at: me?.plan_expires_at ?? null,
      days_left: typeof me?.days_left === "number" ? me.days_left : null,
      is_subscription_active:
        typeof me?.is_subscription_active === "boolean"
          ? me.is_subscription_active
          : null,
    };
  }, [me]);

  const planStatusText = useMemo(() => {
    const days = plan.days_left;
    const active = plan.is_subscription_active;

    if (active === true) {
      if (typeof days === "number") return `Activo • Te quedan ${days} días`;
      return "Activo";
    }

    if (active === false) {
      if (typeof days === "number") {
        if (days < 0) return `Inactivo • Venció hace ${Math.abs(days)} días`;
        return `Inactivo • Te quedan ${days} días`;
      }
      return "Inactivo";
    }

    if (typeof days === "number") {
      if (days < 0) return `Te quedan 0 días • Venció hace ${Math.abs(days)} días`;
      return `Te quedan ${days} días`;
    }
    return "Plan: —";
  }, [plan.days_left, plan.is_subscription_active]);

  // UI mock (temporal)
  const sensors: SensorRow[] = useMemo(
    () => [
      {
        id: "S-001",
        name: "Temp Tanque 2",
        status: "online",
        last_value: "27.3°C",
        last_seen: "hace 1 min",
        battery: "86%",
        rssi: "-63 dBm",
      },
      {
        id: "S-002",
        name: "MQ-135 Planta Norte",
        status: "offline",
        last_value: "—",
        last_seen: "hace 42 min",
        battery: "—",
        rssi: "—",
      },
      {
        id: "S-003",
        name: "Nivel Cisterna",
        status: "online",
        last_value: "68%",
        last_seen: "hace 3 min",
        battery: "74%",
        rssi: "-71 dBm",
      },
      {
        id: "S-004",
        name: "Humedad Bodega",
        status: "online",
        last_value: "55%",
        last_seen: "hace 5 min",
        battery: "91%",
        rssi: "-59 dBm",
      },
      {
        id: "S-005",
        name: "Presión Línea 1",
        status: "offline",
        last_value: "—",
        last_seen: "hace 1 h",
        battery: "—",
        rssi: "—",
      },
      {
        id: "S-006",
        name: "Temp Horno",
        status: "online",
        last_value: "182°C",
        last_seen: "hace 2 min",
        battery: "—",
        rssi: "-66 dBm",
      },
      {
        id: "S-007",
        name: "Vibración Motor A",
        status: "online",
        last_value: "0.12 g",
        last_seen: "hace 4 min",
        battery: "63%",
        rssi: "-68 dBm",
      },
      {
        id: "S-008",
        name: "Caudal Entrada",
        status: "online",
        last_value: "12.4 L/min",
        last_seen: "hace 2 min",
        battery: "—",
        rssi: "-64 dBm",
      },
    ],
    []
  );

  const activity: ActivityItem[] = useMemo(
    () => [
      {
        id: "A-1",
        level: "critico",
        title: "Temperatura alta en Tanque 2",
        meta: "hace 5 min • Planta Central",
      },
      {
        id: "A-2",
        level: "advertencia",
        title: "Sensor MQ-135 sin reporte hace 30 min",
        meta: "hace 30 min • Planta Norte",
      },
      {
        id: "A-3",
        level: "info",
        title: "Gateway Planta Norte reconectado",
        meta: "hace 1 h • Planta Norte",
      },
    ],
    []
  );

  const [activityFilter, setActivityFilter] = useState<
    "todos" | ActivityItem["level"]
  >("todos");

  const filteredActivity = useMemo(() => {
    if (activityFilter === "todos") return activity;
    return activity.filter((a) => a.level === activityFilter);
  }, [activity, activityFilter]);

  const kpis = useMemo(() => {
    const online = sensors.filter((s) => s.status === "online").length;
    const offline = sensors.filter((s) => s.status === "offline").length;

    return [
      { label: "Sensores activos", value: String(online), sub: "Online" },
      { label: "Sensores offline", value: String(offline), sub: "Sin reporte" },
      { label: "Alertas activas", value: "3", sub: "1 crítico • 2 medias" },
      { label: "Última lectura", value: "hace 1 min", sub: "Más reciente" },
      { label: "Datos hoy", value: "18,240", sub: "puntos guardados" },
      { label: "Uptime (7 días)", value: "99.8%", sub: "promedio" },
    ];
  }, [sensors]);

  // Cierra menú al hacer click fuera
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-profile-menu]")) setMenuOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Cargar "me" cuando está autenticado
  useEffect(() => {
    if (!isAuthenticated || !token) {
      setMe(null);
      return;
    }

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
            logout();
            navigate("/login", { replace: true });
          }
          return;
        }

        const data = (await res.json()) as MeResponse;
        if (!cancelled) setMe(data);
      } catch {
        // Silencioso
      } finally {
        if (!cancelled) setMeLoading(false);
      }
    }

    fetchMe();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token, apiBase, logout, navigate]);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate("/", { replace: true });
  }

  function goTo(path: string) {
    setMenuOpen(false);
    navigate(path);
  }

  function addNew() {
    // Cambia la ruta según tu flujo real
    navigate("/devices/new");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Cargando...</div>
      </div>
    );
  }

  // Si NO está autenticado: se queda como landing (lo que ya tenías)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={logoIprocess} alt="IProcess" className="h-10 w-auto" />
              <span className="font-bold text-xl">IProcess</span>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Registrarse</Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Hero />
          <Features />
          <Pricing />
        </main>
      </div>
    );
  }

  // Dashboard (post-login)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <img src={logoIprocess} alt="IProcess" className="h-10 w-auto" />
            <div className="leading-tight">
              <div className="font-bold text-xl">IProcess</div>
              <div className="text-xs text-muted-foreground">
                {meLoading ? "Cargando..." : `Hola, ${me?.name || "usuario"}`}
              </div>
            </div>
          </div>

          {/* Nav visible */}
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => goTo("/dashboard")}>
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => goTo("/devices")}>
              Dispositivos
            </Button>
            <Button variant="ghost" size="sm" onClick={() => goTo("/alerts")}>
              Alertas
            </Button>
            <Button variant="ghost" size="sm" onClick={() => goTo("/reports")}>
              Reportes
            </Button>
            <Button variant="ghost" size="sm" onClick={() => goTo("/settings")}>
              Configuración
            </Button>
          </nav>

          {/* Actions + Account */}
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={addNew}>
              + Agregar
            </Button>

            <div className="relative" data-profile-menu>
              {/* Trigger: avatar + nombre */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="gap-2"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 border text-xs font-semibold">
                  {initials(me?.name)}
                </span>
                <span className="hidden sm:inline">
                  {meLoading ? "Cargando..." : me?.name || "Mi cuenta"}
                </span>
                <span className="text-xs opacity-70">▾</span>
              </Button>

              {/* Dropdown */}
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-xl border bg-white shadow-lg overflow-hidden"
                  role="menu"
                >
                  {/* Header del menú */}
                  <div className="px-4 py-3 border-b">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold leading-tight">
                          {meLoading ? "Cargando..." : me?.name || "Mi cuenta"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {me?.email || ""}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground text-right">
                        <div className="font-semibold text-slate-700">Mi plan</div>
                        <div>{planStatusText}</div>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-2">
                    <button
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                      onClick={() => goTo("/profile")}
                      role="menuitem"
                    >
                      <div className="font-medium">Mi perfil</div>
                      <div className="text-xs text-muted-foreground">
                        Datos personales y seguridad
                      </div>
                    </button>

                    {/* Mi plan */}
                    <div className="mt-2 px-3 py-3 rounded-lg bg-slate-50 border">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Mi plan</div>
                        <div
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            plan.is_subscription_active === true
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {plan.is_subscription_active === true ? "Activo" : "Inactivo"}
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-slate-700 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vence:</span>
                          <span className="font-medium">
                            {formatDate(plan.plan_expires_at)}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Días restantes:</span>
                          <span className="font-medium">
                            {typeof plan.days_left === "number" ? plan.days_left : "—"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button size="sm" className="flex-1" onClick={() => goTo("/mi-plan")}>
                          {plan.is_subscription_active ? "Renovar" : "Pagar / Renovar"}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => goTo("/select-plan")}
                        >
                          Cambiar plan
                        </Button>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full mt-2"
                        onClick={() => goTo("/mi-plan")}
                      >
                        Ver mi plan →
                      </Button>

                      <div className="mt-2 text-xs text-muted-foreground">{planStatusText}</div>
                    </div>

                    <div className="my-2 h-px bg-slate-100" />

                    {/* Logout */}
                    <button
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 transition"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <div className="font-medium text-red-600">Cerrar sesión</div>
                      <div className="text-xs text-red-500/80">
                        Salir de tu cuenta en este dispositivo
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nav mobile (visible bajo header) */}
        <div className="md:hidden border-t bg-white">
          <div className="max-w-7xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto">
            <Button variant="ghost" size="sm" onClick={() => goTo("/dashboard")}>
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => goTo("/devices")}>
              Dispositivos
            </Button>
            <Button variant="ghost" size="sm" onClick={() => goTo("/alerts")}>
              Alertas
            </Button>
            <Button variant="ghost" size="sm" onClick={() => goTo("/reports")}>
              Reportes
            </Button>
            <Button variant="ghost" size="sm" onClick={() => goTo("/settings")}>
              Configuración
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* KPI cards */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-slate-900">Resumen</h1>
              <div className="text-sm text-muted-foreground">
                Vista general del estado del sistema
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpis.map((k) => (
                <div
                  key={k.label}
                  className="rounded-2xl border bg-white p-4 shadow-sm"
                >
                  <div className="text-sm text-muted-foreground">{k.label}</div>
                  <div className="mt-1 text-2xl font-bold text-slate-900">
                    {k.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{k.sub}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Table + Activity */}
          <section className="grid lg:grid-cols-3 gap-6">
            {/* Sensors table */}
            <div className="lg:col-span-2 rounded-2xl border bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">Vista rápida de sensores</div>
                  <div className="text-xs text-muted-foreground">
                    Últimos dispositivos con estado y acciones
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => goTo("/devices")}>
                    Ver todos
                  </Button>
                  <Button size="sm" onClick={addNew}>
                    + Agregar
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="text-left font-medium px-4 py-3">Nombre / ID</th>
                      <th className="text-left font-medium px-4 py-3">Estado</th>
                      <th className="text-left font-medium px-4 py-3">Último dato</th>
                      <th className="text-left font-medium px-4 py-3">Última actualización</th>
                      <th className="text-left font-medium px-4 py-3">Batería / RSSI</th>
                      <th className="text-right font-medium px-4 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensors.slice(0, 12).map((s) => (
                      <tr key={s.id} className="border-t">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{s.name}</div>
                          <div className="text-xs text-muted-foreground">{s.id}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full border ${
                              s.status === "online"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                s.status === "online" ? "bg-green-600" : "bg-red-600"
                              }`}
                            />
                            {s.status === "online" ? "Online" : "Offline"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-900">{s.last_value}</td>
                        <td className="px-4 py-3 text-muted-foreground">{s.last_seen}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          <div className="flex flex-col">
                            <span>{s.battery ?? "—"}</span>
                            <span className="text-xs">{s.rssi ?? "—"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => goTo(`/devices/${s.id}`)}>
                              Ver
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => goTo(`/devices/${s.id}/history`)}>
                              Histórico
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => goTo(`/devices/${s.id}/settings`)}>
                              Configurar
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => goTo(`/alerts?sensor=${s.id}`)}>
                              Silenciar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity panel */}
            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b">
                <div className="font-semibold text-slate-900">Actividad</div>
                <div className="text-xs text-muted-foreground">
                  Alertas y eventos recientes
                </div>

                {/* Filters */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={activityFilter === "todos" ? "default" : "outline"}
                    onClick={() => setActivityFilter("todos")}
                  >
                    Todos
                  </Button>
                  <Button
                    size="sm"
                    variant={activityFilter === "critico" ? "default" : "outline"}
                    onClick={() => setActivityFilter("critico")}
                  >
                    Crítico
                  </Button>
                  <Button
                    size="sm"
                    variant={activityFilter === "advertencia" ? "default" : "outline"}
                    onClick={() => setActivityFilter("advertencia")}
                  >
                    Advertencia
                  </Button>
                  <Button
                    size="sm"
                    variant={activityFilter === "info" ? "default" : "outline"}
                    onClick={() => setActivityFilter("info")}
                  >
                    Info
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {filteredActivity.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No hay eventos para este filtro.
                  </div>
                ) : (
                  filteredActivity.map((a) => (
                    <div key={a.id} className="rounded-xl border p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-slate-900">{a.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {a.meta}
                          </div>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full border ${levelBadge(
                            a.level
                          )}`}
                        >
                          {a.level === "critico"
                            ? "Crítico"
                            : a.level === "advertencia"
                            ? "Advertencia"
                            : "Info"}
                        </span>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => goTo("/alerts")}>
                          Ver alertas
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => goTo("/reports")}>
                          Reporte
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Charts (placeholders por ahora) */}
          <section className="grid lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="font-semibold text-slate-900">Serie temporal</div>
              <div className="text-xs text-muted-foreground mb-3">
                1–3 sensores favoritos
              </div>
              <div className="h-44 rounded-xl bg-slate-50 border flex items-center justify-center text-sm text-muted-foreground">
                Gráfica (placeholder)
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="font-semibold text-slate-900">Alertas por día</div>
              <div className="text-xs text-muted-foreground mb-3">
                Últimos 7/30 días
              </div>
              <div className="h-44 rounded-xl bg-slate-50 border flex items-center justify-center text-sm text-muted-foreground">
                Gráfica (placeholder)
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="font-semibold text-slate-900">Disponibilidad</div>
              <div className="text-xs text-muted-foreground mb-3">
                Gateways / sitios
              </div>
              <div className="h-44 rounded-xl bg-slate-50 border flex items-center justify-center text-sm text-muted-foreground">
                Gráfica (placeholder)
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
