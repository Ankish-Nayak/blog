import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Tooltip,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import humanReadableDate from "../../../../helpers/HumanReadableDate";
import { useGetProfilePicQuery } from "../../authApiSlice";
import { updateIsRead } from "./notificationSlice";
import { useNotificationReadMutation } from "./notificationsApi";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};
const Notification = ({
  notification,
  setUpdated,
}: {
  setUpdated: Dispatch<SetStateAction<boolean>>;
  notification: {
    id: string;
    isRead: boolean;
    reactionId: string;
    clickedByName: string;
    clickedAt: string;
    postId: string;
    clickedBy: string;
    authorId: string;
    reactionType: string;
  };
}) => {
  const {
    data: profilePic,
    isLoading: isPicLoading,
    isSuccess: isPicSuccess,
    isError: isPicError,
  } = useGetProfilePicQuery(notification.clickedBy);
  console.log("clickedBy Id", notification.clickedBy);
  const [profilePicUrl, setProfilePicUrl] = useState<string>(profilePic || "");

  useEffect(() => {
    if (isPicSuccess) {
      setProfilePicUrl(profilePic);
    }
  }, [isPicSuccess]);

  const [markAsRead, { isSuccess: isMarkAsReadSuccess }] =
    useNotificationReadMutation();
  const dispatch = useDispatch();
  const handleMarkAsRead = async () => {
    try {
      await markAsRead(notification.reactionId).unwrap();
      setUpdated(true);
      dispatch(
        updateIsRead({
          notificationId: notification.id,
          isRead: true,
        }),
      );
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <ListItem>
      {/* display profile pic here */}
      <ListItemAvatar>
        <Tooltip title={notification.clickedByName}>
          <ListItemIcon>
            {isPicSuccess && (
              <Avatar variant="circular" src={profilePicUrl}></Avatar>
            )}
            {isPicLoading && <Skeleton variant="circular"></Skeleton>}
            {isPicError && (
              <Avatar variant="circular">
                {notification.clickedByName.at(0)?.toUpperCase()}
              </Avatar>
            )}
          </ListItemIcon>
        </Tooltip>
      </ListItemAvatar>
      <ListItemText
        primary={`${notification.clickedByName} reacted ${
          reactionEmoji[notification.reactionType]
        }`}
        secondary={`${humanReadableDate(notification.clickedAt)}`}
      >
        {/* {notification.authorId} reacted reactiontype postId and Time At */}
      </ListItemText>
      <ListItemButton onClick={handleMarkAsRead}>mark as read</ListItemButton>
    </ListItem>
  );
};

export default Notification;
