import {
  PayloadAction,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

export interface INotification {
  id: string;
  postId: {
    _id: string;
    title: string;
    userId: string;
  };
  clickedBy: {
    _id: string;
    name: string;
  };
  clickedAt: string;
  reactionType: "thumbsUp" | "heart" | "wow" | "coffee" | "rocket";
  isRead: boolean;
}

export const notificationsAdapter = createEntityAdapter<INotification>({
  sortComparer: (a, b) => b.clickedAt.localeCompare(a.clickedAt),
});

export const initialState = notificationsAdapter.getInitialState();

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    initialize: (_state, action: PayloadAction<INotification[]>) => {
      notificationsAdapter.setAll(initialState, action.payload);
    },
    updateIsRead: (
      state,
      action: PayloadAction<{ notificationId: string; isRead: boolean }>,
    ) => {
      const { notificationId, isRead } = action.payload;
      notificationsAdapter.updateOne(state, {
        id: notificationId,
        changes: { isRead },
      });
    },
  },
});

export const { initialize, updateIsRead } = notificationsSlice.actions;

export default notificationsSlice.reducer;
