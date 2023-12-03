import { loginParams, signUpParams } from "types";
import { apiSlice } from "../api/apiSlice";

interface ILogin {
  id: string;
  name: string;
}

const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ILogin, loginParams>({
      query: (data) => ({
        url: "/users/login",
        method: "POST",
        body: {
          ...data,
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    signup: builder.mutation<ILogin, signUpParams>({
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
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    me: builder.query<ILogin, string>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation<
      ILogin,
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
