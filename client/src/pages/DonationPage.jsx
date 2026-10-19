
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  ShieldCheck,
  QrCode,
  Info,
  BookOpen,
} from "lucide-react";
import "./DonationPage.css";

export default function DonationPage() {
  return (
    <main className="donation-page">
      <header className="donation-page-header">
        <Link to="/" className="donation-back-link">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <Link to="/" className="donation-page-brand">
          <BookOpen size={27} />
          <span>
            <strong>SHRI RAJKUMARI GUPTA</strong>
            <small>EDUCATION &amp; SOCIAL WELFARE</small>
          </span>
        </Link>
      </header>

      <section className="donation-page-content">
        <span className="donation-page-eyebrow">
          <Heart size={17} />
          SUPPORT OUR MISSION
        </span>

        <h1>Make a Difference Through Your Support</h1>

        <p className="donation-page-description">
          Your generosity can help support education, women's
          skill training, Samuhik Vivah, and other community
          welfare initiatives of Shrimati Rajkumari Gupta
          Memorial Charitable Society.
        </p>

        <div className="donation-payment-card">
          <div className="donation-payment-heading">
            <QrCode size={29} />
            <div>
              <h2>Scan to Donate</h2>
              <p>Society's official payment QR will be added here.</p>
            </div>
          </div>

          <div className="donation-demo-qr">
            <QrCode size={100} strokeWidth={1.5} />
            <strong>DEMO QR</strong>
            <span>Not a payment code</span>
          </div>

          <div className="donation-demo-notice">
            <Info size={21} />
            <p>
              <strong>Payments are not enabled yet.</strong>
              <br />
              This is a demonstration placeholder. Do not scan
              it or transfer money using this image.
            </p>
          </div>

          <div className="donation-trust-note">
            <ShieldCheck size={23} />
            <p>
              Official payment details and transaction
              verification will be provided after the society's
              documentation and payment arrangements are finalised.
            </p>
          </div>
        </div>

        <div className="donation-page-footer">
          <Heart size={17} />
          Thank you for caring about education and social welfare.
        </div>

        <Link to="/" className="donation-home-link">
          Return to the society website
        </Link>
      </section>
    </main>
  );
}
