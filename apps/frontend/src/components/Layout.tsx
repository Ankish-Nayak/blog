import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "../features/me/AppBar";

const Layout = () => {
  return (
    <>
      <ResponsiveAppBar />
      <main className="App">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
