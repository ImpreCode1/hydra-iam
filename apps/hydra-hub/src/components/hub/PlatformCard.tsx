/* eslint-disable @next/next/no-img-element */
import { ExternalLink } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string;
}

export function PlatformCard({ platform }: { platform: Platform }) {
  const handleRedirect = () => {
    window.open(platform.url, "_blank");
  };

  return (
    <div
      onClick={handleRedirect}
      className="relative h-75 w-96 cursor-pointer rounded-2xl border border-zinc-200 bg-white p-6
      flex flex-col justify-between overflow-hidden
      shadow-sm transition-all duration-300 
      hover:shadow-xl hover:-translate-y-1 hover:border-indigo-400/40 group"
    >
      {/* 🔥 Glow / gradient sutil */}
      <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-indigo-50/40 opacity-0 group-hover:opacity-100 transition duration-500" />

      {/* 🔝 TOP */}
      <div className="relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={platform.image}
            alt={platform.name}
            className="h-24 w-auto object-contain transition-all duration-300 group-hover:scale-110"
          />
        </div>

        {/* Title */}
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">
            {platform.name}
          </h2>

          <ExternalLink
            size={16}
            className="text-zinc-300 group-hover:text-indigo-500 transition-colors"
          />
        </div>

        {/* Description */}
        <div className="relative mt-2">
          <p className="text-sm text-zinc-600 text-center line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
            {platform.description}
          </p>
        </div>
      </div>

      {/* 🔽 BOTTOM */}
      <div className="relative z-10">
        <div
          className="w-full text-center py-2 rounded-lg text-sm font-medium 
          bg-zinc-900 text-white 
          transition-all duration-300
          group-hover:bg-indigo-600 group-hover:shadow-md"
        >
          Ingresar
        </div>
      </div>

      {/* 🔥 Border glow animado */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none border border-transparent group-hover:border-indigo-400/40 transition-all duration-300" />
    </div>
  );
}
