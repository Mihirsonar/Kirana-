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
      state.products = action.payload || [];
      const query = (state.searchQuery || '').trim().toLowerCase();
      state.filteredProducts = query
        ? state.products.filter(
            (p) =>
              p.name?.toLowerCase().includes(query) ||
              p.description?.toLowerCase().includes(query)
          )
        : state.products;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload || '';
      const query = state.searchQuery.trim().toLowerCase();
      state.filteredProducts = query
        ? state.products.filter(
            (p) =>
              p.name?.toLowerCase().includes(query) ||
              p.description?.toLowerCase().includes(query)
          )
        : state.products;
    },
  },
});

export const { setProducts, setSearchQuery } = productSlice.actions;
export default productSlice.reducer;


