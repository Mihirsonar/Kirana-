// import { createSlice } from "@reduxjs/toolkit";

// const initialState= { 
//   user :JSON.parse(localStorage.getItem("User")),
//  };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     login: (state,action) => {
//       state.user=action.payload;
//       // localStorage.setitem("Token",JSON.stringify(action.payload));
//     },
//     logout: (state) => {
//       state.user = null;
//       // localStorage.removeItem("Token") 
//        },
//   },
// });

// export const { login, logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: null,
    token: null, 
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload.user; 
      state.token = action.payload.token;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null; 
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;