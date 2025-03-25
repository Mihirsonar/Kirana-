// redux/Slice/ProductSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  filteredProducts: [],
  searchQuery: '',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.filteredProducts = action.payload; // Initialize with all products
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      // Filter products based on the search query
      state.filteredProducts = state.products.filter((product) =>
        product.name.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
  },
});

export const { setProducts, setSearchQuery } = productSlice.actions;
export default productSlice.reducer;
