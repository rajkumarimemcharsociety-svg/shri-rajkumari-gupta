
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Image as ImageIcon,
  Pause,
  Play,
  Scissors,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./ScholarshipPage.css";

const photoNames = [
  "1.jpeg",
  "2.jpeg",
  "3.jpeg",
  "4.jpeg",
  "5.jpeg",
  "6.jpeg",
  "7.jpeg",
  "8.jpeg",
  "9.jpeg",
  "10.jpeg",
  "WhatsApp Image 2023-10-08 at 18.32.43 (1).jpeg",
  "WhatsApp Image 2023-10-08 at 18.32.43 (2).jpeg",
  "WhatsApp Image 2023-10-08 at 18.32.43 (3).jpeg",
  "WhatsApp Image 2023-10-08 at 18.32.43 (4).jpeg",
  "WhatsApp Image 2023-10-08 at 18.32.43 (6).jpeg",
  "WhatsApp Image 2023-10-08 at 18.32.44 (1).jpeg",
  "WhatsApp Image 2023-10-08 at 18.32.44 (2).jpeg",
  "WhatsApp Image 2023-10-08 at 18.32.44 (3).jpeg",
  "WhatsApp Image 2023-10-08 at 18.32.44 (4).jpeg",
  "WhatsApp Image 2023-10-08 at 18.32.44 (5).jpeg",
  "WhatsApp Image 2023-10-08 at 18.32.44.jpeg",
  "WhatsApp Image 2023-10-08 at 18.32.45 (1).jpeg",
  "WhatsApp Image 2023-10-08 at 18.32.45 (2).jpeg",
  "WhatsApp Image 2023-10-08 at 18.32.45.jpeg",
  "WhatsApp Image 2023-10-08 at 18.32.46 (1).jpeg",
  "WhatsApp Image 2023-10-08 at 18.32.46.jpeg",
];

const photos = photoNames.map((name, index) => ({
  id: index + 1,
  src: `/images/womens-training/${encodeURIComponent(name)}`,
  alt: `Women's skill training centre photograph ${index + 1}`,
}));

const PHOTOS_PER_SLIDE = 4;
const totalSlides = Math.ceil(photos.length / PHOTOS_PER_SLIDE);

