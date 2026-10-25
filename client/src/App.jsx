
import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Heart,
  HeartHandshake,
  Menu,
  ShieldCheck,
  Target,
  Users,
  X,
  GraduationCap,
  Scissors,
  HandHeart,
  CalendarHeart,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";

import ScholarshipPage from "./pages/ScholarshipPage";
import SamuhikVivahPage from "./pages/SamuhikVivahPage";
import WomensTrainingPage from "./pages/WomensTrainingPage";
import BloodDonationPage from "./pages/BloodDonationPage";
import EnquiryForm from "./components/EnquiryForm";
import JoinSocietyPage from "./pages/JoinSocietyPage";
import DonationSection from "./components/DonationSection";
import DonationPage from "./pages/DonationPage";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminEnquiries from "./admin/AdminEnquiries";
import AdminReports from "./admin/AdminReports";
import ReportsPage from "./ReportsPage";
import PrivateDocuments from "./admin/PrivateDocuments";
import AdminDonations from "./admin/AdminDonations";

import "./App.css";

const works = [
  {
    title: "Free Coaching & Scholarships",
    description:
      "Educational support for students from families with limited resources, including coaching, merit-based support, and guidance.",
    icon: GraduationCap,
    link: "/scholarships",
    linkText: "Explore scholarships",
  },
  {
    title: "Samuhik Vivah/Single Marriage",
    description:
      "Supporting simple, dignified group marriages for couples from underprivileged families.",
    icon: HeartHandshake,
    link: "/samuhik-vivah",
    linkText: "Learn more",
  },
  {
    title: "Women's Skill Training",
    description:
      "Short-term basic and advanced training in stitching, beautician skills, and mehndi to support livelihoods.",
    icon: Scissors,
    link: "/womens-skill-training",
    linkText: "Learn more",
  },
  {
    title: "Blood Donation Camp",
    description:
      "Explore photographs and videos from our blood donation camp and community service activities.",
    icon: HeartHandshake,
    link: "/blood-donation-camp",
    linkText: "View photos & videos",
  },
];

// These paths must match the actual files inside client/public/documents/
const publicDocuments = [
  {
    title: "Society Registration Certificate",
    category: "Legal Registration",
    description: "Registration certificate dated 18 September 2024.",
    file: "/documents/REGISTRATION%20CERTIFICATE%2018-09-24.pdf",
    type: "PDF",
  },
  {
    title: "Registration Certificate — Image Copy",
    category: "Legal Registration",
    description: "Image copy of the society registration certificate.",
    file: "/documents/REGISTRATION%20CERTIFICATE.jpeg",
    type: "Image",
  },
  {
    title: "Memorandum and Rules",
    category: "Governing Documents",
    description: "Memorandum and rules of the society.",
    file: "/documents/memorendum%20and%20rules.pdf",
    type: "PDF",
  },
  {
    title: "Section 80G Document — Part 1",
    category: "Tax & Compliance",
    description: "First supplied Section 80G document.",
    file: "/documents/Exemptions%20under%2080(G)%20Income%20tax%201%20.pdf",
    type: "PDF",
  },
  {
    title: "Section 80G Document — Part 2",
    category: "Tax & Compliance",
    description: "Second supplied Section 80G document.",
    file: "/documents/Exemptions%20under%2080(G)%20Income%20tax%202%20.pdf",
    type: "PDF",
  },
  {
    title: "Financial Statement — 2012–13",
    category: "Financial Records",
    description: "Financial record for the 2012–13 year.",
    file: "/documents/2012-13.pdf",
    type: "PDF",
  },
  {
    title: "Financial Statement — 2023–24",
    category: "Financial Records",
    description: "Financial record for the 2023–24 year.",
    file: "/documents/2023-24.jpg",
    type: "Image",
  },
  {
    title: "Financial Statement — 2024–25",
    category: "Financial Records",
    description: "Financial record for the 2024–25 year.",
    file: "/documents/2024-25.jpg",
    type: "Image",
  },
];

