import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./app/store.ts";
import { usersApiSlice } from "./features/users/usersSlice.ts";
import { postsApiSlice } from "./features/posts/postsSlice.ts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";

store.dispatch(usersApiSlice.endpoints.getUsers.initiate("getUsers"));
store.dispatch(postsApiSlice.endpoints.getPosts.initiate("getUsers"));
const outerTheme = createTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={outerTheme}>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </Router>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
);
