/* eslint-disable @next/next/no-img-element */
import { ExternalLink } from "lucide-react";
import { accessPlatform } from "@/modules/platforms/api";

interface Platform {
  id: string;
  name: string;
  code: string;
  description: string;
  image: string;
  url: string;
}

export function PlatformCard({ platform }: { platform: Platform }) {
  const handleRedirect = async () => {
    try {
      await accessPlatform(platform.code);
    } catch (error) {
      console.error("Error al acceder a la plataforma:", error);
      alert("Has pasado demasiado tiempo inactivo, por favor recarga la página");
    }
  };

  return (
    <div
      onClick={handleRedirect}
      className="relative h-72 sm:h-80 cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 sm:p-6
      flex flex-col justify-between overflow-hidden
      shadow-sm transition-all duration-300 
      hover:shadow-xl hover:-translate-y-1 hover:border-blue-400/40 group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/40 opacity-0 group-hover:opacity-100 transition duration-500" />

      <div className="relative z-10">
        <div className="flex justify-center mb-4 sm:mb-6">
          <img
            src={platform.image}
            alt={platform.name}
            className="h-16 sm:h-20 w-auto object-contain transition-all duration-300 group-hover:scale-110"
          />
        </div>

        <div className="flex items-center justify-center gap-2">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 tracking-tight">
            {platform.name}
          </h2>

          <ExternalLink
            size={14}
            className="text-slate-300 group-hover:text-blue-500 transition-colors"
          />
        </div>

        <div className="relative mt-2">
          <p className="text-xs sm:text-sm text-slate-500 text-center line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
            {platform.description}
          </p>
        </div>
      </div>

      <div className="relative z-10">
        <div
          className="w-full text-center py-2.5 rounded-lg text-sm font-medium 
          bg-slate-800 text-white 
          transition-all duration-300
          group-hover:bg-blue-600 group-hover:shadow-md"
        >
          Ingresar
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl pointer-events-none border border-transparent group-hover:border-blue-400/40 transition-all duration-300" />
    </div>
  );
}
