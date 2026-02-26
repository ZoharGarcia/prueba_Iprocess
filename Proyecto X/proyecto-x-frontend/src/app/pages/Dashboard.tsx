// src/pages/Dashboard.tsx
import { useMemo, useState } from "react";
import { Button } from "@/app/components/ui/button";

type Severity = "critical" | "high" | "medium" | "low";
type AlarmState = "active" | "acked" | "cleared";

type Alarm = {
  id: string;
  severity: Severity;
  state: AlarmState;
  tag: string;
  message: string;
  area: string;
  ts: string; // ISO
};

type DeviceStatus = "ok" | "warning" | "fault" | "offline";

type Device = {
  id: string;
  name: string;
  area: string;
  status: DeviceStatus;
  last_seen: string; // ISO
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("es-NI", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function severityLabel(sev: Severity) {
  switch (sev) {
    case "critical":
      return "Crítica";
    case "high":
      return "Alta";
    case "medium":
      return "Media";
    case "low":
      return "Baja";
  }
}

function severityPillClass(sev: Severity) {
  switch (sev) {
    case "critical":
      return "bg-red-600 text-white";
    case "high":
      return "bg-orange-600 text-white";
    case "medium":
      return "bg-amber-500 text-white";
    case "low":
      return "bg-slate-200 text-slate-700";
  }
}

function stateLabel(state: AlarmState) {
  switch (state) {
    case "active":
      return "Activa";
    case "acked":
      return "Reconocida";
    case "cleared":
      return "Normal";
  }
}

function statePillClass(state: AlarmState) {
  switch (state) {
    case "active":
      return "bg-red-50 text-red-700 border border-red-200";
    case "acked":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "cleared":
      return "bg-green-50 text-green-700 border border-green-200";
  }
}

function deviceStatusLabel(s: DeviceStatus) {
  switch (s) {
    case "ok":
      return "OK";
    case "warning":
      return "Advertencia";
    case "fault":
      return "Falla";
    case "offline":
      return "Offline";
  }
}

function deviceStatusClass(s: DeviceStatus) {
  switch (s) {
    case "ok":
      return "bg-green-50 border-green-200 text-green-800";
    case "warning":
      return "bg-amber-50 border-amber-200 text-amber-800";
    case "fault":
      return "bg-red-50 border-red-200 text-red-800";
    case "offline":
      return "bg-slate-100 border-slate-200 text-slate-700";
  }
}

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<"1h" | "8h" | "24h" | "7d">("8h");
  const [areaFilter, setAreaFilter] = useState<string>("Todos");
  const [search, setSearch] = useState("");

  // Datos mock (reemplazar por API)
  const alarms: Alarm[] = [
    {
      id: "ALM-1001",
      severity: "critical",
      state: "active",
      tag: "P-101.PRESS",
      message: "Presión alta fuera de rango",
      area: "Proceso",
      ts: new Date(Date.now() - 5 * 60_000).toISOString(),
    },
    {
      id: "ALM-1002",
      severity: "high",
      state: "acked",
      tag: "T-204.TEMP",
      message: "Temperatura elevada (reconocida)",
      area: "Horno",
      ts: new Date(Date.now() - 18 * 60_000).toISOString(),
    },
    {
      id: "ALM-1003",
      severity: "medium",
      state: "cleared",
      tag: "IO-M1.PORT3",
      message: "Desconexión momentánea de sensor",
      area: "Línea 1",
      ts: new Date(Date.now() - 55 * 60_000).toISOString(),
    },
  ];

  const devices: Device[] = [
    {
      id: "DEV-01",
      name: "IO-Link Master M1",
      area: "Línea 1",
      status: "ok",
      last_seen: new Date(Date.now() - 20_000).toISOString(),
    },
    {
      id: "DEV-02",
      name: "IO-Link Master M2",
      area: "Línea 2",
      status: "warning",
      last_seen: new Date(Date.now() - 90_000).toISOString(),
    },
    {
      id: "DEV-03",
      name: "PLC-01",
      area: "Proceso",
      status: "ok",
      last_seen: new Date(Date.now() - 12_000).toISOString(),
    },
    {
      id: "DEV-04",
      name: "Gateway SCADA",
      area: "Red",
      status: "offline",
      last_seen: new Date(Date.now() - 35 * 60_000).toISOString(),
    },
  ];

  const areas = useMemo(() => {
    const all = new Set<string>();
    alarms.forEach((a) => all.add(a.area));
    devices.forEach((d) => all.add(d.area));
    return ["Todos", ...Array.from(all).sort((a, b) => a.localeCompare(b))];
  }, [alarms, devices]);

  const filteredAlarms = useMemo(() => {
    const q = search.trim().toLowerCase();
    return alarms
      .filter((a) => (areaFilter === "Todos" ? true : a.area === areaFilter))
      .filter((a) => {
        if (!q) return true;
        return (
          a.id.toLowerCase().includes(q) ||
          a.tag.toLowerCase().includes(q) ||
          a.message.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
  }, [alarms, areaFilter, search]);

  const kpis = useMemo(() => {
    const active = alarms.filter((a) => a.state === "active").length;
    const warnings = alarms.filter((a) => a.severity === "medium" || a.severity === "low").length;
    const critical = alarms.filter((a) => a.severity === "critical").length;
    const onlineDevices = devices.filter((d) => d.status !== "offline").length;
    const availability =
      devices.length === 0 ? 0 : Math.round((onlineDevices / devices.length) * 100);

    return {
      activeAlarms: active,
      criticalAlarms: critical,
      warnings,
      devices: devices.length,
      availability,
    };
  }, [alarms, devices]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Vista operativa: alarmas, estado de equipos y tendencias (alineado a ISA-101).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <select
              className="h-10 rounded-xl border bg-white px-3 text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
            >
              <option value="1h">Última hora</option>
              <option value="8h">Últimas 8 horas</option>
              <option value="24h">Últimas 24 horas</option>
              <option value="7d">Últimos 7 días</option>
            </select>

            <select
              className="h-10 rounded-xl border bg-white px-3 text-sm"
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
            >
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>

            <Button variant="outline" onClick={() => { /* hook para refresh */ }}>
              Actualizar
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-xs text-muted-foreground">Alarmas activas</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{kpis.activeAlarms}</div>
            <div className="mt-1 text-xs text-muted-foreground">Ventana: {timeRange}</div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-xs text-muted-foreground">Críticas</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{kpis.criticalAlarms}</div>
            <div className="mt-1 text-xs text-muted-foreground">Prioridad máxima</div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-xs text-muted-foreground">Advertencias</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{kpis.warnings}</div>
            <div className="mt-1 text-xs text-muted-foreground">Baja/Media severidad</div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-xs text-muted-foreground">Dispositivos</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{kpis.devices}</div>
            <div className="mt-1 text-xs text-muted-foreground">Maestros IO-Link + PLC + gateway</div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-xs text-muted-foreground">Disponibilidad</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{kpis.availability}%</div>
            <div className="mt-1 text-xs text-muted-foreground">Online / total</div>
          </div>
        </section>

        {/* Grid principal */}
        <section className="grid gap-4 lg:grid-cols-3">
          {/* Alarm Center */}
          <div className="lg:col-span-2 rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-900">Centro de alarmas</div>
                <div className="text-xs text-muted-foreground">
                  Lista priorizada por severidad/tiempo (ISA-101: claridad y mínima distracción).
                </div>
              </div>

              <input
                className="h-10 w-full sm:w-72 rounded-xl border bg-white px-3 text-sm"
                placeholder="Buscar por ID, tag o mensaje…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground bg-slate-50">
                    <th className="px-5 py-3">Severidad</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3">Área</th>
                    <th className="px-5 py-3">Tag</th>
                    <th className="px-5 py-3">Mensaje</th>
                    <th className="px-5 py-3">Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlarms.length === 0 ? (
                    <tr>
                      <td className="px-5 py-6 text-sm text-muted-foreground" colSpan={6}>
                        No hay alarmas para los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredAlarms.map((a) => (
                      <tr key={a.id} className="border-t">
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${severityPillClass(a.severity)}`}>
                            {severityLabel(a.severity)}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${statePillClass(a.state)}`}>
                            {stateLabel(a.state)}
                          </span>
                        </td>
                        <td className="px-5 py-3">{a.area}</td>
                        <td className="px-5 py-3 font-mono text-xs text-slate-700">{a.tag}</td>
                        <td className="px-5 py-3 text-slate-900">{a.message}</td>
                        <td className="px-5 py-3 text-slate-700">{formatDateTime(a.ts)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-4 border-t flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">
                {filteredAlarms.length} alarmas visibles
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { /* ack */ }}>
                  Reconocer
                </Button>
                <Button variant="outline" onClick={() => { /* silence */ }}>
                  Silenciar
                </Button>
              </div>
            </div>
          </div>

          {/* Devices */}
          <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b">
              <div className="font-semibold text-slate-900">Estado de equipos</div>
              <div className="text-xs text-muted-foreground">
                Conectividad y salud por nodo (maestros IO-Link / PLC / gateway).
              </div>
            </div>

            <div className="p-5 grid gap-3">
              {devices.map((d) => (
                <div
                  key={d.id}
                  className={`rounded-2xl border p-4 ${deviceStatusClass(d.status)}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{d.name}</div>
                      <div className="text-xs opacity-80 mt-1">{d.area}</div>
                      <div className="text-xs opacity-80 mt-1">
                        Última señal: {formatDateTime(d.last_seen)}
                      </div>
                    </div>

                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold border bg-white/60">
                      {deviceStatusLabel(d.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 border-t">
              <Button className="w-full" variant="outline" onClick={() => { /* drilldown */ }}>
                Ver detalles
              </Button>
            </div>
          </div>
        </section>

        {/* Trends / Analytics */}
        <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b">
            <div className="font-semibold text-slate-900">Tendencias y análisis</div>
            <div className="text-xs text-muted-foreground">
              Históricos de variables (temperatura, presión, estados IO-Link) y métricas (OEE, downtime, alarm-rate).
            </div>
          </div>

          <div className="p-5">
            <div className="rounded-2xl border bg-slate-50 p-6 text-sm text-muted-foreground">
              Aquí va el gráfico de tendencias (Recharts) y/o tarjetas analíticas.
              <div className="mt-2 text-xs">
                Siguiente paso: definir variables, agregaciones (min/avg/max), y endpoint de series temporales.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}