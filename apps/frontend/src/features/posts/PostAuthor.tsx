import { useGetUserQuery } from "../users/usersSlice";
import { Link } from "react-router-dom";

const PostAuthor = ({ userId }: { userId: string }) => {
  const {
    data: author,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetUserQuery(userId);

  let content;
  if (isLoading) {
    content = <span>Loading...</span>;
  } else if (isSuccess) {
    content = (
      <span>
        by <Link to={`/users/${userId}`}>{author.name}</Link>
      </span>
    );
  } else if (isError) {
    content = <span>{JSON.stringify(error)}</span>;
  }
  return content;
};

export default PostAuthor;
