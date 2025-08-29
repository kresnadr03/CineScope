import axios from "axios";
console.log("TMDB KEY:", process.env.REACT_APP_TMDB_KEY);


const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: process.env.REACT_APP_TMDB_KEY,
    language: "en-US",
  },
});

const IMG_BASE = process.env.REACT_APP_TMDB_IMG_BASE || "https://image.tmdb.org/t/p";

export function imgUrl(path, size = "w500") {
  return path ? `${IMG_BASE}/${size}${path}` : `https://picsum.photos/500/750?random=${Math.floor(Math.random() * 1000)}`;
}

// --- sessionStorage cache helpers ---
function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { exp, val } = JSON.parse(raw);
    if (Date.now() > exp) {
      sessionStorage.removeItem(key);
      return null;
    }
    return val;
  } catch {
    return null;
  }
}

function writeCache(key, val, ttlSec = 600) {
  sessionStorage.setItem(key, JSON.stringify({ exp: Date.now() + ttlSec * 1000, val }));
}

async function cachedGet(key, url, params = {}, ttlSec = 600) {
  const cached = readCache(key);
  if (cached) return cached;
  const { data } = await api.get(url, { params });
  writeCache(key, data, ttlSec);
  return data;
}

// --- genres cache in-memory ---
let genreMap = null;
export async function getGenres() {
  if (genreMap) return genreMap;
  const fromCache = readCache("genres_v1");
  if (fromCache) {
    genreMap = fromCache;
    return genreMap;
  }
  const { data } = await api.get("/genre/movie/list");
  genreMap = Object.fromEntries((data.genres || []).map((g) => [g.id, g.name]));
  writeCache("genres_v1", genreMap, 24 * 3600);
  return genreMap;
}

function transformMovie(raw, gm) {
  return {
    id: raw.id,
    title: raw.title || raw.name,
    year: raw.release_date ? new Date(raw.release_date).getFullYear() : "—",
    rating: raw.vote_average ? Number(raw.vote_average).toFixed(1) : "—",
    genres: (raw.genre_ids || []).map((id) => gm[id]).filter(Boolean),
    posterUrl: imgUrl(raw.poster_path, "w500"),
    backdropUrl: imgUrl(raw.backdrop_path, "w1280"),
    overview: raw.overview || "",
  };
}

export async function getHomeLists() {
  const gm = await getGenres();
  const [trending, top, now] = await Promise.all([
    cachedGet("list_trending", "/trending/movie/week", {}, 900),
    cachedGet("list_top", "/movie/top_rated", {}, 900),
    cachedGet("list_now", "/movie/now_playing", {}, 900),
  ]);
  return {
    trending: (trending.results || []).map((m) => transformMovie(m, gm)),
    topRated: (top.results || []).map((m) => transformMovie(m, gm)),
    newReleases: (now.results || []).map((m) => transformMovie(m, gm)),
  };
}

export async function searchMovies(query, page = 1) {
  const gm = await getGenres();
  const data = await cachedGet(
    `search_${query}_${page}`,
    "/search/movie",
    { query, page, include_adult: false },
    300
  );
  return {
    page: data.page,
    totalPages: data.total_pages,
    results: (data.results || []).map((m) => transformMovie(m, gm)),
  };
}

export async function getMovieDetails(id) {
  const gm = await getGenres();
  const data = await cachedGet(
    `movie_${id}`,
    `/movie/${id}`,
    { append_to_response: "videos,recommendations" },
    1800
  );
  const trailer = (data.videos?.results || []).find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  return {
    info: transformMovie(data, gm),
    runtime: data.runtime,
    genresFull: (data.genres || []).map((g) => g.name),
    trailerKey: trailer?.key || null,
    recommendations: (data.recommendations?.results || []).map((m) => transformMovie(m, gm)),
  };
}
