import { useEffect, useState } from "react";
import Hero from "../components/Hero.jsx";
import MovieCarousel from "../components/MovieCarousel.jsx";
import { getHomeLists } from "../services/tmdb.js";
import PageTransition from "../components/PageTransition.jsx";

export default function Home() {
  const [lists, setLists] = useState({ trending: [], topRated: [], newReleases: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getHomeLists();
        if (alive) setLists(data);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <PageTransition>
      <Hero />
      <div className="py-3" />
      <MovieCarousel title="Trending Now" items={lists.trending} loading={loading} />
      <MovieCarousel title="Top Rated" items={lists.topRated} loading={loading} />
      <MovieCarousel title="Now Playing" items={lists.newReleases} loading={loading} />
    </PageTransition>
  );
}
