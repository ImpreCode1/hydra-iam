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
      className="h-75 w-96 cursor-pointer rounded-2xl border border-zinc-200 bg-white p-6
      flex flex-col justify-between
      shadow-sm transition-all duration-300 
      hover:shadow-lg hover:-translate-y-1 hover:border-indigo-400/40 group"
    >
      {/* TOP */}
      <div>
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <img
            src={platform.image}
            alt={platform.name}
            className="h-24 w-auto object-contain transition-all duration-300 group-hover:scale-110"
          />
        </div>

        {/* Title */}
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-lg font-semibold text-zinc-900">
            {platform.name}
          </h2>

          <ExternalLink
            size={16}
            className="text-zinc-300 group-hover:text-indigo-500 transition-colors"
          />
        </div>

        {/* Description */}
        <p className="mt-2 text-sm text-zinc-500 text-center line-clamp-2 min-h-10">
          {platform.description}
        </p>
      </div>

      {/* BOTTOM (siempre alineado) */}
      <div>
        <div className="w-full text-center py-2 rounded-lg text-sm font-medium 
        bg-zinc-900 text-white 
        group-hover:bg-indigo-600 transition-all">
          Ingresar
        </div>
      </div>
    </div>
  );
}