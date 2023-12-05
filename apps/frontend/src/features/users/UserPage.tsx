import { Link, useParams } from "react-router-dom";
import { useGetPostsByUserIdQuery } from "../posts/postsSlice";
import { useGetUserQuery } from "./usersSlice";
const UserPage = () => {
  const { userId } = useParams() as { userId: string };
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    isSuccess: isSuccessUser,
    error: errorUser,
  } = useGetUserQuery(userId);

  const {
    data: posts,
    isLoading: isLoadingPost,
    isSuccess: isSuccessPost,
    isError: isErrorPost,
    error: errorPost,
  } = useGetPostsByUserIdQuery(userId);

  let content;
  if (isLoadingPost || isLoadingUser) {
    content = <p>Loading...</p>;
  } else if (isSuccessPost && isSuccessUser) {
    content = (
      <ol>
        {posts.ids.map((id) => (
          <li key={id}>
            <Link to={`/post/${id}`}>{posts.entities[id]?.title}</Link>
          </li>
        ))}
      </ol>
    );
  } else if (isErrorPost || isErrorUser) {
    content = (
      <p>
        {JSON.stringify(errorUser)} {JSON.stringify(errorPost)}
      </p>
    );
  }
  return (
    <section>
      <h2>{user?.name}</h2>
      {content}
    </section>
  );
};

export default UserPage;
