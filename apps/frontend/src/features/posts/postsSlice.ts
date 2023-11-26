import {
  EntityState,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { IgetPostsByUserId, IgetPosts, IgetPost } from "types";
import { RootState } from "../../app/store";

export type IReaction = "thumbsUp" | "wow" | "heart" | "rocket" | "coffee";

export interface IReactions {
  thumbsUp: number;
  wow: number;
  heart: number;
  rocket: number;
  coffee: number;
}

export interface IPost {
  id: string;
  title: string;
  content: string;
  date: string;
  userId?: string;
  reactions: IReactions;
}

const postsAdapter = createEntityAdapter<IPost>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState();
// TODO: make min to used updated to time instead this one
export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPost: builder.query<IPost, string>({
      query: (id) => `/posts/${id}`,
      transformResponse: (res: IgetPost) => {
        const newPost: IPost = {
          id: res.post._id,
          title: res.post.title,
          content: res.post.content,
          reactions: res.post.reactions,
          date: res.post.updatedAt.toDateString(),
          userId: res.post.userId,
        };
        return newPost;
      },
    }),
    getPosts: builder.query<EntityState<IPost>, void>({
      query: () => "/posts",
      transformResponse: (res: IgetPosts) => {
        const loadedPosts = res.posts.map((post) => {
          const newPost: IPost = {
            id: post._id,
            userId: post.userId,
            title: post.title,
            content: post.content,
            date: post.updatedAt.toDateString(),
            reactions: post.reactions,
          };

          return newPost;
        });

        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result) => {
        return typeof result === "undefined"
          ? [{ type: "Post", id: "LIST" }]
          : [
              { type: "Post", id: "LIST" },
              ...result.ids.map((id) => ({ type: "Post" as const, id })),
            ];
      },
    }),
    getPostsByUserId: builder.query<EntityState<IPost>, string>({
      query: (userId) => `/posts/?userId=${userId}`,
      transformResponse: (res: IgetPostsByUserId) => {
        const loadedPosts = res.posts.map((post) => {
          return {
            id: post._id,
            title: post.title,
            content: post.content,
            date: post.updatedAt.toDateString(),
            reactions: post.reactions,
          };
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result) => {
        return typeof result === "undefined"
          ? []
          : [...result.ids.map((id) => ({ type: "Post" as const, id }))];
      },
    }),
    addNewPost: builder.mutation<
      void,
      Omit<IPost, "id" | "date" | "reactions">
    >({
      query: (initialPost) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...initialPost,
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: builder.mutation<void, IPost>({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: "PUT",
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (_, __, arg) => [{ type: "Post", id: arg.id }],
    }),
    deletePost: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Post", id }],
    }),
    addReaction: builder.mutation<
      void,
      {
        postId: string;
        reactions: IReactions;
      }
    >({
      query: ({ postId, reactions }) => ({
        url: `/posts/${postId}`,
        method: "PATCH",
        body: {
          ...reactions,
        },
      }),
      async onQueryStarted(
        { postId, reactions },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          postsApiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
            const post = draft.entities[postId];
            if (post) post.reactions = reactions;
          }),
        );
        try {
          await queryFulfilled;
        } catch (e) {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useAddReactionMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useGetPostQuery,
} = postsApiSlice;

export const selectPostsResult = postsApiSlice.endpoints.getPosts.select();

const selectPostsData = createSelector(
  [selectPostsResult],
  (postsResult) => postsResult.data,
);

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors<RootState>(
  (state) => selectPostsData(state) ?? initialState,
);
