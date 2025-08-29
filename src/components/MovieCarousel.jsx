import { Carousel, Container, Row, Col } from "react-bootstrap";
import MovieCard from "./MovieCard.jsx";
import SkeletonCard from "./SkeletonCard.jsx";

function chunk(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
}

export default function MovieCarousel({ title, items = [], loading = false }) {
  const slides = loading
    ? [Array.from({ length: 6 }, (_, i) => ({ id: `skel-${i}` }))]
    : chunk(items, 6);

  return (
    <section className="py-4">
      <Container fluid>
        {title && <h2 className="h4 mb-2">{title}</h2>}
        {/* Biarkan mengikuti theme; jangan hardcode variant */}
        <Carousel indicators={!loading} interval={7000} pause="hover">
          {slides.map((group, idx) => (
            <Carousel.Item key={idx} className="px-1">
              <Row className="g-3">
                {group.map((movie, i) => (
                  <Col key={movie.id || i} xs={6} sm={4} md={3} lg={2}>
                    {loading ? <SkeletonCard /> : <MovieCard movie={movie} />}
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
