import { useEffect, useMemo, useState } from "react";
import { Button } from "@/app/components/ui/button"; // ✅ deja esto solo si existe en tu proyecto
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return typeof baseUrl === "string" ? baseUrl.replace(/\/$/, "") : "";
}

type SettingsForm = {
  timezone: string;
  language: "es" | "en";
  notif_email: boolean;
  notif_push: boolean;
  notif_critical_only: boolean;
};

type MeResponse = {
  id?: number;
  name?: string;
  email?: string;
  plan_expires_at?: string | null;
  days_left?: number | null;
  is_subscription_active?: boolean | null;
  server_now?: string;
  app_timezone?: string;
};

export default function Settings() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const apiBase = useMemo(() => getApiBaseUrl(), []);

  const token =
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

  const [saving, setSaving] = useState(false);

  const [meLoading, setMeLoading] = useState(false);
  const [me, setMe] = useState<MeResponse | null>(null);

  const [form, setForm] = useState<SettingsForm>({
    timezone: "America/Managua",
    language: "es",
    notif_email: true,
    notif_push: false,
    notif_critical_only: true,
  });

  function set<K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ✅ Cargar /me (para mostrar nombre/correo en Settings)
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
            logout?.();
            navigate("/login", { replace: true });
          }
          return;
        }

        const data = (await res.json()) as MeResponse;
        if (!cancelled) setMe(data);
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
  }, [isAuthenticated, token, apiBase, navigate, logout]);

  async function onSave() {
    setSaving(true);
    try {
      // TODO: conectar con tu API real (ej: POST /settings)
      // await fetch(`${apiBase}/settings`, { method: "POST", ... })
      await new Promise((r) => setTimeout(r, 600));
    } finally {
      setSaving(false);
    }
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="rounded-2xl border bg-white p-6 shadow-sm max-w-md w-full">
          <div className="text-lg font-semibold text-slate-900">Acceso restringido</div>
          <div className="text-sm text-muted-foreground mt-1">
            Inicia sesión para ver configuración.
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => navigate("/login")}>Ir a Login</Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
            <p className="text-sm text-muted-foreground">
              Preferencias de cuenta, notificaciones e integraciones.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Atrás
            </Button>
            <Button onClick={onSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Izquierda */}
          <div className="lg:col-span-2 space-y-6">
            {/* Perfil */}
            <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b">
                <div className="font-semibold text-slate-900">Perfil</div>
                <div className="text-xs text-muted-foreground">
                  Datos básicos de tu cuenta.
                </div>
              </div>

              <div className="p-5 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Nombre</label>
                  <div className="mt-1 rounded-xl border bg-slate-50 px-3 py-2 text-sm">
                    {meLoading ? "Cargando..." : me?.name || "—"}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Correo</label>
                  <div className="mt-1 rounded-xl border bg-slate-50 px-3 py-2 text-sm">
                    {meLoading ? "Cargando..." : me?.email || "—"}
                  </div>
                </div>

                <div className="sm:col-span-2 flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => navigate("/profile")}>
                    Ir a perfil
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/change-password")}>
                    Cambiar contraseña
                  </Button>
                </div>
              </div>
            </section>

            {/* Preferencias */}
            <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b">
                <div className="font-semibold text-slate-900">Preferencias</div>
                <div className="text-xs text-muted-foreground">
                  Zona horaria e idioma.
                </div>
              </div>

              <div className="p-5 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Zona horaria</label>
                  <select
                    className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                    value={form.timezone}
                    onChange={(e) => set("timezone", e.target.value)}
                  >
                    <option value="America/Managua">America/Managua (UTC-06)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/Mexico_City">America/Mexico_City</option>
                    <option value="America/Bogota">America/Bogota</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Idioma</label>
                  <select
                    className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                    value={form.language}
                    onChange={(e) => set("language", e.target.value as SettingsForm["language"])}
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Notificaciones */}
            <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b">
                <div className="font-semibold text-slate-900">Notificaciones</div>
                <div className="text-xs text-muted-foreground">
                  Controla alertas por email/push.
                </div>
              </div>

              <div className="p-5 space-y-4">
                <ToggleRow
                  title="Email"
                  desc="Recibe alertas y reportes por correo."
                  value={form.notif_email}
                  onChange={(v) => set("notif_email", v)}
                />
                <ToggleRow
                  title="Push"
                  desc="Notificaciones en el navegador (si aplica)."
                  value={form.notif_push}
                  onChange={(v) => set("notif_push", v)}
                />
                <ToggleRow
                  title="Solo críticas"
                  desc="Reduce ruido: solo alertas críticas."
                  value={form.notif_critical_only}
                  onChange={(v) => set("notif_critical_only", v)}
                />
              </div>
            </section>
          </div>

          {/* Derecha */}
          <aside className="space-y-6">
            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b">
                <div className="font-semibold text-slate-900">Integración</div>
                <div className="text-xs text-muted-foreground">
                  Información del entorno.
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground">API Base URL</div>
                  <div className="mt-1 flex gap-2">
                    <div className="flex-1 rounded-xl border bg-slate-50 px-3 py-2 text-xs break-all">
                      {apiBase || "— (VITE_API_BASE_URL vacío)"}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copy(apiBase)}
                      disabled={!apiBase}
                    >
                      Copiar
                    </Button>
                  </div>
                </div>

                {/* debug opcional */}
                <div className="text-xs text-muted-foreground">
                  TZ app: {me?.app_timezone || "—"} • Server now: {me?.server_now || "—"}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b">
                <div className="font-semibold text-slate-900">Acciones rápidas</div>
                <div className="text-xs text-muted-foreground">Atajos frecuentes.</div>
              </div>

              <div className="p-5 flex flex-col gap-2">
                <Button variant="outline" onClick={() => navigate("/devices/new")}>
                  + Agregar dispositivo
                </Button>
                <Button variant="outline" onClick={() => navigate("/alerts/new")}>
                  + Crear regla de alerta
                </Button>
                <Button variant="outline" onClick={() => navigate("/reports")}>
                  Ver reportes
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  title,
  desc,
  value,
  onChange,
}: {
  title: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border p-4">
      <div>
        <div className="text-sm font-medium text-slate-900">{title}</div>
        <div className="text-xs text-muted-foreground mt-1">{desc}</div>
      </div>

      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`h-7 w-12 rounded-full border transition flex items-center px-1 ${
          value ? "bg-slate-900" : "bg-slate-200"
        }`}
        aria-pressed={value}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white transition ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
