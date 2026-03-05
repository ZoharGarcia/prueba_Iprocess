
export function TermsPage() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Términos y Condiciones
        </h1>

        <div className="space-y-6 text-secondary leading-relaxed">
          <p>
            Estos términos regulan el uso de la plataforma Proyecto X. Al
            utilizar nuestros servicios, aceptas cumplir con estas condiciones.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            1. Uso del servicio
          </h2>
          <p>
            El usuario se compromete a utilizar la plataforma de forma legal y
            conforme a las buenas prácticas técnicas.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            2. Responsabilidad
          </h2>
          <p>
            Proyecto X no se hace responsable por daños derivados de un uso
            indebido del sistema o configuraciones incorrectas realizadas por
            el usuario.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            3. Propiedad intelectual
          </h2>
          <p>
            Todo el contenido y software asociado a la plataforma es propiedad
            de Proyecto X o sus respectivos titulares.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            4. Modificaciones
          </h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier
            momento. Las actualizaciones serán publicadas en esta página.
          </p>
        </div>
      </div>
    </section>
  );
}