import { DeleteRounded } from "@mui/icons-material";
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
import { useNavigate } from "react-router-dom";
import { default as humanReadableDate } from "../../../../helpers/HumanReadableDate";
import {
  ISavedPost,
  useToggleSavedPostMutation,
} from "../../../posts/postsSlice";
import { useGetUserQuery } from "../../../users/usersSlice";
import { useGetProfilePicQuery } from "../../authApiSlice";
const SavedPost = ({
  savedPost,
  setOpen,
}: {
  savedPost: ISavedPost;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data: user, isSuccess: isUserSuccess } = useGetUserQuery(
    savedPost.userId,
  );

  const [name, setName] = useState<string>("");

  const {
    data: profilePic,
    isLoading: isPicLoading,
    isSuccess: isPicSuccess,
    isError: isPicError,
  } = useGetProfilePicQuery(savedPost.userId);
  const [toggleSavedPost] = useToggleSavedPostMutation();
  const navigate = useNavigate();

  const [profilePicUrl, setProfilePicUrl] = useState<string>(profilePic || "");

  useEffect(() => {
    if (isPicSuccess) {
      setProfilePicUrl(profilePic);
    }
    if (isUserSuccess) {
      setName(user.name);
    }
  }, [isPicSuccess]);
  const handleDeleteButton = async () => {
    try {
      await toggleSavedPost(savedPost.postId).unwrap();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <ListItem>
      <ListItemAvatar>
        <Tooltip title={name}>
          <ListItemIcon>
            {isPicSuccess && (
              <Avatar variant="circular" src={profilePicUrl}></Avatar>
            )}
            {isPicLoading && <Skeleton variant="circular"></Skeleton>}
            {isPicError && <Avatar variant="circular">{"A"}</Avatar>}
          </ListItemIcon>
        </Tooltip>
      </ListItemAvatar>
      <ListItemButton
        onClick={() => {
          navigate(`/post/${savedPost.postId}`);
          setOpen(false);
        }}
      >
        <ListItemText
          primary={"post title"}
          secondary={humanReadableDate(savedPost.savedAt)}
        ></ListItemText>
      </ListItemButton>
      <ListItemButton onClick={handleDeleteButton}>
        <DeleteRounded />
      </ListItemButton>
    </ListItem>
  );
};
export default SavedPost;
