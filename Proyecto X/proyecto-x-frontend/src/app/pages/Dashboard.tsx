export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Alertas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          (Vacío por ahora)
        </p>

        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm text-sm text-muted-foreground">
          Aquí irá el centro de alertas, reglas, severidad y actividad.
        </div>
      </div>
    </div>
  );
}