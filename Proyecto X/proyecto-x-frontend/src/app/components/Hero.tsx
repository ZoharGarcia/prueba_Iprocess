import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, Play, ShieldCheck, Zap, Activity } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 right-[-6rem] h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,0,0,0.04),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,91,34,0.08),transparent_50%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 shadow-sm backdrop-blur">
              <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm font-medium text-foreground">
                Monitoreo en tiempo real
              </span>
              <span className="text-xs text-secondary">•</span>
              <span className="text-sm text-secondary">Alertas y analytics</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-foreground">
                Monitoreo inteligente para{" "}
                <span className="text-primary">sensores industriales</span>
              </h1>
              <p className="text-lg lg:text-xl text-secondary leading-relaxed max-w-xl">
                Centraliza datos, detecta anomalías y recibe alertas accionables.
                Reduce paros, optimiza mantenimiento y toma decisiones con datos
                confiables.
              </p>
            </div>

            {/* Value props */}
            <div className="grid sm:grid-cols-3 gap-3 max-w-xl">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-white/70 px-3 py-2 backdrop-blur">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">Alertas instantáneas</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-white/70 px-3 py-2 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">Datos seguros</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-white/70 px-3 py-2 backdrop-blur">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">KPIs en vivo</span>
              </div>
            </div>

            {/* CTAs */}
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
                  href="https://api.whatsapp.com/message/SKFMZLLTWXMKD1?autoload=1&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Play className="mr-2 h-5 w-5 inline-block" />
                  Agendar demo
                </a>
              </Button>
            </div>

            {/* Trust row */}
            <div className="pt-6">
              <div className="text-xs uppercase tracking-wider text-secondary mb-3">
                Confiado por equipos de mantenimiento y operaciones
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

            {/* Metrics */}
            <div className="grid sm:grid-cols-3 gap-4 pt-6 max-w-xl">
              <div className="rounded-2xl border border-border bg-white/70 p-4 shadow-sm backdrop-blur">
                <div className="text-2xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-secondary">sensores monitoreados</div>
              </div>
              <div className="rounded-2xl border border-border bg-white/70 p-4 shadow-sm backdrop-blur">
                <div className="text-2xl font-bold text-foreground">99.9%</div>
                <div className="text-sm text-secondary">uptime</div>
              </div>
              <div className="rounded-2xl border border-border bg-white/70 p-4 shadow-sm backdrop-blur">
                <div className="text-2xl font-bold text-foreground">500+</div>
                <div className="text-sm text-secondary">empresas</div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-2xl">
              {/* Mock top bar */}
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                <div className="ml-3 text-xs text-secondary">
                  Dashboard • Tiempo real
                </div>
              </div>

              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1714322148068-923f9f9bfc1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwc2Vuc29ycyUyMG1vbml0b3JpbmclMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzcwOTExMjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Dashboard de Monitoreo Industrial"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />
              </div>
            </div>

            {/* Floating insights */}
            <div className="absolute -bottom-6 left-6 right-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-white/90 p-4 shadow-lg backdrop-blur">
                <div className="text-xs text-secondary">Estado</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <div className="text-sm font-semibold text-foreground">
                    Operación estable
                  </div>
                </div>
                <div className="mt-2 text-xs text-secondary">
                  Sin alertas críticas en los últimos 60 min.
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white/90 p-4 shadow-lg backdrop-blur">
                <div className="text-xs text-secondary">Alertas</div>
                <div className="mt-1 text-sm font-semibold text-foreground">
                  Notificación 24/7
                </div>
                <div className="mt-2 text-xs text-secondary">
                  Email y canales configurables según plan.
                </div>
              </div>
            </div>

            {/* Spacer for floating cards */}
            <div className="h-16" />
          </div>
        </div>
      </div>
    </section>
  );
}