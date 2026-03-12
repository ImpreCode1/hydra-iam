import LoginBackground from "@/components/auth/LoginBackground"
import LoginCard from "@/components/auth/LoginCard"

export default function LoginPage() {
  return (
    <div className="login-container">

      <LoginBackground />

      <div className="login-content">
        <LoginCard />
      </div>

    </div>
  )
}