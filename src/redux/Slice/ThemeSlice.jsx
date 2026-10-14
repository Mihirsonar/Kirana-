import { createSlice } from "@reduxjs/toolkit";

const getSavedThemeMode = () => {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("theme_mode") || (localStorage.getItem("theme") === "dark" ? "dark" : "light");
};

const resolveIsDark = (mode) => {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
};

const initialMode = getSavedThemeMode();
const initialDark = resolveIsDark(initialMode);

const applyDocumentTheme = (isDark) => {
  if (typeof document !== "undefined") {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
};

const initialState = {
  mode: initialMode, // 'light' | 'dark' | 'system'
  darkmode: initialDark,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const nextIsDark = !state.darkmode;
      state.darkmode = nextIsDark;
      state.mode = nextIsDark ? "dark" : "light";
      localStorage.setItem("theme_mode", state.mode);
      localStorage.setItem("theme", nextIsDark ? "dark" : "light");
      applyDocumentTheme(nextIsDark);
    },
    setThemeMode: (state, action) => {
      const mode = action.payload; // 'light' | 'dark' | 'system'
      state.mode = mode;
      const isDark = resolveIsDark(mode);
      state.darkmode = isDark;
      localStorage.setItem("theme_mode", mode);
      localStorage.setItem("theme", isDark ? "dark" : "light");
      applyDocumentTheme(isDark);
    },
    setTheme: (state, action) => {
      const isDark = !!action.payload;
      state.darkmode = isDark;
      state.mode = isDark ? "dark" : "light";
      localStorage.setItem("theme_mode", state.mode);
      localStorage.setItem("theme", isDark ? "dark" : "light");
      applyDocumentTheme(isDark);
    },
  },
});

export const { toggleTheme, setThemeMode, setTheme } = themeSlice.actions;
export default themeSlice.reducer;