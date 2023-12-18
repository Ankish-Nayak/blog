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
import { useGetUserQuery } from "../../../users/usersSlice";
import { useGetProfilePicQuery } from "../../authApiSlice";
import {
  useAddSavedPostMutation,
  useGetSavedPostStatusQuery,
  useRemovedSavedPostMutation,
} from "./savedPostsApi";
import humanReadableDate from "../../../../helpers/HumanReadableDate";
const SavedPost = ({
  setOpen,
  userId,
  postId,
  savedAt,
}: {
  userId: string;
  postId: string;
  savedAt: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [addSavedPost] = useAddSavedPostMutation();
  const [removeSavedPost] = useRemovedSavedPostMutation();

  const navigate = useNavigate();
  const { data: user, isSuccess: isUserSuccess } = useGetUserQuery(userId);
  const { data: savedPostStatus } = useGetSavedPostStatusQuery(postId);

  console.log(savedAt, postId, userId);
  const [name, setName] = useState<string>("");

  const {
    data: profilePic,
    isLoading: isPicLoading,
    isSuccess: isPicSuccess,
    isError: isPicError,
  } = useGetProfilePicQuery(userId);

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
      if (savedPostStatus) {
        await removeSavedPost(postId).unwrap();
      } else {
        await addSavedPost(postId).unwrap();
      }
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
          navigate(`/post/${postId}`);
          setOpen(false);
        }}
      >
        <ListItemText
          primary={"post title"}
          secondary={humanReadableDate(savedAt)}
        ></ListItemText>
      </ListItemButton>
      <ListItemButton onClick={handleDeleteButton}>
        <DeleteRounded />
      </ListItemButton>
    </ListItem>
  );
};
export default SavedPost;
