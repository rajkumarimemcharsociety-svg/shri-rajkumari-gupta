
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Heart,
  Image as ImageIcon,
  Pause,
  Play,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./ScholarshipPage.css";

const photos = Array.from({ length: 88 }, (_, index) => {
  const number = index + 1;

  return {
    id: number,
    src: `/images/scholarship/${encodeURIComponent(
      `S (${number}).jpeg`
    )}`,
    alt: `Scholarship and educational support photograph ${number}`,
  };
});

const PHOTOS_PER_SLIDE = 4;
const totalSlides = Math.ceil(photos.length / PHOTOS_PER_SLIDE);

export default function ScholarshipPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activePhoto, setActivePhoto] = useState(null);
  const [failedPhotos, setFailedPhotos] = useState({});

  // Automatically rotate the gallery.
  useEffect(() => {
    if (!isPlaying || activePhoto !== null) return undefined;

    const timer = window.setInterval(() => {
      setCurrentSlide((current) => (current + 1) % totalSlides);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [isPlaying, activePhoto]);

  // Keyboard controls and background scroll lock for the lightbox.
  useEffect(() => {
    if (activePhoto === null) return undefined;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActivePhoto(null);
      }

      if (event.key === "ArrowRight") {
        setActivePhoto((current) =>
          current === null ? null : (current + 1) % photos.length
        );
      }

      if (event.key === "ArrowLeft") {
        setActivePhoto((current) =>
          current === null
            ? null
            : (current - 1 + photos.length) % photos.length
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhoto]);

  const previousSlide = () => {
    setCurrentSlide((current) => (current - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    setCurrentSlide((current) => (current + 1) % totalSlides);
  };

  const previousPhoto = () => {
    setActivePhoto((current) =>
      current === null
        ? null
        : (current - 1 + photos.length) % photos.length
    );
  };

  const nextPhoto = () => {
    setActivePhoto((current) =>
      current === null ? null : (current + 1) % photos.length
    );
  };

  return (
    <main className="scholarship-page">
      {/* Top information bar */}
      <div className="scholarship-topline">
        <span>Education</span>
        <span className="topline-dot">•</span>
        <span>Opportunity</span>
        <span className="topline-dot">•</span>
        <span>A brighter future</span>
      </div>

      {/* Navigation */}
      <header className="scholarship-nav">
        <Link to="/" className="scholarship-brand">
          <span className="scholarship-brand-icon">
            <BookOpen size={25} />
          </span>

          <span>
            <strong>SHRI RAJKUMARI GUPTA</strong>
            <small>EDUCATION &amp; SOCIAL WELFARE</small>
          </span>
        </Link>

        <nav className="scholarship-nav-links" aria-label="Scholarship navigation">
          <Link to="/">Home</Link>
          <a href="#about-scholarships">About</a>
          <a href="#scholarship-gallery">Gallery</a>
        </nav>

        <Link to="/#contact" className="scholarship-nav-cta">
          Back to Home <ArrowLeft size={15} />
        </Link>
      </header>

      {/* Hero */}
      <section className="scholarship-hero">
        <div className="scholarship-hero-decoration decoration-one" />
        <div className="scholarship-hero-decoration decoration-two" />

        <div className="scholarship-hero-content">
          <Link to="/" className="scholarship-back-link">
            <ArrowLeft size={15} />
            Back to homepage
          </Link>

          <span className="scholarship-eyebrow">
            <span /> OUR EDUCATION INITIATIVE
          </span>

          <h1>
            Every child deserves
            <br />
            a <em>chance to shine.</em>
          </h1>

          <p>
            Education opens doors to opportunity. We believe every child
            should have encouragement and support to pursue learning and
            build a brighter future.
          </p>

          <a href="#about-scholarships" className="scholarship-primary-btn">
            Discover our initiative <ArrowRight size={17} />
          </a>

          <div className="scholarship-hero-note">
            <BookOpen size={17} />
            <span>Learning creates possibilities</span>
          </div>
        </div>

        <div className="scholarship-hero-art" aria-hidden="true">
          <div className="hero-art-circle" />

          <div className="hero-art-card">
            <GraduationCap size={84} strokeWidth={1.1} />
            <span>Knowledge is a gift that lasts a lifetime.</span>
          </div>

          <div className="hero-art-orbit" />
        </div>

        <a href="#scholarship-gallery" className="hero-scroll-link">
          Explore the photographs <ArrowDown size={15} />
        </a>
      </section>

      {/* About the initiative */}
      <section
        id="about-scholarships"
        className="scholarship-intro section-reveal"
      >
        <div className="scholarship-intro-heading">
          <span className="scholarship-eyebrow">WHY EDUCATION MATTERS</span>

          <h2>
            Opportunity should never
            <br />
            be limited by circumstances.
          </h2>
        </div>

        <div className="scholarship-intro-copy">
          <p>
            SHRI RAJKUMARI GUPTA Education and Social Welfare works to
            support educational opportunities for children and families
            facing financial barriers.
          </p>

          <p>
            Through education-focused support and social welfare initiatives,
            the society aims to help learners build knowledge, grow in
            confidence, and work towards their aspirations.
          </p>

          <div className="scholarship-principles">
            <div>
              <span className="principle-icon">
                <BookOpen size={20} />
              </span>
              <span>
                <strong>Learning first</strong>
                <small>Encouraging educational progress</small>
              </span>
            </div>

            <div>
              <span className="principle-icon">
                <Heart size={20} />
              </span>
              <span>
                <strong>Community support</strong>
                <small>Creating opportunities together</small>
              </span>
            </div>

            <div>
              <span className="principle-icon">
                <CheckCircle2 size={20} />
              </span>
              <span>
                <strong>Dignity and encouragement</strong>
                <small>Supporting learners with respect</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Compact, automatically rotating photo gallery */}
      <section
        id="scholarship-gallery"
        className="scholarship-gallery-section"
      >
        <div className="scholarship-gallery-heading section-reveal">
          <div>
            <span className="scholarship-eyebrow">OUR PHOTO COLLECTION</span>
            <h2>Moments from our journey.</h2>
            <p>
              Explore photographs shared for our scholarship and educational
              support gallery.
            </p>
          </div>

          <div className="scholarship-photo-count">
            <ImageIcon size={19} />
            <span>
              <strong>{photos.length}</strong>
              <small>Photographs</small>
            </span>
          </div>
        </div>

        <div className="scholarship-carousel">
          <div className="scholarship-carousel-toolbar">
            <span>
              <strong>
                {String(currentSlide + 1).padStart(2, "0")}
              </strong>
              {" / "}
              {String(totalSlides).padStart(2, "0")}
              <span className="carousel-toolbar-label"> photo collections</span>
            </span>

            <div className="scholarship-carousel-controls">
              <button
                type="button"
                className="carousel-control"
                onClick={previousSlide}
                aria-label="Previous photo collection"
              >
                <ChevronLeft size={19} />
              </button>

              <button
                type="button"
                className="carousel-control carousel-play-control"
                onClick={() => setIsPlaying((playing) => !playing)}
                aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>

              <button
                type="button"
                className="carousel-control"
                onClick={nextSlide}
                aria-label="Next photo collection"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>

          <div className="scholarship-carousel-viewport">
            <div
              className="scholarship-carousel-track"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => {
                const slidePhotos = photos.slice(
                  slideIndex * PHOTOS_PER_SLIDE,
                  (slideIndex + 1) * PHOTOS_PER_SLIDE
                );

                return (
                  <div
                    className="scholarship-carousel-slide"
                    key={slideIndex}
                    aria-label={`Photo collection ${slideIndex + 1}`}
                  >
                    {slidePhotos.map((photo) => (
                      <button
                        type="button"
                        className="scholarship-photo-card"
                        key={photo.id}
                        onClick={() => setActivePhoto(photo.id - 1)}
                        aria-label={`View photograph ${photo.id}`}
                      >
                        {!failedPhotos[photo.id] ? (
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            loading={slideIndex === 0 ? "eager" : "lazy"}
                            decoding="async"
                            onError={() =>
                              setFailedPhotos((current) => ({
                                ...current,
                                [photo.id]: true,
                              }))
                            }
                          />
                        ) : (
                          <span className="scholarship-photo-error">
                            <ImageIcon size={25} />
                            <small>Photo {photo.id} unavailable</small>
                          </span>
                        )}

                        <span className="photo-card-overlay">
                          <span>View photograph</span>
                          <ArrowRight size={16} />
                        </span>

                        <span className="photo-number">
                          {String(photo.id).padStart(2, "0")}
                        </span>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="scholarship-carousel-progress">
            <div
              className="scholarship-carousel-progress-bar"
              style={{
                width: `${((currentSlide + 1) / totalSlides) * 100}%`,
              }}
            />
          </div>

          <p className="scholarship-carousel-hint">
            <ChevronLeft size={14} />
            Use the arrows to explore all {photos.length} photographs
            <ChevronRight size={14} />
          </p>
        </div>

        <p className="scholarship-gallery-note">
          Photographs are presented as supplied. Ensure that images of
          children are published with appropriate consent and that personal
          or sensitive information is not exposed.
        </p>
      </section>

      {/* Closing call to action */}
      <section className="scholarship-cta">
        <div className="scholarship-cta-icon">
          <Heart size={25} />
        </div>

        <span className="scholarship-eyebrow">
          BUILDING A BETTER TOMORROW
        </span>

        <h2>Every opportunity to learn matters.</h2>

        <p>
          Learn more about our society, our educational initiatives,
          and the work we do for the community.
        </p>

        <Link to="/" className="scholarship-primary-btn">
          Return to our homepage <ArrowRight size={17} />
        </Link>

        <small>
          Official programme details will be shared as they are verified.
        </small>
      </section>

      {/* Full-screen photograph viewer */}
      {activePhoto !== null && (
        <div
          className="scholarship-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photograph viewer"
          onClick={() => setActivePhoto(null)}
        >
          <button
            className="lightbox-close"
            onClick={() => setActivePhoto(null)}
            aria-label="Close photograph"
            type="button"
          >
            <X size={25} />
          </button>

          <button
            className="lightbox-arrow lightbox-prev"
            onClick={(event) => {
              event.stopPropagation();
              previousPhoto();
            }}
            aria-label="Previous photograph"
            type="button"
          >
            <ChevronLeft size={29} />
          </button>

          <div
            className="lightbox-image-wrap"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={photos[activePhoto].src}
              alt={photos[activePhoto].alt}
            />

            <div className="lightbox-caption">
              <span>
                Photograph {activePhoto + 1} of {photos.length}
              </span>

              <a
                href={photos[activePhoto].src}
                target="_blank"
                rel="noreferrer"
              >
                Open original <ArrowRight size={14} />
              </a>
            </div>
          </div>

          <button
            className="lightbox-arrow lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              nextPhoto();
            }}
            aria-label="Next photograph"
            type="button"
          >
            <ChevronRight size={29} />
          </button>
        </div>
      )}
    </main>
  );
}
