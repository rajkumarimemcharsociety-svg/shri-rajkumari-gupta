
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LogOut,
  ArrowLeft,
  RefreshCw,
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff,
  LockKeyhole,
  Sun,
  Moon,
} from "lucide-react";
import "./Admin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const categories = [
  "Annual Report",
  "Financial Report",
  "Registration Document",
  "Program Report",
  "Other",
];

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-IN");
}

function formatSize(bytes = 0) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [privateDocuments, setPrivateDocuments] = useState([]);
  const [documentMode, setDocumentMode] = useState("public");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Annual Report");
  const [file, setFile] = useState(null);

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

  const request = useCallback(async (url, options = {}) => {
    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      logout();
      throw new Error("Your login session has expired.");
    }

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (response.status === 401 || response.status === 403) {
      logout();
      throw new Error("Your login session has expired.");
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || "The request failed.");
    }

    return data;
  }, [logout]);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await request("/api/reports/admin");
      setReports(data.reports || []);
    } catch (err) {
      setError(err.message || "Unable to load reports.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  const loadPrivateDocuments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await request("/api/private-documents");
      setPrivateDocuments(data.documents || []);
    } catch (err) {
      setError(err.message || "Unable to load private documents.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    if (documentMode === "public") loadReports();
    else loadPrivateDocuments();
  }, [documentMode, loadReports, loadPrivateDocuments]);

  async function uploadReport(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF documents are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("The PDF must be 10 MB or smaller.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());

    if (documentMode === "public") {
      formData.append("category", category);
    }

    formData.append("file", file);
    setBusy(true);

    try {
      const data = await request(
        documentMode === "public"
          ? "/api/reports/admin"
          : "/api/private-documents",
        { method: "POST", body: formData }
      );

      setMessage(
        data.message ||
          (documentMode === "public"
            ? "Report uploaded successfully."
            : "Private document uploaded successfully.")
      );

      setTitle("");
      setDescription("");
      setCategory("Annual Report");
      setFile(null);

      const input = document.getElementById("admin-report-file");
      if (input) input.value = "";

      if (documentMode === "public") await loadReports();
      else await loadPrivateDocuments();
    } catch (err) {
      setError(err.message || "Unable to upload the document.");
    } finally {
      setBusy(false);
    }
  }

  async function togglePublished(report) {
    setError("");
    setMessage("");
    setBusy(true);

    try {
      await request(`/api/reports/admin/${report._id}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !report.published }),
      });

      setMessage(
        report.published
          ? "Report unpublished."
          : "Report published and made publicly available."
      );

      await loadReports();
    } catch (err) {
      setError(err.message || "Unable to update publication status.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadPrivateDocument(item) {
    setError("");

    try {
      const token = sessionStorage.getItem("adminToken");

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(
        `${API_URL}/api/private-documents/${item._id}/download`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to download this document.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");

      link.href = url;
      link.download = item.originalName || `${item.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Unable to download the document.");
    }
  }

  async function deletePrivateDocument(item) {
    if (
      !window.confirm(
        `Permanently delete "${item.title}" and its PDF file?`
      )
    ) {
      return;
    }

    setError("");
    setMessage("");
    setBusy(true);

    try {
      const data = await request(`/api/private-documents/${item._id}`, {
        method: "DELETE",
      });

      setMessage(data.message || "Private document deleted.");
      await loadPrivateDocuments();
    } catch (err) {
      setError(err.message || "Unable to delete the document.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteReport(report) {
    const confirmed = window.confirm(
      `Permanently delete "${report.title}" and its PDF file?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");
    setBusy(true);

    try {
      await request(`/api/reports/admin/${report._id}`, {
        method: "DELETE",
      });

      setMessage("Report deleted.");
      await loadReports();
    } catch (err) {
      setError(err.message || "Unable to delete the report.");
    } finally {
      setBusy(false);
    }
  }

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
            onClick={logout}
            type="button"
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
            <h1>Reports &amp; Documents</h1>
            <p className="admin-dashboard-subtitle">
              Manage public reports and confidential admin-only documents in
              one place.
            </p>
          </div>

          <button
            className="admin-refresh-button"
            type="button"
            onClick={
              documentMode === "public"
                ? loadReports
                : loadPrivateDocuments
            }
            disabled={loading || busy}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {error && (
          <p className="admin-dashboard-error" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="admin-success-message" role="status">
            {message}
          </p>
        )}

        <div
          className="admin-header-actions admin-document-mode-actions"
          style={{ margin: "0 0 20px", flexWrap: "wrap" }}
        >
          <button
            type="button"
            className={
              documentMode === "public"
                ? "admin-login-button"
                : "admin-refresh-button"
            }
            onClick={() => {
              setDocumentMode("public");
              setError("");
              setMessage("");
            }}
          >
            <FileText size={16} />
            Public Reports
          </button>

          <button
            type="button"
            className={
              documentMode === "private"
                ? "admin-login-button"
                : "admin-refresh-button"
            }
            onClick={() => {
              setDocumentMode("private");
              setError("");
              setMessage("");
            }}
          >
            <LockKeyhole size={16} />
            Private / Admin Only
          </button>
        </div>

        <section className="admin-enquiries-panel admin-reports-upload">
          <div className="admin-panel-heading">
            <h2>
              <Upload size={18} />
              {documentMode === "public"
                ? "Upload a public report"
                : "Upload a private document"}
            </h2>
            <p>
              {documentMode === "public"
                ? "PDF only, maximum file size 10 MB. New uploads are unpublished by default."
                : "PDF only, maximum 10 MB. Private files are never published on the public website."}
            </p>
          </div>

          <form className="admin-report-form" onSubmit={uploadReport}>
            <label>
              {documentMode === "public" ? "Report title *" : "Document title *"}
              <input
                required
                maxLength={150}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={
                  documentMode === "public"
                    ? "e.g. Annual Report 2025–26"
                    : "e.g. Confidential Student Records 2026"
                }
              />
            </label>

            {documentMode === "public" && (
              <label>
                Category
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="admin-report-description">
              Description
              <textarea
                maxLength={1000}
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={
                  documentMode === "public"
                    ? "Briefly describe this document..."
                    : "Optional confidential description..."
                }
              />
            </label>

            <label className="admin-report-file">
              PDF document *
              <input
                id="admin-report-file"
                required
                type="file"
                accept=".pdf,application/pdf"
                onChange={(event) =>
                  setFile(event.target.files?.[0] || null)
                }
              />
              {file && (
                <span>
                  Selected: {file.name} ({formatSize(file.size)})
                </span>
              )}
            </label>

            <button
              className="admin-login-button admin-report-submit"
              disabled={busy}
              type="submit"
            >
              <Upload size={16} />
              {busy ? "Please wait..." : "Upload PDF"}
            </button>
          </form>
        </section>

        <section className="admin-enquiries-panel admin-reports-list-panel">
          <div className="admin-panel-heading">
            <h2>
              <FileText size={18} />
              {documentMode === "public"
                ? "Saved public reports"
                : "Saved private documents"}
            </h2>
            <p>
              {documentMode === "public"
                ? "Only published reports are available to website visitors."
                : "These documents are accessible only to authenticated administrators."}
            </p>
          </div>

          {loading ? (
            <p className="admin-empty-state">
              Loading{" "}
              {documentMode === "public" ? "reports" : "private documents"}...
            </p>
          ) : documentMode === "private" ? (
            privateDocuments.length === 0 ? (
              <p className="admin-empty-state">
                No private documents uploaded yet.
              </p>
            ) : (
              <div className="admin-report-list">
                {privateDocuments.map((item) => (
                  <article className="admin-report-card" key={item._id}>
                    <span className="admin-report-icon">
                      <LockKeyhole size={23} />
                    </span>

                    <div className="admin-report-info">
                      <h3>{item.title}</h3>
                      <p>
                        Private PDF · {formatSize(item.fileSize)} · Uploaded{" "}
                        {formatDate(item.createdAt)}
                      </p>
                      {item.description && <p>{item.description}</p>}
                      <span className="admin-status admin-status-in-progress">
                        Private — admin only
                      </span>
                    </div>

                    <div className="admin-report-actions">
                      <button
                        className="admin-report-action"
                        type="button"
                        disabled={busy}
                        onClick={() => downloadPrivateDocument(item)}
                        title="Download private PDF"
                        aria-label={`Download ${item.title}`}
                      >
                        <Download size={16} />
                      </button>

                      <button
                        className="admin-report-action admin-report-delete"
                        type="button"
                        disabled={busy}
                        onClick={() => deletePrivateDocument(item)}
                        title="Delete private document"
                        aria-label={`Delete ${item.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )
          ) : reports.length === 0 ? (
            <p className="admin-empty-state">No reports uploaded yet.</p>
          ) : (
            <div className="admin-report-list">
              {reports.map((report) => (
                <article className="admin-report-card" key={report._id}>
                  <span className="admin-report-icon">
                    <FileText size={23} />
                  </span>

                  <div className="admin-report-info">
                    <h3>{report.title}</h3>
                    <p>
                      {report.category} · {formatSize(report.fileSize)} ·
                      Uploaded {formatDate(report.createdAt)}
                    </p>
                    {report.description && <p>{report.description}</p>}
                    <span
                      className={`admin-status ${
                        report.published
                          ? "admin-status-resolved"
                          : "admin-status-in-progress"
                      }`}
                    >
                      {report.published ? "Published" : "Draft — private"}
                    </span>
                  </div>

                  <div className="admin-report-actions">
                    {report.published && (
                      <a
                        className="admin-report-action"
                        href={`${API_URL}/api/reports/${report._id}/download`}
                        target="_blank"
                        rel="noreferrer"
                        title="Download published report"
                      >
                        <Download size={16} />
                      </a>
                    )}

                    <button
                      className="admin-report-action"
                      type="button"
                      disabled={busy}
                      onClick={() => togglePublished(report)}
                      title={
                        report.published ? "Unpublish report" : "Publish report"
                      }
                    >
                      {report.published ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>

                    <button
                      className="admin-report-action admin-report-delete"
                      type="button"
                      disabled={busy}
                      onClick={() => deleteReport(report)}
                      title="Delete report"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
