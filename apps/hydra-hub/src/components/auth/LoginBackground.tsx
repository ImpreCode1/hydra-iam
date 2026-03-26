export default function LoginBackground() {
  return (
    <div className="login-bg">
      <video autoPlay muted loop playsInline className="login-video">
        <source src="/fondo-login.mp4" type="video/mp4" />
      </video>

      <div className="login-overlay" />
    </div>
  )
}