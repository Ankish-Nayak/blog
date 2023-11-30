import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
// import { createTheme } from "@mui/material/styles";
import PostAuthor from "./PostAuthor";
import ReactionButtons from "./ReactionButtons";
import TimeAgo from "./TimeAgo";
import { selectPostById } from "./postsSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const PostExcerpt = ({ postId }: { postId: string }) => {
  const post = useSelector((state: RootState) => selectPostById(state, postId));
  const navigate = useNavigate();
  let content;
  if (post) {
    content = (
      <ThemeProvider
        theme={() =>
          createTheme({
            palette: {
              primary: {
                light: "#B6BBC4",
                main: "#31304D",
                dark: "#161A30",
              },
            },
          })
        }
      >
        <Box className={"postExcerpt"} sx={{}}>
          <Card
            variant="outlined"
            sx={{
              width: "400px",
              height: "250px",
              bgcolor: `primary.light`,
              fontSize: "10px",
            }}
          >
            <CardContent>
              <Typography variant="h5">{post.title}</Typography>
              <Typography variant="body1" gutterBottom>
                {post.content.substring(0, 75)}
              </Typography>
              <Stack
                flexDirection={"row"}
                justifyContent={"space-evenly"}
                alignItems={"center"}
              >
                <Button
                  variant="text"
                  size="small"
                  color={`primary`}
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  View Post
                </Button>
                {(post.userId && <PostAuthor userId={post.userId} />) ||
                  "by unknown"}
                <TimeAgo timestamp={post.date} />
              </Stack>
            </CardContent>
            <CardActionArea
              sx={{
                position: "absolute",
                bottom: "10px",
              }}
            >
              <ReactionButtons post={post} />
            </CardActionArea>
          </Card>
        </Box>
      </ThemeProvider>
    );
  } else {
    content = <p>Post dose not exist</p>;
  }
  return content;
};

export default PostExcerpt;
