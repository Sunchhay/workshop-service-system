import { baseApi } from '../../lib/api/baseApi';
import type { ApiResponse } from '../../lib/api/types';
import type {
  AuthUser,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  UpdateProfileRequest,
} from './types';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    getMe: builder.query<ApiResponse<AuthUser>, void>({
      query: () => '/auth/me',
      keepUnusedDataFor: 300,
    }),
    updateProfile: builder.mutation<ApiResponse<AuthUser>, UpdateProfileRequest>({
      query: (body) => ({
        url: '/auth/profile',
        method: 'PATCH',
        body,
      }),
    }),
    changePassword: builder.mutation<ApiResponse<null>, ChangePasswordRequest>({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
