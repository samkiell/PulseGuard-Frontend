import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Shield, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { getToken, setToken } from "../utils/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = getToken();
  if (token) return <Navigate to="/dashboard" replace />;

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 900));

    const valid =
      email === "demo@pulseguard.ai" && password === "PulseGuard2026";

    if (valid) {
      setToken("mock-jwt-pulseguard-2026");
      navigate("/dashboard");
      return;
    }

    setError("Invalid credentials. Use demo@pulseguard.ai / PulseGuard2026");
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSignIn();
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#0F62FE";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#C6C6C6";
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    marginTop: 6,
    padding: "10px 12px",
    border: "1px solid #C6C6C6",
    borderRadius: 4,
    fontSize: 14,
    color: "#161616",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F4F4F4",
        position: "relative",
      }}
    >
      <button
        type="button"
        onClick={toggleTheme}
        title="Toggle theme"
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          width: 40,
          height: 40,
          borderRadius: "9999px",
          background: "#FFFFFF",
          border: "1px solid #E0E0E0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#525252",
        }}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 8,
          border: "1px solid #E0E0E0",
          padding: 48,
          width: "100%",
          maxWidth: 420,
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Shield size={28} color="#0F62FE" />
          <span style={{ fontSize: 22, fontWeight: 700, color: "#161616" }}>
            PulseGuard
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#6F6F6F", marginTop: 4 }}>
          Secure HIPAA Compliance Auditing
        </p>

        <div
          style={{
            borderBottom: "1px solid #E0E0E0",
            marginTop: 24,
            marginBottom: 32,
          }}
        />

        {/* Email */}
        <label
          style={{ fontSize: 13, fontWeight: 500, color: "#525252" }}
        >
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="you@hospital.org"
          style={inputStyle}
        />

        {/* Password */}
        <div style={{ marginTop: 16 }}>
          <label
            style={{ fontSize: 13, fontWeight: 500, color: "#525252" }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
            style={inputStyle}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#FFF1F1",
              border: "1px solid #DA1E28",
              borderRadius: 4,
              padding: "10px 14px",
              marginTop: 16,
              fontSize: 13,
              color: "#DA1E28",
            }}
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSignIn}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 24,
            padding: "12px 0",
            background: "#0F62FE",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 4,
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        {/* Footer */}
        <p
          style={{
            fontSize: 12,
            color: "#A8A8A8",
            marginTop: 24,
            textAlign: "center",
          }}
        >
          Hackathon demo credentials:
          <br />
          demo@pulseguard.ai  /  PulseGuard2026
        </p>
      </div>
    </div>
  );
}
