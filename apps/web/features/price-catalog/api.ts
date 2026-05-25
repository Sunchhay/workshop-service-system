import { baseApi } from '@/lib/api/baseApi';

import type {
  CreatePriceCatalogRequest,
  GetPriceCatalogResponse,
  GetPriceCatalogsResponse,
  GetPriceCatalogSuggestResponse,
  PriceCatalogQuery,
  PriceCatalogSuggestQuery,
  UpdatePriceCatalogRequest,
} from './types';

const priceCatalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPriceCatalogs: builder.query<GetPriceCatalogsResponse, PriceCatalogQuery>({
      query: ({ search, serviceId, difficultyLevel, customerType, isActive, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (serviceId) params.set('serviceId', serviceId);
        if (difficultyLevel) params.set('difficultyLevel', difficultyLevel);
        if (customerType) params.set('customerType', customerType);
        if (isActive !== undefined) params.set('isActive', String(isActive));
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/price-catalog?${params}`;
      },
      providesTags: ['PriceCatalog'],
    }),
    getPriceCatalog: builder.query<GetPriceCatalogResponse, string>({
      query: (id) => `/price-catalog/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'PriceCatalog', id }],
    }),
    createPriceCatalog: builder.mutation<GetPriceCatalogResponse, CreatePriceCatalogRequest>({
      query: (body) => ({
        url: '/price-catalog',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PriceCatalog'],
    }),
    updatePriceCatalog: builder.mutation<
      GetPriceCatalogResponse,
      { id: string; data: UpdatePriceCatalogRequest }
    >({
      query: ({ id, data }) => ({
        url: `/price-catalog/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'PriceCatalog',
        { type: 'PriceCatalog', id },
      ],
    }),
    updatePriceCatalogStatus: builder.mutation<
      GetPriceCatalogResponse,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/price-catalog/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'PriceCatalog',
        { type: 'PriceCatalog', id },
      ],
    }),
    deletePriceCatalog: builder.mutation<{ success: boolean; data: null }, string>({
      query: (id) => ({
        url: `/price-catalog/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PriceCatalog'],
    }),
    suggestPriceCatalog: builder.query<GetPriceCatalogSuggestResponse, PriceCatalogSuggestQuery>({
      query: ({ serviceId, size, difficultyLevel, customerType }) => {
        const params = new URLSearchParams();
        params.set('serviceId', serviceId);
        if (size !== undefined) params.set('size', String(size));
        if (difficultyLevel) params.set('difficultyLevel', difficultyLevel);
        if (customerType) params.set('customerType', customerType);
        return `/price-catalog/suggest?${params}`;
      },
    }),
  }),
});

export const {
  useGetPriceCatalogsQuery,
  useGetPriceCatalogQuery,
  useCreatePriceCatalogMutation,
  useUpdatePriceCatalogMutation,
  useUpdatePriceCatalogStatusMutation,
  useDeletePriceCatalogMutation,
  useSuggestPriceCatalogQuery,
} = priceCatalogApi;
