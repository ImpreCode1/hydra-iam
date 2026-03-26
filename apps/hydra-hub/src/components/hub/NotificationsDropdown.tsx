import { Bell } from "lucide-react"; // Importamos el icono profesional

export function NotificationsDropdown() {
  const notifications = [
    "Tu acceso a BI fue aprobado",
    "Nueva plataforma disponible: Finance",
    "Actualización del sistema CRM",
  ];

  return (
    <div className="dropdown dropdown-end">
      {/* BOTÓN CON ICONO Y BADGE */}
      <label tabIndex={0} className="btn btn-ghost btn-circle relative">
        <Bell className="h-5 w-5 text-zinc-300" />
        {notifications.length > 0 && (
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </label>

      {/* CONTENIDO DEL DROPDOWN */}
      <div
        tabIndex={0}
        className="dropdown-content mt-3 z-[1] w-80 card bg-white text-zinc-800 shadow-xl border border-zinc-200"
      >
        <div className="card-body p-4">
          <div className="flex items-center justify-between border-b pb-2 mb-2">
            <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-500">
              Notificaciones
            </h3>
            <span className="text-xs bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-600">
              {notifications.length} nuevas
            </span>
          </div>

          <ul className="space-y-1">
            {notifications.map((n, i) => (
              <li 
                key={i} 
                className="text-sm p-2 rounded-md hover:bg-zinc-50 transition-colors cursor-pointer border-b border-zinc-50 last:border-0"
              >
                <p className="text-zinc-700 leading-tight">{n}</p>
                <span className="text-[10px] text-zinc-400">Hace un momento</span>
              </li>
            ))}
          </ul>
          
          <button className="btn btn-sm btn-ghost mt-2 text-primary no-underline text-xs">
            Ver todas las notificaciones
          </button>
        </div>
      </div>
    </div>
  );
}