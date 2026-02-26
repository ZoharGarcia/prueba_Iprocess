import {
  ClipboardList,
  DraftingCompass,
  Wrench,
  PlayCircle,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Link } from "react-router-dom";

export function WorkProcessSection() {
  const steps = [
    {
      id: "01",
      title: "Diagnóstico técnico",
      description:
        "Levantamiento en sitio, análisis de riesgos, alcance y objetivos. Definimos entregables y roadmap.",
      icon: ClipboardList,
    },
    {
      id: "02",
      title: "Diseño e ingeniería",
      description:
        "Arquitectura OT/IT, ingeniería de detalle, planos, lista de materiales y especificaciones técnicas.",
      icon: DraftingCompass,
    },
    {
      id: "03",
      title: "Implementación",
      description:
        "Integración de sistemas, montaje, cableado y programación. Control de calidad y pruebas internas.",
      icon: Wrench,
    },
    {
      id: "04",
      title: "Puesta en marcha",
      description:
        "Pruebas FAT/SAT, comisionamiento, validación en producción y capacitación al equipo operativo.",
      icon: PlayCircle,
    },
    {
      id: "05",
      title: "Soporte post-proyecto",
      description:
        "Soporte 24/7 (según contrato), mantenimiento, mejoras evolutivas y acompañamiento continuo.",
      icon: Headphones,
    },
  ];

  return (
    <section id="proceso" className="relative py-24 overflow-hidden">
      {/* Soft background accents */}
      <div className="absolute -top-24 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute -bottom-24 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-primary/10 border-2 border-primary/20 shadow-lg backdrop-blur-sm"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">
              Metodología clara, ejecución controlada
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl sm:text-5xl font-bold leading-tight"
          >
            <span className="text-foreground">Nuestro</span>{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-orange-dark bg-clip-text text-transparent">
              proceso
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Así reducimos fricción y riesgo: un flujo de trabajo estándar para
            entregar proyectos de automatización con trazabilidad y soporte.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-2 bottom-2 w-px bg-border/70 hidden sm:block" />

            <div className="space-y-5">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: idx * 0.03 }}
                  className="group relative"
                >
                  <div className="relative flex gap-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-lg p-5 hover:bg-primary/5 transition-colors">
                    {/* Left marker */}
                    <div className="hidden sm:flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-md">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="mt-2 text-xs font-semibold text-muted-foreground">
                        {step.id}
                      </div>
                    </div>

                    {/* Mobile icon */}
                    <div className="sm:hidden w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-md">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xl font-bold text-foreground">
                          {step.title}
                        </h3>
                        <span className="hidden sm:inline-flex text-xs font-semibold px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground">
                          Paso {step.id}
                        </span>
                      </div>
                      <p className="mt-2 text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>

                      {/* Subtle hover accent */}
                      <div className="mt-4 h-px bg-border/60" />
                      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-primary/70" />
                        <span className="group-hover:text-foreground transition-colors">
                          Enfoque: calidad, seguridad y continuidad operativa
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA / Trust card */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-2xl opacity-40 pointer-events-none" />
            <div className="relative rounded-3xl border border-border bg-card/70 backdrop-blur-sm shadow-xl p-8 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  ¿Tienes un proyecto en mente?
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Agenda una sesión técnica. Te ayudamos a definir alcance,
                  estimación y próximos pasos con claridad.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border bg-background/40 p-4">
                    <div className="text-sm font-semibold text-foreground">
                      Respuesta rápida
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Coordinación de visita o llamada técnica.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/40 p-4">
                    <div className="text-sm font-semibold text-foreground">
                      Enfoque industrial
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      OT/IT, control, potencia y continuidad.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/40 p-4">
                    <div className="text-sm font-semibold text-foreground">
                      Entregables claros
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Ingeniería, documentación y soporte.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/40 p-4">
                    <div className="text-sm font-semibold text-foreground">
                      Soporte post-proyecto
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Continuidad operativa asegurada.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group px-8"
                >
                  <Link to="/contacto">
                    Solicitar diagnóstico
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-2 border-foreground/20 hover:border-primary hover:bg-primary/5 px-8 shadow-lg"
                >
                  <Link to="/servicios">Ver servicios</Link>
                </Button>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}