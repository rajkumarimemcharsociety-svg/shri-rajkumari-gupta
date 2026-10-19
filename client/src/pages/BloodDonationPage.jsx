
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Play,
  X,
  Images,
  Video,
  HeartHandshake,
} from "lucide-react";
import "./BloodDonationPage.css";

const photos = [
  "/images/blood-donation/photos/1.jpg",
  "/images/blood-donation/photos/2.jpg",
  "/images/blood-donation/photos/3.jpg",
  "/images/blood-donation/photos/4.jpg",
  "/images/blood-donation/photos/5.jpg",
  "/images/blood-donation/photos/6.jpg",
  "/images/blood-donation/photos/7.jpg",
  "/images/blood-donation/photos/8.jpg",
];

const videos = [
  {
    src: "/images/blood-donation/videos/vid 1.mp4",
    title: "Blood Donation Camp — Video 1",
  },
  {
    src: "/images/blood-donation/videos/vid 2.mp4",
    title: "Blood Donation Camp — Video 2",
  },
];

export default function BloodDonationPage() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <main className="blood-page">
      <header className="blood-page-header">
        <Link to="/" className="blood-back-link">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <Link to="/" className="blood-brand">
          <HeartHandshake size={29} />
          <span>
            <strong>SHRI RAJKUMARI GUPTA</strong>
            <small>EDUCATION &amp; SOCIAL WELFARE</small>
          </span>
        </Link>
      </header>

      {/* HERO */}
      <section className="blood-hero">
        <div className="blood-hero-overlay" />

        <div className="blood-hero-content">
          <span className="blood-eyebrow">
            <Heart size={17} />
            COMMUNITY SERVICE
          </span>

          <h1>Blood Donation Camp</h1>

          <p>
            A community initiative that brings people together
            to support the importance of blood donation and
            compassionate service.
          </p>

          <a href="#blood-photos" className="blood-primary-button">
            Explore Photos <ArrowRight size={17} />
          </a>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="blood-intro">
        <span className="blood-section-label">OUR COMMUNITY</span>
        <h2>Every contribution can make a difference.</h2>
        <p>
          Explore photographs and videos from the blood donation
          camp organised by or associated with the society.
          These galleries preserve moments of participation,
          awareness, and community service.
        </p>
      </section>

      {/* PHOTO GALLERY */}
      <section className="blood-gallery-section" id="blood-photos">
        <div className="blood-section-heading">
          <div className="blood-heading-icon">
            <Images size={23} />
          </div>
          <div>
            <span className="blood-section-label">PHOTO GALLERY</span>
            <h2>Moments from the Camp</h2>
            <p>Browse the photographs from the event.</p>
          </div>
        </div>

        <div className="blood-photo-grid">
          {photos.map((photo, index) => (
            <button
              className="blood-photo-card"
              key={photo}
              type="button"
              onClick={() => setSelectedPhoto(photo)}
              aria-label={`View blood donation camp photograph ${index + 1}`}
            >
              <img
                src={photo}
                alt={`Blood donation camp photograph ${index + 1}`}
                loading="lazy"
              />
              <span className="blood-photo-overlay">
                View Photo <ArrowRight size={16} />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* VIDEO GALLERY */}
      <section className="blood-video-section" id="blood-videos">
        <div className="blood-section-heading">
          <div className="blood-heading-icon">
            <Video size={23} />
          </div>
          <div>
            <span className="blood-section-label">VIDEO GALLERY</span>
            <h2>Watch the Camp</h2>
            <p>Watch recordings and highlights from the event.</p>
          </div>
        </div>

        {videos.length > 0 ? (
          <div className="blood-video-grid">
            {videos.map((video, index) => (
              <article className="blood-video-card" key={video.src}>
                <div className="blood-video-frame">
                  <video
                    src={video.src}
                    controls
                    preload="metadata"
                    playsInline
                  >
                    Your browser does not support video playback.
                  </video>
                </div>

                <div className="blood-video-info">
                  <span className="blood-video-number">
                    VIDEO {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{video.title}</h3>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="blood-empty-message">
            Videos will be added to this gallery soon.
          </p>
        )}
      </section>

      {/* CLOSING CTA */}
      <section className="blood-closing">
        <HeartHandshake size={36} />
        <h2>Service begins with compassion.</h2>
        <p>
          Learn more about the society's other community
          initiatives and educational programmes.
        </p>
        <Link to="/" className="blood-primary-button">
          Explore Our Website <ArrowRight size={17} />
        </Link>
      </section>

      <footer className="blood-footer">
        © {new Date().getFullYear()} SHRI RAJKUMARI GUPTA
        <span>Education · Opportunity · Dignity</span>
      </footer>

      {/* FULL-SCREEN PHOTO VIEWER */}
      {selectedPhoto && (
        <div
          className="blood-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photograph viewer"
          onClick={() => setSelectedPhoto(null)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setSelectedPhoto(null);
          }}
          tabIndex={-1}
        >
          <button
            className="blood-lightbox-close"
            type="button"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Close photograph"
          >
            <X size={28} />
          </button>

          <img
            src={selectedPhoto}
            alt="Expanded blood donation camp"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}
