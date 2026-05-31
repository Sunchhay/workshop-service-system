import { baseApi } from '@/lib/api/baseApi';

import type {
  AddCartItemRequest,
  CartQuery,
  CheckoutRequest,
  CreateCartRequest,
  GetCartItemResponse,
  GetCartResponse,
  GetCartsResponse,
  UpdateCartItemRequest,
  UpdateCartRequest,
} from './types';

const cartsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCarts: builder.query<GetCartsResponse, CartQuery>({
      query: ({ search, status, customerId, mechanicId, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (status) params.set('status', status);
        if (customerId) params.set('customerId', customerId);
        if (mechanicId) params.set('mechanicId', mechanicId);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/carts?${params}`;
      },
      providesTags: ['Cart'],
    }),
    getCart: builder.query<GetCartResponse, string>({
      query: (id) => `/carts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Cart', id }],
    }),
    createCart: builder.mutation<GetCartResponse, CreateCartRequest>({
      query: (body) => ({ url: '/carts', method: 'POST', body }),
      invalidatesTags: ['Cart'],
    }),
    updateCart: builder.mutation<GetCartResponse, { id: string; data: UpdateCartRequest }>({
      query: ({ id, data }) => ({ url: `/carts/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _error, { id }) => ['Cart', { type: 'Cart', id }],
    }),
    discardCart: builder.mutation<{ success: boolean; data: null }, string>({
      query: (id) => ({ url: `/carts/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    addCartItem: builder.mutation<
      GetCartItemResponse,
      { cartId: string; data: AddCartItemRequest }
    >({
      query: ({ cartId, data }) => ({
        url: `/carts/${cartId}/items`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { cartId }) => ['Cart', { type: 'Cart', id: cartId }],
    }),
    clearCartItems: builder.mutation<{ success: boolean; data: null }, string>({
      query: (cartId) => ({ url: `/carts/${cartId}/items`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, cartId) => ['Cart', { type: 'Cart', id: cartId }],
    }),
    updateCartItem: builder.mutation<
      GetCartItemResponse,
      { cartId: string; itemId: string; data: UpdateCartItemRequest }
    >({
      query: ({ cartId, itemId, data }) => ({
        url: `/carts/${cartId}/items/${itemId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { cartId }) => ['Cart', { type: 'Cart', id: cartId }],
    }),
    removeCartItem: builder.mutation<
      { success: boolean; data: null },
      { cartId: string; itemId: string }
    >({
      query: ({ cartId, itemId }) => ({
        url: `/carts/${cartId}/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { cartId }) => ['Cart', { type: 'Cart', id: cartId }],
    }),
    checkout: builder.mutation<GetCartResponse, CheckoutRequest>({
      query: (body) => ({ url: '/checkout/complete', method: 'POST', body }),
      invalidatesTags: ['Cart', 'Sale'],
    }),
  }),
});

export const {
  useGetCartsQuery,
  useGetCartQuery,
  useCreateCartMutation,
  useUpdateCartMutation,
  useDiscardCartMutation,
  useAddCartItemMutation,
  useClearCartItemsMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useCheckoutMutation,
} = cartsApi;
