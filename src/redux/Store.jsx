import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./Slice/CartSlice";
import productReducer from "./Slice/ProductSlice";
import authReducer from "./Slice/AuthSlice";
import themeReducer from "./Slice/ThemeSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,      
    product: productReducer,
    auth: authReducer,
    theme: themeReducer,
  },
});
