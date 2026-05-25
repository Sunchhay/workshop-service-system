import { baseApi } from '@/lib/api/baseApi';

import type {
  CreateServiceJobRequest,
  GetServiceJobResponse,
  GetServiceJobsResponse,
  JobStatus,
  ServiceJobQuery,
  UpdateServiceJobRequest,
} from './types';

const serviceJobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceJobs: builder.query<GetServiceJobsResponse, ServiceJobQuery>({
      query: ({
        search,
        status,
        priority,
        customerId,
        machineModelId,
        assignedToId,
        fromDate,
        toDate,
        page = 1,
        limit = 20,
      }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (status) params.set('status', status);
        if (priority) params.set('priority', priority);
        if (customerId) params.set('customerId', customerId);
        if (machineModelId) params.set('machineModelId', machineModelId);
        if (assignedToId) params.set('assignedToId', assignedToId);
        if (fromDate) params.set('fromDate', fromDate);
        if (toDate) params.set('toDate', toDate);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/service-jobs?${params}`;
      },
      providesTags: ['ServiceJob'],
    }),
    getServiceJob: builder.query<GetServiceJobResponse, string>({
      query: (id) => `/service-jobs/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'ServiceJob', id }],
    }),
    createServiceJob: builder.mutation<GetServiceJobResponse, CreateServiceJobRequest>({
      query: (body) => ({ url: '/service-jobs', method: 'POST', body }),
      invalidatesTags: ['ServiceJob'],
    }),
    updateServiceJob: builder.mutation<
      GetServiceJobResponse,
      { id: string; data: UpdateServiceJobRequest }
    >({
      query: ({ id, data }) => ({
        url: `/service-jobs/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'ServiceJob',
        { type: 'ServiceJob', id },
      ],
    }),
    updateServiceJobStatus: builder.mutation<
      GetServiceJobResponse,
      { id: string; status: JobStatus }
    >({
      query: ({ id, status }) => ({
        url: `/service-jobs/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'ServiceJob',
        { type: 'ServiceJob', id },
      ],
    }),
    deleteServiceJob: builder.mutation<{ success: boolean; data: null }, string>({
      query: (id) => ({ url: `/service-jobs/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ServiceJob'],
    }),
  }),
});

export const {
  useGetServiceJobsQuery,
  useGetServiceJobQuery,
  useCreateServiceJobMutation,
  useUpdateServiceJobMutation,
  useUpdateServiceJobStatusMutation,
  useDeleteServiceJobMutation,
} = serviceJobsApi;
