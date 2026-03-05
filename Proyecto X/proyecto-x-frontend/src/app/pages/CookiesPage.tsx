
export function CookiesPage() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Política de Cookies
        </h1>

        <div className="space-y-6 text-secondary leading-relaxed">
          <p>
            Utilizamos cookies para mejorar la experiencia del usuario y
            optimizar el rendimiento de nuestra plataforma.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            1. ¿Qué son las cookies?
          </h2>
          <p>
            Son pequeños archivos almacenados en tu dispositivo que permiten
            reconocer tu navegador y recordar información relevante.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            2. Tipos de cookies utilizadas
          </h2>
          <p>
            Podemos utilizar cookies técnicas, analíticas y de personalización
            para mejorar nuestros servicios.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            3. Gestión de cookies
          </h2>
          <p>
            Puedes configurar tu navegador para bloquear o eliminar cookies en
            cualquier momento.
          </p>
        </div>
      </div>
    </section>
  );
}