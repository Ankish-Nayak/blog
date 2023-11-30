import { loginParams } from "types";
import { apiSlice } from "../api/apiSlice";
import { logOut, setCredentials } from "../me/authSlice";

const userApiSlice = apiSlice.injectEndpoints({
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
    logout: builder.mutation<{ name: string; message: string }, string>({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
      transformResponse(res: { name: string; message: string }) {
        logOut();
        return res;
      },
    }),
    signup: builder.mutation<{ name: string; message: string }, loginParams>({
      query: (data) => ({
        url: "/users/signup",
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
  }),
});

// export const { useLoginMutation, useLogoutMutation, useSignupMutation } =
//   userApiSlice;
//
// export default userApiSlice;

// interface IUser {
//   name: string | undefined;
// }
// const initialState: IUser = {
//   name:undefined
// }
//
// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.
//     }
//   }
// });
// export default userSlice.reducer;
