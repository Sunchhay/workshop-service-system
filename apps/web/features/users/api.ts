import { baseApi } from '@/lib/api/baseApi';

import type {
  CreateUserRequest,
  GetUserResponse,
  GetUsersResponse,
  UpdateUserRequest,
  UserQuery,
} from './types';

const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, UserQuery>({
      query: ({ role, search, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (role) params.set('role', role);
        if (search) params.set('search', search);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/users?${params}`;
      },
      providesTags: ['User'],
    }),
    getUser: builder.query<GetUserResponse, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    createUser: builder.mutation<GetUserResponse, CreateUserRequest>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<
      GetUserResponse,
      { id: string; data: UpdateUserRequest }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'User',
        { type: 'User', id },
      ],
    }),
    updateUserStatus: builder.mutation<
      GetUserResponse,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/users/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'User',
        { type: 'User', id },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
} = usersApi;
