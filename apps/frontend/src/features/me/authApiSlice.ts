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

      invalidatesTags: [{ type: "Post", id: "LIST" }],
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
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    me: builder.query<{ message: string; name: string }, string>({
      query: () => "/users/me",
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
  useUpdateProfileMutation,
  useGetProfileQuery,
  useMeQuery,
} = authSlice;

export default authSlice;
