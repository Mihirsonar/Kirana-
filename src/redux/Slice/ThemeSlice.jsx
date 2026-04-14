import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  darkmode: localStorage.getItem("theme") === "dark",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
toggleTheme: (state) => {
  state.darkmode = !state.darkmode;

  const theme = state.darkmode ? "dark" : "light";
  localStorage.setItem("theme", theme);

  document.documentElement.classList.toggle("dark", state.darkmode);
},
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

