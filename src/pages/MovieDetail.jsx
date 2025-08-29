import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Badge, Button, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import { getMovieDetails } from "../services/tmdb.js";
import MovieCarousel from "../components/MovieCarousel.jsx";
import PageTransition from "../components/PageTransition.jsx";

export default function MovieDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await getMovieDetails(id);
      if (alive) setData(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    })();
    return () => { alive = false; };
  }, [id]);

  if (!data) {
    return (
      <div style={{ minHeight: "60vh" }} className="d-flex align-items-center justify-content-center">
        Loading...
      </div>
    );
  }

  const { info, runtime, genresFull, trailerKey, recommendations } = data;

  return (
    <PageTransition>
      <>
        <section className="position-relative">
          <img
            src={info.backdropUrl}
            alt=""
            className="w-100"
            style={{ maxHeight: "60vh", objectFit: "cover", filter: "brightness(.5)" }}
          />
          <Container className="position-absolute top-0 start-50 translate-middle-x h-100 d-flex align-items-end pb-4">
            <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <h1 className="display-5 fw-bold">{info.title}</h1>
              <div className="d-flex flex-wrap align-items-center gap-2 text-secondary mb-3">
                <span>{info.year}</span> <span>•</span>
                {genresFull.map((g) => (
                  <Badge key={g} bg="secondary">{g}</Badge>
                ))}
                <span>•</span>
                <span>{runtime} min</span>
                <span>•</span>
                <Badge bg="info">⭐ {info.rating}</Badge>
              </div>
              <p className="lead text-body">{info.overview}</p>
              {trailerKey && (
                <Button variant="primary" onClick={() => setShowTrailer(true)}>
                  Watch Trailer
                </Button>
              )}
            </motion.div>
          </Container>
        </section>

        <Container className="py-4">
          <h2 className="h4 mb-3">Recommended</h2>
          <MovieCarousel title="" items={recommendations.slice(0, 12)} />
        </Container>

        <Modal size="lg" show={showTrailer} onHide={() => setShowTrailer(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Trailer</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <div className="ratio ratio-16x9">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Modal.Body>
        </Modal>
      </>
    </PageTransition>
  );
}
