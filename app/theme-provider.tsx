// import { createContext, useEffect, useState, ReactNode } from "react";

// type Theme = "light" | "dark";
// type ThemeContextType = { theme: Theme; toggleTheme: () => void };

// export const ThemeContext = createContext<ThemeContextType | undefined>(
//   undefined
// );

// export function ThemeProvider({ children }: { children: ReactNode }) {
//   const [theme, setTheme] = useState<Theme>("light");
//   const [isMounted, setIsMounted] = useState(false);

//   // Load theme from localStorage only on the client
//   useEffect(() => {
//     setIsMounted(true); // Ensures this runs only on client-side
//     const storedTheme = localStorage.getItem("theme") as Theme | null;
//     if (storedTheme) {
//       setTheme(storedTheme);
//       document.documentElement.classList.toggle("dark", storedTheme === "dark");
//     }
//   }, []);

//   useEffect(() => {
//     if (isMounted) {
//       document.documentElement.classList.toggle("dark", theme === "dark");
//       localStorage.setItem("theme", theme);
//     }
//   }, [theme, isMounted]);

//   const toggleTheme = () =>
//     setTheme((prev) => (prev === "light" ? "dark" : "light"));

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

import { createContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [isMounted, setIsMounted] = useState(false);

  // Detect system theme
  const getSystemTheme = (): "light" | "dark" => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // Apply theme based on user preference or system theme
  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const activeTheme =
      storedTheme === "system" ? getSystemTheme() : storedTheme || "system";

    setTheme(storedTheme || "system");
    document.documentElement.classList.toggle("dark", activeTheme === "dark");
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      const handleSystemThemeChange = () => {
        document.documentElement.classList.toggle(
          "dark",
          getSystemTheme() === "dark"
        );
      };

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () =>
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }
  }, [theme]);

  // Update localStorage and apply theme when user selects an option
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("theme", theme);
      document.documentElement.classList.toggle(
        "dark",
        theme === "dark" || (theme === "system" && getSystemTheme() === "dark")
      );
    }
  }, [theme, isMounted]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "light" ? "dark" : prev === "dark" ? "system" : "light"
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
