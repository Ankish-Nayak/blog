import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "../postsSlice";
import PostConfirmDialog from "./PostConfirmDailog";
import { dataValidation } from "./addPostDataValidation";
import { createPostParams, createPostTypes } from "types";

const AddPostForm = () => {
  const [addNewPost, { isLoading }] = useAddNewPostMutation();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  const navigate = useNavigate();
  const canSave = [title, content].every(Boolean) && !isLoading;

  const [open, setOpen] = useState<boolean>(false);

  const onSavePostClicked = async () => {
    const valid = await dataValidation({
      title,
      content,
      setContentError,
      setTitleError,
    });
    if (valid) {
      try {
        await addNewPost({
          title,
          content,
        }).unwrap();

        setTitle("");
        setContent("");
        navigate("/posts");
      } catch (e) {
        console.log("failed to save");
      }
    }
  };

  return (
    <Grid container height={"85vh"}>
      <PostConfirmDialog open={open} setOpen={setOpen} />
      <Grid
        item
        xs={6}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <img
          src="blog.webp"
          style={{
            display: "inline",
            width: "650px",
          }}
        />
      </Grid>
      <Grid
        item
        display={"flex"}
        flexDirection={"column"}
        xs={6}
        alignItems={"center"}
        justifyContent={"center"}
        padding={"150px"}
      >
        <Card>
          <CardContent>
            <TextField
              type="text"
              variant="outlined"
              error={titleError !== null}
              helperText={titleError}
              label="title"
              value={title}
              fullWidth
              margin={"dense"}
              onChange={(e) => {
                setTitleError(null);
                setTitle(e.target.value);
              }}
              placeholder="Enter post title"
              name="postTitle"
              id="postTitle"
            />
            <TextField
              error={contentError != null}
              helperText={contentError}
              value={content}
              multiline
              rows={5}
              fullWidth
              margin={"dense"}
              variant="outlined"
              label="content"
              onChange={(e) => {
                setContentError(null);
                setContent(e.target.value);
              }}
              name="postContent"
              id="postContent"
            />
          </CardContent>
          <CardActions
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Button
              type={"button"}
              onClick={onSavePostClicked}
              size="small"
              disabled={!canSave}
              variant="contained"
            >
              Post
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AddPostForm;
