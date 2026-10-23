import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LogOut,
  RefreshCw,
  Inbox,
  Clock3,
  CheckCircle2,
  MessageSquare,
  Sun,
  Moon,
  FileText,
  ArrowLeft,
  Search,
  X,
} from "lucide-react";
import "./Admin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const EMPTY_STATS = {
  total: 0,
  new: 0,
  inProgress: 0,
  resolved: 0,
};

const STATUS_LABELS = {
  new: "New",
  "in-progress": "In progress",
  resolved: "Resolved",
};

function formatDate(date) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Dark mode is the default unless the administrator previously chose light mode.
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("adminTheme") !== "light"
  );

  const [stats, setStats] = useState(EMPTY_STATS);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("adminTheme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const logout = useCallback(() => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUsername");
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  const loadDashboard = useCallback(async (showLoading = true) => {
    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      logout();
      return;
    }

    if (showLoading) setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/dashboard`, {
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
        throw new Error(data.message || "Unable to load dashboard.");
      }

      setStats({
        ...EMPTY_STATS,
        ...(data.stats || {}),
      });

      setEnquiries(
        Array.isArray(data.recentEnquiries) ? data.recentEnquiries : []
      );
    } catch (err) {
      setError(err.message || "Unable to load dashboard.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function updateStatus(id, status) {
    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      logout();
      return;
    }

    setUpdatingId(id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/enquiries/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not update enquiry.");
      }

      setEnquiries((current) =>
        current.map((item) =>
          item._id === id ? { ...item, status } : item
        )
      );

      await loadDashboard(false);
    } catch (err) {
      setError(err.message || "Could not update enquiry.");
    } finally {
      setUpdatingId("");
    }
  }

  const filteredEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return enquiries.filter((enquiry) => {
      const matchesStatus =
        statusFilter === "all" || enquiry.status === statusFilter;

      const searchableText = [
        enquiry.name,
        enquiry.email,
        enquiry.mobile,
        enquiry.category,
        enquiry.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(query);
    });
  }, [enquiries, search, statusFilter]);

  const username =
    sessionStorage.getItem("adminUsername") || "Administrator";

  return (
    <main
      className={`admin-dashboard-page${darkMode ? " admin-dark" : ""}`}
    >
      <header className="admin-dashboard-header">
        <Link to="/" className="admin-dashboard-brand">
          <span className="admin-dashboard-logo">
            <ShieldCheck size={25} />
          </span>

          <span>
            <strong>SHRI RAJKUMARI GUPTA</strong>
            <small>ADMINISTRATION</small>
          </span>
        </Link>

        <div className="admin-header-actions">
          <span className="admin-welcome">
            Welcome, {username}
          </span>

          <button
            className="admin-logout-button"
            type="button"
            onClick={() => setDarkMode((current) => !current)}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
            title="Change admin theme"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            {darkMode ? "Light mode" : "Dark mode"}
          </button>

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
        <Link to="/" className="admin-back-link">
          <ArrowLeft size={16} />
          Back to public website
        </Link>

        <Link
          to="/admin/enquiries"
          className="admin-back-link admin-enquiries-nav-link"
        >
          <Inbox size={16} />
          Manage all enquiries
        </Link>

        <Link
          to="/admin/reports"
          className="admin-back-link admin-enquiries-nav-link"
        >
          <FileText size={16} />
          Reports &amp; Documents
        </Link>

        <div className="admin-dashboard-title-row">
          <div>
            <p className="admin-eyebrow">ADMINISTRATION PANEL</p>
            <h1>Dashboard</h1>
            <p className="admin-dashboard-subtitle">
              Review website enquiries and track their progress.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={() => loadDashboard()}
            disabled={loading || Boolean(updatingId)}
          >
            <RefreshCw
              size={16}
              className={loading ? "admin-refresh-spinning" : ""}
            />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="admin-dashboard-error" role="alert">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="admin-stats-grid">
          <article className="admin-stat-card">
            <span className="admin-stat-icon">
              <Inbox size={21} />
            </span>
            <span className="admin-stat-label">Total enquiries</span>
            <strong>{loading ? "—" : stats.total}</strong>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon admin-stat-blue">
              <MessageSquare size={21} />
            </span>
            <span className="admin-stat-label">New enquiries</span>
            <strong>{loading ? "—" : stats.new}</strong>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon admin-stat-orange">
              <Clock3 size={21} />
            </span>
            <span className="admin-stat-label">In progress</span>
            <strong>{loading ? "—" : stats.inProgress}</strong>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon admin-stat-green">
              <CheckCircle2 size={21} />
            </span>
            <span className="admin-stat-label">Resolved</span>
            <strong>{loading ? "—" : stats.resolved}</strong>
          </article>
        </div>

        <section className="admin-enquiries-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Recent enquiries</h2>
              <p>
                The latest 10 enquiries submitted through your website.
              </p>
            </div>
          </div>

          <div className="admin-enquiry-tools">
            <label className="admin-search-box">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search name, email, phone or message..."
                aria-label="Search enquiries"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <label className="admin-filter-box">
              <span>Filter:</span>
              <select
                aria-label="Filter enquiries by status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="new">New</option>
                <option value="in-progress">In progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </label>
          </div>

          {loading ? (
            <p className="admin-empty-state">Loading enquiries...</p>
          ) : filteredEnquiries.length === 0 ? (
            <div className="admin-empty-state">
              <Inbox size={28} />
              <p>
                {enquiries.length === 0
                  ? "No enquiries have been submitted yet."
                  : "No enquiries match your search or selected filter."}
              </p>

              {(search || statusFilter !== "all") && (
                <button
                  className="admin-clear-filters"
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="admin-results-count">
                Showing {filteredEnquiries.length} of {enquiries.length} recent
                enquiries
              </div>

              <div className="admin-enquiries-list">
                {filteredEnquiries.map((enquiry) => {
                  const status = STATUS_LABELS[enquiry.status]
                    ? enquiry.status
                    : "new";

                  return (
                    <article
                      className="admin-enquiry-card"
                      key={enquiry._id}
                    >
                      <div className="admin-enquiry-top">
                        <div>
                          <h3>{enquiry.name || "Unnamed visitor"}</h3>
                          <p className="admin-enquiry-category">
                            {enquiry.category || "General enquiry"}
                          </p>
                        </div>

                        <span
                          className={`admin-status admin-status-${status}`}
                        >
                          {STATUS_LABELS[status]}
                        </span>
                      </div>

                      <div className="admin-enquiry-contact">
                        {enquiry.email ? (
                          <a href={`mailto:${enquiry.email}`}>
                            {enquiry.email}
                          </a>
                        ) : (
                          <span>Email not provided</span>
                        )}

                        {enquiry.mobile ? (
                          <a href={`tel:${enquiry.mobile}`}>
                            {enquiry.mobile}
                          </a>
                        ) : (
                          <span>Phone not provided</span>
                        )}
                      </div>

                      <p className="admin-enquiry-message">
                        {enquiry.message || "No message provided."}
                      </p>

                      <div className="admin-enquiry-bottom">
                        <time dateTime={enquiry.createdAt || undefined}>
                          {formatDate(enquiry.createdAt)}
                        </time>

                        <label className="admin-status-control">
                          <span>Update status</span>
                          <select
                            value={status}
                            disabled={Boolean(updatingId)}
                            onChange={(event) =>
                              updateStatus(enquiry._id, event.target.value)
                            }
                            aria-label={`Update status for ${enquiry.name || "enquiry"}`}
                          >
                            <option value="new">New</option>
                            <option value="in-progress">In progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </label>

                        {updatingId === enquiry._id && (
                          <span className="admin-updating-label">
                            Saving...
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <p className="admin-dashboard-note">
          This dashboard displays actual enquiry records. Donation reporting
          will be added only when verified donation records or a payment
          integration are available.
        </p>
      </section>
    </main>
  );
}