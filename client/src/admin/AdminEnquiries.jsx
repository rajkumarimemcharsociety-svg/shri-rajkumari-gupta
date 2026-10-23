
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LogOut,
  ArrowLeft,
  RefreshCw,
  Search,
  Inbox,
  X,
  Mail,
  Phone,
  Clock3,
  Sun,
  Moon,
  Trash2,
} from "lucide-react";
import "./Admin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_LABELS = {
  new: "New",
  "in-progress": "In progress",
  resolved: "Resolved",
};

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminEnquiries() {
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("adminTheme") !== "light"
  );

  useEffect(() => {
    localStorage.setItem("adminTheme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const logout = useCallback(() => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUsername");
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  const loadEnquiries = useCallback(async () => {
    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      logout();
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_URL}/api/admin/enquiries`, {
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
        throw new Error(data.message || "Unable to load enquiries.");
      }

      setEnquiries(Array.isArray(data.enquiries) ? data.enquiries : []);
    } catch (err) {
      setError(err.message || "Unable to load enquiries.");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  async function updateStatus(id, status) {
    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      logout();
      return;
    }

    setUpdatingId(id);
    setError("");
    setSuccessMessage("");

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
        throw new Error(data.message || "Unable to update status.");
      }

      setEnquiries((current) =>
        current.map((item) =>
          item._id === id ? { ...item, status } : item
        )
      );

      setSuccessMessage("Enquiry status updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update status.");
      await loadEnquiries();
    } finally {
      setUpdatingId("");
    }
  }

  async function deleteEnquiry(item) {
    const id = item._id;

    if (!id) {
      setError("Unable to delete this enquiry because its ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the enquiry from ${
        item.name || "this visitor"
      }?\n\nThis will remove the enquiry from the database and cannot be undone.`
    );

    if (!confirmed) return;

    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      logout();
      return;
    }

    setDeletingId(id);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/enquiries/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete enquiry.");
      }

      // Remove the enquiry from the page only after the server confirms deletion.
      setEnquiries((current) =>
        current.filter((enquiry) => enquiry._id !== id)
      );

      setSuccessMessage(
        `Enquiry from ${item.name || "the visitor"} was permanently deleted.`
      );
    } catch (err) {
      setError(err.message || "Unable to delete enquiry.");
    } finally {
      setDeletingId("");
    }
  }

  const filteredEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return enquiries.filter((item) => {
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const searchable = [
        item.name,
        item.email,
        item.mobile,
        item.category,
        item.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchable.includes(query);
    });
  }, [enquiries, search, statusFilter]);

  const username =
    sessionStorage.getItem("adminUsername") || "Administrator";

  return (
    <main
      className={`admin-dashboard-page${darkMode ? " admin-dark" : ""}`}
    >
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
            className="admin-logout-button admin-theme-toggle"
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
        <Link to="/admin" className="admin-back-link">
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="admin-dashboard-title-row">
          <div>
            <p className="admin-eyebrow">ADMINISTRATION PANEL</p>
            <h1>Enquiry Management</h1>
            <p className="admin-dashboard-subtitle">
              Review submissions and manage their progress.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadEnquiries}
            disabled={loading || Boolean(updatingId) || Boolean(deletingId)}
          >
            <RefreshCw size={16} />
            Refresh
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

        {successMessage && (
          <div
            className="admin-dashboard-success"
            role="status"
          >
            <span>{successMessage}</span>
            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              aria-label="Dismiss success message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <section className="admin-enquiries-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>All available enquiries</h2>
              <p>{enquiries.length} record(s) loaded from your database.</p>
            </div>
          </div>

          <div className="admin-enquiry-tools">
            <label className="admin-search-box">
              <Search size={18} />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, phone or message..."
                aria-label="Search enquiries"
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
              <span>Status:</span>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by enquiry status"
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
              <Inbox size={30} />

              <p>
                {enquiries.length === 0
                  ? "No enquiries have been submitted yet."
                  : "No enquiries match your search or filter."}
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
                Showing {filteredEnquiries.length} of {enquiries.length} loaded
                enquiries
              </div>

              <div className="admin-enquiries-list">
                {filteredEnquiries.map((item) => {
                  const status = STATUS_LABELS[item.status]
                    ? item.status
                    : "new";

                  const isDeleting = deletingId === item._id;

                  return (
                    <article
                      className="admin-enquiry-card"
                      key={item._id}
                    >
                      <div className="admin-enquiry-top">
                        <div>
                          <h3>{item.name || "Unnamed visitor"}</h3>

                          <p className="admin-enquiry-category">
                            {item.category || "General enquiry"}
                          </p>
                        </div>

                        <span className={`admin-status admin-status-${status}`}>
                          {STATUS_LABELS[status]}
                        </span>
                      </div>

                      <div className="admin-enquiry-contact">
                        {item.email ? (
                          <a href={`mailto:${item.email}`}>
                            <Mail size={13} />
                            {item.email}
                          </a>
                        ) : (
                          <span>Email not provided</span>
                        )}

                        {item.mobile ? (
                          <a href={`tel:${item.mobile}`}>
                            <Phone size={13} />
                            {item.mobile}
                          </a>
                        ) : (
                          <span>Phone not provided</span>
                        )}
                      </div>

                      <p className="admin-enquiry-message">
                        {item.message || "No message provided."}
                      </p>

                      <div className="admin-enquiry-bottom">
                        <time dateTime={item.createdAt || undefined}>
                          <Clock3 size={12} />
                          {formatDate(item.createdAt)}
                        </time>

                        <label className="admin-status-control">
                          <span>Update status</span>

                          <select
                            value={status}
                            disabled={
                              Boolean(updatingId) ||
                              Boolean(deletingId) ||
                              loading
                            }
                            onChange={(event) =>
                              updateStatus(item._id, event.target.value)
                            }
                            aria-label={`Update status for ${
                              item.name || "enquiry"
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="in-progress">In progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </label>

                        {updatingId === item._id && (
                          <span className="admin-updating-label">
                            Saving...
                          </span>
                        )}

                        <button
                          type="button"
                          className="admin-delete-enquiry-button"
                          onClick={() => deleteEnquiry(item)}
                          disabled={
                            Boolean(deletingId) ||
                            Boolean(updatingId) ||
                            loading
                          }
                          aria-label={`Delete enquiry from ${
                            item.name || "visitor"
                          }`}
                          title="Permanently delete this enquiry"
                        >
                          {isDeleting ? (
                            <>
                              <RefreshCw size={15} />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 size={15} />
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}
