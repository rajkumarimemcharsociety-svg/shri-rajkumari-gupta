import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, ArrowLeft, LockKeyhole } from "lucide-react";
import "./Admin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.token) {
        throw new Error(data.message || "Unable to log in.");
      }

      sessionStorage.setItem("adminToken", data.token);
      sessionStorage.setItem("adminUsername", data.username || username);

      navigate("/admin", { replace: true });
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Make sure your backend is running."
          : err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link to="/" className="admin-back-link">
          <ArrowLeft size={17} />
          Back to website
        </Link>

        <div className="admin-login-brand">
          <div className="admin-brand-icon">
            <ShieldCheck size={31} />
          </div>
          <p className="admin-eyebrow">SHRI RAJKUMARI GUPTA</p>
          <h1>Admin Login</h1>
          <p className="admin-login-description">
            Sign in to securely manage website enquiries and administration.
          </p>
        </div>

        <div className="admin-security-note">
          <LockKeyhole size={18} />
          <span>Authorized administrators only</span>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <label htmlFor="admin-username">Username</label>
          <input
            id="admin-username"
            type="text"
            autoComplete="username"
            placeholder="Enter your admin username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="admin-password">Password</label>
          <div className="admin-password-wrap">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              className="admin-password-toggle"
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="admin-login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in securely"}
          </button>
        </form>

        <p className="admin-login-footer">
          Private administration portal · Public registration is disabled
        </p>
      </section>
    </main>
  );
}
