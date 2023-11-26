import { RootState } from "../../app/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  selectPostById,
  useDeletePostMutation,
  useUpdatePostMutation,
} from "./postsSlice";
import { useGetUsersQuery } from "../users/usersSlice";
const EditPostForm = () => {
  const { postId } = useParams() as { postId: string };
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const [deletePost] = useDeletePostMutation();
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const post = useSelector((state: RootState) => selectPostById(state, postId));
  const {
    data: users,
    isLoading: isLoadingUser,
    isError,
    isSuccess,
    error,
  } = useGetUsersQuery();
  if (!post) {
    return (
      <section>
        <h2>Post dose not exists</h2>
      </section>
    );
  }
  let usersOptions;
  if (isLoadingUser) {
    usersOptions = <p>Loading...</p>;
  } else if (isSuccess) {
    usersOptions = users.ids.map((id) => (
      <option key={id} value={id}>
        {users.entities[id]?.name}
      </option>
    ));
  } else if (isError) {
    usersOptions = <p>{JSON.stringify(error)}</p>;
  }

  const onAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(e.target.value);
  };

  const canSave =
    [title, content, userId].every(Boolean) && !isLoading && !isLoadingUser;
  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        await updatePost({
          ...post,
          title,
          content,
        }).unwrap();

        setTitle("");
        setContent("");
        setUserId("");
        navigate("/");
      } catch (e) {
        console.log(e);
      }
    }
  };

  const onDeletePostClicked = async () => {
    try {
      await deletePost({ id: postId }).unwrap();

      setTitle("");
      setContent("");
      setUserId("");
      navigate("/");
    } catch (e) {
      console.log("failed to delete", e);
    }
  };
  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          value={title}
          id="postTitle"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
        />
        <label htmlFor="postAuthor">Post Author:</label>
        <select
          id="postAuthor"
          value={userId}
          onChange={onAuthorChange}
          name={"postAuthor"}
        >
          {usersOptions}
        </select>
        <label htmlFor="postContent">Post Content:</label>
        <textarea
          id={"postContent"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
        <button
          className="deleteButton"
          type="button"
          onClick={onDeletePostClicked}
        >
          Delete Post
        </button>
      </form>
    </section>
  );
};

export default EditPostForm;
