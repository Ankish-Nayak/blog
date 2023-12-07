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
import humanReadableDate from "../../../helpers/HumanReadableDate";
import {
  useGetProfilePicQuery,
  useNotificationReadMutation,
} from "../authApiSlice";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};
const Notification = ({
  notification,
}: {
  notification: {
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

  const [markAsRead, { isSuccess: isMarkAsReadSuccess }] =
    useNotificationReadMutation();
  const handleMarkAsRead = async () => {
    try {
      await markAsRead(notification.reactionId).unwrap();
    } catch (e) {}
  };
  return (
    <ListItem>
      {/* display profile pic here */}
      <ListItemAvatar>
        <Tooltip title={notification.clickedByName}>
          <ListItemIcon>
            {isPicSuccess && (
              <Avatar variant="circular" src={profilePic}></Avatar>
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
      <ListItemButton onClick>mark as read</ListItemButton>
    </ListItem>
  );
};

export default Notification;
