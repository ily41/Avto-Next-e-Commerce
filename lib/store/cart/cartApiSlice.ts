import { api } from "../api";
import { Product } from "../../api/types";

export interface CartItem {
  id: string; // Internal id for cart item, usually a guid
  cartId?: string;
  productId: string;
  productName?: string;
  productSku?: string;
  productDescription?: string;
  productImageUrl?: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  createdAt?: string;

  // Additional frontend-only metadata for guest cart mainly
  product?: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subTotal: number;
  totalAmount: number;
  totalPriceBeforeDiscount: number;
  totalDiscount: number;
  totalQuantity: number;
  appliedPromoCode: string | null;
  promoCodeDiscountPercentage: number;
  promoCodeDiscountAmount: number;
  finalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export const cartApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => "/Cart",
      providesTags: ["Cart"],
    }),
    deleteCart: builder.mutation<void, void>({
      query: () => ({
        url: "/Cart",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    addItem: builder.mutation<CartItem, { productId: string; quantity: number }>({
      query: (body) => ({
        url: "/Cart/items",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateItem: builder.mutation<void, { cartItemId: string; quantity: number }>({
      query: ({ cartItemId, ...body }) => ({
        url: `/Cart/items/${cartItemId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeItem: builder.mutation<void, string>({
      query: (cartItemId) => ({
        url: `/Cart/items/${cartItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    getCartCount: builder.query<{ count: number }, void>({
      query: () => "/Cart/count",
      providesTags: ["Cart"],
    }),
    applyPromo: builder.mutation<void, { promoCode: string }>({
      query: (body) => ({
        url: "/Cart/apply-promo",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    removePromo: builder.mutation<void, void>({
      query: () => ({
        url: "/Cart/promo",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useDeleteCartMutation,
  useAddItemMutation,
  useUpdateItemMutation,
  useRemoveItemMutation,
  useGetCartCountQuery,
  useApplyPromoMutation,
  useRemovePromoMutation,
} = cartApiSlice;
