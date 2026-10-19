
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./SamuhikVivahPage.css";

// Vite discovers images automatically, including when you add more later.

const allImages = import.meta.glob(
  "../assets/samuhik-vivah/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true, query: "?url", import: "default" }
);



const events = [
  { id: "3rd", title: "3rd Samuhik Vivah", date: "8 March 2015" },
  { id: "4th", title: "4th Samuhik Vivah", date: "28 February 2016" },
  { id: "5th", title: "5th Samuhik Vivah", date: "18 February 2018" },
  { id: "6th", title: "6th Samuhik Vivah", date: "1 December 2019" },
  { id: "8th", title: "8th Samuhik Vivah", date: "27 November 2022" },
];


export default function SamuhikVivahPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activePhoto, setActivePhoto] = useState(null);

  const eventPhotos = useMemo(() => {
    return Object.fromEntries(
      events.map((event) => {
        const photos = Object.entries(allImages)
          .filter(([path]) =>
            path.includes(`/samuhik-vivah/${event.id}/`)
          )
          .sort(([a], [b]) =>
            a.localeCompare(b, undefined, { numeric: true })
          )
          .map(([path, src]) => ({
            src,
            alt: `${event.title} community wedding photograph`,
            name: path.split("/").pop(),
          }));

        return [event.id, photos];
      })
    );
  }, []);

  const visibleEvents = selectedEvent
    ? events.filter((event) => event.id === selectedEvent)
    : events;

  const currentEvent = events.find(
    (event) => event.id === selectedEvent
  );

  const photos = selectedEvent ? eventPhotos[selectedEvent] : [];

  function closeGallery() {
    setSelectedEvent(null);
    setActivePhoto(null);
  }

  function changePhoto(direction) {
    setActivePhoto((current) => {
      if (current === null || photos.length === 0) return current;
      return (current + direction + photos.length) % photos.length;
    });
  }

  return (
    <main className="samuhik-page">
      <div className="samuhik-topbar">
        <Link to="/" className="samuhik-brand">
          <span className="samuhik-brand-icon">
            <HeartHandshake size={25} />
          </span>
          <span>
            <strong>SHRI RAJKUMARI GUPTA</strong>
            <small>Education & Social Welfare</small>
          </span>
        </Link>

        <Link to="/" className="samuhik-home-link">
          <ArrowLeft size={17} /> Back to Home
        </Link>
      </div>

      <section className="samuhik-hero">
        <span className="samuhik-eyebrow">
          OUR COMMUNITY INITIATIVE
        </span>
        <h1>Samuhik Vivah Gallery</h1>
        <p>
          Celebrating new beginnings, dignity and togetherness.
          Explore photographs from our community wedding events.
        </p>

        <div className="samuhik-hero-meta">
          <span><Camera size={17} /> 5 event galleries</span>
          <span><HeartHandshake size={17} /> Community support</span>
        </div>
      </section>

      <section className="samuhik-content">
        {selectedEvent && (
          <button
            className="samuhik-back-button"
            onClick={closeGallery}
          >
            <ArrowLeft size={17} /> All marriage events
          </button>
        )}

        <div className="samuhik-section-heading">
          <div>
            <span className="samuhik-eyebrow">
              {selectedEvent ? "EVENT PHOTOGRAPHS" : "OUR JOURNEY"}
            </span>
            <h2>
              {currentEvent
                ? currentEvent.title
                : "Marriage Events"}
            </h2>
            <p>
              {currentEvent
                ? `Memories from ${currentEvent.date}`
                : "Choose an event to explore its photographs."}
            </p>
          </div>
        </div>

        {!selectedEvent ? (
          <div className="samuhik-event-grid">
            {events.map((event) => {
              const images = eventPhotos[event.id];
              const cover = images[0];

              return (
                <button
                  type="button"
                  className="samuhik-event-card"
                  key={event.id}
                  onClick={() => setSelectedEvent(event.id)}
                >
                  <div className="samuhik-card-image">
                    {cover ? (
                      <img src={cover.src} alt={cover.alt} loading="lazy" />
                    ) : (
                      <div className="samuhik-empty-cover">
                        <Camera size={36} />
                        <span>Photographs coming soon</span>
                      </div>
                    )}

                    <span className="samuhik-event-number">
                      {event.id.toUpperCase()}
                    </span>
                  </div>

                  <div className="samuhik-card-body">
                    <h3>{event.title}</h3>
                    <p className="samuhik-event-date">
                      <CalendarDays size={16} />
                      {event.date}
                    </p>
                    <div className="samuhik-card-footer">
                      <span>
                        {images.length} {images.length === 1 ? "photo" : "photos"}
                      </span>
                      <span className="samuhik-view-link">
                        View gallery <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : photos.length === 0 ? (
          <div className="samuhik-no-photos">
            <Camera size={42} />
            <h3>No photographs found yet</h3>
            <p>
              Add this event's photos to
              {" "}src/assets/samuhik-vivah/{selectedEvent}/
              {" "}and they will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="samuhik-photo-grid">
            {photos.map((photo, index) => (
              <button
                type="button"
                className="samuhik-photo-card"
                key={photo.src}
                onClick={() => setActivePhoto(index)}
                aria-label={`Open photograph ${index + 1}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                />
                <span className="samuhik-photo-overlay">
                  <Camera size={19} />
                  View photo
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      <footer className="samuhik-footer">
        <p>
          SHRI RAJKUMARI GUPTA Education & Social Welfare
        </p>
        <span>Working together for a more caring community.</span>
      </footer>

      {activePhoto !== null && photos[activePhoto] && (
        <div
          className="samuhik-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photograph viewer"
          onClick={() => setActivePhoto(null)}
        >
          <button
            className="samuhik-lightbox-close"
            onClick={() => setActivePhoto(null)}
            aria-label="Close photo"
          >
            <X size={26} />
          </button>

          {photos.length > 1 && (
            <button
              className="samuhik-lightbox-arrow samuhik-lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                changePhoto(-1);
              }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={30} />
            </button>
          )}

          <img
            className="samuhik-lightbox-image"
            src={photos[activePhoto].src}
            alt={photos[activePhoto].alt}
            onClick={(e) => e.stopPropagation()}
          />

          {photos.length > 1 && (
            <button
              className="samuhik-lightbox-arrow samuhik-lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                changePhoto(1);
              }}
              aria-label="Next photo"
            >
              <ChevronRight size={30} />
            </button>
          )}

          <p className="samuhik-lightbox-count">
            {activePhoto + 1} / {photos.length}
          </p>
        </div>
      )}
    </main>
  );
}
