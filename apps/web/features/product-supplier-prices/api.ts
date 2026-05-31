import { baseApi } from '@/lib/api/baseApi';

import type {
  CreateProductSupplierPriceRequest,
  GetProductSupplierPriceResponse,
  GetProductSupplierPricesResponse,
  ProductSupplierPriceQuery,
  UpdateProductSupplierPriceRequest,
} from './types';

const productSupplierPricesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductSupplierPrices: builder.query<
      GetProductSupplierPricesResponse,
      ProductSupplierPriceQuery
    >({
      query: ({ search, productId, supplierId, currency, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (productId) params.set('productId', productId);
        if (supplierId) params.set('supplierId', supplierId);
        if (currency) params.set('currency', currency);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/product-supplier-prices?${params}`;
      },
      providesTags: ['ProductSupplierPrice'],
    }),
    getProductSupplierPrice: builder.query<GetProductSupplierPriceResponse, string>({
      query: (id) => `/product-supplier-prices/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'ProductSupplierPrice', id }],
    }),
    createProductSupplierPrice: builder.mutation<
      GetProductSupplierPriceResponse,
      CreateProductSupplierPriceRequest
    >({
      query: (body) => ({ url: '/product-supplier-prices', method: 'POST', body }),
      invalidatesTags: ['ProductSupplierPrice'],
    }),
    updateProductSupplierPrice: builder.mutation<
      GetProductSupplierPriceResponse,
      { id: string; data: UpdateProductSupplierPriceRequest }
    >({
      query: ({ id, data }) => ({
        url: `/product-supplier-prices/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'ProductSupplierPrice',
        { type: 'ProductSupplierPrice', id },
      ],
    }),
    deleteProductSupplierPrice: builder.mutation<GetProductSupplierPriceResponse, string>({
      query: (id) => ({ url: `/product-supplier-prices/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ProductSupplierPrice'],
    }),
  }),
});

export const {
  useGetProductSupplierPricesQuery,
  useGetProductSupplierPriceQuery,
  useCreateProductSupplierPriceMutation,
  useUpdateProductSupplierPriceMutation,
  useDeleteProductSupplierPriceMutation,
} = productSupplierPricesApi;
