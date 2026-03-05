export function PrivacyPage() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Política de Privacidad
        </h1>

        <div className="space-y-6 text-secondary leading-relaxed">
          <p>
            En Proyecto X valoramos tu privacidad. Esta política describe cómo
            recopilamos, usamos y protegemos tu información cuando utilizas
            nuestra plataforma.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            1. Información que recopilamos
          </h2>
          <p>
            Podemos recopilar información como nombre, correo electrónico,
            datos de uso de la plataforma y métricas técnicas necesarias para
            el funcionamiento del sistema.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            2. Uso de la información
          </h2>
          <p>
            Utilizamos la información para operar, mejorar y asegurar la
            plataforma, así como para brindar soporte técnico.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            3. Protección de datos
          </h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas para
            proteger la información contra accesos no autorizados.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            4. Contacto
          </h2>
          <p>
            Si tienes preguntas sobre esta política, puedes contactarnos a
            través de nuestros canales oficiales.
          </p>
        </div>
      </div>
    </section>
  );
}