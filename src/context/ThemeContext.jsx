import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // load: localStorage → prefers-color-scheme → "dark"
  const getInitial = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    if (window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
    return "dark";
  };

  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    // Bootstrap 5.3 color mode
    document.documentElement.setAttribute("data-bs-theme", theme);
    // optional: for your own CSS hooks
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
