import { useState } from "react";
import { signup } from "../services/authService";

export default function SignupForm({ onSignupSuccess, onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await signup(name, email, password);
      onSignupSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#04060f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        background: "#090d1a",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "400px"
      }}>
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "8px",
            background: "#4682B4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "800",
            fontSize: "24px",
            color: "#fff",
            marginBottom: "16px"
          }}>◆</div>
          <h1 style={{ fontWeight: "800", fontSize: "24px", marginBottom: "8px", color: "#dde1ef", fontFamily: "'Space Grotesk', sans-serif" }}>Get Started</h1>
          <p style={{ color: "#8892a8", fontSize: "14px" }}>Create your Spec King account</p>
        </div>

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", color: "#8892a8", display: "block", marginBottom: "6px" }}>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#161d2e",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: "#dde1ef",
                fontFamily: "'JetBrains Mono', monospace",
                outline: "none",
                fontSize: "13px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", color: "#8892a8", display: "block", marginBottom: "6px" }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#161d2e",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: "#dde1ef",
                fontFamily: "'JetBrains Mono', monospace",
                outline: "none",
                fontSize: "13px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", color: "#8892a8", display: "block", marginBottom: "6px" }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#161d2e",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: "#dde1ef",
                fontFamily: "'JetBrains Mono', monospace",
                outline: "none",
                fontSize: "13px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", color: "#8892a8", display: "block", marginBottom: "6px" }}>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#161d2e",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: "#dde1ef",
                fontFamily: "'JetBrains Mono', monospace",
                outline: "none",
                fontSize: "13px",
                boxSizing: "border-box"
              }}
            />
          </div>

          {error && (
            <div style={{
              background: "rgba(244,63,94,0.12)",
              border: "1px solid rgba(244,63,94,0.2)",
              borderRadius: "6px",
              padding: "10px 12px",
              marginBottom: "16px",
              color: "#f43f5e",
              fontSize: "12px"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#4682B4",
              border: "none",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: "800",
              fontSize: "14px",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
              marginBottom: "16px"
            }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: "13px", color: "#8892a8" }}>
          Already have an account?{" "}
          <button
            onClick={onBackToLogin}
            style={{
              background: "none",
              border: "none",
              color: "#4682B4",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "13px",
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
}
