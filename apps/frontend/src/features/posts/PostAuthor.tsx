import { useGetUsersQuery } from "../users/usersSlice";
import { Link } from "react-router-dom";

const PostAuthor = ({ userId }: { userId: string }) => {
  const {
    user: author,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetUsersQuery("getUsers", {
    selectFromResult: ({ data, isLoading, isError, isSuccess, error }) => ({
      user: data?.entities[userId],
      isLoading,
      isError,
      isSuccess,
      error,
    }),
  });

  let content;
  if (isLoading) {
    content = <span>Loading...</span>;
  } else if (isSuccess) {
    content = author ? (
      <span>
        by <Link to={`/users/${userId}`}>{author.name}</Link>
      </span>
    ) : (
      <span>by unkown</span>
    );
  } else if (isError) {
    content = <span>{JSON.stringify(error)}</span>;
  }
  return content;
};

export default PostAuthor;
