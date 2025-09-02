import { createSlice } from "@reduxjs/toolkit";

// Load cart from storage
const loadCart = () => {
  try {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error("Error loading cart from storage", err);
    return [];
  }
};

// Save cart to storage
const saveCart = (cartItems) => {
  try {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  } catch (err) {
    console.error("Error saving cart to storage", err);
  }
};

const initialState = {
  cartItems: loadCart(),
};

const cartSlice = createSlice({
  name: "cart", // 👈 lowercase
  initialState,
  reducers: {
    add: (state, action) => {
      const existingItem = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
      saveCart(state.cartItems);
    },
    incrementQuantity: (state, action) => {
      const item = state.cartItems.find((item) => item._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      saveCart(state.cartItems);
    },
    decrementQuantity: (state, action) => {
      const item = state.cartItems.find((item) => item._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item) {
        state.cartItems = state.cartItems.filter(
          (item) => item._id !== action.payload
        );
      }
      saveCart(state.cartItems);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
      saveCart(state.cartItems);
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      saveCart(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const {
  add,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  setCartItems,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
