export function SecurityPage() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-6">
          Seguridad
        </h1>

        <div className="space-y-6 text-secondary leading-relaxed">
          <p>
            La seguridad es una prioridad fundamental en Proyecto X.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            Cifrado
          </h2>
          <p>
            Toda la información transmitida está protegida mediante protocolos
            de cifrado estándar de la industria.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            Control de acceso
          </h2>
          <p>
            Implementamos autenticación segura y gestión de roles para proteger
            los datos sensibles.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            Infraestructura
          </h2>
          <p>
            Nuestra infraestructura está diseñada para alta disponibilidad y
            resiliencia operativa.
          </p>
        </div>
      </div>
    </section>
  );
}