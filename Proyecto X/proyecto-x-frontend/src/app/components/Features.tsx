import {
  Activity,
  Bell,
  BarChart3,
  Lock,
  Zap,
  Cloud,
  Check,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const features = [
  {
    icon: Activity,
    title: "Monitoreo en tiempo real",
    description:
      "Visualiza señales de sensores con actualización continua y contexto operativo en vivo.",
  },
  {
    icon: Bell,
    title: "Alertas inteligentes",
    description:
      "Notificaciones por umbrales y reglas para actuar antes de que ocurra una falla.",
  },
  {
    icon: BarChart3,
    title: "Analytics avanzado",
    description:
      "Tendencias históricas, comparativos y reportes para mejorar rendimiento y mantenimiento.",
  },
  {
    icon: Lock,
    title: "Seguridad empresarial",
    description:
      "Cifrado, control de acceso y prácticas alineadas a entornos industriales.",
  },
  {
    icon: Zap,
    title: "Integración rápida",
    description:
      "Conecta dispositivos con soporte para protocolos estándar y configuración ágil.",
  },
  {
    icon: Cloud,
    title: "Infraestructura cloud",
    description:
      "Escala bajo demanda y accede desde cualquier dispositivo con alta disponibilidad.",
  },
];

const highlights = [
  {
    title: "Dashboard personalizable",
    desc: "Crea vistas por áreas: mantenimiento, producción y calidad.",
  },
  {
    title: "API completa",
    desc: "Integra con tus sistemas existentes y automatiza flujos.",
  },
  {
    title: "Soporte 24/7",
    desc: "Acompañamiento técnico cuando el proceso no puede parar.",
  },
];

export function Features() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-32">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 right-[-6rem] h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(0,0,0,0.035),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,91,34,0.08),transparent_55%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white/70 shadow-sm backdrop-blur mb-4">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-foreground">
              Características
            </span>
            <span className="text-xs text-secondary">•</span>
            <span className="text-sm text-secondary">Operación y confiabilidad</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-5">
            Todo lo que necesitas para{" "}
            <span className="text-primary">monitorear</span> tu industria
          </h2>

          <p className="text-lg lg:text-xl text-secondary leading-relaxed">
            Plataforma completa para capturar, visualizar y accionar datos de sensores
            sin fricción.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border bg-white/70 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:scale-105">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* subtle divider */}
              <div className="mt-5 h-px w-full bg-border/70" />

              {/* micro-copy */}
              <p className="mt-4 text-xs text-secondary">
                Diseñado para entornos industriales: claridad, velocidad y control.
              </p>
            </div>
          ))}
        </div>

        {/* Feature Image Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden border border-border bg-white shadow-2xl">
              {/* mock header */}
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                <div className="ml-3 text-xs text-secondary">
                  Automatización • Control • Insights
                </div>
              </div>

              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1717386255773-1e3037c81788?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWN0b3J5JTIwYXV0b21hdGlvbiUyMGNvbnRyb2x8ZW58MXx8fHwxNzcwOTExMjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Control de Automatización Industrial"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />
              </div>
            </div>

            {/* floating KPI */}
            <div className="absolute -bottom-6 left-6 rounded-2xl border border-border bg-white/90 p-4 shadow-lg backdrop-blur">
              <div className="text-xs text-secondary">KPI</div>
              <div className="mt-1 text-sm font-semibold text-foreground">
                Disponibilidad operacional
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs text-secondary">Estable • sin alertas críticas</span>
              </div>
            </div>

            <div className="h-10" />
          </div>

          <div className="space-y-6">
            <h3 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Potencia tu producción con datos en tiempo real
            </h3>

            <p className="text-lg text-secondary leading-relaxed">
              Proyecto X te ayuda a detectar desviaciones, anticipar fallas y mejorar
              la eficiencia. Menos tiempo de inactividad, más control y decisiones más rápidas.
            </p>

            <div className="grid sm:grid-cols-1 gap-4">
              {highlights.map((h, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-white/70 p-4 shadow-sm backdrop-blur"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{h.title}</div>
                      <div className="text-sm text-secondary">{h.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* optional note */}
            <p className="text-sm text-secondary">
              Compatible con crecimiento: desde pilotos hasta operación multi-planta.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}