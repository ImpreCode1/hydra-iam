"use client"

import { useEffect, useState } from "react"
import { getExternalSitesActive, ExternalSite } from "@/modules/sites/api"
import { ExternalLink, X, ChevronUp, LayoutGrid } from "lucide-react"

export function ExternalSitesFab() {
  const [sites, setSites] = useState<ExternalSite[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    async function loadSites() {
      try {
        const data = await getExternalSitesActive()
        setSites(data)
      } catch (error) {
        console.error("Error cargando sitios", error)
      } finally {
        setLoading(false)
      }
    }

    loadSites()
  }, [])

  if (sites.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen && (
        <div className="absolute bottom-14 right-0 bg-white rounded-xl shadow-xl border border-slate-200 w-72 max-h-96 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-slate-200">
            <span className="font-medium text-sm text-slate-900">Sitios Externos</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <p className="p-3 text-sm text-slate-500">Cargando...</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {sites.map((site) => (
                  <a
                    key={site.id}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {site.logoUrl ? (
                        <img
                          src={site.logoUrl}
                          className="w-full h-full object-contain"
                          alt={site.name}
                        />
                      ) : (
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {site.name}
                      </p>
                      {site.description && (
                        <p className="text-xs text-slate-500 truncate">{site.description}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 text-white 
                 rounded-full shadow-xl hover:shadow-2xl hover:from-blue-400 hover:to-blue-600
                 transition-all duration-300 flex items-center justify-center
                 hover:scale-110 active:scale-95"
      >
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold 
                      rounded-full flex items-center justify-center">
          {sites.length}
        </span>
        {isOpen ? (
          <ChevronUp className="w-7 h-7" />
        ) : (
          <LayoutGrid className="w-7 h-7" />
        )}
      </button>
    </div>
  )
}