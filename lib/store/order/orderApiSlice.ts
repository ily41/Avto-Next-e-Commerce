import { api } from "../api";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderPayment {
  id: string;
  epointTransactionId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  installmentPeriod: number;
  installmentInterestAmount: number;
  originalAmount: number;
  createdAt: string;
  completedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  promoCode: string;
  promoCodeDiscountPercentage: number;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  notes: string;
  installmentPeriod: number;
  installmentInterestPercentage: number;
  installmentInterestAmount: number;
  originalAmount: number;
  walletAmountUsed: number;
  items: OrderItem[];
  payment: OrderPayment;
  createdAt: string;
  updatedAt: string;
}

export const orderApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query<Order[], void>({
      query: () => "/Orders/my-orders",
      providesTags: ["Order"],
    }),
    getOrderById: builder.query<Order, string>({
      query: (orderId) => `/Orders/${orderId}`,
      providesTags: ["Order"],
    }),
    getOrderByNumber: builder.query<Order, string>({
      query: (orderNumber) => `/Orders/number/${orderNumber}`,
      providesTags: ["Order"],
    }),
  }),
});

export const { 
  useGetMyOrdersQuery, 
  useGetOrderByIdQuery, 
  useGetOrderByNumberQuery 
} = orderApiSlice;
