import { configureStore } from '@reduxjs/toolkit'
import  cartSlice  from './Slice/CartSlice'
import productReducer from './Slice/ProductSlice';
import authSlice from './Slice/AuthSlice';


export const store = configureStore({
  reducer: {
    Cart: cartSlice,
    product: productReducer,
    auth :authSlice,
  },
})