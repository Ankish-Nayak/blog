import { List } from "@mui/material";
// import { useGetNotificationsQuery } from "../authApiSlice";
import { notificationsAdapter } from "./notificationSlice";
import { useGetNotificationsQuery } from "./notificationsApi";
import Notification from "./Notification";
import { useEffect, useState } from "react";
const Notifications = ({ show }: { show: boolean }) => {
  const {
    data: notifications,
    isLoading: isNotificationsLoading,
    isSuccess: isNotificationsSuccess,
    error: notificationsError,
    refetch: notificationRefetch,
  } = useGetNotificationsQuery("");
  const { selectAll } = notificationsAdapter.getSelectors();
  const [updated, setUpdated] = useState<boolean>(false);

  useEffect(() => {
    if (show) {
      notificationRefetch();
    }
    if (updated) {
      notificationRefetch();
      setUpdated(false);
    }
  }, [show, updated]);

  if (isNotificationsLoading) {
    return <p>Loading...</p>;
  } else if (isNotificationsSuccess && notifications) {
    const orderedNotifications = selectAll(notifications) || [];
    const renderendNotification = orderedNotifications
      .filter((notification) => !notification.isRead)
      .map((notification) => {
        if (!notification) {
          return <></>;
        }
        return (
          <Notification
            setUpdated={setUpdated}
            key={notification.id}
            notification={{
              id: notification.id,
              reactionId: notification.id,
              clickedByName: notification.clickedBy.name,
              clickedAt: notification.clickedAt,
              postId: notification.postId._id,
              clickedBy: notification.clickedBy._id,
              authorId: notification.postId.userId,
              reactionType: notification.reactionType,
              isRead: notification.isRead,
            }}
          />
        );
      });
    return <List>{renderendNotification}</List>;
  } else {
    return <p>{JSON.stringify(notificationsError)}</p>;
  }
};

export default Notifications;
