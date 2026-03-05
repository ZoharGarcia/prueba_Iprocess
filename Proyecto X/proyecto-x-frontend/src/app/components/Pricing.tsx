import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "./ui/button";

const plans = [
  {
    name: "Individual Básico",
    price: "$-",
    period: "/mes",
    description: "Ideal para uso personal o pruebas en un solo usuario.",
    features: [
      "1 usuario",
      "Hasta 3 dispositivos",
      "Monitoreo en tiempo real",
      "Dashboard básico",
      "Soporte por email",
    ],
    highlighted: false,
    cta: "Probar Gratis",
  },
  {
    name: "Empresa Pro",
    price: "$-",
    period: "/mes",
    description: "Para equipos y operaciones pequeñas/medianas con más capacidad.",
    features: [
      "Hasta 10 usuarios",
      "Hasta 50 dispositivos",
      "Monitoreo en tiempo real",
      "Alertas por email",
      "Dashboard avanzado",
      "Soporte prioritario",
    ],
    highlighted: true,
    cta: "Comenzar Ahora",
  },
];

export function Pricing() {
  return (
    <section className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#ff5b22]/10 rounded-full mb-4">
            <span className="text-sm text-primary">Precios</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Planes que escalan con tu <span className="text-primary">negocio</span>
          </h2>
          <p className="text-xl text-secondary">
            Elige el plan perfecto para tus necesidades. Todos incluyen prueba gratuita
            de 14 días.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 ${
                plan.highlighted
                  ? "border-2 border-primary shadow-2xl scale-105 z-10"
                  : "border border-border shadow-lg"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-sm rounded-full">
                  Recomendado
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-secondary text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-secondary ml-2">{plan.period}</span>
                </div>
              </div>

              {/* CTA -> /mi-plan (para ambos) */}
              <Button
                asChild
                className="w-full mb-6"
                variant={plan.highlighted ? "default" : "outline"}
                size="lg"
              >
                <Link to="/mi-plan">{plan.cta}</Link>
              </Button>

              <div className="space-y-4">
                <div className="text-sm font-bold text-foreground mb-3">
                  Incluye:
                </div>

                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? "bg-primary" : "bg-[#a3a2a2]"
                      }`}
                    >
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Section */}
        <div className="mt-16 text-center">
          <div className="bg-white border border-border rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              ¿Necesitas un plan a medida?
            </h3>
            <p className="text-secondary mb-6">
              Podemos ofrecer precios por volumen, límites personalizados de usuarios/dispositivos
              y soporte dedicado.
            </p>

            {/* WhatsApp */}
            <Button asChild size="lg" variant="outline">
              <a
                href="https://api.whatsapp.com/message/SKFMZLLTWXMKD1?autoload=1&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contactar Ventas
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}