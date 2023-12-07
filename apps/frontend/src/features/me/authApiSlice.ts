import { loginParams, signUpParams, IgetProfilePicture } from "types";
import { apiSlice } from "../api/apiSlice";
import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;

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
      invalidatesTags: [
        "Post",
        "User",
        "Auth",
        { type: "Auth", id: "profilePic" },
      ],
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
      invalidatesTags: ["Post", "User", "Auth"],
    }),
    me: builder.query<ILogin, string>({
      query: () => "/users/me",
      providesTags: ["Auth"],
    }),
    getProfilePic: builder.query<string, string>({
      query: (id) => {
        return id === ""
          ? "/profilePictures/profile/protected/"
          : `/profilePictures/profile/${id}`;
      },
      transformResponse(res: IgetProfilePicture) {
        const contentType = res.photo.contentType;
        const bufferData = res.photo.data.data;
        return `data:${contentType};base64, ${Buffer.from(bufferData).toString(
          "base64",
        )}`;
      },
      providesTags: [{ type: "Auth", id: "profilePic" }],
    }),
    updateProfilePic: builder.mutation<string, FormData>({
      query: (formData) => ({
        url: "/profilePictures/profile/",
        method: "PUT",
        body: formData,
      }),
      transformResponse(res: IgetProfilePicture) {
        const contentType = res.photo.contentType;
        const bufferData = res.photo.data.data;
        return `data:${contentType};base64, ${Buffer.from(bufferData).toString(
          "base64",
        )}`;
      },
      invalidatesTags: [{ type: "Auth", id: "profilePic" }],
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
    getNotificationCount: builder.query<number, string>({
      query: () => "/users/notifications/notification-count",
      transformResponse(res: { notificationCount: number }) {
        return res.notificationCount;
      },
    }),
    getNotifications: builder.query<
      {
        _id: string;
        postId: {
          _id: string;
          title: string;
          userId: string;
        };
        clickedBy: {
          _id: string;
          name: string;
        };
        clickedAt: string; // Assuming it's a string representing a date
        reactionType: "thumbsUp" | "heart" | "wow" | "coffee" | "rocket";
        isRead: boolean;
      }[],
      string
    >({
      query: () => "/users/notifications",
      transformResponse: (res: {
        notifications: {
          _id: string;
          postId: {
            _id: string;
            title: string;
            userId: string;
          };
          clickedBy: {
            _id: string;
            name: string;
          };
          clickedAt: string; // Assuming it's a string representing a date
          reactionType: "thumbsUp" | "heart" | "wow" | "coffee" | "rocket";
          isRead: false;
        }[];
      }) => {
        return res.notifications;
      },
    }),
    notificationRead: builder.mutation<{ success: true }, string>({
      query: (reactionId) => ({
        url: `/users/notifications/${reactionId}/mark-as-read`,
        method: "PUT",
      }),
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
  useGetProfilePicQuery,
  useUpdateProfilePicMutation,
  useGetNotificationCountQuery,
  useGetNotificationsQuery,
  useNotificationReadMutation,
} = authSlice;

export default authSlice;
