"use client";

import { useState } from "react";
import { ExternalSitesForm } from "@/components/external-sites/ExternalSitesForm";
import { ExternalSitesList } from "@/components/external-sites/ExternalSitesList";

export default function ExternalSitesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleCreated() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="section-title">Sitios Externos</h1>
        <p className="section-subtitle">
          Administra los accesos directos que aparecen en la página de login
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2">
          <ExternalSitesForm onCreated={handleCreated} />
        </div>
        <div className="xl:col-span-3">
          <ExternalSitesList refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}