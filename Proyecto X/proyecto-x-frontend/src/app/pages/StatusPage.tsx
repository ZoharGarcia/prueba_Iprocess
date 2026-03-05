import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000/api/system-status";

export function StatusPage() {
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<string | null>(null);

  const loadStatus = async () => {
    setLoading(true);

    try {
      const res = await fetch(API, { headers: { Accept: "application/json" } });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setIsOnline(true);
      setIsActive(Boolean(data.is_active));
      setLastCheck(new Date().toLocaleTimeString());
    } catch {
      setIsOnline(false);
      setIsActive(null);
      setLastCheck(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    const id = setInterval(loadStatus, 15000);
    return () => clearInterval(id);
  }, []);

  // Estilos dinámicos
  const dotColor =
    isOnline === false
      ? "bg-gray-400"
      : isActive
      ? "bg-green-500"
      : "bg-red-500";

  const statusTitle =
    isOnline === false
      ? "Servicio no disponible"
      : isActive
      ? "Sistema Operando con Normalidad"
      : "Interrupción del Servicio";

  const statusMessage =
    isOnline === false
      ? "En este momento no es posible verificar el estado del sistema. Intente nuevamente en unos minutos."
      : isActive
      ? "Todos los servicios están funcionando correctamente."
      : "Estamos experimentando una interrupción temporal. Nuestro equipo ya está trabajando para restablecer el servicio.";

  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-6">
          Estado del Servicio
        </h1>

        <div className="rounded-2xl border p-10 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span
              className={`h-3 w-3 rounded-full ${dotColor} ${
                loading ? "animate-pulse" : ""
              }`}
            />
            <span className="text-lg font-semibold">
              {loading ? "Verificando estado..." : statusTitle}
            </span>
          </div>

          {!loading && (
            <p className="text-secondary text-sm max-w-xl mx-auto">
              {statusMessage}
            </p>
          )}

          {lastCheck && (
            <p className="text-xs text-gray-400 mt-6">
              Última actualización: {lastCheck}
            </p>
          )}

          <button
            onClick={loadStatus}
            disabled={loading}
            className={`mt-8 px-6 py-2 rounded-lg text-white transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Actualizando..." : "Actualizar estado"}
          </button>
        </div>
      </div>
    </section>
  );
}