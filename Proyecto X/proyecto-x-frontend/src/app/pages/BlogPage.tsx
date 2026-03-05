
export function BlogPage() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-6">
          Blog
        </h1>

        <p className="text-secondary mb-8">
          Próximamente compartiremos artículos sobre monitoreo industrial,
          IoT, mantenimiento predictivo y optimización operativa.
        </p>

        <div className="rounded-2xl border border-border p-8 bg-white/70 shadow-sm">
          <p className="text-sm text-secondary">
            🚧 Contenido en preparación
          </p>
        </div>
      </div>
    </section>
  );
}