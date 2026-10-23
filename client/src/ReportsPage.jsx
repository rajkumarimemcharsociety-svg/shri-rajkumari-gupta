import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Download, RefreshCw } from "lucide-react";
import "./ReportsPage.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const categories = [
  "All reports",
  "Annual Report",
  "Financial Report",
  "Registration Document",
  "Program Report",
  "Other",
];

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [category, setCategory] = useState("All reports");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReports() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/reports`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load reports.");
      }

      // The public API should return published reports only.
      setReports(Array.isArray(data.reports) ? data.reports : []);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load reports right now. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const visibleReports =
    category === "All reports"
      ? reports
      : reports.filter((report) => report.category === category);

  return (
    <main className="public-reports-page">
      <section className="public-reports-hero">
        <div className="public-reports-container">
          <p className="public-reports-eyebrow">TRANSPARENCY &amp; ACCOUNTABILITY</p>
          <h1>Reports &amp; Publications</h1>
          <p>
            Explore our published reports and official documents to learn more
            about our work and commitment to transparency.
          </p>
        </div>
      </section>

      <section className="public-reports-container public-reports-content">
        <div className="public-reports-toolbar">
          <div>
            <h2>Our documents</h2>
            <p>Download published reports as PDF documents.</p>
          </div>
          <button
            className="public-reports-refresh"
            type="button"
            onClick={loadReports}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="public-reports-filters" aria-label="Filter reports by category">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="public-reports-state">Loading reports…</div>
        ) : error ? (
          <div className="public-reports-state public-reports-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={loadReports}>Try again</button>
          </div>
        ) : visibleReports.length === 0 ? (
          <div className="public-reports-state">
            <FileText size={34} />
            <h3>
              {reports.length === 0
                ? "No reports published yet"
                : "No reports in this category"}
            </h3>
            <p>
              {reports.length === 0
                ? "Published documents will appear here when they are available."
                : "Choose another category to see available documents."}
            </p>
          </div>
        ) : (
          <div className="public-reports-grid">
            {visibleReports.map((report) => (
              <article className="public-report-card" key={report._id}>
                <div className="public-report-icon">
                  <FileText size={25} />
                </div>
                <div className="public-report-details">
                  <span className="public-report-category">
                    {report.category || "Document"}
                  </span>
                  <h3>{report.title}</h3>
                  {report.description && <p>{report.description}</p>}
                  {report.createdAt && (
                    <span className="public-report-date">
                      Published {formatDate(report.createdAt)}
                    </span>
                  )}
                  <a
                    className="public-report-download"
                    href={`${API_URL}/api/reports/${report._id}/download`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Download size={16} />
                    Download PDF
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="public-reports-note">
          For official information, please refer to the published documents listed on this page.
        </p>
      </section>
    </main>
  );
}
