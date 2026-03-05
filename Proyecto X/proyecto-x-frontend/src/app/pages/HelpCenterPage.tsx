

export function HelpCenterPage() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-6">
          Centro de Ayuda
        </h1>

        <p className="text-secondary mb-10">
          Encuentra guías, preguntas frecuentes y recursos para aprovechar al
          máximo Proyecto X.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-2">
              Primeros pasos
            </h3>
            <p className="text-sm text-secondary">
              Aprende cómo configurar tu cuenta y conectar tus dispositivos.
            </p>
          </div>

          <div className="rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-2">
              Gestión de alertas
            </h3>
            <p className="text-sm text-secondary">
              Configura notificaciones y reglas inteligentes.
            </p>
          </div>

          <div className="rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-2">
              Reportes y análisis
            </h3>
            <p className="text-sm text-secondary">
              Genera informes y exporta datos históricos.
            </p>
          </div>

          <div className="rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-2">
              Contactar soporte
            </h3>
            <p className="text-sm text-secondary">
              ¿Necesitas ayuda directa? Nuestro equipo está disponible 24/7.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}