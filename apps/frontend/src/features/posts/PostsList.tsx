import { useSelector } from "react-redux";
import PostExcerpt from "./PostExcerpt";
import { selectPostIds, useGetPostsQuery } from "./postsSlice";

const PostsList = () => {
  const { error, isLoading, isError, isSuccess } = useGetPostsQuery();
  const orderedPosts = useSelector(selectPostIds);
  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = orderedPosts.map((id) => (
      <PostExcerpt key={id} postId={id.toString()} />
    ));
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }
  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  );
};

export default PostsList;
