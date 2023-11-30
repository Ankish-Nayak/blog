import { loginParams, signUpParams } from "types";
import { apiSlice } from "../api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

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
      transformResponse(res: { name: string; message: string }) {
        setCredentials({ user: res.name });
        return res;
      },
    }),
    signup: builder.mutation<{ name: string; message: string }, signUpParams>({
      query: (data) => ({
        url: "/users/signup",
        method: "POST",
        body: {
          ...data,
        },
      }),
      transformResponse(res: { name: string; message: string }) {
        return res;
      },
    }),
    logout: builder.mutation<{ message: string }, string>({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
      transformResponse(res: { name: string; message: string }) {
        logOut();
        return res;
      },
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
  overrideExisting: false,
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
