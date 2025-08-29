import { useEffect, useMemo, useState } from "react";
import { Navbar, Nav, Container, Form, Button } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";
import DarkModeToggle from "./DarkModeToggle.jsx";

export default function MainNavbar() {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("q") || "");
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const navClass = useMemo(
    () => `py-2 ${scrolled ? "navbar-scrolled" : ""}`,
    [scrolled]
  );

  const bg = theme === "dark" ? "dark" : "light";
  const variant = bg;

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="sticky-top z-3"
    >
      <Navbar bg={bg} variant={variant} expand="lg" className={navClass}>
        <Container fluid>
          <Navbar.Brand as={NavLink} to="/" className="fw-bold">
            CineScope
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
              <Nav.Link as={NavLink} to="/search">Search</Nav.Link>
            </Nav>

            <Form className="d-flex gap-2 align-items-center" onSubmit={handleSubmit} role="search">
              <Form.Control
                type="search"
                placeholder="Search movies..."
                aria-label="Search movies"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="submit" variant="primary">Search</Button>
              <DarkModeToggle />
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </motion.nav>
  );
}
