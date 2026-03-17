"use client";

import { useEffect, useState } from "react";
import { getPlatforms, Platform } from "@/modules/platforms/api";

export function PlatformList({ refreshKey }: { refreshKey: number }) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [refreshKey]);

  async function load() {
    try {
      const data = await getPlatforms();
      setPlatforms(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Cargando plataformas...</p>;

  return (
    <div className="border p-4 rounded">
      <h2 className="font-semibold text-lg mb-2">Plataformas</h2>

      <ul className="space-y-2">
        {platforms.map((p) => (
          <li key={p.id} className="border p-2 rounded">
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-gray-500">{p.code}</div>
            {p.description && (
              <div className="text-xs text-gray-400">{p.description}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
