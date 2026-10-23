
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
} from "lucide-react";
import "./Admin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN");
}

function formatSize(bytes = 0) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PrivateDocuments() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const logout = useCallback(() => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUsername");
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  const request = useCallback(async (url, options = {}) => {
    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      logout();
      throw new Error("Please log in to continue.");
    }

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (response.status === 401 || response.status === 403) {
      logout();
      throw new Error("Your login session has expired.");
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || "The request failed.");
    }

    return data;
  }, [logout]);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await request("/api/private-documents");
      setDocuments(data.documents || []);
    } catch (err) {
      setError(err.message || "Unable to load private documents.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  async function uploadDocument(event) {
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
    formData.append("file", file);

    setBusy(true);

    try {
      const data = await request("/api/private-documents", {
        method: "POST",
        body: formData,
      });

      setMessage(data.message || "Private document uploaded successfully.");
      setTitle("");
      setDescription("");
      setFile(null);

      const input = document.getElementById("private-document-file");
      if (input) input.value = "";

      await loadDocuments();
    } catch (err) {
      setError(err.message || "Unable to upload the document.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadDocument(document) {
    setError("");
    setMessage("");

    try {
      const token = sessionStorage.getItem("adminToken");

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(
        `${API_URL}/api/private-documents/${document._id}/download`,
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
      link.download = document.originalName || `${document.title}.pdf`;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Unable to download the document.");
    }
  }

  async function deleteDocument(document) {
    if (
      !window.confirm(
        `Permanently delete "${document.title}" and its PDF file?`
      )
    ) {
      return;
    }

    setError("");
    setMessage("");
    setBusy(true);

    try {
      const data = await request(
        `/api/private-documents/${document._id}`,
        { method: "DELETE" }
      );

      setMessage(data.message || "Private document deleted.");
      await loadDocuments();
    } catch (err) {
      setError(err.message || "Unable to delete the document.");
    } finally {
      setBusy(false);
    }
  }

  const username =
    sessionStorage.getItem("adminUsername") || "Administrator";

  return (
    <main className="admin-dashboard-page">
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
            <h1>Private Documents</h1>
            <p className="admin-dashboard-subtitle">
              Confidential PDFs and student records. Accessible only to
              authenticated administrators.
            </p>
          </div>

          <button
            className="admin-refresh-button"
            type="button"
            onClick={loadDocuments}
            disabled={loading || busy}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {error && (
          <p className="admin-dashboard-error" role="alert">{error}</p>
        )}
        {message && (
          <p className="admin-success-message" role="status">{message}</p>
        )}

        <section className="admin-enquiries-panel admin-reports-upload">
          <div className="admin-panel-heading">
            <h2><Upload size={18} /> Upload a private PDF</h2>
            <p>
              PDF only, maximum 10 MB. Files are not published publicly.
            </p>
          </div>

          <form className="admin-report-form" onSubmit={uploadDocument}>
            <label>
              Document title *
              <input
                required
                maxLength={150}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Student Records 2026"
              />
            </label>

            <label className="admin-report-description">
              Description
              <textarea
                maxLength={1000}
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional confidential notes..."
              />
            </label>

            <label className="admin-report-file">
              PDF document *
              <input
                id="private-document-file"
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
              {busy ? "Please wait..." : "Upload Private PDF"}
            </button>
          </form>
        </section>

        <section className="admin-enquiries-panel admin-reports-list-panel">
          <div className="admin-panel-heading">
            <h2><FileText size={18} /> Saved private documents</h2>
            <p>
              This list is available only through the authenticated admin API.
            </p>
          </div>

          {loading ? (
            <p className="admin-empty-state">Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="admin-empty-state">No private documents uploaded yet.</p>
          ) : (
            <div className="admin-report-list">
              {documents.map((document) => (
                <article className="admin-report-card" key={document._id}>
                  <span className="admin-report-icon">
                    <FileText size={23} />
                  </span>

                  <div className="admin-report-info">
                    <h3>{document.title}</h3>
                    <p>
                      PDF · {formatSize(document.fileSize)} · Uploaded{" "}
                      {formatDate(document.createdAt)}
                    </p>
                    {document.description && <p>{document.description}</p>}
                    <span className="admin-status admin-status-in-progress">
                      Private — admin only
                    </span>
                  </div>

                  <div className="admin-report-actions">
                    <button
                      className="admin-report-action"
                      type="button"
                      disabled={busy}
                      onClick={() => downloadDocument(document)}
                      title="Download private PDF"
                      aria-label={`Download ${document.title}`}
                    >
                      <Download size={16} />
                    </button>

                    <button
                      className="admin-report-action admin-report-delete"
                      type="button"
                      disabled={busy}
                      onClick={() => deleteDocument(document)}
                      title="Delete private document"
                      aria-label={`Delete ${document.title}`}
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
