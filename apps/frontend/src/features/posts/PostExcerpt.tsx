import PostAuthor from "./PostAuthor";
import ReactionButtons from "./ReactionButtons";
import TimeAgo from "./TimeAgo";
import { useGetPostsQuery } from "./postsSlice";
import { Link } from "react-router-dom";

const PostExcerpt = ({ postId }: { postId: string }) => {
  const { post, isLoading, isError, error, isSuccess } = useGetPostsQuery(
    "getPosts",
    {
      selectFromResult: ({ data, isLoading, isError, isSuccess, error }) => ({
        post: data?.entities[postId],
        isError,
        error,
        isSuccess,
        isLoading,
      }),
    },
  );
  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    if (post) {
      content = (
        <article key={postId}>
          <h3>{post.title}</h3>
          <p>{post.content.substring(0, 75)}</p>
          <p className="postCredict">
            <Link to={`/post/${post.id}`}>View Post </Link>
            {(post.userId && <PostAuthor userId={post.userId} />) ||
              "by unknown"}
            <TimeAgo timestamp={post.date} />
          </p>
          <div className="reactionButtons">
            <ReactionButtons post={post} />
          </div>
        </article>
      );
    } else {
      content = <p>Post dose not exist</p>;
    }
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }
  return content;
};

export default PostExcerpt;
