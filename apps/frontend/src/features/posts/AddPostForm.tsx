import { useState } from "react";
import { useAddNewPostMutation } from "./postsSlice";
import { useGetUsersQuery } from "../users/usersSlice";
import { useNavigate } from "react-router-dom";

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
  } = useGetUsersQuery();

  let userOptions;

  if (isLoadingUser) {
    userOptions = <p>Loading...</p>;
  } else if (isSuccess) {
    userOptions = users.ids.map((id) => (
      <option value={id}>{users.entities[id]?.name}</option>
    ));
  } else if (isError) {
    userOptions = <p>{JSON.stringify(error)}</p>;
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
      navigate("/");
    } catch (e) {
      console.log("failed to save");
    }
  };

  return (
    <section>
      <h2>Add a new post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          name="postTitle"
          id="postTitle"
        />
        <label htmlFor="postContent">Post Content:</label>
        <textarea
          value={content}
          placeholder="Enter post body"
          onChange={(e) => setContent(e.target.value)}
          name="postContent"
          id="postContent"
        />
        <select id="postUserId" value={userId} onChange={onAuthorChange}>
          {userOptions}
        </select>
        <button type={"button"} onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
