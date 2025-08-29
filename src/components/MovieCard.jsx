import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Tilt from "./Tilt.jsx";

export default function MovieCard({ movie }) {
  const { id, title, rating, year, genres, posterUrl } = movie;

  return (
    <Tilt className="h-100" max={8}>
      <motion.div
        whileHover={{ scale: 1.03, y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.25)" }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="h-100"
      >
        {/* Theme-aware (ikuti data-bs-theme) */}
        <Card className="h-100 border-0 poster-card bg-body text-body shadow-sm">
          <Link
            to={`/movie/${id}`}
            className="text-decoration-none"
            aria-label={`Open details for ${title}`}
          >
            <div className="ratio ratio-2x3 rounded overflow-hidden position-relative">
              {/* Lazy-load + decoding async untuk perf */}
              <img
                src={posterUrl}
                alt={`${title} poster`}
                className="poster-img"
                loading="lazy"
                decoding="async"
              />
              <div className="poster-gloss" />
            </div>
          </Link>
          <Card.Body className="px-2 py-3">
            <div className="d-flex justify-content-between align-items-start gap-2">
              <Card.Title as="h3" className="h6 mb-1 text-truncate" title={title}>
                {title}
              </Card.Title>
              <Badge bg="secondary" title="Rating">
                {rating}
              </Badge>
            </div>
            <div className="d-flex flex-wrap gap-2 align-items-center text-secondary small">
              <span>{year}</span>
              <span>•</span>
              <span className="text-truncate" style={{ maxWidth: 140 }}>
                {genres.join(", ")}
              </span>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Tilt>
  );
}
