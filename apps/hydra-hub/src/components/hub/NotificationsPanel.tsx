export function NotificationsPanel() {

  const notifications = [
    "Tu acceso a BI fue aprobado",
    "Nueva plataforma disponible: Finance",
    "Actualización del sistema CRM"
  ]

  return (

    <div className="card bg-base-200 shadow-md h-fit">

      <div className="card-body">

        <h2 className="card-title text-lg">
          Notificaciones
        </h2>

        <ul className="space-y-3 mt-2 text-sm">

          {notifications.map((n, i) => (
            <li
              key={i}
              className="p-2 rounded-lg hover:bg-base-300 transition"
            >
              • {n}
            </li>
          ))}

        </ul>

      </div>

    </div>

  )
}