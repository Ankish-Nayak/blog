import PostAuthor from "./PostAuthor";
import ReactionButtons from "./ReactionButtons";
import TimeAgo from "./TimeAgo";
import { useGetPostQuery } from "./postsSlice";
import { Link } from "react-router-dom";

const PostExcerpt = ({ postId }: { postId: string }) => {
  const {
    data: post,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetPostQuery(postId);
  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = (
      <article>
        <h3>{post.title}</h3>
        <p>{post.content.substring(0, 75)}</p>
        <p className="postCredict">
          <Link to={`/posts/${post.id}`}>View Post</Link>
          {(post.userId && <PostAuthor userId={post.userId.toString()} />) ||
            "by unknown"}
          <TimeAgo timestamp={post.date} />
          <ReactionButtons post={post} />
        </p>
      </article>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }
  return content;
};

export default PostExcerpt;
