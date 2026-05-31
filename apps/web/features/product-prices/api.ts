import { baseApi } from '@/lib/api/baseApi';

import type {
  CreateProductPriceRequest,
  GetProductPriceResponse,
  GetProductPricesResponse,
  GetSuggestProductPriceResponse,
  ProductPriceQuery,
  SuggestProductPriceQuery,
  UpdateProductPriceRequest,
  UpdateProductPriceStatusRequest,
} from './types';

const productPricesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductPrices: builder.query<GetProductPricesResponse, ProductPriceQuery>({
      query: ({
        search,
        productId,
        machineModelId,
        status,
        category,
        machineType,
        page = 1,
        limit = 20,
      }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (productId) params.set('productId', productId);
        if (machineModelId) params.set('machineModelId', machineModelId);
        if (status) params.set('status', status);
        if (category) params.set('category', category);
        if (machineType) params.set('machineType', machineType);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/product-prices?${params}`;
      },
      providesTags: ['ProductPrice'],
    }),
    getProductPrice: builder.query<GetProductPriceResponse, string>({
      query: (id) => `/product-prices/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'ProductPrice', id }],
    }),
    suggestProductPrice: builder.query<
      GetSuggestProductPriceResponse,
      SuggestProductPriceQuery
    >({
      query: ({ productId, machineModelId, customerType }) => {
        const params = new URLSearchParams();
        params.set('productId', productId);
        params.set('machineModelId', machineModelId);
        params.set('customerType', customerType);
        return `/product-prices/suggest?${params}`;
      },
    }),
    createProductPrice: builder.mutation<
      GetProductPriceResponse,
      CreateProductPriceRequest
    >({
      query: (body) => ({ url: '/product-prices', method: 'POST', body }),
      invalidatesTags: ['ProductPrice'],
    }),
    updateProductPrice: builder.mutation<
      GetProductPriceResponse,
      { id: string; data: UpdateProductPriceRequest }
    >({
      query: ({ id, data }) => ({
        url: `/product-prices/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'ProductPrice',
        { type: 'ProductPrice', id },
      ],
    }),
    updateProductPriceStatus: builder.mutation<
      GetProductPriceResponse,
      { id: string; data: UpdateProductPriceStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/product-prices/${id}/status`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'ProductPrice',
        { type: 'ProductPrice', id },
      ],
    }),
    deleteProductPrice: builder.mutation<GetProductPriceResponse, string>({
      query: (id) => ({ url: `/product-prices/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ProductPrice'],
    }),
  }),
});

export const {
  useGetProductPricesQuery,
  useLazyGetProductPricesQuery,
  useGetProductPriceQuery,
  useSuggestProductPriceQuery,
  useCreateProductPriceMutation,
  useUpdateProductPriceMutation,
  useUpdateProductPriceStatusMutation,
  useDeleteProductPriceMutation,
} = productPricesApi;
