import { createSlice } from "@reduxjs/toolkit";

const initialState= { 
  user :JSON.parse(localStorage.getItem("User")),
 };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state,action) => {
      state.user=action.payload;
      // localStorage.setitem("Token",JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      // localStorage.removeItem("Token") 
       },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
