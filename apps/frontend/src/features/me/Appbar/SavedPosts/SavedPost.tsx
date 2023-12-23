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
import humanReadableDate from "../../../../helpers/HumanReadableDate";
import { useGetUserQuery } from "../../../users/usersSlice";
import { useGetProfilePicQuery } from "../../authApiSlice";
import { useRemovedSavedPostMutation } from "./savedPostsApi";
import ProfileDialog from "../../../user/Profile/ProfileDialog";
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
  const [removeSavedPost] = useRemovedSavedPostMutation();

  const navigate = useNavigate();
  const { data: user, isSuccess: isUserSuccess } = useGetUserQuery(userId);

  const [name, setName] = useState<string>("");

  const [openProfile, setOpenProfile] = useState<boolean>(false);

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
      await removeSavedPost(postId).unwrap();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <ListItem>
      <ProfileDialog
        id={userId}
        pic={profilePicUrl}
        show={openProfile}
        setOpenProfile={setOpenProfile}
      />
      <ListItemAvatar>
        <Tooltip title={name}>
          <ListItemIcon
            onClick={() => {
              setOpenProfile(true);
            }}
          >
            {isPicSuccess && (
              <Avatar variant="circular" src={profilePicUrl}></Avatar>
            )}
            {isPicLoading && <Skeleton variant="circular"></Skeleton>}
            {isPicError && (
              <Avatar variant="circular">{name.at(0)?.toUpperCase()}</Avatar>
            )}
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
