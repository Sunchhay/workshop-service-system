import { baseApi } from '@/lib/api/baseApi';

import type {
  AddCartItemRequest,
  CartServiceCatalogQuery,
  CheckoutCartRequest,
  CheckoutCartResponse,
  CreateCartRequest,
  GetCartResponse,
  GetCartsResponse,
  GetCartServiceCatalogResponse,
  UpdateCartItemRequest,
  UpdateCartRequest,
} from './types';

const cartsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveCarts: builder.query<GetCartsResponse, void>({
      query: () => '/carts/active',
      providesTags: ['Cart'],
    }),
    createCart: builder.mutation<GetCartResponse, CreateCartRequest>({
      query: (body) => ({ url: '/carts', method: 'POST', body }),
      invalidatesTags: ['Cart'],
    }),
    updateCart: builder.mutation<GetCartResponse, { id: string; data: UpdateCartRequest }>({
      query: ({ id, data }) => ({ url: `/carts/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Cart', id }, 'Cart'],
    }),
    closeCart: builder.mutation<GetCartResponse, string>({
      query: (id) => ({ url: `/carts/${id}/close`, method: 'PATCH' }),
      invalidatesTags: ['Cart'],
    }),
    deleteCart: builder.mutation<{ success: boolean; data: null }, string>({
      query: (id) => ({ url: `/carts/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    checkoutCart: builder.mutation<CheckoutCartResponse, { id: string; data: CheckoutCartRequest }>({
      query: ({ id, data }) => ({ url: `/carts/${id}/checkout`, method: 'POST', body: data }),
      invalidatesTags: ['Cart', 'Sale', 'Invoice', 'Payment'],
    }),
    addCartItem: builder.mutation<GetCartResponse, { cartId: string; data: AddCartItemRequest }>({
      query: ({ cartId, data }) => ({ url: `/carts/${cartId}/items`, method: 'POST', body: data }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<GetCartResponse, { cartId: string; itemId: string; data: UpdateCartItemRequest }>({
      query: ({ cartId, itemId, data }) => ({ url: `/carts/${cartId}/items/${itemId}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation<GetCartResponse, { cartId: string; itemId: string }>({
      query: ({ cartId, itemId }) => ({ url: `/carts/${cartId}/items/${itemId}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    createQuotationFromCart: builder.mutation<
      { success: boolean; data: { id: string; quotationNumber: string } },
      { cartId: string; notes?: string }
    >({
      query: (body) => ({ url: '/quotations/from-cart', method: 'POST', body }),
    }),
    getCartServiceCatalog: builder.query<GetCartServiceCatalogResponse, CartServiceCatalogQuery>({
      query: ({ search, machineModelId, showAll, page = 1, limit = 12 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (machineModelId) params.set('machineModelId', machineModelId);
        if (showAll !== undefined) params.set('showAll', String(showAll));
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/carts/service-catalog?${params}`;
      },
      providesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetActiveCartsQuery,
  useCreateCartMutation,
  useUpdateCartMutation,
  useCloseCartMutation,
  useDeleteCartMutation,
  useCheckoutCartMutation,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useCreateQuotationFromCartMutation,
  useGetCartServiceCatalogQuery,
} = cartsApi;
