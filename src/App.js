import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import Search from "./pages/Search.jsx";
import MainNavbar from "./components/MainNavbar.jsx";
import AppFooter from "./components/AppFooter.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      {/* key penting supaya exit animation terpanggil */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <div className="main-wrap">
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <MainNavbar />
          <main>
            <AnimatedRoutes />
          </main>
          <AppFooter />
        </Router>
      </ThemeProvider>
    </div>
  );
}
