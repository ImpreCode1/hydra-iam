/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import MicrosoftButton from "./MicrosoftButton"
import { getExternalSitesActive, ExternalSite } from "@/modules/external-sites/api";

export default function LoginCard() {
  const [externalSites, setExternalSites] = useState<ExternalSite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSites() {
      try {
        const data = await getExternalSitesActive();
        setExternalSites(data);
      } catch (err) {
        console.error("Error fetching external sites:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSites();
  }, []);

  return (
    <div className="login-card">

      <div className="login-brand">
        <img
          src="/impresistem_logo.png"
          alt="Impresistem"
          className="company-logo"
        />
      </div>

      <h1 className="login-title">
        Sistema de Gestión de Accesos
      </h1>

      <p className="login-subtitle">
        Accede de forma segura usando tu cuenta corporativa
      </p>

      <MicrosoftButton />

      {!loading && externalSites.length > 0 && (
        <>
          <div className="platforms-divider">
            <span>Otras plataformas</span>
          </div>

          <div className="platforms-grid">
            {externalSites.map((site) => (
              <a
                key={site.id}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="platform-button"
              >
                {site.logoUrl ? (
                  <img 
                    src={site.logoUrl} 
                    alt={site.name} 
                    className="platform-logo" 
                  />
                ) : (
                  <div className="platform-logo-placeholder">
                    {site.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="platform-name">{site.name}</span>
              </a>
            ))}
          </div>
        </>
      )}

      <div className="login-footer">
        © {new Date().getFullYear()} Impresistem
      </div>

    </div>
  )
}