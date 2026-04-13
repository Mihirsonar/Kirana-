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

      localStorage.setItem("theme", state.darkmode ? "dark" : "light");
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

