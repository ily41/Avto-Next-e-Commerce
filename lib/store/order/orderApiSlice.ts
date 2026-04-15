import { api } from "../api";

// ── Interfaces ─────────────────────────────────────────────────────────────────
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
  // Delivery fields
  deliveryPostCode?: string;
  userPassport?: string;
  packageWeight?: number;
  fragile?: boolean;
  /** 0 = post_office_lcl, 1 = home_delivery_lcl */
  deliveryType?: 0 | 1;
  // Azerpost fields
  azerpostTrackingCode?: string;
  azerpostStatus?: string;
  azerpostDispatchedAt?: string;
  azerpostEstimatedDelivery?: string;
  azerpostOrderId?: string; // Matching user prompt mention
  items: OrderItem[];
  payment: OrderPayment;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AdminOrdersParams {
  page?: number;
  pageSize?: number;
  status?: string;
}

export interface AzerpostStatusResponse {
  package_id: string;
  order_id: string;
  status: string;
  status_description: string;
  delivery_post_code: string;
  customer_address: string;
}

// ── Slice ──────────────────────────────────────────────────────────────────────
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
    // Admin Endpoints
    getAdminOrders: builder.query<PaginatedResponse<Order>, AdminOrdersParams>({
      query: (params) => ({
        url: "/Orders/admin/all",
        params,
      }),
      providesTags: ["Order"],
    }),
    sendToAzerpost: builder.mutation<{ message: string; azerpostOrderId: string }, string>({
      query: (orderId) => ({
        url: `/Orders/${orderId}/send-to-azerpost`,
        method: "POST",
      }),
      invalidatesTags: ["Order"],
    }),
    getAzerpostStatus: builder.query<AzerpostStatusResponse, string>({
      query: (orderId) => `/Orders/${orderId}/azerpost-status`,
    }),
    updateOrderStatus: builder.mutation<void, { id: string; status: number }>({
      query: ({ id, status }) => ({
        url: `/Order/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderByNumberQuery,
  useGetAdminOrdersQuery,
  useSendToAzerpostMutation,
  useGetAzerpostStatusQuery,
  useUpdateOrderStatusMutation,
} = orderApiSlice;
