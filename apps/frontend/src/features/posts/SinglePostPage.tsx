import { useParams, Link } from "react-router-dom";
import { selectPostById } from "./postsSlice";
import { useSelector } from "react-redux";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import { RootState } from "../../app/store";
const SinglePostPage = () => {
  const { postId } = useParams() as { postId: string };

  const post = useSelector((state: RootState) => selectPostById(state, postId));

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <article>
      <h3>{post.title}</h3>
      <p>{post.content.substring(0, 75)}...</p>
      <p className="postCredict">
        <span>
          <Link to={`/post/edit/${post.id}`}>Edit Post </Link>
        </span>
        <span>
          {(post.userId && <PostAuthor userId={post.userId} />) || "by unknown"}
        </span>
        <TimeAgo timestamp={post.date} />
      </p>
    </article>
  );
};

export default SinglePostPage;
