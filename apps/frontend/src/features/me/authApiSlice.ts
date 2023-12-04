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
      { userId: string; name: string; email: string; password?: string }
    >({
      query: ({ name, email, password }) => ({
        url: "/users/profile",
        method: "POST",
        body: {
          name,
          email,
          password,
        },
      }),
      invalidatesTags: (res) => {
        return res ? [{ type: "User" as const, id: res.id }] : [];
      },
      // async onQueryStarted(
      //   { userId, name, email },
      //   { dispatch, queryFulfilled },
      // ) {
      //   const patch = dispatch(
      //     usersApiSlice.util.updateQueryData(
      //       "getUsers",
      //       "blahblah",
      //       (draft) => {
      //         const user = draft.entities[userId];
      //         // if(typeof draft.entities[userId] !== 'undefined'){
      //         //   draft.entities[userId].name = name;
      //         //   draft.entities[userId].email = email;
      //         // }
      //         if (user) {
      //           user.name = name;
      //           user.email = email;
      //         }
      //         draft.entities[userId] = user;
      //         // user.name = name;
      //         // user.email = email;
      //       },
      //     ),
      //   );
      //   //   postsApiSlice.util.updateQueryData(
      //   //     "getPosts",
      //   //     { title: undefined, name: undefined },
      //   //     (draft) => {
      //   //       const post = draft.entities[postId];
      //   //       if (post) {
      //   //         post.reactionsCount = reactionsCount;
      //   //         post.clicked = clicked;
      //   //       }
      //   //     },
      //   //   ),
      //   try {
      //     await queryFulfilled;
      //   } catch (e) {
      //     patch.undo();
      //     console.log(e);
      //   }
      // },
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
