import { EntityState, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../../api/apiSlice";
import { ISavedPost } from "./savedPostSlice";
import {
  addSavedPost,
  initialState,
  removeSavedPost,
  savedPostsAdapter,
} from "./savedPostSlice";
import { RootState } from "../../../../app/store";

export const savedPostsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSavedPostStatus: builder.query<boolean, string>({
      query: (postId) => `/posts/savedPosts/${postId}/status`,
      transformResponse: (res: {
        message: "saved post" | "not saved post";
      }) => {
        return res.message === "saved post" ? true : false;
      },
    }),
    getSavedPosts: builder.query<EntityState<ISavedPost>, string>({
      query: () => "/posts/savedPosts",
      transformResponse: async (res: {
        savedPosts: {
          _id: string;
          savedBy: string;
          postId: {
            _id: string;
            userId: string;
          };
          savedAt: string;
        }[];
      }) => {
        console.log("res", res);
        const promifiy = (): Promise<ISavedPost[]> => {
          return new Promise<ISavedPost[]>((resO) => {
            const promises = res.savedPosts.map((savedPost) => {
              return new Promise<ISavedPost>((resi) => {
                resi({
                  id: savedPost._id,
                  savedBy: savedPost.savedBy,
                  savedAt: savedPost.savedAt,
                  postId: savedPost.postId._id,
                  authorId: savedPost.postId.userId,
                });
              });
            });
            resO(Promise.all(promises));
          });
        };
        const loadedPosts = await promifiy();
        console.log("loadedPosts", loadedPosts);
        return savedPostsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (res) => {
        return typeof res === "undefined"
          ? [{ type: "SavedPost", id: "LIST" }]
          : [
              { type: "SavedPost", id: "LIST" },
              ...res.ids.map((id) => ({
                type: "SavedPost" as const,
                id: res.entities[id]?.postId,
              })),
            ];
      },
    }),
    addSavedPost: builder.mutation<ISavedPost, string>({
      query: (postId) => ({
        url: `/posts/savedPosts/${postId}`,
        method: "POST",
      }),
      transformResponse: (res: { savedPost: ISavedPost }) => {
        return res.savedPost;
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const data = await queryFulfilled;
          dispatch(addSavedPost(data.data));
        } catch (e) {
          console.log(e);
        }
      },
    }),
    removedSavedPost: builder.mutation<string, string>({
      query: (postId) => ({
        url: `/posts/savedPosts/${postId}`,
        method: "DELETE",
      }),
      transformResponse: (res: { message: string }) => {
        return res.message;
      },
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(removeSavedPost({ postId }));
        } catch (e) {
          console.log(e);
        }
      },
      invalidatesTags: (_, __, postId) => {
        return [{ type: "SavedPost", id: postId }];
      },
    }),
  }),
});

export const {
  useGetSavedPostsQuery,
  useGetSavedPostStatusQuery,
  useAddSavedPostMutation,
  useRemovedSavedPostMutation,
} = savedPostsApi;

const selectSavedPostsResult = savedPostsApi.endpoints.getSavedPosts.select("");

const selectSavedPostsData = createSelector(
  [selectSavedPostsResult],
  (savedPostsResult) => savedPostsResult.data,
);
export const {
  selectAll: selectAllSavedPosts,
  selectById: selectSavedPostById,
  selectIds: selectSavedPostsIds,
} = savedPostsAdapter.getSelectors<RootState>(
  (state) => selectSavedPostsData(state) ?? initialState,
);
