import MicrosoftButton from "./MicrosoftButton"

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

      <div className="login-footer">
        © {new Date().getFullYear()} Impresistem
      </div>

    </div>
  )
}