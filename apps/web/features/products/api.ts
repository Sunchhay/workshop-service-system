import { baseApi } from "@/lib/api/baseApi";

import type {
  AdjustStockRequest,
  CreateProductRequest,
  GetProductResponse,
  GetProductsResponse,
  ProductQuery,
  UpdateProductRequest,
} from "./types";

const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<GetProductsResponse, ProductQuery>({
      query: ({
        search,
        category,
        componentPartType,
        machineModelId,
        isActive,
        lowStock,
        page = 1,
        limit = 20,
      }) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (category) params.set("category", category);
        if (componentPartType)
          params.set("componentPartType", componentPartType);
        if (machineModelId) params.set("machineModelId", machineModelId);
        if (isActive !== undefined) params.set("isActive", String(isActive));
        if (lowStock !== undefined) params.set("lowStock", String(lowStock));
        params.set("page", String(page));
        params.set("limit", String(limit));
        return `/products?${params}`;
      },
      providesTags: ["Product"],
    }),
    getProduct: builder.query<GetProductResponse, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation<GetProductResponse, CreateProductRequest>({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<
      GetProductResponse,
      { id: string; data: UpdateProductRequest }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Product",
        { type: "Product", id },
      ],
    }),
    updateProductStatus: builder.mutation<
      GetProductResponse,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/products/${id}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Product",
        { type: "Product", id },
      ],
    }),
    adjustProductStock: builder.mutation<
      GetProductResponse,
      { id: string; data: AdjustStockRequest }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}/stock`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Product",
        { type: "Product", id },
      ],
    }),
    deleteProduct: builder.mutation<{ success: boolean; data: null }, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
  useAdjustProductStockMutation,
  useDeleteProductMutation,
} = productsApi;
