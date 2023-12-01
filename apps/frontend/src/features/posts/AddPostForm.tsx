import { useState } from "react";
import { useAddNewPostMutation } from "./postsSlice";
import { useGetUsersQuery } from "../users/usersSlice";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const AddPostForm = () => {
  const [addNewPost, { isLoading }] = useAddNewPostMutation();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const navigate = useNavigate();

  const {
    data: users,
    isLoading: isLoadingUser,
    isError,
    isSuccess,
    error,
  } = useGetUsersQuery("getUsers");

  let userOptions;

  if (isLoadingUser) {
    userOptions = <option value={"loading.."}>Loading...</option>;
  } else if (isSuccess) {
    userOptions = users.ids.map((id) => (
      <MenuItem key={id} value={id}>
        {users.entities[id]?.name}
      </MenuItem>
    ));
  } else if (isError) {
    userOptions = <option>{JSON.stringify(error)}</option>;
  }

  const onAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(e.target.value);
  };

  const canSave =
    [title, content, userId].every(Boolean) && !isLoading && !isLoadingUser;

  const onSavePostClicked = async () => {
    try {
      await addNewPost({
        title,
        content,
        userId,
      }).unwrap();

      setTitle("");
      setContent("");
      setUserId("");
      navigate("/posts");
    } catch (e) {
      console.log("failed to save");
    }
  };

  return (
    <Stack
      margin={"auto"}
      key={"new"}
      padding={"0px 400px"}
      textAlign={"center"}
    >
      <Typography variant="h5">Add Post</Typography>
      <Stack textAlign={"center"} flexDirection={"column"}>
        <TextField
          type="text"
          variant="outlined"
          label="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          name="postTitle"
          id="postTitle"
        />
        <TextField
          value={content}
          multiline
          rows={5}
          maxRows={4}
          variant="outlined"
          label="content"
          onChange={(e) => setContent(e.target.value)}
          name="postContent"
          id="postContent"
        />
        <FormControl>
          <InputLabel>users</InputLabel>
          <Select
            labelId="postUserId"
            value={users}
            label="userId"
            onChange={onAuthorChange}
          >
            {userOptions}
          </Select>
        </FormControl>
        <Button
          type={"button"}
          onClick={onSavePostClicked}
          disabled={!canSave}
          variant="contained"
        >
          Save Post
        </Button>
      </Stack>
    </Stack>
  );
};

export default AddPostForm;
