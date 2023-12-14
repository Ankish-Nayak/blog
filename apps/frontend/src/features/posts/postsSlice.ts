import {
  EntityState,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { IgetPost, IgetPosts, IgetPostsByUserId } from "types";
import { RootState } from "../../app/store";
import { apiSlice } from "../api/apiSlice";
import { IFilter } from "./filtersSlice";

export type IReaction = "thumbsUp" | "wow" | "heart" | "rocket" | "coffee";

export interface ISavedPost {
  postId: string;
  userId: string;
  savedAt: string;
}

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
  clicked: {
    thumbsUp: boolean;
    heart: boolean;
    wow: boolean;
    rocket: boolean;
    coffee: boolean;
  };
}

const newPostData = (data: IgetPost): IPost => {
  const { post: oldPost } = data;
  return {
    id: oldPost.id,
    userId: oldPost.userId,
    title: oldPost.title,
    content: oldPost.content,
    // @ts-expect-error depends on backend
    date: oldPost.updatedAt as string,
    reactionsCount: oldPost.reactionsCount,
    clicked: oldPost.clicked,
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
        // return res;
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
      transformResponse: async (res: IgetPosts) => {
        console.log("res", res);
        const promisfy = async (): Promise<IPost> => {
          return new Promise((resO) => {
            const promises = res.posts.map((post) => {
              return new Promise((resI) => {
                resI(newPostData({ post: post }));
              });
            });
            resO(Promise.all(promises));
          });
        };
        const loadedPosts = await promisfy();
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
      {
        title: string;
        content: string;
      }
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
    updatePost: builder.mutation<
      void,
      {
        id: string;
        title: string;
        content: string;
      }
    >({
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
        reactionsCount: {
          thumbsUp: number;
          wow: number;
          rocket: number;
          coffee: number;
          heart: number;
        };
        clicked: {
          thumbsUp: boolean;
          wow: boolean;
          rocket: boolean;
          coffee: boolean;
          heart: boolean;
        };
      },
      {
        postId: string;
        clickedBy: string;
        reactionType: string;
        reactionsCount: {
          thumbsUp: number;
          heart: number;
          wow: number;
          rocket: number;
          coffee: number;
        };
        clicked: {
          thumbsUp: boolean;
          heart: boolean;
          wow: boolean;
          rocket: boolean;
          coffee: boolean;
        };
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
      async onQueryStarted({ queryFulfilled }) {
        // manually updating cache
        // const patchResult = dispatch(
        //   postsApiSlice.util.updateQueryData(
        //     "getPosts",
        //     { title: undefined, name: undefined },
        //     (draft) => {
        //       const post = draft.entities[postId];
        //       if (post) {
        //         post.reactionsCount = reactionsCount;
        //         post.clicked = clicked;
        //       }
        //     },
        //   ),
        // );
        // const patchResult2 = dispatch(
        //   postsApiSlice.util.updateQueryData("getPost", postId, (draft) => {
        //     const post = draft;
        //     if (post) {
        //       post.reactionsCount = reactionsCount;
        //       post.clicked = clicked;
        //     }
        //   }),
        // );
        try {
          const { data } = await queryFulfilled;
          // const { data } = await queryFulfilled;
          // const patchResult = dispatch(
          //   postsApiSlice.util.updateQueryData("getPosts", {}, (draft) => {
          //     const post = draft.entities[postId];
          //     if (post) {
          //       post.reactionsCount = data.reactionsCount;
          //       post.clicked = data.clicked;
          //     }
          //   }),
          // );
        } catch (e) {
          // patchResult.undo();
          // patchResult2.undo();
        }
      },
    }),
    getSavedPostStatus: builder.query<boolean, string>({
      query: (postId) => `/posts/savedPosts/${postId}/status`,
      transformResponse: (res: {
        message: "saved post" | "not saved post";
      }) => {
        return res.message === "saved post" ? true : false;
      },
    }),
    getSavedPosts: builder.query<ISavedPost[], string>({
      query: () => "/posts/savedPosts",
      transformResponse: (res: { savedPosts: ISavedPost[] }) => {
        return res.savedPosts;
      },
      providesTags: (res) => {
        return typeof res === "undefined"
          ? [{ type: "SavedPost", id: "LIST" }]
          : [
              { type: "SavedPost", id: "LIST" },
              ...res.map((savedPost) => ({
                type: "SavedPost" as const,
                id: savedPost.postId,
              })),
            ];
      },
    }),
    toggleSavedPost: builder.mutation<boolean, string>({
      query: (postId) => ({
        url: `/posts/savedPosts/${postId}`,
        method: "POST",
      }),
      transformResponse: (res: {
        message: "saved post" | "not saved post";
      }) => {
        return res.message === "saved post" ? true : false;
      },
      invalidatesTags: (_, __, postId) => {
        return [{ type: "SavedPost", id: postId }];
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
  useGetPostsByNameQuery,
  useGetSavedPostStatusQuery,
  useGetSavedPostsQuery,
  useToggleSavedPostMutation,
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
