import {
  EntityState,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { IgetPostsByUserId, IgetPosts, IgetPost } from "types";
import { RootState } from "../../app/store";
import { IFilter } from "./filtersSlice";

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
  reactionsCount: {
    thumbsUp: number;
    heart: number;
    wow: number;
    rocket: number;
    coffee: number;
  };
}

const newPostData = (data: IgetPost) => {
  const { post: oldPost } = data;
  return {
    id: oldPost._id,
    userId: oldPost.userId,
    title: oldPost.title,
    content: oldPost.content,
    // @ts-expect-error depends on backend
    date: oldPost.updatedAt as string,
    reactionsCount: oldPost.reactionsCount,
  };
};

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
        return newPostData(res);
      },
    }),
    getPosts: builder.query<EntityState<IPost>, IFilter>({
      query: (filters) => {
        let url = "/posts/";
        if (typeof filters.title !== "undefined") {
          url = url + `?title=${encodeURI(filters.title)}`;
        }
        if (typeof filters.name !== "undefined") {
          url = url + `?name=${encodeURI(filters.name)}`;
        }
        return url;
      },
      transformResponse: (res: IgetPosts) => {
        const loadedPosts = res.posts.map((post) =>
          newPostData({ post: post }),
        );

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
        const loadedPosts = res.posts.map((post) =>
          newPostData({ post: post }),
        );
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result) => {
        return typeof result === "undefined"
          ? []
          : [...result.ids.map((id) => ({ type: "Post" as const, id }))];
      },
    }),
    getPostsByName: builder.query<IPost[], string>({
      query: (name) => `/posts/?name=${name}`,
      transformResponse: (res: IgetPostsByUserId) => {
        const loadedPosts = res.posts.map((post) =>
          newPostData({ post: post }),
        );
        return loadedPosts;
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
      {
        message: string;
        added: boolean;
      },
      {
        postId: string;
        clickedBy: string;
        reactionType: string;
        // reactions: IReactions;
      }
    >({
      query: ({ postId, clickedBy, reactionType }) => ({
        url: `/posts/${postId}`,
        method: "PATCH",
        body: {
          postId,
          clickedBy,
          reactionType,
        },
      }),
      // async onQueryStarted(
      //   { postId, reactionType, reactionCount },
      //   { dispatch, queryFulfilled },
      // ) {
      //   const patchResult = dispatch(
      //     postsApiSlice.util.updateQueryData(
      //       "getPosts",
      //       { title: undefined, name: undefined },
      //       (draft) => {
      //         const post = draft.entities[postId];
      //         if (post) post.reactionsCount[reactionType] = reactionCount;
      //       },
      //     ),
      //   );
      //   const patchResult2 = dispatch(
      //     postsApiSlice.util.updateQueryData("getPost", "getPost", (draft) => {
      //       const post = draft;
      //       if (post) post.reactionsCount[reactionType] = reactionCount;
      //     }),
      //   );
      //   try {
      //     await queryFulfilled;
      //   } catch (e) {
      //     patchResult.undo();
      //     patchResult2.undo();
      //   }
      // },
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
  useGetPostsByNameQuery,
} = postsApiSlice;

export const selectPostsResult = postsApiSlice.endpoints.getPosts.select({
  name: undefined,
  title: undefined,
});

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
