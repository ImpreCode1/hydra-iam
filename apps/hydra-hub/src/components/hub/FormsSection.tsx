"use client"

import { ArrowUpRight } from "lucide-react"

interface Form {
  id: string
  title: string
  description: string
  url: string
}

const forms: Form[] = [
  {
    id: "1",
    title: "Mercadeo - Solicitud de Actividades",
    description: "Solicita nuevas actividades de marketing",
    url: "https://forms.office.com/pages/responsepage.aspx?id=MeJZQN6xpkCC73R_E2AAg1sWxx8m7MRHse-Fl4LbNYdUNllQS0JIWlJWQ0ZYRVRQNVZZR1ZGV1BJWi4u&route=shorturl",
  },
  {
    id: "2",
    title: "Cotizaciones de Marketing",
    description: "Solicita cotizaciones para campañas",
    url: "https://forms.office.com/pages/responsepage.aspx?id=MeJZQN6xpkCC73R_E2AAg1sWxx8m7MRHse-Fl4LbNYdUNzlETjE3VEZNSU9OTUJETFBTVDRPU0FMSy4u&route=shorturl",
  },
  {
    id: "3",
    title: "Solicitud de Permisos",
    description: "Solicita permisos laborales",
    url: "https://forms.office.com/pages/responsepage.aspx?id=MeJZQN6xpkCC73R_E2AAg1sWxx8m7MRHse-Fl4LbNYdUQlc3WDNMMlVFU0pRMUMyRVM1WUNPVlBGNS4u&route=shorturl",
  },
  {
    id: "4",
    title: "Cotización de Viaje",
    description: "Solicita cotización para viajes",
    url: "https://forms.office.com/pages/responsepage.aspx?id=MeJZQN6xpkCC73R_E2AAg1sWxx8m7MRHse-Fl4LbNYdUMVdRQjc4OU5XMEwzN0MwUzk5VEE3M1pJUy4u&route=shorturl",
  },
]

export function FormsSection() {
  return (
    <div className="mt-16 pt-12 border-t border-slate-200">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
          Formularios
        </h2>
        <p className="text-slate-600 mt-1">
          Accede rápidamente a los formularios de la empresa
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {forms.map((form) => (
          <a
            key={form.id}
            href={form.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col p-5 rounded-xl border border-slate-200 bg-white 
              shadow-sm transition-all duration-300 
              hover:shadow-lg hover:-translate-y-1 hover:border-blue-400/40"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 mb-4 
              group-hover:bg-blue-100 transition-colors">
              <img
                src="/logo_formularios.png"
                alt="Forms"
                className="w-8 h-8 object-contain"
              />
            </div>

            <h3 className="text-sm font-semibold text-slate-800 mb-1">
              {form.title}
            </h3>

            <p className="text-xs text-slate-500">
              {form.description}
            </p>

            <div className="mt-auto pt-4 flex items-center gap-1 text-xs font-medium text-blue-600 
              group-hover:text-blue-700 transition-colors">
              <span>Acceder</span>
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}