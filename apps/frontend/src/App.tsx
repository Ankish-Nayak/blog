import "./App.css";
import { Navigate, Routes, Route } from "react-router-dom";
import PostsList from "./features/posts/PostsList";
import Layout from "./components/Layout";
import SinglePostPage from "./features/posts/SinglePostPage";
import EditPostForm from "./features/posts/editPostForm/EditPostForm";
import UsersList from "./features/users/UsersList";
import UserPage from "./features/users/UserPage";
import AddPostForm from "./features/posts/addPostForm/AddPostForm";
import HomePage from "./components/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path={"posts"} element={<PostsList />} />

        <Route path="post">
          <Route index element={<AddPostForm />} />
          {/* <Route path=":postId" element={<SinglePostPage />} /> */}
          <Route path=":postId" element={<EditPostForm />} />
        </Route>

        <Route path="users">
          <Route index element={<UsersList />} />
          <Route path=":userId" element={<UserPage />} />
          {/* <Route path="profile" element={<Profile />} /> */}
        </Route>
        {/* catch all the components with 404  */}
        <Route path="*" element={<Navigate to="/" replace />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
