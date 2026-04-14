import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "./cartApiSlice";

interface CartState {
  guestItems: CartItem[];
}

const GUEST_CART_KEY = "avto_guest_cart";

const initialState: CartState = {
  guestItems: typeof window !== "undefined" 
    ? JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]") 
    : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setGuestItems: (state, action: PayloadAction<CartItem[]>) => {
      state.guestItems = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(action.payload));
      }
    },
    clearGuestCart: (state) => {
      state.guestItems = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem(GUEST_CART_KEY);
      }
    },
  },
});

export const { setGuestItems, clearGuestCart } = cartSlice.actions;
export default cartSlice.reducer;
