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
    <div className="mt-8 pt-8 border-t border-slate-200">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Formularios
        </h2>
        <p className="text-slate-600 mt-1 text-sm">
          Accede rápidamente a los formularios de la empresa
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {forms.map((form) => (
          <a
            key={form.id}
            href={form.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl border border-slate-200 bg-white 
              shadow-sm transition-all duration-300 
              hover:shadow-lg hover:-translate-y-1 hover:border-blue-400/40"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 shrink-0
              group-hover:bg-blue-100 transition-colors self-center sm:self-start">
              <img
                src="/logo_formularios.png"
                alt="Forms"
                className="w-5 h-5 object-contain"
              />
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h3 className="text-sm font-semibold text-slate-800">
                {form.title}
              </h3>

              <p className="text-xs text-slate-500">
                {form.description}
              </p>
            </div>

            <ArrowUpRight className="w-4 h-4 text-blue-600 shrink-0 self-center 
              group-hover:text-blue-700 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  )
}