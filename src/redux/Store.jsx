import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./Slice/CartSlice";
import productReducer from "./Slice/ProductSlice";
import authReducer from "./Slice/AuthSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,      // 👈 lowercase & consistent
    product: productReducer,
    auth: authReducer,
  },
});
