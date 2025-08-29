import { useCallback, useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Form, Alert, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard.jsx";
import { searchMovies } from "../services/tmdb.js";
import useDebounce from "../hooks/useDebounce.js";
import useInfiniteScroll from "../hooks/useInfiniteScroll.js";
import PageTransition from "../components/PageTransition.jsx";

function useQueryParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Search() {
  const params = useQueryParams();
  const urlQ = params.get("q") || "";

  // input query yang tampil di form
  const [query, setQuery] = useState(urlQ);
  const debouncedQ = useDebounce(query, 450);

  // data & ui state
  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState("All");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const navigate = useNavigate();

  // Sinkronkan input dengan URL TANPA mereset hasil
  useEffect(() => {
    setQuery(urlQ);
  }, [urlQ]);

  // Fetch page 1 saat debounced query berubah
  useEffect(() => {
    let alive = true;
    if (!debouncedQ) {
      setResults([]);
      setTotalPages(1);
      setPage(1);
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const res = await searchMovies(debouncedQ, 1);
        if (!alive) return;
        setResults(res.results || []);
        setTotalPages(res.totalPages || 1);
        setPage(1);
        setGenre("All"); // penting: reset filter genre untuk query baru
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [debouncedQ]);

  // Load halaman berikutnya (infinite scroll)
  useEffect(() => {
    let alive = true;
    if (!debouncedQ || page <= 1) return;
    setLoadingMore(true);
    (async () => {
      try {
        const res = await searchMovies(debouncedQ, page);
        if (!alive) return;
        setResults(prev => {
          const seen = new Set(prev.map(m => m.id));
          const next = (res.results || []).filter(m => !seen.has(m.id));
          return [...prev, ...next];
        });
        setTotalPages(res.totalPages || 1);
      } finally {
        if (alive) setLoadingMore(false);
      }
    })();
    return () => { alive = false; };
  }, [page, debouncedQ]);

  // Genre list dari hasil
  const genres = useMemo(() => {
    const s = new Set();
    results.forEach(m => m.genres.forEach(g => s.add(g)));
    return ["All", ...Array.from(s).sort()];
  }, [results]);

  // Filter client-side
  const filtered = useMemo(
    () => (genre === "All" ? results : results.filter(m => m.genres.includes(genre))),
    [results, genre]
  );

  // Infinite scroll sentinel
  const canLoadMore = debouncedQ && page < totalPages && !loading && !loadingMore;
  const onIntersect = useCallback(() => { if (canLoadMore) setPage(p => p + 1); }, [canLoadMore]);
  const sentinelRef = useInfiniteScroll(onIntersect, !!canLoadMore, "800px");

  // Submit manual: sinkronkan URL (tanpa fetch paksa; debounce yang handle)
  const onSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <PageTransition>
      <Container fluid className="py-4">
        <h1 className="h3 mb-3">Search</h1>

        <Form className="d-flex gap-2 mb-3" onSubmit={onSubmit}>
          <Form.Control
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
          />
          <Form.Select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            style={{ maxWidth: 220 }}
          >
            {genres.map((g) => <option key={g}>{g}</option>)}
          </Form.Select>
        </Form>

        {!debouncedQ && !loading && (
          <Alert variant="secondary">Start typing to search for movies.</Alert>
        )}

        <Row className="g-3">
          {(loading ? Array.from({ length: 12 }) : filtered).map((m, i) => (
            <Col key={m?.id || i} xs={6} sm={4} md={3} lg={2}>
              {loading ? (
                <div className="ratio ratio-2x3 bg-secondary bg-opacity-25 rounded" />
              ) : (
                <MovieCard movie={m} />
              )}
            </Col>
          ))}
        </Row>

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} />

        {loadingMore && (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" role="status" aria-hidden="true" />
            <span className="ms-2">Loading more…</span>
          </div>
        )}

        {/* Bedakan kosong karena query vs karena filter genre */}
        {!loading && debouncedQ && results.length === 0 && (
          <Alert variant="dark" className="mt-3">No results for “{debouncedQ}”.</Alert>
        )}
        {!loading && debouncedQ && results.length > 0 && filtered.length === 0 && (
          <Alert variant="secondary" className="mt-3">
            No matches in genre “{genre}”. Try “All”.
          </Alert>
        )}
      </Container>
    </PageTransition>
  );
}
