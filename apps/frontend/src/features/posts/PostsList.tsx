import { useSelector } from "react-redux";
import PostExcerpt from "./PostExcerpt";
import { useGetPostsQuery } from "./postsSlice";
import { Skeleton, Stack } from "@mui/material";
import { RootState } from "../../app/store";

const PostsList = () => {
  const filters = useSelector((state: RootState) => state.filter);
  const {
    data: posts,
    error,
    isLoading,
    isError,
    isSuccess,
  } = useGetPostsQuery(filters);
  let content;
  if (isLoading) {
    const array = [];
    for (let index = 0; index < 12; index++) {
      array.push(
        <div
          key={index}
          style={{
            margin: "5px",
          }}
        >
          <Skeleton variant="rectangular" width={400} height={300}></Skeleton>
        </div>,
      );
    }
    content = array;
  } else if (isSuccess) {
    const orderedPosts = posts.ids;
    content = orderedPosts.map((id) => (
      <div style={{ margin: "5px" }} key={id}>
        <PostExcerpt key={id} postId={id.toString()} />
      </div>
    ));
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }
  return (
    <Stack textAlign={"center"} justifyContent={"flex-end"}>
      <Stack flexDirection={"row"} flexWrap={"wrap"} padding={"0px 100px"}>
        {content}
      </Stack>
    </Stack>
  );
};

export default PostsList;
