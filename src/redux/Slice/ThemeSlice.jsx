import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    return savedTheme === "dark";
  }
  return typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const initialState = {
  darkmode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkmode = !state.darkmode;
      const themeValue = state.darkmode ? "dark" : "light";
      localStorage.setItem("theme", themeValue);
      if (typeof document !== "undefined") {
        if (state.darkmode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    },
    setTheme: (state, action) => {
      state.darkmode = !!action.payload;
      const themeValue = state.darkmode ? "dark" : "light";
      localStorage.setItem("theme", themeValue);
      if (typeof document !== "undefined") {
        if (state.darkmode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;