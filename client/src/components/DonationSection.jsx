import {
  Heart,
  GraduationCap,
  Users,
  ShieldCheck,
  Leaf,
  QrCode,
  Info,
} from "lucide-react";
import "./DonationSection.css";

const benefits = [
  {
    icon: GraduationCap,
    title: "Support Education",
    text: "Help children access educational support and build a brighter future.",
  },
  {
    icon: Users,
    title: "Empower Communities",
    text: "Support families through community welfare and skill development.",
  },
  {
    icon: ShieldCheck,
    title: "Responsible Giving",
    text: "Help strengthen our mission through accountable social initiatives.",
  },
  {
    icon: Leaf,
    title: "Make a Difference",
    text: "Every contribution can help create opportunities for people in need.",
  },
];

export default function DonationSection() {
  return (
    <section className="donation-section" id="donate">
      <div className="donation-container">
        <div className="donation-intro">
          <span className="donation-eyebrow">
            SUPPORT OUR MISSION
          </span>

          <h2>Every contribution can make a difference.</h2>

          <p>
            Your support can help advance education, women's
            skill training and community welfare initiatives
            of Shrimati Rajkumari Gupta Memorial Charitable
            Society.
          </p>

          <div className="donation-benefits">
            {benefits.map(({ icon: Icon, title, text }) => (
              <article className="donation-benefit" key={title}>
                <div className="donation-benefit-icon">
                  <Icon size={25} />
                </div>

                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="donation-card">
          <div className="donation-card-heading">
            <QrCode size={30} />

            <div>
              <h3>Scan & Donate</h3>
              <p>Official payment QR coming soon</p>
            </div>
          </div>

          <div
            className="demo-qr"
            role="img"
            aria-label="Demo QR placeholder. Not a valid payment code."
          >
            <QrCode size={112} strokeWidth={1.4} />
            <span>DEMO ONLY</span>
          </div>

          <div className="donation-account">
            <ShieldCheck size={24} />

            <div>
              <strong>Donation payments</strong>
              <p>
                Official society payment details will be
                displayed after verification.
              </p>
            </div>
          </div>

          <div className="donation-notice">
            <Info size={21} />

            <p>
              This is a demonstration only. Payments are
              not enabled. Please do not transfer money
              using this placeholder.
            </p>
          </div>

          <div className="donation-footer">
            <Heart size={17} />
            Thank you for supporting our mission.
          </div>
        </div>
      </div>
    </section>
  );
}
