import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "dark";
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
      localStorage.setItem("theme", state.darkmode ? "dark" : "light");
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;