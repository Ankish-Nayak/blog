import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  ToggleButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostConfirmDialog from "../addPostForm/PostConfirmDailog";
import { useGetPostQuery, useUpdatePostMutation } from "../postsSlice";
import DeletePostDialog from "./DeletePostDialog";
import { dataValidation } from "./savePostDataValidation";
import SimpleBackdrop from "./SimpleBackdrop";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { Bookmark } from "@mui/icons-material";
import {
  useAddSavedPostMutation,
  useGetSavedPostStatusQuery,
  useRemovedSavedPostMutation,
} from "../../me/Appbar/SavedPosts/savedPostsApi";

// implement add to favourites function (params:type) {
// FIX:  not to show notificaitons when we liked our own post.

const EditPostForm = () => {
  const { postId } = useParams() as { postId: string };
  const {
    data: post,
    isLoading: isPostLoading,
    isSuccess: isPostSuccess,
  } = useGetPostQuery(postId);
  const [
    updatePost,
    { isLoading: isUpdatePostLoading, isSuccess: isUpdatePostSuccess },
  ] = useUpdatePostMutation();

  const [disabled, setDisabled] = useState<boolean>(true);

  const [title, setTitle] = useState<string>(post?.title || "");
  const [content, setContent] = useState<string>(post?.content || "");

  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  const userId = useSelector((state: RootState) => state.auth.id);

  const [openPostDeleteDialog, setOpenPostDeleteDialog] =
    useState<boolean>(false);

  const { data: postSaved, isSuccess: isPostSavedSuccess } =
    useGetSavedPostStatusQuery(postId);

  const [bookmark, setBookmark] = useState<boolean>(postSaved || false);

  const [addSavedPost] = useAddSavedPostMutation();

  const [removeSavedPost] = useRemovedSavedPostMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (isPostSuccess) {
      setTitle(post.title);
      setContent(post.content);
    }
    if (isUpdatePostSuccess) {
      navigate("/posts");
    }
    if (isPostSavedSuccess) {
      setBookmark(postSaved);
    }
  }, [isPostSuccess, isUpdatePostSuccess, isPostSavedSuccess]);
  const [open, setOpen] = useState<boolean>(false);

  if (isPostLoading) {
    return <SimpleBackdrop isLoading={isPostLoading} />;
  }

  if (isPostSuccess) {
    const handleDelete = async () => {
      setOpenPostDeleteDialog(true);
    };

    const onSavePostClicked = async () => {
      const valid = await dataValidation({
        title,
        content,
        setTitleError,
        setContentError,
      });
      if (valid) {
        try {
          await updatePost({
            title,
            content,
            id: postId,
          }).unwrap();

          setTitle("");
          setContent("");
        } catch (e) {
          console.log("failed to save");
        }
      }
    };

    // const han;

    const handleReset = async () => {
      setTitle(post.title);
      setContent(post.content);
      setTitleError(null);
      setContentError(null);
    };

    const handleBookMark = async () => {
      try {
        if (postSaved) {
          await removeSavedPost(postId).unwrap();
          setBookmark(false);
        } else {
          await addSavedPost(postId).unwrap();
          setBookmark(true);
        }
      } catch (e) {
        console.log(e);
      }
    };

    return (
      <Grid container height={"85vh"}>
        <SimpleBackdrop isLoading={isUpdatePostLoading} />
        <PostConfirmDialog open={open} setOpen={setOpen} />
        <DeletePostDialog
          postId={postId}
          open={openPostDeleteDialog}
          setOpen={setOpenPostDeleteDialog}
        />
        <Grid
          item
          xs={6}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <img
            src="../../../blog.webp"
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
            <CardActions>
              <ToggleButton
                value={"bookmark"}
                selected={bookmark}
                onChange={handleBookMark}
              >
                <Bookmark />
              </ToggleButton>
            </CardActions>

            <CardContent>
              <TextField
                type="text"
                variant="outlined"
                disabled={disabled}
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
                disabled={disabled}
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
            {userId === post.userId && (
              <CardActions
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                {!disabled && (
                  <Button
                    size={"small"}
                    variant="contained"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                )}
                <Button
                  type={"button"}
                  onClick={() => {
                    if (disabled) {
                      setDisabled(false);
                    } else {
                      onSavePostClicked();
                    }
                  }}
                  size="small"
                  variant="contained"
                >
                  {disabled ? "Edit" : "Save"}
                </Button>
                {!disabled && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                )}
              </CardActions>
            )}
          </Card>
        </Grid>
      </Grid>
    );
  }
  return <>Error</>;
};

export default EditPostForm;
