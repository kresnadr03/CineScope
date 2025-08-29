import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="hero-wrap position-relative overflow-hidden">
      <img
        className="hero-bg"
        src="https://picsum.photos/id/1018/1920/1080"
        alt="Cinematic background"
        decoding="async"
      />
      <div className="hero-overlay" />
      <Container className="position-relative z-2 py-5" style={{ minHeight: "60vh" }}>
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
          className="col-12 col-lg-8"
        >
          <h1 className="display-4 fw-bold">Watch what moves you.</h1>
          <p className="lead text-secondary">
            Explore trending titles with buttery-smooth interactions and delightful animations.
          </p>
          <div className="d-flex gap-2">
            <Button
              variant="primary"
              onClick={() => navigate("/search")}
              aria-label="Go to search page"
            >
              Explore Now
            </Button>
            <Button
              variant="outline-light"
              onClick={() =>
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
              }
              aria-label="Scroll to trending section"
            >
              See What's Trending
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
