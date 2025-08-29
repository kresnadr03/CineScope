import { Container } from "react-bootstrap";

export default function AppFooter() {
    return (
        <footer className="bg-dark text-secondary mt-auto border-top border-1 border-secondary-subtle">
            <Container fluid className="py-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
                <small>© {new Date().getFullYear()} CineScope — UI Showcase</small>
                <div className="d-flex gap-3">
                    <a className="link-secondary text-decoration-none" href="https://github.com/" target="_blank" rel="noreferrer">
                        GitHub
                    </a>
                    <a className="link-secondary text-decoration-none" href="https://www.figma.com/" target="_blank" rel="noreferrer">
                        Figma
                    </a>
                    <a className="link-secondary text-decoration-none" href="https://react.dev/" target="_blank" rel="noreferrer">
                        React
                    </a>
                </div>
                <small className="text-secondary">
                    Data by TMDB — This product uses the TMDB API but is not endorsed or certified by TMDB.
                </small>
            </Container>
        </footer>
    );
}
