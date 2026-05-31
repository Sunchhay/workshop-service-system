import { baseApi } from "@/lib/api/baseApi";

import type {
  CreateServicePriceRequest,
  GetServicePriceResponse,
  GetServicePricesResponse,
  GetSuggestServicePriceResponse,
  ServicePriceQuery,
  SuggestServicePriceQuery,
  UpdateServicePriceRequest,
  UpdateServicePriceStatusRequest,
} from "./types";

const servicePricesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServicePrices: builder.query<
      GetServicePricesResponse,
      ServicePriceQuery
    >({
      query: ({
        search,
        serviceId,
        machineModelId,
        status,
        category,
        machineType,
        page = 1,
        limit = 20,
      }) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (serviceId) params.set("serviceId", serviceId);
        if (machineModelId) params.set("machineModelId", machineModelId);
        if (status) params.set("status", status);
        if (category) params.set("category", category);
        if (machineType) params.set("machineType", machineType);
        params.set("page", String(page));
        params.set("limit", String(limit));
        return `/service-prices?${params}`;
      },
      providesTags: ["ServicePrice"],
    }),
    getServicePrice: builder.query<GetServicePriceResponse, string>({
      query: (id) => `/service-prices/${id}`,
      providesTags: (_result, _error, id) => [{ type: "ServicePrice", id }],
    }),
    suggestServicePrice: builder.query<
      GetSuggestServicePriceResponse,
      SuggestServicePriceQuery
    >({
      query: ({ serviceId, machineModelId, customerType }) => {
        const params = new URLSearchParams();
        params.set("serviceId", serviceId);
        params.set("machineModelId", machineModelId);
        params.set("customerType", customerType);
        return `/service-prices/suggest?${params}`;
      },
    }),
    createServicePrice: builder.mutation<
      GetServicePriceResponse,
      CreateServicePriceRequest
    >({
      query: (body) => ({
        url: "/service-prices",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ServicePrice"],
    }),
    updateServicePrice: builder.mutation<
      GetServicePriceResponse,
      { id: string; data: UpdateServicePriceRequest }
    >({
      query: ({ id, data }) => ({
        url: `/service-prices/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "ServicePrice",
        { type: "ServicePrice", id },
      ],
    }),
    updateServicePriceStatus: builder.mutation<
      GetServicePriceResponse,
      { id: string; data: UpdateServicePriceStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/service-prices/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "ServicePrice",
        { type: "ServicePrice", id },
      ],
    }),
    deleteServicePrice: builder.mutation<GetServicePriceResponse, string>({
      query: (id) => ({
        url: `/service-prices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ServicePrice"],
    }),
  }),
});

export const {
  useGetServicePricesQuery,
  useLazyGetServicePricesQuery,
  useGetServicePriceQuery,
  useSuggestServicePriceQuery,
  useCreateServicePriceMutation,
  useUpdateServicePriceMutation,
  useUpdateServicePriceStatusMutation,
  useDeleteServicePriceMutation,
} = servicePricesApi;
