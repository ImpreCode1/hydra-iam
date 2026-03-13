import { ExternalLink } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  description: string;
  image: string;
}

export function PlatformCard({ platform }: { platform: Platform }) {
  return (
    <div className="card bg-white w-96 border border-zinc-200 shadow-sm transition-all duration-300 hover:border-indigo-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 group">
      
      {/* FIGURE: Contenedor de la imagen/logo */}
      <figure className="px-10 pt-10">
        <div className="w-20 h-20 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center p-4 transition-colors group-hover:bg-indigo-50/50 group-hover:border-indigo-100">
          <img
            src={platform.image} // O usa {platform.image} si viene del objeto
            alt={platform.name}
            className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all"
          />
        </div>
      </figure>

      {/* CARD BODY: Texto y contenido centralizado */}
      <div className="card-body items-center text-center">
        <div className="flex items-center gap-2">
          <h2 className="card-title text-zinc-900 font-bold tracking-tight">
            {platform.name}
          </h2>
          <ExternalLink size={16} className="text-zinc-300 group-hover:text-indigo-500 transition-colors" />
        </div>
        
        <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
          {platform.description}
        </p>

        {/* CARD ACTIONS: El botón principal */}
        <div className="card-actions w-full mt-4">
          <button className="btn bg-zinc-900 hover:bg-indigo-600 text-white border-none w-full normal-case font-medium transition-all active:scale-95">
            Ingresar a la plataforma
          </button>
        </div>
      </div>

      {/* DECORACIÓN SUTIL DE FONDO */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-transparent to-transparent group-hover:to-indigo-50/40 transition-all duration-500" />
    </div>
  );
}