
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Heart,
  ShieldCheck,
  PlusCircle,
  LogOut,
} from "lucide-react";
import "./Admin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_LABELS = {
  "demo-success": "Demo success",
  "demo-pending": "Demo pending",
  "demo-failed": "Demo failed",
};

function formatDate(date) {
  if (!date) return "Date unavailable";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Date unavailable";

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

export default function AdminDonations() {
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [totals, setTotals] = useState({
    count: 0,
    demoSuccess: 0,
    demoPending: 0,
    demoFailed: 0,
    demoAmount: 0,
  });

  const [donorName, setDonorName] = useState("Demo Donor");
  const [amount, setAmount] = useState("500");
  const [status, setStatus] = useState("demo-pending");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const logout = useCallback(() => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUsername");
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  const loadDonations = useCallback(async () => {
    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      logout();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/donations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load demo transactions.");
      }

      setDonations(Array.isArray(data.donations) ? data.donations : []);
      setTotals((current) => ({ ...current, ...(data.totals || {}) }));
    } catch (err) {
      setError(err.message || "Unable to load demo transactions.");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  async function createDemoDonation(event) {
    event.preventDefault();

    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      logout();
      return;
    }

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount < 1 ||
      numericAmount > 10000000
    ) {
      setError("Enter an amount between ₹1 and ₹1,00,00,000.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/api/admin/donations/demo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          donorName: donorName.trim() || "Demo Donor",
          amount: numericAmount,
          status,
        }),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not create demo transaction.");
      }

      setNotice(
        "Demo transaction created. No payment was made or received."
      );

      await loadDonations();
    } catch (err) {
      setError(err.message || "Could not create demo transaction.");
    } finally {
      setSaving(false);
    }
  }

  const username =
    sessionStorage.getItem("adminUsername") || "Administrator";

  return (
    <main className="admin-dashboard-page admin-dark">
      <header className="admin-dashboard-header">
        <Link to="/admin" className="admin-dashboard-brand">
          <span className="admin-dashboard-logo">
            <ShieldCheck size={25} />
          </span>
          <span>
            <strong>SHRI RAJKUMARI GUPTA</strong>
            <small>ADMINISTRATION</small>
          </span>
        </Link>

        <div className="admin-header-actions">
          <span className="admin-welcome">Welcome, {username}</span>
          <button
            className="admin-logout-button"
            type="button"
            onClick={logout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <section className="admin-dashboard-content">
        <Link to="/admin" className="admin-back-link">
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div
          style={{
            marginTop: 24,
            padding: 20,
            border: "1px solid #d97706",
            borderRadius: 12,
            background: "#451a03",
            color: "#fef3c7",
          }}
          role="note"
        >
          <strong>DEMO MODE — NO REAL PAYMENTS</strong>
          <p style={{ marginBottom: 0 }}>
            Every record on this page is simulated for testing.
            No money has been collected, and these figures are not
            actual donations received by the society.
          </p>
        </div>

        <div className="admin-dashboard-title-row" style={{ marginTop: 24 }}>
          <div>
            <p className="admin-eyebrow">DONATION MANAGEMENT</p>
            <h1>
              <Heart
                size={28}
                style={{ verticalAlign: "middle", marginRight: 8 }}
              />
              Demo Donations
            </h1>
            <p className="admin-dashboard-subtitle">
              Test donation records without connecting a payment gateway.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadDonations}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="admin-dashboard-error" role="alert">
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            style={{
              margin: "16px 0",
              padding: 12,
              borderRadius: 8,
              background: "#14532d",
              color: "#dcfce7",
            }}
          >
            {notice}
          </div>
        )}

        <div className="admin-stats-grid">
          <article className="admin-stat-card">
            <span className="admin-stat-label">Demo records</span>
            <strong>{loading ? "—" : totals.count}</strong>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-label">Demo success</span>
            <strong>{loading ? "—" : totals.demoSuccess}</strong>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-label">Demo pending</span>
            <strong>{loading ? "—" : totals.demoPending}</strong>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-label">
              Simulated successful amount
            </span>
            <strong>
              {loading ? "—" : formatAmount(totals.demoAmount)}
            </strong>
          </article>
        </div>

        <section className="admin-enquiries-panel" style={{ marginTop: 24 }}>
          <div className="admin-panel-heading">
            <div>
              <h2>Create a demo transaction</h2>
              <p>This form never initiates a payment.</p>
            </div>
          </div>

          <form
            onSubmit={createDemoDonation}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 16,
              padding: "16px 0",
            }}
          >
            <label>
              Donor label
              <input
                value={donorName}
                onChange={(event) => setDonorName(event.target.value)}
                maxLength={100}
                placeholder="Demo Donor"
                style={{ display: "block", width: "100%", marginTop: 8 }}
              />
            </label>

            <label>
              Amount (INR)
              <input
                type="number"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                min="1"
                max="10000000"
                step="1"
                required
                style={{ display: "block", width: "100%", marginTop: 8 }}
              />
            </label>

            <label>
              Simulated status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                style={{ display: "block", width: "100%", marginTop: 8 }}
              >
                <option value="demo-pending">Demo pending</option>
                <option value="demo-success">Demo success</option>
                <option value="demo-failed">Demo failed</option>
              </select>
            </label>

            <div style={{ alignSelf: "end" }}>
              <button
                className="admin-refresh-button"
                type="submit"
                disabled={saving}
              >
                <PlusCircle size={16} />
                {saving ? "Creating..." : "Create demo record"}
              </button>
            </div>
          </form>
        </section>

        <section className="admin-enquiries-panel" style={{ marginTop: 24 }}>
          <div className="admin-panel-heading">
            <div>
              <h2>Demo transaction history</h2>
              <p>Latest simulated records, up to 200 entries.</p>
            </div>
          </div>

          {loading ? (
            <p className="admin-empty-state">Loading demo records...</p>
          ) : donations.length === 0 ? (
            <div className="admin-empty-state">
              <Heart size={28} />
              <p>No demo transactions yet. Create one above to test the page.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: 12 }}>Date</th>
                    <th style={{ textAlign: "left", padding: 12 }}>Donor label</th>
                    <th style={{ textAlign: "left", padding: 12 }}>Reference</th>
                    <th style={{ textAlign: "left", padding: 12 }}>Amount</th>
                    <th style={{ textAlign: "left", padding: 12 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((item) => (
                    <tr key={item._id}>
                      <td style={{ padding: 12 }}>{formatDate(item.createdAt)}</td>
                      <td style={{ padding: 12 }}>{item.donorName}</td>
                      <td style={{ padding: 12, overflowWrap: "anywhere" }}>
                        {item.reference}
                      </td>
                      <td style={{ padding: 12 }}>{formatAmount(item.amount)}</td>
                      <td style={{ padding: 12 }}>
                        {STATUS_LABELS[item.status] || "Demo record"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="admin-dashboard-note">
          This page contains simulated records only. Real donation tracking
          will require a configured payment provider and server-verified
          payment confirmations.
        </p>
      </section>
    </main>
  );
}
