import { EntityState, createSelector } from "@reduxjs/toolkit";
import { initialState } from "./notificationSlice";
import { RootState } from "../../../app/store";
import { apiSlice } from "../../api/apiSlice";
import { notificationsAdapter } from "./notificationSlice";
export interface INotificationResponse {
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
  clickedAt: string;

  reactionType: "thumbsUp" | "heart" | "wow" | "coffee" | "rocket";
  isRead: boolean;
}
export interface INotificationsResponse {
  notifications: INotificationResponse[];
}
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

const newNotfication = (
  oldNotification: INotificationResponse,
): INotification => {
  const tempNotification = {
    ...oldNotification,
    id: oldNotification._id,
  };
  const { _id: _, ...resNotification } = tempNotification;
  return resNotification;
};

const notifcationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationCount: builder.query<number, string>({
      query: () => "/users/notifications/notification-count",
      transformResponse(res: { notificationCount: number }) {
        return res.notificationCount;
      },
      providesTags: [{ type: "Notification", id: "notificationCount" }],
    }),
    getNotifications: builder.query<EntityState<INotification>, string>({
      query: () => "/users/notifications",
      transformResponse: async (res: INotificationsResponse) => {
        const promisfy = async (): Promise<INotification[]> => {
          return new Promise((resO) => {
            const promises = res.notifications.map((notification) => {
              return new Promise((resI) => {
                resI(newNotfication(notification));
              });
            });
            resO(Promise.all(promises));
          });
        };
        const loadedNotifications = await promisfy();
        console.log("loadedNotifications ", loadedNotifications);
        return notificationsAdapter.setAll(initialState, loadedNotifications);
      },
      providesTags: (res) => {
        return typeof res === "undefined"
          ? [{ type: "Notification", id: "LIST" }]
          : [...res.ids.map((id) => ({ type: "Notification" as const, id }))];
      },
    }),
    notificationRead: builder.mutation<{ success: true }, string>({
      query: (reactionId) => ({
        url: `/notifications/${reactionId}/mark-as-read`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "Notification", id: "notificationCount" }],
    }),
  }),
});

export const selectNotificationsResult =
  notifcationsApi.endpoints.getNotifications.select("");

export const selectNotificationsData = createSelector(
  [selectNotificationsResult],
  (notificationResult) => notificationResult.data,
);
export const {
  useGetNotificationsQuery,
  useGetNotificationCountQuery,
  useNotificationReadMutation,
} = notifcationsApi;

export const {
  selectAll: selectAllNotifications,
  selectById: selectNotificationById,
  selectIds: selectNotificationIds,
} = notificationsAdapter.getSelectors<RootState>(
  (state) => selectNotificationsData(state) ?? initialState,
);
