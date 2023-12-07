import { List } from "@mui/material";
import { useGetNotificationsQuery } from "../authApiSlice";
import Notification from "./Notification";
import { useEffect } from "react";
const Notifications = ({ show }: { show: boolean }) => {
  const {
    data: notifications,
    isLoading: isNotificationsLoading,
    isSuccess: isNotificationsSuccess,
    error: notificationsError,
    refetch: notificationRefetch,
  } = useGetNotificationsQuery("");

  useEffect(() => {
    if (show) {
      notificationRefetch();
    }
  }, [show]);

  if (isNotificationsLoading) {
    return <p>Loading...</p>;
  } else if (isNotificationsSuccess) {
    if (!notifications) {
      return <p>undefined</p>;
    }
    const renderendNotification = notifications
      .filter((notification) => !notification.isRead)
      .map((notification) => (
        <Notification
          notification={{
            reactionId: notification._id,
            clickedByName: notification.clickedBy.name,
            clickedAt: notification.clickedAt,
            postId: notification.postId._id,
            clickedBy: notification._id,
            authorId: notification.postId.userId,
            reactionType: notification.reactionType,
          }}
        />
      ));
    return <List>{renderendNotification}</List>;
  } else {
    return <p>{JSON.stringify(notificationsError)}</p>;
  }
};

export default Notifications;