export default function WomensTrainingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activePhoto, setActivePhoto] = useState(null);
  const [failedPhotos, setFailedPhotos] = useState({});

  useEffect(() => {
    if (!isPlaying || activePhoto !== null) return;

    const timer = window.setInterval(() => {
      setCurrentSlide((current) => (current + 1) % totalSlides);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [isPlaying, activePhoto]);

  useEffect(() => {
    if (activePhoto === null) return;

    const oldOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActivePhoto(null);
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
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhoto]);

  const previousSlide = () =>
    setCurrentSlide((current) => (current - 1 + totalSlides) % totalSlides);

  const nextSlide = () =>
    setCurrentSlide((current) => (current + 1) % totalSlides);

  const previousPhoto = () =>
    setActivePhoto((current) =>
      current === null ? null : (current - 1 + photos.length) % photos.length
    );

  const nextPhoto = () =>
    setActivePhoto((current) =>
      current === null ? null : (current + 1) % photos.length
    );

  return (
    <main className="scholarship-page">
      <div className="scholarship-topline">
        <span>Skills</span><span className="topline-dot">•</span>
        <span>Confidence</span><span className="topline-dot">•</span>
        <span>Opportunity for women</span>
      </div>

      <header className="scholarship-nav">
        <Link to="/" className="scholarship-brand">
          <span className="scholarship-brand-icon"><BookOpen size={25} /></span>
          <span>
            <strong>SHRI RAJKUMARI GUPTA</strong>
            <small>EDUCATION &amp; SOCIAL WELFARE</small>
          </span>
        </Link>

        <nav className="scholarship-nav-links" aria-label="Training navigation">
          <Link to="/">Home</Link>
          <a href="#about-training">About</a>
          <a href="#training-gallery">Gallery</a>
        </nav>

        <Link to="/#contact" className="scholarship-nav-cta">
          Back To Home <ArrowLeft size={15} />
        </Link>
      </header>

      <section className="scholarship-hero">
        <div className="scholarship-hero-decoration decoration-one" />
        <div className="scholarship-hero-decoration decoration-two" />

        <div className="scholarship-hero-content">
          <Link to="/" className="scholarship-back-link">
            <ArrowLeft size={15} /> Back to homepage
          </Link>

          <span className="scholarship-eyebrow">
            <span /> WOMEN'S SKILL DEVELOPMENT
          </span>

          <h1>
            Skills that create
            <br />
            <em>new possibilities.</em>
          </h1>

          <p>
            Practical skills can help women grow in confidence, explore
            opportunities, and work towards greater independence. Discover
            moments from our Women's Skill Training Centre.
          </p>

          <a href="#about-training" className="scholarship-primary-btn">
            Discover the programme <ArrowRight size={17} />
          </a>

          <div className="scholarship-hero-note">
            <Scissors size={17} />
            <span>Learning practical skills for a brighter future</span>
          </div>
        </div>

        <div className="scholarship-hero-art" aria-hidden="true">
          <div className="hero-art-circle" />
          <div className="hero-art-card">
            <Scissors size={78} strokeWidth={1.1} />
            <span>Knowledge, creativity and skills can open doors.</span>
          </div>
          <div className="hero-art-orbit" />
        </div>

        <a href="#training-gallery" className="hero-scroll-link">
          Explore training photographs <ArrowDown size={15} />
        </a>
      </section>

      <section id="about-training" className="scholarship-intro">
        <div className="scholarship-intro-heading">
          <span className="scholarship-eyebrow">LEARNING THROUGH PRACTICE</span>
          <h2>
            Building skills.
            <br />
            Creating opportunity.
          </h2>
        </div>

        <div className="scholarship-intro-copy">
          <p>
            SHRI RAJKUMARI GUPTA Education and Social Welfare includes
            women's skill training among its community initiatives.
          </p>
          <p>
            The programme description includes basic and advanced training
            in stitching, beautician skills, and mehndi. Practical learning
            can help participants develop useful skills and confidence.
          </p>

          <div className="scholarship-principles">
            <div>
              <span className="principle-icon"><Scissors size={20} /></span>
              <span>
                <strong>Practical skills</strong>
                <small>Stitching and creative skill development</small>
              </span>
            </div>
            <div>
              <span className="principle-icon"><Heart size={20} /></span>
              <span>
                <strong>Confidence and dignity</strong>
                <small>Encouraging learning in a supportive setting</small>
              </span>
            </div>
            <div>
              <span className="principle-icon"><CheckCircle2 size={20} /></span>
              <span>
                <strong>Greater opportunity</strong>
                <small>Building skills that may support livelihoods</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="training-gallery" className="scholarship-gallery-section">
        <div className="scholarship-gallery-heading">
          <div>
            <span className="scholarship-eyebrow">LIFE AT THE TRAINING CENTRE</span>
            <h2>Every skill starts with learning.</h2>
            <p>
              Explore photographs from the Women's Skill Training Centre.
              Select any photograph to view it in full screen.
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
              <strong>{String(currentSlide + 1).padStart(2, "0")}</strong>
              {" / "}{String(totalSlides).padStart(2, "0")}
              <span className="carousel-toolbar-label"> photo collections</span>
            </span>

            <div className="scholarship-carousel-controls">
              <button type="button" className="carousel-control"
                onClick={previousSlide} aria-label="Previous collection">
                <ChevronLeft size={19} />
              </button>
              <button type="button"
                className="carousel-control carousel-play-control"
                onClick={() => setIsPlaying((playing) => !playing)}
                aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}>
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button type="button" className="carousel-control"
                onClick={nextSlide} aria-label="Next collection">
                <ChevronRight size={19} />
              </button>
            </div>
          </div>

          <div className="scholarship-carousel-viewport">
            <div className="scholarship-carousel-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div className="scholarship-carousel-slide" key={slideIndex}>
                  {photos.slice(
                    slideIndex * PHOTOS_PER_SLIDE,
                    (slideIndex + 1) * PHOTOS_PER_SLIDE
                  ).map((photo) => (
                    <button type="button"
                      className="scholarship-photo-card"
                      key={photo.id}
                      onClick={() => setActivePhoto(photo.id - 1)}
                      aria-label={`View photograph ${photo.id}`}>
                      {!failedPhotos[photo.id] ? (
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          loading={slideIndex === 0 ? "eager" : "lazy"}
                          decoding="async"
                          onError={() => setFailedPhotos((old) => ({
                            ...old, [photo.id]: true,
                          }))}
                        />
                      ) : (
                        <span className="scholarship-photo-error">
                          <ImageIcon size={25} />
                          <small>Photo {photo.id} unavailable</small>
                        </span>
                      )}
                      <span className="photo-card-overlay">
                        <span>View photograph</span><ArrowRight size={16} />
                      </span>
                      <span className="photo-number">
                        {String(photo.id).padStart(2, "0")}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="scholarship-carousel-progress">
            <div className="scholarship-carousel-progress-bar"
              style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }} />
          </div>

          <p className="scholarship-carousel-hint">
            <ChevronLeft size={14} />
            Use the arrows to explore all {photos.length} photographs
            <ChevronRight size={14} />
          </p>
        </div>

        <p className="scholarship-gallery-note">
          Please ensure that photographs are published with appropriate
          permission and that personal or sensitive information is not exposed.
        </p>
      </section>

      <section className="scholarship-cta">
        <div className="scholarship-cta-icon"><Heart size={25} /></div>
        <span className="scholarship-eyebrow">EMPOWERING THROUGH LEARNING</span>
        <h2>Every new skill can open a door.</h2>
        <p>
          Learn more about our society and its work to create educational
          and practical opportunities within the community.
        </p>
        <Link to="/" className="scholarship-primary-btn">
          Return to homepage <ArrowRight size={17} />
        </Link>
        <small>Programme details can be updated as verified information becomes available.</small>
      </section>

      {activePhoto !== null && (
        <div className="scholarship-lightbox" role="dialog" aria-modal="true"
          aria-label="Training photograph viewer"
          onClick={() => setActivePhoto(null)}>
          <button className="lightbox-close" type="button"
            onClick={() => setActivePhoto(null)} aria-label="Close photograph">
            <X size={25} />
          </button>

          <button className="lightbox-arrow lightbox-prev" type="button"
            onClick={(event) => { event.stopPropagation(); previousPhoto(); }}
            aria-label="Previous photograph">
            <ChevronLeft size={29} />
          </button>

          <div className="lightbox-image-wrap"
            onClick={(event) => event.stopPropagation()}>
            <img src={photos[activePhoto].src} alt={photos[activePhoto].alt} />
            <div className="lightbox-caption">
              <span>Photograph {activePhoto + 1} of {photos.length}</span>
              <a href={photos[activePhoto].src} target="_blank" rel="noreferrer">
                Open original <ArrowRight size={14} />
              </a>
            </div>
          </div>

          <button className="lightbox-arrow lightbox-next" type="button"
            onClick={(event) => { event.stopPropagation(); nextPhoto(); }}
            aria-label="Next photograph">
            <ChevronRight size={29} />
          </button>
        </div>
      )}
    </main>
  );
}
