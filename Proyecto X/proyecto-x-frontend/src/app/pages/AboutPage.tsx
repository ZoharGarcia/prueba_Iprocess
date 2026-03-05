
export function AboutPage() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Acerca de Proyecto X
        </h1>

        <div className="space-y-6 text-secondary leading-relaxed">
          <p>
            Proyecto X es una plataforma de monitoreo inteligente diseñada
            para entornos industriales modernos.
          </p>

          <p>
            Nuestra misión es brindar visibilidad en tiempo real,
            reducir tiempos de inactividad y permitir decisiones basadas en datos.
          </p>

          <p>
            Trabajamos con equipos de mantenimiento, producción y energía
            para optimizar operaciones críticas.
          </p>
        </div>
      </div>
    </section>
  );
}