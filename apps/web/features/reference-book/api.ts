import { baseApi } from '@/lib/api/baseApi';

import type {
  CreateReferenceBookRequest,
  GetReferenceBookResponse,
  GetReferenceBooksResponse,
  ReferenceBookQuery,
  UpdateReferenceBookRequest,
  VerificationStatus,
} from './types';

const referenceBookApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReferenceBooks: builder.query<GetReferenceBooksResponse, ReferenceBookQuery>({
      query: ({
        search,
        machineModelId,
        componentType,
        sourceType,
        verificationStatus,
        isActive,
        page = 1,
        limit = 20,
      }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (machineModelId) params.set('machineModelId', machineModelId);
        if (componentType) params.set('componentType', componentType);
        if (sourceType) params.set('sourceType', sourceType);
        if (verificationStatus) params.set('verificationStatus', verificationStatus);
        if (isActive !== undefined) params.set('isActive', String(isActive));
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/reference-book?${params}`;
      },
      providesTags: ['ReferenceBook'],
    }),
    getReferenceBook: builder.query<GetReferenceBookResponse, string>({
      query: (id) => `/reference-book/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'ReferenceBook', id }],
    }),
    createReferenceBook: builder.mutation<
      GetReferenceBookResponse,
      CreateReferenceBookRequest
    >({
      query: (body) => ({ url: '/reference-book', method: 'POST', body }),
      invalidatesTags: ['ReferenceBook'],
    }),
    updateReferenceBook: builder.mutation<
      GetReferenceBookResponse,
      { id: string; data: UpdateReferenceBookRequest }
    >({
      query: ({ id, data }) => ({
        url: `/reference-book/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'ReferenceBook',
        { type: 'ReferenceBook', id },
      ],
    }),
    updateReferenceBookStatus: builder.mutation<
      GetReferenceBookResponse,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/reference-book/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'ReferenceBook',
        { type: 'ReferenceBook', id },
      ],
    }),
    updateReferenceBookVerification: builder.mutation<
      GetReferenceBookResponse,
      { id: string; verificationStatus: VerificationStatus }
    >({
      query: ({ id, verificationStatus }) => ({
        url: `/reference-book/${id}/verification-status`,
        method: 'PATCH',
        body: { verificationStatus },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'ReferenceBook',
        { type: 'ReferenceBook', id },
      ],
    }),
    deleteReferenceBook: builder.mutation<{ success: boolean; data: null }, string>({
      query: (id) => ({ url: `/reference-book/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ReferenceBook'],
    }),
  }),
});

export const {
  useGetReferenceBooksQuery,
  useGetReferenceBookQuery,
  useCreateReferenceBookMutation,
  useUpdateReferenceBookMutation,
  useUpdateReferenceBookStatusMutation,
  useUpdateReferenceBookVerificationMutation,
  useDeleteReferenceBookMutation,
} = referenceBookApi;
