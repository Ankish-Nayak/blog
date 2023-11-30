import { useSelector } from "react-redux";
import PostExcerpt from "./PostExcerpt";
import { useGetPostsQuery } from "./postsSlice";
import { Grid, Skeleton, Stack, Typography } from "@mui/material";
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
        <Grid item key={index}>
          <Skeleton variant="rectangular" width={400} height={300}></Skeleton>
        </Grid>,
      );
    }
    content = array;
  } else if (isSuccess) {
    const orderedPosts = posts.ids;
    content = orderedPosts.map((id) => (
      <div style={{ margin: "5px" }}>
        <PostExcerpt key={id} postId={id.toString()} />
      </div>
    ));
    // content = orderedPosts.map((id) => (
    //   <Grid item key={id}>
    //     <PostExcerpt key={id} postId={id.toString()} />
    //   </Grid>
    // ));
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }
  console.log(content);
  return (
    <Stack
      textAlign={"center"}
      // padding={"0px 100px"}
      // paddingTop={"50px"}
      // border={"5px solid black"}
      justifyContent={"flex-end"}
    >
      {/* <Typography margin={"10px"} variant="h5"> */}
      {/*   Posts */}
      {/* </Typography> */}
      <Stack flexDirection={"row"} flexWrap={"wrap"} padding={"0px 100px"}>
        {content}
      </Stack>
      {/* <Grid container spacing={1}> */}
      {/*   {content} */}
      {/* </Grid> */}
    </Stack>
  );
};

export default PostsList;
