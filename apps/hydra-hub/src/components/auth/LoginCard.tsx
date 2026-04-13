/* eslint-disable @next/next/no-img-element */
import MicrosoftButton from "./MicrosoftButton"

const platforms = [
  { name: "Impresistem", url: "https://www.impresistem.com/", logo: "/impresistem_logos.png" },
  { name: "Portal Victoria", url: "https://portal.victoriasolutions.ai/es", logo: "/victoria.ico" },
  { name: "CRM David", url: "https://www.maxgp.com.co/index.php?view=vistas/login.php", logo: "/crm.png" },
  { name: "Infolaft", url: "https://www.infolaftsearch.com/#!/signin", logo: "/infolaft.png" },
  { name: "GLPI", url: "https://soporteit.impresistem.com/", logo: "/glpi.png" },
  { name: "Heinsohn", url: "https://nomina58.heinsohn.com.co/NominaWEB/common/mainPages/login.seam", logo: "/heinsohn.png" },
  { name: "IM Academy", url: "https://login.ubitslearning.com/login?state=hKFo2SBYdXJKYXZKdlJ1OWVKVXJjNUR1a2JvUE1GMHVZeUVMZ6FupWxvZ2luo3RpZNkgZ1NOSDNEY244Mk40VGlNZDdUdDlXb0J4T2UwZmhXMzijY2lk2SA1TkhqdG90dHl1OE5aRFFkYXRMdmtjRW5nd296VU9nNA&client=5NHjtottyu8NZDQdatLvkcEngwozUOg4&protocol=oauth2&response_type=code&redirect_uri=https%3A%2F%2Fubitslearning.com%2F&scope=openid%20profile%20email&connection=ubits-users-db&upstream_params=org_aRRcG3bOEgY9mw8d&company=2114", logo: "/ubits.png" },
  { name: "Linkus", url: "https://telefonia.impresistem.com:8088/login", logo: "/linkus.png" },
  { name: "Plytix", url: "https://auth.plytix.com/auth/login", logo: "/plytix.png" },
  { name: "IMPREDATA", url: "https://informesbi.impresistem.com/reports/browse/IMPREDATA", logo: "/impredata.png" },
]

export default function LoginCard() {
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

      <div className="platforms-divider">
        <span>Otras plataformas</span>
      </div>

      <div className="platforms-grid">
        {platforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="platform-button"
          >
            <img 
              src={platform.logo} 
              alt={platform.name} 
              className={`platform-logo ${["Infolaft", "Linkus"].includes(platform.name) ? "inverse" : ""}`} 
            />
            <span className="platform-name">{platform.name}</span>
          </a>
        ))}
      </div>

      <div className="login-footer">
        © {new Date().getFullYear()} Impresistem
      </div>

    </div>
  )
}