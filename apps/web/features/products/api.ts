import { baseApi } from '@/lib/api/baseApi';

import type {
  CreateProductRequest,
  GetProductResponse,
  GetProductsResponse,
  ProductQuery,
  UpdateProductRequest,
  UpdateProductStatusRequest,
} from './types';

const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<GetProductsResponse, ProductQuery>({
      query: ({ search, status, category, unit, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (status) params.set('status', status);
        if (category) params.set('category', category);
        if (unit) params.set('unit', unit);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/products?${params}`;
      },
      providesTags: ['Product'],
    }),
    getProduct: builder.query<GetProductResponse, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation<GetProductResponse, CreateProductRequest>({
      query: (body) => ({ url: '/products', method: 'POST', body }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<
      GetProductResponse,
      { id: string; data: UpdateProductRequest }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Product',
        { type: 'Product', id },
      ],
    }),
    updateProductStatus: builder.mutation<
      GetProductResponse,
      { id: string; data: UpdateProductStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}/status`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Product',
        { type: 'Product', id },
      ],
    }),
    deleteProduct: builder.mutation<GetProductResponse, string>({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
  useDeleteProductMutation,
} = productsApi;
