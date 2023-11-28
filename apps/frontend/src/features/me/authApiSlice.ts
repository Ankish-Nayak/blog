import { loginParams, signUpParams } from "types";
import { apiSlice } from "../api/apiSlice";

const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ name: string; message: string }, loginParams>({
      query: (data) => ({
        url: "/users/login",
        method: "POST",
        body: {
          ...data,
        },
      }),
    }),
    signup: builder.mutation<{ name: string; message: string }, signUpParams>({
      query: (data) => ({
        url: "/users/signup",
        method: "POST",
        body: {
          ...data,
        },
      }),
    }),
    logout: builder.mutation<{ message: string }, string>({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
    }),
    me: builder.mutation<{ message: string; name: string }, string>({
      query: () => ({
        url: "/users/me",
        method: "POST",
      }),
    }),
    updateProfile: builder.mutation<
      { message: string; name: string },
      { name: string; email: string; password?: string }
    >({
      query: (data) => ({
        url: "/users/profile",
        method: "POST",
        body: {
          ...data,
        },
      }),
    }),
    getProfile: builder.query<{ name: string; email: string }, string>({
      query: () => "/users/profile",
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useMeMutation,
  useUpdateProfileMutation,
  useGetProfileQuery,
} = authSlice;

export default authSlice;
