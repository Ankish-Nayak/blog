import {
  PayloadAction,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
export interface ISavedPost {
  postId: string;
  savedBy: string;
  authorId: string;
  savedAt: string;
}
export const savedPostsAdapter = createEntityAdapter<ISavedPost>({
  sortComparer: (a, b) => b.savedAt.localeCompare(a.savedAt),
});

export const initialState = savedPostsAdapter.getInitialState();

const savedPostsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    initialize: (_state, action: PayloadAction<ISavedPost[]>) => {
      savedPostsAdapter.setAll(initialState, action.payload);
    },
    addSavedPost: (state, action: PayloadAction<ISavedPost>) => {
      savedPostsAdapter.addOne(state, action.payload);
    },
    removeSavedPost: (state, action: PayloadAction<{ postId: string }>) => {
      const id = state.ids.find((id) => {
        const savedPost = state.entities[id];
        if (
          typeof savedPost !== "undefined" &&
          savedPost.postId === action.payload.postId
        ) {
          return true;
        }
        return false;
      });
      if (id) {
        savedPostsAdapter.removeOne(state, id);
      }
    },
  },
});

export const { initialize, addSavedPost, removeSavedPost } =
  savedPostsSlice.actions;

export default savedPostsSlice.reducer;
