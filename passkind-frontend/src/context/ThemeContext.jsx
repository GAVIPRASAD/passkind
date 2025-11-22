import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Theme: 'dark' | 'light'
  // ColorScheme: 'monochrome' | 'teal' | 'blue'
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [colorScheme, setColorScheme] = useState(
    localStorage.getItem("colorScheme") || "monochrome"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    // Remove old color classes if any (implementation depends on CSS strategy,
    // here we just store state for components to use or set data attributes)
    root.setAttribute("data-color-scheme", colorScheme);
    localStorage.setItem("colorScheme", colorScheme);
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, toggleTheme, colorScheme, setColorScheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
