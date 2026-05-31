import { baseApi } from '@/lib/api/baseApi';

import type {
  CreateItemRequest,
  CreateReferenceBookRequest,
  CreateSectionRequest,
  GetItemResponse,
  GetReferenceBookResponse,
  GetReferenceBooksResponse,
  GetSectionResponse,
  ReferenceBookQuery,
  UpdateItemRequest,
  UpdateReferenceBookRequest,
  UpdateSectionRequest,
} from './types';

const referenceBookApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReferenceBooks: builder.query<GetReferenceBooksResponse, ReferenceBookQuery>({
      query: ({ search, category, machineModelId, status, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (machineModelId) params.set('machineModelId', machineModelId);
        if (status) params.set('status', status);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/reference-books?${params}`;
      },
      providesTags: ['ReferenceBook'],
    }),
    getReferenceBook: builder.query<GetReferenceBookResponse, string>({
      query: (id) => `/reference-books/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'ReferenceBook', id }],
    }),
    createReferenceBook: builder.mutation<GetReferenceBookResponse, CreateReferenceBookRequest>({
      query: (body) => ({ url: '/reference-books', method: 'POST', body }),
      invalidatesTags: ['ReferenceBook'],
    }),
    updateReferenceBook: builder.mutation<
      GetReferenceBookResponse,
      { id: string; data: UpdateReferenceBookRequest }
    >({
      query: ({ id, data }) => ({ url: `/reference-books/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        'ReferenceBook',
        { type: 'ReferenceBook', id },
      ],
    }),
    deleteReferenceBook: builder.mutation<{ success: boolean; data: null }, string>({
      query: (id) => ({ url: `/reference-books/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ReferenceBook'],
    }),

    // Sections
    createSection: builder.mutation<
      GetSectionResponse,
      { bookId: string; data: CreateSectionRequest }
    >({
      query: ({ bookId, data }) => ({
        url: `/reference-books/${bookId}/sections`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { bookId }) => [{ type: 'ReferenceBook', id: bookId }],
    }),
    updateSection: builder.mutation<
      GetSectionResponse,
      { sectionId: string; bookId: string; data: UpdateSectionRequest }
    >({
      query: ({ sectionId, data }) => ({
        url: `/reference-book-sections/${sectionId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { bookId }) => [{ type: 'ReferenceBook', id: bookId }],
    }),
    deleteSection: builder.mutation<
      { success: boolean; data: null },
      { sectionId: string; bookId: string }
    >({
      query: ({ sectionId }) => ({
        url: `/reference-book-sections/${sectionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { bookId }) => [{ type: 'ReferenceBook', id: bookId }],
    }),

    // Items
    createItem: builder.mutation<
      GetItemResponse,
      { sectionId: string; bookId: string; data: CreateItemRequest }
    >({
      query: ({ sectionId, data }) => ({
        url: `/reference-book-sections/${sectionId}/items`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { bookId }) => [{ type: 'ReferenceBook', id: bookId }],
    }),
    updateItem: builder.mutation<
      GetItemResponse,
      { itemId: string; bookId: string; data: UpdateItemRequest }
    >({
      query: ({ itemId, data }) => ({
        url: `/reference-book-items/${itemId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { bookId }) => [{ type: 'ReferenceBook', id: bookId }],
    }),
    deleteItem: builder.mutation<
      { success: boolean; data: null },
      { itemId: string; bookId: string }
    >({
      query: ({ itemId }) => ({ url: `/reference-book-items/${itemId}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, { bookId }) => [{ type: 'ReferenceBook', id: bookId }],
    }),
  }),
});

export const {
  useGetReferenceBooksQuery,
  useGetReferenceBookQuery,
  useCreateReferenceBookMutation,
  useUpdateReferenceBookMutation,
  useDeleteReferenceBookMutation,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = referenceBookApi;
