import { Link } from "react-router-dom";

import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { Pricing } from "../components/Pricing";
import { Button } from "../components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Clock,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    icon: BarChart3,
    value: "0",
    label: "sensores activos",
    hint: "Conexión continua y lecturas estables",
  },
  {
    icon: Building2,
    value: "0",
    label: "empresas",
    hint: "Operación multi-área y multi-planta",
  },
  {
    icon: ShieldCheck,
    value: "0",
    label: "uptime",
    hint: "Alta disponibilidad para industria",
  },
  {
    icon: Clock,
    value: "0",
    label: "soporte",
    hint: "Acompañamiento cuando no puedes parar",
  },
];

const WHATSAPP_URL =
  "https://api.whatsapp.com/message/SKFMZLLTWXMKD1?autoload=1&app_absent=0";

export function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <Features />

      {/* Stats Section (adaptada al estilo) */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-white">
        {/* Subtle background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 right-[-6rem] h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,0,0,0.035),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,91,34,0.08),transparent_55%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white/70 shadow-sm backdrop-blur mb-4">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm font-medium text-foreground">
                Métricas de operación
              </span>
              <span className="text-xs text-secondary">•</span>
              <span className="text-sm text-secondary">
                Confiabilidad en producción
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
              Indicadores que importan en{" "}
              <span className="text-primary">entornos industriales</span>
            </h2>

            <p className="text-lg text-secondary leading-relaxed">
              Visibilidad y control para tomar decisiones más rápidas, reducir paros
              y operar con datos consistentes.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-border bg-white/70 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:scale-105">
                    <s.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-3xl font-bold text-foreground">
                      {s.value}
                    </div>
                    <div className="text-sm text-secondary">{s.label}</div>
                  </div>
                </div>

                <div className="mt-5 h-px w-full bg-border/70" />
                <p className="mt-4 text-xs text-secondary">{s.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Pricing />

      {/* CTA Section (adaptada) */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-white">
        {/* Subtle background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 right-[-6rem] h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(0,0,0,0.03),transparent_45%),radial-gradient(circle_at_80%_35%,rgba(255,91,34,0.10),transparent_55%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-white/70 shadow-sm backdrop-blur p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Left */}
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 shadow-sm backdrop-blur">
                  <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Prueba gratuita
                  </span>
                  <span className="text-xs text-secondary">•</span>
                  <span className="text-sm text-secondary">Sin tarjeta</span>
                </div>

                <h3 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                  Comienza tu prueba gratuita hoy
                </h3>

                <p className="text-lg text-secondary leading-relaxed">
                  14 días gratis. Configura alertas, dashboards y reportes en minutos.
                  Cancela cuando quieras.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Comenzar ahora -> /register */}
                  <Button asChild size="lg" className="group">
                    <Link to="/register">
                      Comenzar ahora
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>

                  {/* Agendar demo -> WhatsApp */}
                  <Button asChild size="lg" variant="outline" className="group">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Agendar demo
                    </a>
                  </Button>
                </div>

                <p className="text-sm text-secondary">
                  Ideal para pilotos: valida valor en una línea o área antes de escalar.
                </p>
              </div>

              {/* Right (mini trust panel) */}
              <div className="relative">
                <div className="rounded-3xl overflow-hidden border border-border bg-white shadow-2xl">
                  <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                    <div className="ml-3 text-xs text-secondary">
                      Implementación • Seguridad • Escalabilidad
                    </div>
                  </div>

                  <div className="p-6 lg:p-8 space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-border bg-white/70 p-4 shadow-sm backdrop-blur">
                        <div className="text-xs text-secondary">
                          Tiempo de puesta en marcha
                        </div>
                        <div className="mt-1 text-sm font-semibold text-foreground">
                          Rápido y guiado
                        </div>
                        <div className="mt-2 text-xs text-secondary">
                          Conecta y valida datos con una configuración simple.
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-white/70 p-4 shadow-sm backdrop-blur">
                        <div className="text-xs text-secondary">Seguridad</div>
                        <div className="mt-1 text-sm font-semibold text-foreground">
                          Control de acceso
                        </div>
                        <div className="mt-2 text-xs text-secondary">
                          Roles y permisos para equipos operativos.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-white/70 p-4 shadow-sm backdrop-blur">
                      <div className="text-xs uppercase tracking-wider text-secondary mb-3">
                        Áreas típicas
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["Mantenimiento", "Producción", "Calidad", "Energía", "HSE"].map(
                          (t) => (
                            <span
                              key={t}
                              className="rounded-full border border-border bg-white/70 px-3 py-1 text-sm text-foreground"
                            >
                              {t}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* small spacer */}
                <div className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