const gallery = [
  {
    image: "/images/scholarship/S (1).jpeg",
    alt: "Photograph from the society's education support work",
  },
  {
    image: "/images/womens-training/1.jpeg",
    alt: "Women participating in the society's skills training programme",
  },
  {
    image: "/images/womens-training/2.jpeg",
    alt: "Practical learning at the women's training centre",
  },
  {
    image: "/images/scholarship/S (2).jpeg",
    alt: "Photograph from the society's student support work",
  },
  {
    image: "/images/womens-training/3.jpeg",
    alt: "Participants practising skills at the training centre",
  },
  {
    image: "/images/womens-training/4.jpeg",
    alt: "A moment from the women's skills training programme",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  link,
  href = "#programs",
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>

      {link && (
        <a className="text-link heading-link" href={href}>
          {link} <ArrowRight size={15} />
        </a>
      )}
    </div>
  );
}

function PublicDocuments() {
  return (
    <section className="public-documents section-wrap" id="public-documents">
      <SectionHeading
        eyebrow="PUBLIC ACCOUNTABILITY"
        title="Transparency & Official Documents"
        description="Review the society's available registration, governing, tax-related, and financial documents."
      />

      <div className="documents-grid">
        {publicDocuments.map((doc) => (
          <article className="document-card" key={doc.file}>
            <div className="document-card-icon">
              <FileText size={25} />
            </div>

            <span className="document-category">{doc.category}</span>

            <h3>{doc.title}</h3>

            <p>{doc.description}</p>

            <span className="document-type">{doc.type} document</span>

            <div className="document-actions">
              <a
                href={doc.file}
                target="_blank"
                rel="noopener noreferrer"
                className="document-view-link"
              >
                <ExternalLink size={15} />
                View Document
              </a>

              <a
                href={doc.file}
                download
                className="document-download-link"
              >
                <Download size={15} />
                Download
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className="documents-disclaimer">
        Documents are provided for public reference. Please check each
        document for its date, scope, and applicable validity. Publishing
        a document does not by itself confirm that an approval or exemption
        remains current.
      </p>
    </section>
  );
}

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const heroSlides = [
    {
      image: "/images/scholarship/S (1).jpeg",
      alt: "Children learning in a classroom",
    },
    {
      image: "/images/womens-training/1.jpeg",
      alt: "A photograph from the society's community initiatives",
    },
    {
      image: "/images/womens-training/2.jpeg",
      alt: "A photograph from the society's programme activities",
    },
    {
      image: "/images/womens-training/3.jpeg",
      alt: "A photograph from a society skills programme",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroSlide(
        (current) => (current + 1) % heroSlides.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const elements = document.querySelectorAll(
      ".section-wrap, .about-band, .impact-band, " +
        ".transparency-section, .public-documents, .contact-cta, .site-footer, " +
        ".story-card, .gallery-item, .impact-item, " +
        ".values-list article, .news-placeholder, " +
        ".donation-section, .donation-benefit, .donation-card, .document-card"
    );

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add("is-visible");
      });
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    elements.forEach((element) => {
      element.classList.add("reveal-on-scroll");
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="ngo-site" id="home">
      <div className="top-note">
        <span className="top-note-dot" />
        Education • Opportunity • Dignity
        <a href="#about">
          Discover our story <ArrowRight size={13} />
        </a>
      </div>

      <header className="site-header">
        <div className="brand-stack">
          <a className="brand" href="#home" onClick={closeMenu}>
            <span className="brand-symbol">
              <BookOpen size={28} strokeWidth={1.8} />
            </span>

            <span className="brand-name">
              <strong>SHRI RAJKUMARI GUPTA</strong>
              <small>EDUCATION &amp; SOCIAL WELFARE</small>
            </span>
          </a>

          <div className="header-action-buttons">
            <Link className="header-donate-button" to="/donate">
              <Heart size={17} />
              Donate to Our Mission
              <ArrowRight size={17} />
            </Link>

            <Link className="header-join-button" to="/join-society">
              <Users size={17} />
              Join Our Society
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          type="button"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav
          className={`nav-menu ${menuOpen ? "nav-menu-open" : ""}`}
          aria-label="Main navigation"
        >
          <a href="#home" onClick={closeMenu}>Home</a>
<a href="#about" onClick={closeMenu}>Our Story</a>
<a href="#mission-vision" onClick={closeMenu}>
  Mission &amp; Vision
</a>
<a href="#our-works" onClick={closeMenu}>Our Work</a>
          
<a href="#impact" onClick={closeMenu}>Our Impact</a>
<a href="#transparency" onClick={closeMenu}>Transparency</a>
<Link to="/reports" onClick={closeMenu}>Reports &amp; Publications</Link>
<a href="#contact" onClick={closeMenu}>Contact</a>

          <Link
  className="admin-nav-link"
  to="/admin/login"
  onClick={closeMenu}
>
  
  <ShieldCheck size={15} /> Admin Login
</Link>

          <Link className="donate-button" to="/donate" onClick={closeMenu}>
            <Heart size={15} /> Donate
          </Link>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="hero-banner" aria-labelledby="hero-title">
          {heroSlides.map((slide, index) => (
            <img
              key={slide.image}
              className={`hero-photo ${index === activeHeroSlide ? "active" : ""}`}
              src={slide.image}
              alt={slide.alt}
              aria-hidden={index !== activeHeroSlide}
            />
          ))}

          <div className="hero-shade" />

          <div className="hero-inner">
            <span className="hero-kicker">
              <span /> EDUCATION • OPPORTUNITY • DIGNITY
            </span>

            <h1 id="hero-title">
              Every learner
              <br />
              deserves
              <br />
              <em>a chance to thrive.</em>
            </h1>

            <p>
              Inspired by the spirit of Smt. Raj Kumari Gupta, our
              society works to widen access to education and support
              families facing financial hardship.
            </p>

            <div className="hero-action-buttons">
              <Link to="/donate" className="hero-donate-button">
                <Heart size={17} />
                Donate Us
                <ArrowRight size={17} />
              </Link>

              <a href="#contact" className="hero-enquiry-button">
                <HeartHandshake size={17} />
                Send Us an Enquiry
                <ArrowRight size={17} />
              </a>
            </div>

            <a className="button button-yellow" href="#our-works">
              Explore Our Work <ArrowRight size={17} />
            </a>
          </div>

          <div className="hero-works" id="our-works">
            <span className="hero-works-heading">HOW WE HELP</span>

            <div className="hero-works-grid">
              {works.map(({ title, description, icon: Icon, link, linkText }) => (
                <Link
                  to={link}
                  className="hero-work-card hero-work-card-link"
                  key={title}
                  aria-label={`Explore ${title}`}
                >
                  <span className="hero-work-icon">
                    <Icon size={23} />
                  </span>

                  <h2>{title}</h2>
                  <p>{description}</p>

                  <span className="hero-work-link">
                    {linkText} <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="hero-caption">
            <span>OUR PURPOSE</span>
            <span>Education and social welfare</span>
            <span className="caption-mark">
              <BookOpen size={17} />
            </span>
          </div>
        </section>

        {/* ABOUT THE SOCIETY */}
        <section className="about-band" id="about">
          <div
            className="about-inner"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "32px",
            }}
          >
            <div
              className="about-photo-wrap"
              style={{
                flex: "1 1 260px",
                minWidth: 0,
                maxWidth: "100%",
              }}
            >
              <img
                src="/images/scholarship/S (3).jpeg"
                alt="A classroom activity supported by the society"
                loading="lazy"
              />

              <span className="photo-label">
                <Heart size={16} /> A legacy of care
              </span>
            </div>

            <div
              className="about-copy"
              style={{
                flex: "2 1 320px",
                minWidth: 0,
              }}
            >
              <span className="eyebrow">OUR STORY</span>
              <h2>FORMATION OF THE SOCIETY</h2>
              <p>
                The Society was inspired by the life and values of Smt. Raj
                Kumari Gupta. Her family turned that spirit of compassion into
                charitable work, which grew into a community initiative to
                support girls from underprivileged families through Samuhik
                Vivah.
              </p>
              <a className="button button-green" href="#history">
                Read our journey <ArrowRight size={16} />
              </a>
            </div>

            <div
              className="values-list"
              style={{
                flex: "1 1 220px",
                minWidth: 0,
              }}
            >
              <article>
                <span><BookOpen size={20} /></span>
                <div>
                  <h3>Education</h3>
                  <p>Supporting learners with limited resources.</p>
                </div>
              </article>

              <article>
                <span><Target size={20} /></span>
                <div>
                  <h3>Opportunity</h3>
                  <p>Skills and support for a more secure future.</p>
                </div>
              </article>

              <article>
                <span><Heart size={20} /></span>
                <div>
                  <h3>Dignity</h3>
                  <p>Care, respect, and community participation.</p>
                </div>
              </article>
            </div>

            <div
              className="formation-story-full"
              style={{
                flex: "1 1 100%",
                width: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                marginTop: "8px",
                padding: "clamp(22px, 4vw, 40px)",
                background: "#ffffff",
                border: "1px solid #dce7f5",
                borderRadius: "18px",
                boxShadow: "0 10px 30px rgba(23, 54, 93, 0.06)",
              }}
            >
              <span
                className="eyebrow"
                style={{ display: "inline-block", marginBottom: "10px" }}
              >
                THE STORY BEHIND OUR BEGINNINGS
              </span>
              <h2
                style={{
                  margin: "0 0 22px",
                  color: "#17365d",
                  fontSize: "clamp(24px, 3vw, 34px)",
                  lineHeight: 1.25,
                }}
              >
                From a family’s remembrance to a community initiative
              </h2>

              <div
                style={{
                  width: "100%",
                  maxWidth: "none",
                  color: "#536174",
                  fontSize: "16px",
                  lineHeight: 1.9,
                }}
              >
                <p style={{ margin: "0 0 16px" }}>
                  Smt. Raj Kumari Gupta was a pious, helpful, socially minded
                  and philanthropic woman. She was sensitive to the needs of
                  society and became the inspiration and guiding spirit behind
                  the concept of the Society. She passed away in 1992. After
                  her death, her family started a society in her memory to
                  continue her concern for society and her spirit of service.
                </p>

                <p style={{ margin: "0 0 16px" }}>
                  Initially, the family supported people through scholarship
                  donations and other charitable contributions. These early
                  efforts were limited in duration and could not all continue
                  because of the family’s economic circumstances. Originally,
                  her husband and all four of her sons were members of the
                  Society because of their relationship with Smt. Raj Kumari
                  Gupta.
                </p>

                <p style={{ margin: "0 0 16px" }}>
                  A new chapter began during the marriage of Aastha. Arun
                  requested guests to share their good wishes rather than
                  give gifts in cash or kind. The guests respected this wish,
                  although some close relatives gave cash because of their
                  personal sentiments. It was decided that the money collected
                  would be used to support marriages for girls from
                  underprivileged families by organising a simple Samuhik
                  Vivah.
                </p>

                <p style={{ margin: "0 0 16px" }}>
                  The first such initiative took place on 2 December 2012.
                  This was a new concept in the area, and members of the
                  community expressed their willingness to participate in
                  this social cause. Interested members were subsequently
                  inducted into the Society, helping it develop beyond the
                  original family membership.
                </p>

                <p style={{ margin: 0 }}>
                  The Society later pursued formal registration so that its
                  charitable work could continue in an organised way. The
                  registration and tax-related details should be read from
                  the Society’s official certificates and governing documents
                  published in the Transparency &amp; Official Documents
                  section of this website.
                </p>
              </div>
            </div>
          </div>
        </section>

                {/* MISSION AND VISION */}
        <section
          className="mission-vision-section"
          id="mission-vision"
          aria-labelledby="mission-vision-title"
        >
          <div className="mission-vision-heading">
            <span className="eyebrow">OUR PURPOSE</span>
            <h2 id="mission-vision-title">Our Mission &amp; Vision</h2>
            <p>
              Every meaningful change begins with compassion, opportunity,
              and the belief that every person deserves a brighter future.
            </p>
          </div>

          <div className="mission-vision-grid">
            <article className="mission-vision-card">
              <div className="mission-vision-icon">
                <BookOpen size={25} />
              </div>

              <span className="mission-vision-label">WHAT WE DO</span>
              <h3>Our Mission</h3>

              <p>
                Our mission is to make education, opportunity, and dignity
                accessible to every person, regardless of their financial
                background. We believe every child deserves the chance to
                learn, grow, and build a brighter future.
              </p>

              <p>
                We work to support children through educational guidance
                and learning opportunities, empower women through skill
                development, and encourage families through meaningful
                community initiatives. Through compassion, dedication,
                and collective effort, we strive to bring positive change
                to the lives of those who need it most.
              </p>
            </article>

            <article className="mission-vision-card">
              <div className="mission-vision-icon">
                <Target size={25} />
              </div>

              <span className="mission-vision-label">WHAT WE ASPIRE TO</span>
              <h3>Our Vision</h3>

              <p>
                Our vision is a society where every child can dream freely
                and every woman has the confidence to become self-reliant.
                We hope to build a future where financial difficulties do
                not prevent anyone from accessing education or opportunities.
              </p>

              <p>
                We believe kindness, equal opportunity, and community support
                can create lasting change. We want to inspire people to come
                together, help one another, and build stronger communities.
                Above all, we aspire to carry forward a legacy of care and
                service, creating a more hopeful and dignified future for
                generations to come.
              </p>
            </article>
          </div>
        </section>


        {/* COMMUNITY GALLERY */}
        <section className="gallery-section section-wrap" id="gallery">
          <SectionHeading
            eyebrow="OUR COMMUNITY"
            title="A mission rooted in community"
            description="Our work brings people together around education, skills, and practical support."
            link="Contact us"
            href="#contact"
          />

          <div className="gallery-grid">
            {gallery.map((item, index) => (
              <a
                className="gallery-item"
                href="#contact"
                key={item.alt}
                aria-label={`Illustrative image ${index + 1}: ${item.alt}`}
              >
                <img src={item.image} alt={item.alt} loading="lazy" />
              </a>
            ))}
          </div>

          <p className="image-disclaimer">
            Photographs are shared to help visitors understand the
            society's initiatives. Programme dates, counts, and
            outcomes are described separately where they are
            supported by the society's records.
          </p>
        </section>

        {/* SOCIETY HISTORY */}
        <section className="stories-section section-wrap" id="history">
          <SectionHeading
            eyebrow="OUR JOURNEY"
            title="A history of practical support"
            description="The society has worked on community initiatives over the years, including group marriages, women's skills training, and education support."
          />

          <div className="story-grid">
            <article className="story-card">
              <span className="quote-mark"><CalendarHeart size={25} /></span>
              <h3>2012 · Samuhik Vivah</h3>
              <p>
                The society's first group marriage initiative was
                held on 2 December 2012. The supplied records
                document nine events through February 2024.
              </p>
              <span className="story-byline">Dignity &amp; community support</span>
            </article>

            <article className="story-card">
              <span className="quote-mark"><Scissors size={25} /></span>
              <h3>2019 · Training Centre</h3>
              <p>
                Short-term basic and advanced training began for
                women in stitching, beautician skills, and mehndi.
              </p>
              <span className="story-byline">Skills &amp; livelihood opportunities</span>
            </article>

            <article className="story-card">
              <span className="quote-mark"><BookOpen size={25} /></span>
              <h3>2023 · Coaching Mission</h3>
              <p>
                The society began coaching for students in classes
                IX–XII from government or lower-fee schools, with
                support based on annual tests.
              </p>
              <span className="story-byline">Education &amp; merit-based support</span>
            </article>
          </div>
        </section>

        {/* IMPACT */}
        <section className="impact-band" id="impact">
          <div className="impact-inner">
            <div className="impact-intro">
              <span className="eyebrow">OUR JOURNEY</span>
              <h2>Support with a purpose.</h2>
              <p>Figures below are drawn from the society's supplied project notes.</p>
            </div>

            <div className="impact-item">
              <span><HeartHandshake /></span>
              <strong>46</strong>
              <small>Group marriages recorded</small>
            </div>

            <div className="impact-item">
              <span><Scissors /></span>
              <strong>Since 2019</strong>
              <small>Women's skill training</small>
            </div>

            <div className="impact-item">
              <span><BookOpen /></span>
              <strong>Since 2017–18</strong>
              <small>Education support history</small>
            </div>

            <div className="impact-item">
              <span><ShieldCheck /></span>
              <strong>Accountability</strong>
              <small>Verified reporting matters</small>
            </div>
          </div>

          <p className="impact-disclaimer">
            The 46 group marriages are the total recorded across
            nine events from 2012 to 2024 in the supplied
            documentation. Training and student counts were not
            filled in the source tables.
          </p>
        </section>

        {/* TRANSPARENCY INTRO */}
        <section className="transparency-section section-wrap" id="transparency">
          <div className="transparency-icon">
            <ShieldCheck size={43} />
          </div>

          <div className="transparency-copy">
            <span className="eyebrow">TRANSPARENCY &amp; TRUST</span>
            <h2>Clear information builds trust.</h2>

            <p>
              We aim to share our projects, governing documents,
              tax-related records, and available financial statements
              openly so visitors can review the information published
              by the society.
            </p>
          </div>

          <a className="button button-outline" href="#public-documents">
            View official documents <ArrowRight size={16} />
          </a>
        </section>

        {/* PUBLIC DOCUMENTS ON HOMEPAGE */}
        <PublicDocuments />

        {/* EDUCATION AND TRAINING */}
        <section className="news-section section-wrap" id="news">
          <SectionHeading
            eyebrow="EDUCATION MISSION"
            title="Coaching for students with potential"
            description="The society's coaching initiative prioritises students who are motivated to continue their studies but face resource constraints."
          />

          <div className="news-placeholder">
            <span><BookOpen size={25} /></span>
            <div>
              <h3>Supporting learning beyond the classroom</h3>
              <p>
                According to the supplied notes, annual tests help
                determine eligibility for free coaching and
                scholarship or transport support. Subject-wise
                support and class coverage depend on available
                resources.
              </p>
            </div>
          </div>

          <div className="news-placeholder" style={{ marginTop: 12 }}>
            <span><Scissors size={25} /></span>
            <div>
              <h3>Training for women's livelihoods</h3>
              <p>
                The training centre offers basic and advanced
                short-term courses in stitching, beautician skills,
                and mehndi, with the aim of helping participants
                pursue employment or self-employment.
              </p>
            </div>
          </div>
        </section>

        {/* DONATION SECTION */}
        <DonationSection />

        {/* CONTACT AND ENQUIRY FORM */}
        <section className="contact-cta" id="contact">
          <div className="cta-symbol"><HandHeart size={34} /></div>
          <span className="eyebrow">ASSOCIATE WITH THE SOCIETY</span>
          <h2>Help make education and opportunity possible.</h2>

          <p>
            Contact details and official records will be published
            after they are confirmed. Until then, visitors can
            review the programme information on this website and
            request clarification through the society.
          </p>

          <EnquiryForm />

          <a className="button button-yellow" href="#footer-contact">
            View contact information <ArrowRight size={17} />
          </a>

          <small>
            Donation payments are not enabled yet and will be
            considered after the society's documentation is finalised.
          </small>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer" id="footer-contact">
        <div className="footer-top">
          <div className="footer-about">
            <a className="brand footer-brand" href="#home">
              <span className="brand-symbol"><BookOpen size={25} /></span>
              <span className="brand-name">
                <strong>SHRI RAJKUMARI GUPTA</strong>
                <small>EDUCATION &amp; SOCIAL WELFARE</small>
              </span>
            </a>

            <p>
              Continuing a family-inspired commitment to
              education, dignity, and practical support for people
              facing social and economic barriers.
            </p>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>
            <a href="#about">Our story</a>
            <a href="#our-works">Our work</a>
            <a href="#impact">Our journey</a>
            <a href="#transparency">Transparency</a>
                        <a href="#public-documents">Official documents</a>
            <a href="#donate">Support Us</a>
          </div>

          <div className="footer-column">
            <h3>Our initiatives</h3>
            <Link to="/scholarships">Free coaching</Link>
            <Link to="/samuhik-vivah">Samuhik Vivah</Link>
            <Link to="/womens-skill-training">Women's training</Link>
            <Link to="/blood-donation-camp">Blood donation camp</Link>
            <Link to="/join-society">Join our society</Link>
            
          </div>

          <div className="footer-column footer-contact">
            <h3>Contact</h3>
            <p>Official address, phone, and email are to be confirmed.</p>
            <a href="#contact">Send an enquiry <ArrowRight size={14} /></a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} SHRI RAJKUMARI GUPTA.
            All rights reserved.
          </span>
          <span>Education · Opportunity · Dignity</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/scholarships" element={<ScholarshipPage />} />
      <Route path="/samuhik-vivah" element={<SamuhikVivahPage />} />
      <Route path="/womens-skill-training" element={<WomensTrainingPage />} />
      <Route path="/blood-donation-camp" element={<BloodDonationPage />} />
      <Route path="/donate" element={<DonationPage />} />
      <Route path="/join-society" element={<JoinSocietyPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin" element={<AdminDashboard />} />
<Route path="/admin/enquiries" element={<AdminEnquiries />} />
<Route path="/admin/reports" element={<AdminReports />} />
<Route path="/reports" element={<ReportsPage />} />
<Route
  path="/admin/private-documents"
  element={<PrivateDocuments />}
/>
<Route path="/admin/reports" element={<AdminReports />} />
<Route
  path="/admin/donations"
  element={<AdminDonations />}
/>

      <Route
        path="*"
        element={
          <main style={{ padding: "80px 24px", textAlign: "center" }}>
            <h1>Page not found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to="/">Return to homepage</Link>
          </main>
        }
      />
    </Routes>
  );
}
